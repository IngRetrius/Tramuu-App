/**
 * Milkings Service - Integration Tests (REAL API)
 * 
 * Tests all milking endpoints against the real backend API
 * Backend endpoints (9 total):
 * - POST /milkings/rapid
 * - POST /milkings/individual
 * - POST /milkings/massive
 * - GET /milkings
 * - GET /milkings/:id
 * - GET /milkings/cow/:cowId/history
 * - GET /milkings/employee/:employeeId/history
 * - GET /milkings/stats/daily
 * - DELETE /milkings/:id
 */

import { TEST_CREDENTIALS, TEST_DATA_TEMPLATES, TEST_TIMEOUTS } from '../../../__tests__/testConfig';
import authService from '../../auth/auth.service';
import cowsService from '../../cows/cows.service';
import milkingsService from '../milkings.service';

describe('Milkings Service - Integration Tests (REAL API)', () => {
  const TEST_COMPANY = {
    email: TEST_CREDENTIALS.COMPANY.email,
    password: TEST_CREDENTIALS.COMPANY.password,
  };

  const TEST_EMPLOYEE = {
    email: TEST_CREDENTIALS.EMPLOYEE.email,
    password: TEST_CREDENTIALS.EMPLOYEE.password,
  };

  let createdMilkingIds = [];
  let testCowId;
  let employeeId = TEST_CREDENTIALS.EMPLOYEE.employeeId;

  beforeAll(async () => {
    console.log('🔐 Logging in as COMPANY for Milkings tests...');
    await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);
    
    // Crear una vaca de prueba para los registros de ordeño
    console.log('🐄 Creating test cow...');
    const testCow = await cowsService.createCow({
      name: TEST_DATA_TEMPLATES.COW.name(),
      code: TEST_DATA_TEMPLATES.COW.code(),
      breed: TEST_DATA_TEMPLATES.COW.breed,
      birthDate: TEST_DATA_TEMPLATES.COW.birthDate,
      weight: TEST_DATA_TEMPLATES.COW.weight,
      status: TEST_DATA_TEMPLATES.COW.status,
    });
    testCowId = testCow.id;
    console.log('✅ Test cow created:', testCowId);
  }, TEST_TIMEOUTS.LONG);

  afterAll(async () => {
    console.log('🧹 Cleaning up milkings tests...');
    
    // Eliminar todos los ordeños creados
    for (const id of createdMilkingIds) {
      try {
        await milkingsService.deleteMilking(id);
        console.log(`✅ Deleted milking: ${id}`);
      } catch (error) {
        console.log(`⚠️ Could not delete milking ${id}:`, error.message);
      }
    }

    // Eliminar la vaca de prueba
    if (testCowId) {
      try {
        await cowsService.deleteCow(testCowId);
        console.log('✅ Test cow deleted');
      } catch (error) {
        console.log('⚠️ Could not delete test cow:', error.message);
      }
    }

    await authService.logout();
  });

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  // ==================== POST /milkings/rapid ====================
  describe('POST /milkings/rapid - Rapid Milking', () => {
    it('should create rapid milking record successfully', async () => {
      console.log('🧪 Testing rapid milking creation');

      const milkingData = {
        cowId: testCowId,
        liters: TEST_DATA_TEMPLATES.MILKING.liters,
        observations: 'Rapid test milking',
      };

      const result = await milkingsService.createRapidMilking(milkingData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.liters).toBe(milkingData.liters);
      expect(result.cowId).toBe(testCowId);

      createdMilkingIds.push(result.id);
      console.log('✅ Rapid milking created:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when creating rapid milking without cowId', async () => {
      console.log('🧪 Testing rapid milking without cowId (should fail)');

      await expect(
        milkingsService.createRapidMilking({
          liters: 15,
          observations: 'Invalid test',
        })
      ).rejects.toThrow();

      console.log('✅ Validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== POST /milkings/individual ====================
  describe('POST /milkings/individual - Individual Milking', () => {
    it('should create individual milking record successfully', async () => {
      console.log('🧪 Testing individual milking creation');

      const milkingData = {
        cowId: testCowId,
        liters: TEST_DATA_TEMPLATES.MILKING.liters,
        fat: TEST_DATA_TEMPLATES.MILKING.fat,
        protein: TEST_DATA_TEMPLATES.MILKING.protein,
        temperature: TEST_DATA_TEMPLATES.MILKING.temperature,
        observations: 'Individual test milking',
      };

      const result = await milkingsService.createIndividualMilking(milkingData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.liters).toBe(milkingData.liters);
      expect(result.fat).toBe(milkingData.fat);
      expect(result.protein).toBe(milkingData.protein);

      createdMilkingIds.push(result.id);
      console.log('✅ Individual milking created:', result.id);
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== POST /milkings/massive ====================
  describe('POST /milkings/massive - Massive Milking', () => {
    it('should create massive milking records successfully', async () => {
      console.log('🧪 Testing massive milking creation');

      const massiveData = {
        milkings: [
          {
            cowId: testCowId,
            liters: 18,
            observations: 'Massive test 1',
          },
        ],
      };

      const result = await milkingsService.createMassiveMilking(massiveData);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Guardar IDs para limpieza
      result.forEach(milking => {
        if (milking.id) {
          createdMilkingIds.push(milking.id);
        }
      });

      console.log('✅ Massive milking created:', result.length, 'records');
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /milkings ====================
  describe('GET /milkings - List Milkings', () => {
    it('should list all milkings', async () => {
      console.log('🧪 Testing list all milkings');

      const result = await milkingsService.getMilkings();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Milkings listed:', result.length);
    }, TEST_TIMEOUTS.LONG);

    it('should filter milkings by date range', async () => {
      console.log('🧪 Testing filter milkings by date');

      const today = new Date().toISOString().split('T')[0];
      const result = await milkingsService.getMilkings({
        startDate: today,
        endDate: today,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Filtered milkings:', result.length);
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /milkings/:id ====================
  describe('GET /milkings/:id - Get Milking by ID', () => {
    it('should get specific milking by ID', async () => {
      console.log('🧪 Testing get milking by ID');

      // Crear un ordeño primero
      const created = await milkingsService.createRapidMilking({
        cowId: testCowId,
        liters: 20,
        observations: 'Test for GET by ID',
      });
      createdMilkingIds.push(created.id);

      const result = await milkingsService.getMilkingById(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.cowId).toBe(testCowId);

      console.log('✅ Milking retrieved:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when getting non-existent milking', async () => {
      console.log('🧪 Testing get non-existent milking');

      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(
        milkingsService.getMilkingById(fakeId)
      ).rejects.toThrow();

      console.log('✅ Error handling working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== GET /milkings/cow/:cowId/history ====================
  describe('GET /milkings/cow/:cowId/history - Cow Milking History', () => {
    it('should get milking history for specific cow', async () => {
      console.log('🧪 Testing cow milking history');

      // Crear un ordeño para la vaca
      const created = await milkingsService.createRapidMilking({
        cowId: testCowId,
        liters: 22,
        observations: 'Test for cow history',
      });
      createdMilkingIds.push(created.id);

      const result = await milkingsService.getCowHistory(testCowId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      console.log('✅ Cow history retrieved:', result.length, 'records');
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /milkings/employee/:employeeId/history ====================
  describe('GET /milkings/employee/:employeeId/history - Employee Milking History', () => {
    it('should get milking history for specific employee', async () => {
      console.log('🧪 Testing employee milking history');

      const result = await milkingsService.getEmployeeHistory(employeeId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      console.log('✅ Employee history retrieved:', result.length, 'records');
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /milkings/stats/daily ====================
  describe('GET /milkings/stats/daily - Daily Statistics', () => {
    it('should get daily milking statistics', async () => {
      console.log('🧪 Testing daily milking statistics');

      const today = new Date().toISOString().split('T')[0];
      const result = await milkingsService.getDailyStats(today);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      console.log('✅ Daily stats retrieved:', result);
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== DELETE /milkings/:id ====================
  describe('DELETE /milkings/:id - Delete Milking', () => {
    it('should delete milking successfully', async () => {
      console.log('🧪 Testing delete milking');

      // Crear un ordeño para eliminar
      const created = await milkingsService.createRapidMilking({
        cowId: testCowId,
        liters: 19,
        observations: 'Test for deletion',
      });

      const result = await milkingsService.deleteMilking(created.id);

      expect(result).toBeDefined();

      // Verificar que ya no existe
      await expect(
        milkingsService.getMilkingById(created.id)
      ).rejects.toThrow();

      console.log('✅ Milking deleted successfully');
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== EDGE CASES & VALIDATION ====================
  describe('Edge Cases & Validation', () => {
    it('should validate liters value', async () => {
      console.log('🧪 Testing liters validation');

      await expect(
        milkingsService.createRapidMilking({
          cowId: testCowId,
          liters: -5, // Invalid: negative
        })
      ).rejects.toThrow();

      console.log('✅ Validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);

    it('should handle missing required fields', async () => {
      console.log('🧪 Testing missing required fields');

      await expect(
        milkingsService.createRapidMilking({
          // Missing cowId and liters
          observations: 'Invalid test',
        })
      ).rejects.toThrow();

      console.log('✅ Required fields validation working');
    }, TEST_TIMEOUTS.MEDIUM);
  });
});
