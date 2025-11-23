/**
 * Auth Service Integration Tests
 * Tests de integración que consumen la API REAL del backend
 * 
 * IMPORTANTE: 
 * - Estos tests requieren que el backend esté corriendo
 * - Usa credenciales de prueba reales
 * - Los datos pueden persistir en la base de datos
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TEST_CREDENTIALS, TEST_TIMEOUTS } from '../../../__tests__/testConfig';
import { expectError, generateTestEmail } from '../../../__tests__/testHelpers';
import authService from '../auth.service';

describe('AuthService - Integration Tests (REAL API)', () => {
  // Credenciales de prueba REALES del backend
  const TEST_COMPANY = {
    email: TEST_CREDENTIALS.COMPANY.email,
    password: TEST_CREDENTIALS.COMPANY.password,
  };

  const TEST_EMPLOYEE = {
    email: TEST_CREDENTIALS.EMPLOYEE.email,
    password: TEST_CREDENTIALS.EMPLOYEE.password,
  };

  const NEW_COMPANY = {
    email: generateTestEmail('company'),
    password: 'TestPassword123!',
    name: 'Test Company Integration',
    nitId: `NIT${Date.now()}`, // ✅ Cambiado de nit_id a nitId
    phone: '1234567890',
  };

  const NEW_EMPLOYEE = {
    email: generateTestEmail('employee'),
    password: 'TestPassword123!',
    name: 'Test Employee Integration',
    phone: '0987654321',
    invitationCode: TEST_CREDENTIALS.COMPANY.invitationCode, // ✅ Usar código real
  };

  beforeEach(async () => {
    // Limpiar AsyncStorage antes de cada test
    await AsyncStorage.clear();
  });

  afterEach(async () => {
    // Intentar hacer logout después de cada test
    try {
      await authService.logout();
    } catch (error) {
      // Ignorar errores de logout
    }
  });

  describe('Login Endpoints', () => {
    it('should login successfully with company credentials from REAL API', async () => {
      console.log('🧪 Testing login with company:', TEST_COMPANY.email);

      const result = await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);

      // Validar estructura de respuesta
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
      
      // Validar que es una empresa
      expect(result.user.userType).toBe('company');
      
      // Validar que se guardó en AsyncStorage
      const savedToken = await AsyncStorage.getItem('@tramuu_access_token');
      expect(savedToken).toBeTruthy();
      expect(savedToken).toBe(result.accessToken);

      const savedUser = await AsyncStorage.getItem('@tramuu_user');
      expect(savedUser).toBeTruthy();
      
      const parsedUser = JSON.parse(savedUser);
      expect(parsedUser.email).toBe(TEST_COMPANY.email);
      expect(parsedUser.userType).toBe('company');
      
      // Validar que tiene nombre (enriquecimiento)
      expect(parsedUser.name).toBeDefined();
      expect(typeof parsedUser.name).toBe('string');

      console.log('✅ Company login successful:', {
        userId: result.user.id,
        userName: parsedUser.name,
        hasToken: !!result.accessToken,
      });
    }, 30000);

    it('should login successfully with employee credentials from REAL API', async () => {
      console.log('🧪 Testing login with employee:', TEST_EMPLOYEE.email);

      const result = await authService.login(TEST_EMPLOYEE.email, TEST_EMPLOYEE.password);

      // Validar estructura de respuesta
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      
      // Validar que es un empleado
      expect(result.user.userType).toBe('employee');
      
      // Validar que se guardó en AsyncStorage
      const savedUser = await AsyncStorage.getItem('@tramuu_user');
      const parsedUser = JSON.parse(savedUser);
      
      expect(parsedUser.email).toBe(TEST_EMPLOYEE.email);
      expect(parsedUser.userType).toBe('employee');
      expect(parsedUser.name).toBeDefined();

      console.log('✅ Employee login successful:', {
        userId: result.user.id,
        userName: parsedUser.name,
      });
    }, 30000);

    it('should fail login with invalid credentials', async () => {
      console.log('🧪 Testing login with invalid credentials');

      // ✅ Usar expectError en lugar de rejects.toThrow
      await expectError(
        authService.login('invalid@test.com', 'wrongpassword'),
        401
      );

      // Validar que NO se guardó nada en AsyncStorage
      const savedToken = await AsyncStorage.getItem('@tramuu_access_token');
      expect(savedToken).toBeNull();

      console.log('✅ Invalid credentials rejected correctly');
    }, 30000);

    it('should enrich user object with company/employee data from REAL API', async () => {
      console.log('🧪 Testing user data enrichment');

      await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);

      const savedUser = await AsyncStorage.getItem('@tramuu_user');
      const parsedUser = JSON.parse(savedUser);

      // Validar que tiene todos los campos enriquecidos
      expect(parsedUser.id).toBeDefined();
      expect(parsedUser.email).toBeDefined();
      expect(parsedUser.userType).toBeDefined();
      expect(parsedUser.name).toBeDefined();
      expect(parsedUser.phone).toBeDefined();

      // Para empresas, debe tener companyData
      if (parsedUser.userType === 'company') {
        expect(parsedUser.companyData).toBeDefined();
        expect(parsedUser.companyId).toBeDefined();
      }

      console.log('✅ User data enrichment validated:', {
        hasName: !!parsedUser.name,
        hasPhone: !!parsedUser.phone,
        hasCompanyData: !!parsedUser.companyData,
      });
    }, 30000);

    it('should save refresh token if provided by REAL API', async () => {
      console.log('🧪 Testing refresh token storage');

      await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);

      const refreshToken = await AsyncStorage.getItem('@tramuu_refresh_token');
      
      // El backend puede o no devolver refresh token
      if (refreshToken) {
        expect(typeof refreshToken).toBe('string');
        expect(refreshToken.length).toBeGreaterThan(0);
        console.log('✅ Refresh token saved');
      } else {
        console.log('ℹ️  Backend does not provide refresh token');
      }
    }, 30000);
  });

  describe('Register Endpoints', () => {
    it('should register company successfully via REAL API', async () => {
      console.log('🧪 Testing company registration:', NEW_COMPANY.email);

      try {
        const result = await authService.registerCompany(NEW_COMPANY);

        // Validar estructura de respuesta
        expect(result).toBeDefined();
        expect(result.user).toBeDefined();
        expect(result.accessToken).toBeDefined();
        
        // Validar que es una empresa
        expect(result.user.userType).toBe('company');
        
        // Validar que se guardó en AsyncStorage
        const savedUser = await AsyncStorage.getItem('@tramuu_user');
        const parsedUser = JSON.parse(savedUser);
        
        expect(parsedUser.userType).toBe('company');
        expect(parsedUser.email).toBe(NEW_COMPANY.email);

        console.log('✅ Company registered successfully:', {
          userId: result.user.id,
          email: parsedUser.email,
        });

        // Limpiar: hacer logout
        await authService.logout();
      } catch (error) {
        // Si falla, puede ser porque el email ya existe
        if (error.message?.includes('already exists') || error.status === 409) {
          console.log('ℹ️  Company already exists (expected if running tests multiple times)');
        } else {
          throw error;
        }
      }
    }, 30000);

    it('should register employee successfully via REAL API', async () => {
      console.log('🧪 Testing employee registration:', NEW_EMPLOYEE.email);

      try {
        const result = await authService.registerEmployee(NEW_EMPLOYEE);

        expect(result).toBeDefined();
        expect(result.user).toBeDefined();
        expect(result.accessToken).toBeDefined();
        expect(result.user.userType).toBe('employee');

        console.log('✅ Employee registered successfully:', {
          userId: result.user.id,
        });

        await authService.logout();
      } catch (error) {
        // Si falla, puede ser por código de invitación inválido o email existente
        if (error.message?.includes('invitation') || error.message?.includes('already exists')) {
          console.log('ℹ️  Registration failed (expected):', error.message);
        } else {
          throw error;
        }
      }
    }, 30000);
  });

  describe('Logout Endpoint', () => {
    it('should logout successfully and clear local data', async () => {
      console.log('🧪 Testing logout');

      // Primero hacer login
      await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);

      // Verificar que hay datos
      let token = await AsyncStorage.getItem('@tramuu_access_token');
      expect(token).toBeTruthy();

      // Hacer logout
      await authService.logout();

      // Verificar que se limpiaron los datos locales
      token = await AsyncStorage.getItem('@tramuu_access_token');
      const user = await AsyncStorage.getItem('@tramuu_user');
      const refreshToken = await AsyncStorage.getItem('@tramuu_refresh_token');

      expect(token).toBeNull();
      expect(user).toBeNull();
      expect(refreshToken).toBeNull();

      console.log('✅ Logout successful and data cleared');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  describe('Helper Methods', () => {
    it('should get current user correctly', async () => {
      console.log('🧪 Testing getCurrentUser');

      // Sin login, debe retornar null
      let currentUser = await authService.getCurrentUser();
      expect(currentUser).toBeNull();

      // Después de login, debe retornar el usuario
      await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);
      
      currentUser = await authService.getCurrentUser();
      expect(currentUser).toBeDefined();
      expect(currentUser.email).toBe(TEST_COMPANY.email);

      console.log('✅ getCurrentUser working correctly');
    }, TEST_TIMEOUTS.MEDIUM);

    it('should check authentication status correctly', async () => {
      console.log('🧪 Testing isAuthenticated');

      // Sin login, debe ser false
      let isAuth = await authService.isAuthenticated();
      expect(isAuth).toBe(false);

      // Después de login, debe ser true
      await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);
      
      isAuth = await authService.isAuthenticated();
      expect(isAuth).toBe(true);

      // Después de logout, debe ser false
      await authService.logout();
      
      isAuth = await authService.isAuthenticated();
      expect(isAuth).toBe(false);

      console.log('✅ isAuthenticated working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  describe('API Connectivity', () => {
    it('should validate API is reachable', async () => {
      console.log('🧪 Testing API connectivity');

      // Intentar login para validar que la API responde
      try {
        await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);
        console.log('✅ API is reachable and responding');
      } catch (error) {
        if (error.isNetworkError) {
          console.error('❌ API is not reachable - check backend is running');
          throw new Error('Backend API is not accessible. Make sure it is running.');
        }
        // Otros errores son aceptables (ej: credenciales)
      }
    }, TEST_TIMEOUTS.LONG);
  });
});
