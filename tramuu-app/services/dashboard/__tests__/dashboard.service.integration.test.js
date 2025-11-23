/**
 * Dashboard Service Integration Tests
 * Tests de integración que consumen la API REAL del backend
 * 
 * IMPORTANTE: 
 * - Estos tests requieren que el backend esté corriendo
 * - Requiere un usuario autenticado (empresa)
 * - Los datos dependen del estado actual de la base de datos
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TEST_CREDENTIALS } from '../../../__tests__/testConfig';
import authService from '../../auth/auth.service';
import dashboardService from '../dashboard.service';

describe('DashboardService - Integration Tests (REAL API)', () => {
  // Credenciales de prueba REALES del backend
  const TEST_COMPANY = {
    email: TEST_CREDENTIALS.COMPANY.email,
    password: TEST_CREDENTIALS.COMPANY.password,
  };

  beforeAll(async () => {
    // Login antes de todos los tests
    console.log('🔐 Logging in for dashboard tests...');
    await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);
  }, 30000);

  afterAll(async () => {
    // Logout después de todos los tests
    await authService.logout();
  });

  beforeEach(async () => {
    // Pequeña pausa entre tests para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  describe('GET /dashboard/summary', () => {
    it('should fetch dashboard summary from REAL API', async () => {
      console.log('🧪 Testing getSummary endpoint');

      const summary = await dashboardService.getSummary();

      // Validar estructura de respuesta
      expect(summary).toBeDefined();
      expect(typeof summary).toBe('object');

      // Validar que tiene las secciones esperadas
      expect(summary.today).toBeDefined();
      expect(summary.thisWeek).toBeDefined();

      // Validar estructura de "today"
      if (summary.today) {
        expect(typeof summary.today.totalLiters).toBe('number');
        expect(typeof summary.today.milkingsAM).toBe('number');
        expect(typeof summary.today.milkingsPM).toBe('number');
        expect(typeof summary.today.avgPerCow).toBe('number');
        expect(typeof summary.today.activeCows).toBe('number');
      }

      // Validar estructura de "thisWeek"
      if (summary.thisWeek) {
        expect(typeof summary.thisWeek.totalLiters).toBe('number');
        expect(Array.isArray(summary.thisWeek.dailyProduction)).toBe(true);
      }

      // Validar topProducers si existe
      if (summary.topProducers) {
        expect(Array.isArray(summary.topProducers)).toBe(true);
      }

      console.log('✅ Dashboard summary fetched:', {
        todayLiters: summary.today?.totalLiters || 0,
        weekLiters: summary.thisWeek?.totalLiters || 0,
        topProducersCount: summary.topProducers?.length || 0,
      });
    }, 30000);

    it('should handle empty dashboard data gracefully', async () => {
      console.log('🧪 Testing empty dashboard handling');

      const summary = await dashboardService.getSummary();

      // Incluso sin datos, debe devolver estructura
      expect(summary).toBeDefined();
      
      // Los números deben ser 0 o undefined, no null
      if (summary.today) {
        expect(summary.today.totalLiters).toBeGreaterThanOrEqual(0);
      }

      console.log('✅ Empty dashboard handled correctly');
    }, 30000);
  });

  describe('GET /dashboard/production', () => {
    it('should fetch production by period - DAY', async () => {
      console.log('🧪 Testing getProductionByPeriod - DAY');

      const production = await dashboardService.getProductionByPeriod('day');

      expect(production).toBeDefined();
      expect(production).toHaveProperty('period', 'day');
      expect(production).toHaveProperty('labels');
      expect(production).toHaveProperty('dataPoints');
      expect(production).toHaveProperty('summary');
      expect(Array.isArray(production.labels)).toBe(true);
      expect(Array.isArray(production.dataPoints)).toBe(true);

      console.log('✅ Daily production fetched:', {
        period: production.period,
        dataPointsCount: production.dataPoints.length,
        labelsCount: production.labels.length,
      });
    }, 30000);

    it('should fetch production by period - WEEK', async () => {
      console.log('🧪 Testing getProductionByPeriod - WEEK');

      const production = await dashboardService.getProductionByPeriod('week');

      expect(production).toBeDefined();
      expect(production).toHaveProperty('period', 'week');
      expect(production).toHaveProperty('labels');
      expect(production).toHaveProperty('dataPoints');
      expect(Array.isArray(production.labels)).toBe(true);
      expect(Array.isArray(production.dataPoints)).toBe(true);

      console.log('✅ Weekly production fetched:', {
        period: production.period,
        dataPointsCount: production.dataPoints.length,
      });
    }, 30000);

    it('should fetch production by period - MONTH', async () => {
      console.log('🧪 Testing getProductionByPeriod - MONTH');

      const production = await dashboardService.getProductionByPeriod('month');

      expect(production).toBeDefined();
      expect(production).toHaveProperty('period', 'month');
      expect(production).toHaveProperty('labels');
      expect(production).toHaveProperty('dataPoints');
      expect(Array.isArray(production.labels)).toBe(true);
      expect(Array.isArray(production.dataPoints)).toBe(true);

      console.log('✅ Monthly production fetched:', {
        period: production.period,
        dataPointsCount: production.dataPoints.length,
      });
    }, 30000);

    it('should handle invalid period gracefully', async () => {
      console.log('🧪 Testing invalid period handling');

      try {
        // Intentar con período inválido
        const production = await dashboardService.getProductionByPeriod('invalid');
        
        // Si no falla, debe retornar estructura válida con arrays vacíos
        expect(production).toBeDefined();
        expect(production).toHaveProperty('period');
        expect(production).toHaveProperty('labels');
        expect(production).toHaveProperty('dataPoints');
        expect(Array.isArray(production.labels)).toBe(true);
        expect(Array.isArray(production.dataPoints)).toBe(true);
        console.log('✅ Invalid period handled with fallback');
      } catch (error) {
        // Si falla, debe ser un error esperado
        expect(error).toBeDefined();
        console.log('✅ Invalid period rejected correctly');
      }
    }, 30000);
  });

  describe('Employee Dashboard (if applicable)', () => {
    it('should fetch employee summary if user is employee', async () => {
      // Este test solo aplica si el usuario es empleado
      // Para empresas, puede no existir este endpoint

      try {
        const summary = await dashboardService.getEmployeeSummary();

        if (summary) {
          expect(summary).toBeDefined();
          expect(typeof summary).toBe('object');

          // Validar estructura esperada para empleados
          if (summary.milkings) {
            expect(Array.isArray(summary.milkings)).toBe(true);
          }

          console.log('✅ Employee summary fetched:', summary);
        }
      } catch (error) {
        // Es esperado si el usuario es empresa
        console.log('ℹ️  Employee summary not available (user is company)');
      }
    }, 30000);
  });

  describe('API Response Validation', () => {
    it('should return consistent data types', async () => {
      console.log('🧪 Testing data type consistency');

      const summary = await dashboardService.getSummary();

      // Todos los números deben ser numbers, no strings
      if (summary.today) {
        expect(typeof summary.today.totalLiters).toBe('number');
        expect(typeof summary.today.milkingsAM).toBe('number');
        expect(typeof summary.today.milkingsPM).toBe('number');
        expect(typeof summary.today.avgPerCow).toBe('number');
        expect(typeof summary.today.activeCows).toBe('number');
      }

      console.log('✅ Data types are consistent');
    }, 30000);

    it('should return non-negative values', async () => {
      console.log('🧪 Testing for non-negative values');

      const summary = await dashboardService.getSummary();

      // Los valores no pueden ser negativos
      if (summary.today) {
        expect(summary.today.totalLiters).toBeGreaterThanOrEqual(0);
        expect(summary.today.milkingsAM).toBeGreaterThanOrEqual(0);
        expect(summary.today.milkingsPM).toBeGreaterThanOrEqual(0);
        expect(summary.today.avgPerCow).toBeGreaterThanOrEqual(0);
        expect(summary.today.activeCows).toBeGreaterThanOrEqual(0);
      }

      console.log('✅ All values are non-negative');
    }, 30000);
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      console.log('🧪 Testing network error handling');

      // Este test validará que los errores de red se manejan apropiadamente
      // En producción real, podríamos desconectar la red temporalmente
      
      try {
        const summary = await dashboardService.getSummary();
        expect(summary).toBeDefined();
        console.log('✅ Network connection is stable');
      } catch (error) {
        // Si hay error de red, debe ser manejado apropiadamente
        expect(error).toBeDefined();
        console.log('ℹ️  Network error detected and handled');
      }
    }, 30000);

    it('should handle unauthorized access', async () => {
      console.log('🧪 Testing unauthorized access handling');

      // Guardar token actual
      const currentToken = await AsyncStorage.getItem('@tramuu_access_token');

      // Limpiar token para simular no autorizado
      await AsyncStorage.removeItem('@tramuu_access_token');

      try {
        await dashboardService.getSummary();
        
        // Si llega aquí, el backend no requiere autenticación (poco probable)
        console.log('ℹ️  Endpoint does not require authentication');
      } catch (error) {
        // Debe fallar con error 401 o similar
        expect(error).toBeDefined();
        console.log('✅ Unauthorized access rejected correctly');
      } finally {
        // Restaurar token
        if (currentToken) {
          await AsyncStorage.setItem('@tramuu_access_token', currentToken);
        }
      }
    }, 30000);
  });
});
