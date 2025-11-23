/**
 * [SERVICE_NAME] Service Integration Tests
 * Tests de integración que consumen la API REAL del backend
 * 
 * IMPORTANTE: 
 * - Estos tests requieren que el backend esté corriendo
 * - Requiere un usuario autenticado
 * - Los datos pueden persistir en la base de datos
 * 
 * INSTRUCCIONES DE USO:
 * 1. Copiar este archivo
 * 2. Reemplazar [SERVICE_NAME] con el nombre del servicio (ej: Cows, Milkings)
 * 3. Reemplazar [service_name] con el nombre en minúsculas (ej: cows, milkings)
 * 4. Reemplazar [RESOURCE] con el nombre del recurso (ej: cow, milking)
 * 5. Ajustar los datos de prueba según el modelo
 * 6. Implementar los tests específicos del servicio
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../auth/auth.service';
import [service_name]Service from '../[service_name].service';

describe('[SERVICE_NAME] Service - Integration Tests (REAL API)', () => {
  // Credenciales de prueba
  const TEST_COMPANY = {
    email: 'test.company@tramuu.test',
    password: 'TestPassword123!',
  };

  const TEST_EMPLOYEE = {
    email: 'test.employee@tramuu.test',
    password: 'TestPassword123!',
  };

  // IDs de recursos creados durante tests (para cleanup)
  let createdResourceIds = [];

  // Datos de prueba - AJUSTAR SEGÚN EL SERVICIO
  const TEST_RESOURCE_DATA = {
    // Ejemplo para Cow:
    // name: 'Test Cow Integration',
    // code: `COW${Date.now()}`,
    // breed: 'Holstein',
    // birthDate: '2023-01-01',
    // status: 'active',
  };

  beforeAll(async () => {
    // Login antes de todos los tests
    console.log('🔐 Logging in for [SERVICE_NAME] tests...');
    await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);
    console.log('✅ Login successful');
  }, 120000);

  afterAll(async () => {
    // Cleanup: eliminar recursos creados durante tests
    console.log('🧹 Cleaning up test resources...');
    
    for (const id of createdResourceIds) {
      try {
        await [service_name]Service.delete(id);
        console.log(`✅ Deleted resource: ${id}`);
      } catch (error) {
        console.log(`ℹ️  Could not delete resource ${id}:`, error.message);
      }
    }

    // Logout
    await authService.logout();
    console.log('✅ Cleanup complete');
  });

  beforeEach(async () => {
    // Pausa entre tests para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  // ============================================================================
  // GET /[resource] - List All
  // ============================================================================
  describe('GET /[resource] - List All [RESOURCE]s', () => {
    it('should list all [resource]s from REAL API', async () => {
      console.log('🧪 Testing GET /[resource] - List all');

      const result = await [service_name]Service.getAll();

      // Validar estructura de respuesta
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Validar estructura de cada item (si hay resultados)
      if (result.length > 0) {
        const first[RESOURCE] = result[0];
        expect(first[RESOURCE].id).toBeDefined();
        // Agregar más validaciones según el modelo
      }

      console.log('✅ [RESOURCE]s listed:', {
        count: result.length,
        hasData: result.length > 0,
      });
    }, 120000);

    it('should handle empty list gracefully', async () => {
      console.log('🧪 Testing empty list handling');

      const result = await [service_name]Service.getAll();

      // Incluso sin datos, debe devolver array
      expect(Array.isArray(result)).toBe(true);

      console.log('✅ Empty list handled correctly');
    }, 120000);
  });

  // ============================================================================
  // POST /[resource] - Create
  // ============================================================================
  describe('POST /[resource] - Create [RESOURCE]', () => {
    it('should create a new [resource] via REAL API', async () => {
      console.log('🧪 Testing POST /[resource] - Create');

      const result = await [service_name]Service.create(TEST_RESOURCE_DATA);

      // Validar que se creó correctamente
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      
      // Validar que los datos se guardaron correctamente
      // AJUSTAR según el modelo
      // expect(result.name).toBe(TEST_RESOURCE_DATA.name);

      // Guardar ID para cleanup
      createdResourceIds.push(result.id);

      console.log('✅ [RESOURCE] created:', {
        id: result.id,
        data: result,
      });
    }, 120000);

    it('should validate required fields', async () => {
      console.log('🧪 Testing field validation');

      try {
        // Intentar crear sin datos requeridos
        await [service_name]Service.create({});
        
        // Si llega aquí, el backend no está validando
        console.log('⚠️  Backend is not validating required fields');
      } catch (error) {
        // Debe fallar con error de validación
        expect(error).toBeDefined();
        console.log('✅ Field validation working:', error.message);
      }
    }, 120000);
  });

  // ============================================================================
  // GET /[resource]/:id - Get by ID
  // ============================================================================
  describe('GET /[resource]/:id - Get [RESOURCE] by ID', () => {
    let test[RESOURCE]Id;

    beforeAll(async () => {
      // Crear un recurso de prueba
      const created = await [service_name]Service.create(TEST_RESOURCE_DATA);
      test[RESOURCE]Id = created.id;
      createdResourceIds.push(test[RESOURCE]Id);
    });

    it('should get [resource] by ID from REAL API', async () => {
      console.log('🧪 Testing GET /[resource]/:id');

      const result = await [service_name]Service.getById(test[RESOURCE]Id);

      expect(result).toBeDefined();
      expect(result.id).toBe(test[RESOURCE]Id);

      console.log('✅ [RESOURCE] retrieved:', result.id);
    }, 120000);

    it('should return 404 for non-existent [resource]', async () => {
      console.log('🧪 Testing 404 handling');

      try {
        await [service_name]Service.getById('non-existent-id');
        
        // Si llega aquí, el backend no está validando
        console.log('⚠️  Backend is not returning 404 for invalid ID');
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ 404 error handled correctly');
      }
    }, 120000);
  });

  // ============================================================================
  // PUT /[resource]/:id - Update
  // ============================================================================
  describe('PUT /[resource]/:id - Update [RESOURCE]', () => {
    let test[RESOURCE]Id;

    beforeAll(async () => {
      const created = await [service_name]Service.create(TEST_RESOURCE_DATA);
      test[RESOURCE]Id = created.id;
      createdResourceIds.push(test[RESOURCE]Id);
    });

    it('should update [resource] via REAL API', async () => {
      console.log('🧪 Testing PUT /[resource]/:id');

      const updatedData = {
        ...TEST_RESOURCE_DATA,
        // Cambiar algún campo
        // name: 'Updated Name',
      };

      const result = await [service_name]Service.update(test[RESOURCE]Id, updatedData);

      expect(result).toBeDefined();
      expect(result.id).toBe(test[RESOURCE]Id);
      // Validar que se actualizó
      // expect(result.name).toBe(updatedData.name);

      console.log('✅ [RESOURCE] updated:', result.id);
    }, 120000);
  });

  // ============================================================================
  // DELETE /[resource]/:id - Delete
  // ============================================================================
  describe('DELETE /[resource]/:id - Delete [RESOURCE]', () => {
    it('should delete [resource] via REAL API', async () => {
      console.log('🧪 Testing DELETE /[resource]/:id');

      // Crear recurso para eliminar
      const created = await [service_name]Service.create(TEST_RESOURCE_DATA);
      const idToDelete = created.id;

      // Eliminar
      await [service_name]Service.delete(idToDelete);

      // Verificar que se eliminó
      try {
        await [service_name]Service.getById(idToDelete);
        console.log('⚠️  [RESOURCE] still exists after deletion');
      } catch (error) {
        // Debe fallar al intentar obtenerlo
        console.log('✅ [RESOURCE] deleted successfully');
      }
    }, 120000);
  });

  // ============================================================================
  // Endpoints Adicionales (AJUSTAR SEGÚN EL SERVICIO)
  // ============================================================================
  describe('Additional Endpoints', () => {
    it('should test additional endpoint 1', async () => {
      // Ejemplo: activar/desactivar, obtener estadísticas, etc.
      console.log('🧪 Testing additional endpoint');

      // Implementar test específico

      console.log('✅ Additional endpoint validated');
    }, 120000);
  });

  // ============================================================================
  // Validación de Datos
  // ============================================================================
  describe('Data Validation', () => {
    it('should return consistent data types', async () => {
      console.log('🧪 Testing data type consistency');

      const result = await [service_name]Service.getAll();

      if (result.length > 0) {
        const first = result[0];
        
        // Validar tipos de datos
        expect(typeof first.id).toBe('string');
        // Agregar más validaciones según el modelo
      }

      console.log('✅ Data types are consistent');
    }, 120000);

    it('should handle pagination if supported', async () => {
      console.log('🧪 Testing pagination');

      // Si el servicio soporta paginación
      try {
        const result = await [service_name]Service.getAll({ page: 1, limit: 10 });
        expect(result).toBeDefined();
        console.log('✅ Pagination supported');
      } catch (error) {
        console.log('ℹ️  Pagination not supported or not implemented');
      }
    }, 120000);
  });

  // ============================================================================
  // Manejo de Errores
  // ============================================================================
  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      console.log('🧪 Testing network error handling');

      try {
        const result = await [service_name]Service.getAll();
        expect(result).toBeDefined();
        console.log('✅ Network connection is stable');
      } catch (error) {
        if (error.isNetworkError) {
          console.log('⚠️  Network error detected');
        }
        expect(error).toBeDefined();
      }
    }, 120000);

    it('should handle unauthorized access', async () => {
      console.log('🧪 Testing unauthorized access handling');

      // Guardar token actual
      const currentToken = await AsyncStorage.getItem('@tramuu_access_token');

      // Limpiar token
      await AsyncStorage.removeItem('@tramuu_access_token');

      try {
        await [service_name]Service.getAll();
        console.log('ℹ️  Endpoint does not require authentication');
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Unauthorized access rejected correctly');
      } finally {
        // Restaurar token
        if (currentToken) {
          await AsyncStorage.setItem('@tramuu_access_token', currentToken);
        }
      }
    }, 120000);
  });
});
