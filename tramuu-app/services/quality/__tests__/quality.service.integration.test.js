/**
 * Quality Service - Integration Tests (REAL API)
 * 
 * Tests all quality test endpoints against the real backend API
 * Backend endpoints (6 total):
 * - POST /quality/tests
 * - GET /quality/tests
 * - GET /quality/tests/:id
 * - PUT /quality/tests/:id
 * - DELETE /quality/tests/:id
 * - GET /quality/stats
 */

import { TEST_CREDENTIALS, TEST_DATA_TEMPLATES, TEST_TIMEOUTS } from '../../../__tests__/testConfig';
import authService from '../../auth/auth.service';
import qualityService from '../quality.service';

describe('Quality Service - Integration Tests (REAL API)', () => {
  const TEST_COMPANY = {
    email: TEST_CREDENTIALS.COMPANY.email,
    password: TEST_CREDENTIALS.COMPANY.password,
  };

  let createdTestIds = [];

  beforeAll(async () => {
    console.log('🔐 Logging in as COMPANY for Quality tests...');
    await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);
  }, TEST_TIMEOUTS.LONG);

  afterAll(async () => {
    console.log('🧹 Cleaning up quality tests...');
    
    for (const id of createdTestIds) {
      try {
        await qualityService.deleteQualityTest(id);
        console.log(`✅ Deleted quality test: ${id}`);
      } catch (error) {
        console.log(`⚠️ Could not delete quality test ${id}:`, error.message);
      }
    }

    await authService.logout();
  });

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  // ==================== POST /quality/tests ====================
  describe('POST /quality/tests - Create Quality Test', () => {
    it('should create quality test successfully', async () => {
      console.log('🧪 Testing quality test creation');

      const testData = {
        date: TEST_DATA_TEMPLATES.QUALITY_TEST.date(),
        fat: TEST_DATA_TEMPLATES.QUALITY_TEST.fat,
        protein: TEST_DATA_TEMPLATES.QUALITY_TEST.protein,
        lactose: TEST_DATA_TEMPLATES.QUALITY_TEST.lactose,
        solids: TEST_DATA_TEMPLATES.QUALITY_TEST.solids,
        temperature: TEST_DATA_TEMPLATES.QUALITY_TEST.temperature,
        ph: TEST_DATA_TEMPLATES.QUALITY_TEST.ph,
        observations: 'Integration test quality check',
      };

      const result = await qualityService.createQualityTest(testData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.fat).toBe(testData.fat);
      expect(result.protein).toBe(testData.protein);

      createdTestIds.push(result.id);
      console.log('✅ Quality test created:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when creating test with invalid data', async () => {
      console.log('🧪 Testing quality test with invalid data');

      await expect(
        qualityService.createQualityTest({
          fat: -5, // Invalid: negative
          protein: 150, // Invalid: too high
        })
      ).rejects.toThrow();

      console.log('✅ Validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== GET /quality/tests ====================
  describe('GET /quality/tests - List Quality Tests', () => {
    it('should list all quality tests', async () => {
      console.log('🧪 Testing list all quality tests');

      const result = await qualityService.getQualityTests();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Quality tests listed:', result.length);
    }, TEST_TIMEOUTS.LONG);

    it('should filter quality tests by date range', async () => {
      console.log('🧪 Testing filter quality tests by date');

      const today = new Date().toISOString().split('T')[0];
      const result = await qualityService.getQualityTests({
        startDate: today,
        endDate: today,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Filtered quality tests:', result.length);
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /quality/tests/:id ====================
  describe('GET /quality/tests/:id - Get Quality Test by ID', () => {
    it('should get specific quality test by ID', async () => {
      console.log('🧪 Testing get quality test by ID');

      // Crear un test primero
      const created = await qualityService.createQualityTest({
        date: new Date().toISOString(),
        fat: 3.8,
        protein: 3.2,
        lactose: 4.5,
        solids: 12.5,
        temperature: 4.0,
        ph: 6.7,
        observations: 'Test for GET by ID',
      });
      createdTestIds.push(created.id);

      const result = await qualityService.getQualityTestById(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.fat).toBe(3.8);

      console.log('✅ Quality test retrieved:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when getting non-existent test', async () => {
      console.log('🧪 Testing get non-existent quality test');

      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(
        qualityService.getQualityTestById(fakeId)
      ).rejects.toThrow();

      console.log('✅ Error handling working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== PUT /quality/tests/:id ====================
  describe('PUT /quality/tests/:id - Update Quality Test', () => {
    it('should update quality test successfully', async () => {
      console.log('🧪 Testing update quality test');

      // Crear un test primero
      const created = await qualityService.createQualityTest({
        date: new Date().toISOString(),
        fat: 3.5,
        protein: 3.0,
        lactose: 4.5,
        solids: 12.0,
        temperature: 4.0,
        ph: 6.7,
        observations: 'Original observation',
      });
      createdTestIds.push(created.id);

      // Actualizar
      const updateData = {
        fat: 4.0,
        protein: 3.5,
        observations: 'Updated observation',
      };

      const result = await qualityService.updateQualityTest(created.id, updateData);

      expect(result).toBeDefined();
      expect(result.fat).toBe(4.0);
      expect(result.protein).toBe(3.5);
      expect(result.observations).toBe('Updated observation');

      console.log('✅ Quality test updated:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when updating non-existent test', async () => {
      console.log('🧪 Testing update non-existent quality test');

      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(
        qualityService.updateQualityTest(fakeId, { fat: 4.0 })
      ).rejects.toThrow();

      console.log('✅ Error handling working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== DELETE /quality/tests/:id ====================
  describe('DELETE /quality/tests/:id - Delete Quality Test', () => {
    it('should delete quality test successfully', async () => {
      console.log('🧪 Testing delete quality test');

      // Crear un test para eliminar
      const created = await qualityService.createQualityTest({
        date: new Date().toISOString(),
        fat: 3.6,
        protein: 3.1,
        lactose: 4.5,
        solids: 12.2,
        temperature: 4.0,
        ph: 6.7,
        observations: 'Test for deletion',
      });

      const result = await qualityService.deleteQualityTest(created.id);

      expect(result).toBeDefined();

      // Verificar que ya no existe
      await expect(
        qualityService.getQualityTestById(created.id)
      ).rejects.toThrow();

      console.log('✅ Quality test deleted successfully');
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /quality/stats ====================
  describe('GET /quality/stats - Quality Statistics', () => {
    it('should get quality statistics', async () => {
      console.log('🧪 Testing quality statistics');

      const result = await qualityService.getStatistics();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      console.log('✅ Quality statistics retrieved:', result);
    }, TEST_TIMEOUTS.LONG);

    it('should get quality statistics with date range', async () => {
      console.log('🧪 Testing quality statistics with date range');

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const result = await qualityService.getStatistics({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      console.log('✅ Quality statistics with date range retrieved');
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== EDGE CASES & VALIDATION ====================
  describe('Edge Cases & Validation', () => {
    it('should validate fat percentage range', async () => {
      console.log('🧪 Testing fat percentage validation');

      await expect(
        qualityService.createQualityTest({
          date: new Date().toISOString(),
          fat: 15, // Invalid: too high
          protein: 3.2,
          lactose: 4.5,
          solids: 12.0,
        })
      ).rejects.toThrow();

      console.log('✅ Fat validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);

    it('should validate pH range', async () => {
      console.log('🧪 Testing pH validation');

      await expect(
        qualityService.createQualityTest({
          date: new Date().toISOString(),
          fat: 3.5,
          protein: 3.2,
          ph: 10.5, // Invalid: too high
        })
      ).rejects.toThrow();

      console.log('✅ pH validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);

    it('should handle missing required fields', async () => {
      console.log('🧪 Testing missing required fields');

      await expect(
        qualityService.createQualityTest({
          // Missing required fields
          observations: 'Invalid test',
        })
      ).rejects.toThrow();

      console.log('✅ Required fields validation working');
    }, TEST_TIMEOUTS.MEDIUM);
  });
});
