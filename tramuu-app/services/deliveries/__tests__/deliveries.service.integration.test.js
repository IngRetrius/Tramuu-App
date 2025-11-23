/**
 * Deliveries Service - Integration Tests (REAL API)
 * 
 * Tests all delivery endpoints against the real backend API
 * Backend endpoints (7 total):
 * - POST /deliveries
 * - GET /deliveries
 * - GET /deliveries/stats
 * - GET /deliveries/:id
 * - PUT /deliveries/:id
 * - PATCH /deliveries/:id/status
 * - DELETE /deliveries/:id
 */

import { TEST_CREDENTIALS, TEST_DATA_TEMPLATES, TEST_TIMEOUTS } from '../../../__tests__/testConfig';
import authService from '../../auth/auth.service';
import deliveriesService from '../deliveries.service';

describe('Deliveries Service - Integration Tests (REAL API)', () => {
  const TEST_COMPANY = {
    email: TEST_CREDENTIALS.COMPANY.email,
    password: TEST_CREDENTIALS.COMPANY.password,
  };

  let createdDeliveryIds = [];

  beforeAll(async () => {
    console.log('🔐 Logging in as COMPANY for Deliveries tests...');
    await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);
  }, TEST_TIMEOUTS.LONG);

  afterAll(async () => {
    console.log('🧹 Cleaning up deliveries tests...');
    
    for (const id of createdDeliveryIds) {
      try {
        await deliveriesService.deleteDelivery(id);
        console.log(`✅ Deleted delivery: ${id}`);
      } catch (error) {
        console.log(`⚠️ Could not delete delivery ${id}:`, error.message);
      }
    }

    await authService.logout();
  });

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  // ==================== POST /deliveries ====================
  describe('POST /deliveries - Create Delivery', () => {
    it('should create delivery successfully', async () => {
      console.log('🧪 Testing delivery creation');

      const deliveryData = {
        date: TEST_DATA_TEMPLATES.DELIVERY.date(),
        liters: TEST_DATA_TEMPLATES.DELIVERY.liters,
        buyer: TEST_DATA_TEMPLATES.DELIVERY.buyer(),
        price: TEST_DATA_TEMPLATES.DELIVERY.price,
        status: TEST_DATA_TEMPLATES.DELIVERY.status,
        observations: 'Integration test delivery',
      };

      const result = await deliveriesService.createDelivery(deliveryData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.liters).toBe(deliveryData.liters);
      expect(result.buyer).toBe(deliveryData.buyer);

      createdDeliveryIds.push(result.id);
      console.log('✅ Delivery created:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when creating delivery with invalid data', async () => {
      console.log('🧪 Testing delivery with invalid data');

      await expect(
        deliveriesService.createDelivery({
          liters: -100, // Invalid: negative
          price: -50, // Invalid: negative
        })
      ).rejects.toThrow();

      console.log('✅ Validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== GET /deliveries ====================
  describe('GET /deliveries - List Deliveries', () => {
    it('should list all deliveries', async () => {
      console.log('🧪 Testing list all deliveries');

      const result = await deliveriesService.getDeliveries();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Deliveries listed:', result.length);
    }, TEST_TIMEOUTS.LONG);

    it('should filter deliveries by date range', async () => {
      console.log('🧪 Testing filter deliveries by date');

      const today = new Date().toISOString().split('T')[0];
      const result = await deliveriesService.getDeliveries({
        startDate: today,
        endDate: today,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Filtered deliveries:', result.length);
    }, TEST_TIMEOUTS.LONG);

    it('should filter deliveries by status', async () => {
      console.log('🧪 Testing filter deliveries by status');

      const result = await deliveriesService.getDeliveries({
        status: 'PENDING',
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Filtered by status:', result.length);
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /deliveries/stats ====================
  describe('GET /deliveries/stats - Delivery Statistics', () => {
    it('should get delivery statistics', async () => {
      console.log('🧪 Testing delivery statistics');

      const result = await deliveriesService.getStatistics();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      console.log('✅ Delivery statistics retrieved:', result);
    }, TEST_TIMEOUTS.LONG);

    it('should get statistics with date range', async () => {
      console.log('🧪 Testing statistics with date range');

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const result = await deliveriesService.getStatistics({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      console.log('✅ Statistics with date range retrieved');
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /deliveries/:id ====================
  describe('GET /deliveries/:id - Get Delivery by ID', () => {
    it('should get specific delivery by ID', async () => {
      console.log('🧪 Testing get delivery by ID');

      // Crear una entrega primero
      const created = await deliveriesService.createDelivery({
        date: new Date().toISOString(),
        liters: 500,
        buyer: 'Test Buyer Co.',
        price: 2500,
        status: 'PENDING',
        observations: 'Test for GET by ID',
      });
      createdDeliveryIds.push(created.id);

      const result = await deliveriesService.getDeliveryById(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.buyer).toBe('Test Buyer Co.');

      console.log('✅ Delivery retrieved:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when getting non-existent delivery', async () => {
      console.log('🧪 Testing get non-existent delivery');

      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(
        deliveriesService.getDeliveryById(fakeId)
      ).rejects.toThrow();

      console.log('✅ Error handling working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== PUT /deliveries/:id ====================
  describe('PUT /deliveries/:id - Update Delivery', () => {
    it('should update delivery successfully', async () => {
      console.log('🧪 Testing update delivery');

      // Crear una entrega primero
      const created = await deliveriesService.createDelivery({
        date: new Date().toISOString(),
        liters: 400,
        buyer: 'Original Buyer',
        price: 2000,
        status: 'PENDING',
      });
      createdDeliveryIds.push(created.id);

      // Actualizar
      const updateData = {
        liters: 450,
        buyer: 'Updated Buyer',
        price: 2250,
        observations: 'Updated delivery',
      };

      const result = await deliveriesService.updateDelivery(created.id, updateData);

      expect(result).toBeDefined();
      expect(result.liters).toBe(450);
      expect(result.buyer).toBe('Updated Buyer');
      expect(result.price).toBe(2250);

      console.log('✅ Delivery updated:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when updating non-existent delivery', async () => {
      console.log('🧪 Testing update non-existent delivery');

      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(
        deliveriesService.updateDelivery(fakeId, { liters: 500 })
      ).rejects.toThrow();

      console.log('✅ Error handling working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== PATCH /deliveries/:id/status ====================
  describe('PATCH /deliveries/:id/status - Update Delivery Status', () => {
    it('should update delivery status successfully', async () => {
      console.log('🧪 Testing update delivery status');

      // Crear una entrega primero
      const created = await deliveriesService.createDelivery({
        date: new Date().toISOString(),
        liters: 300,
        buyer: 'Status Test Buyer',
        price: 1500,
        status: 'PENDING',
      });
      createdDeliveryIds.push(created.id);

      // Actualizar estado
      const result = await deliveriesService.updateStatus(created.id, 'COMPLETED');

      expect(result).toBeDefined();
      expect(result.status).toBe('COMPLETED');

      console.log('✅ Delivery status updated to COMPLETED');
    }, TEST_TIMEOUTS.LONG);

    it('should update status to CANCELLED', async () => {
      console.log('🧪 Testing update status to CANCELLED');

      const created = await deliveriesService.createDelivery({
        date: new Date().toISOString(),
        liters: 200,
        buyer: 'Cancel Test Buyer',
        price: 1000,
        status: 'PENDING',
      });
      createdDeliveryIds.push(created.id);

      const result = await deliveriesService.updateStatus(created.id, 'CANCELLED');

      expect(result).toBeDefined();
      expect(result.status).toBe('CANCELLED');

      console.log('✅ Delivery status updated to CANCELLED');
    }, TEST_TIMEOUTS.LONG);

    it('should fail with invalid status', async () => {
      console.log('🧪 Testing invalid status update');

      const created = await deliveriesService.createDelivery({
        date: new Date().toISOString(),
        liters: 250,
        buyer: 'Invalid Status Test',
        price: 1250,
        status: 'PENDING',
      });
      createdDeliveryIds.push(created.id);

      await expect(
        deliveriesService.updateStatus(created.id, 'INVALID_STATUS')
      ).rejects.toThrow();

      console.log('✅ Status validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== DELETE /deliveries/:id ====================
  describe('DELETE /deliveries/:id - Delete Delivery', () => {
    it('should delete delivery successfully', async () => {
      console.log('🧪 Testing delete delivery');

      // Crear una entrega para eliminar
      const created = await deliveriesService.createDelivery({
        date: new Date().toISOString(),
        liters: 350,
        buyer: 'Delete Test Buyer',
        price: 1750,
        status: 'PENDING',
        observations: 'Test for deletion',
      });

      const result = await deliveriesService.deleteDelivery(created.id);

      expect(result).toBeDefined();

      // Verificar que ya no existe
      await expect(
        deliveriesService.getDeliveryById(created.id)
      ).rejects.toThrow();

      console.log('✅ Delivery deleted successfully');
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== EDGE CASES & VALIDATION ====================
  describe('Edge Cases & Validation', () => {
    it('should validate liters value', async () => {
      console.log('🧪 Testing liters validation');

      await expect(
        deliveriesService.createDelivery({
          date: new Date().toISOString(),
          liters: -500, // Invalid: negative
          buyer: 'Test Buyer',
          price: 1000,
        })
      ).rejects.toThrow();

      console.log('✅ Liters validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);

    it('should validate price value', async () => {
      console.log('🧪 Testing price validation');

      await expect(
        deliveriesService.createDelivery({
          date: new Date().toISOString(),
          liters: 500,
          buyer: 'Test Buyer',
          price: -1000, // Invalid: negative
        })
      ).rejects.toThrow();

      console.log('✅ Price validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);

    it('should handle missing required fields', async () => {
      console.log('🧪 Testing missing required fields');

      await expect(
        deliveriesService.createDelivery({
          // Missing required fields
          observations: 'Invalid test',
        })
      ).rejects.toThrow();

      console.log('✅ Required fields validation working');
    }, TEST_TIMEOUTS.MEDIUM);

    it('should validate date format', async () => {
      console.log('🧪 Testing date format validation');

      await expect(
        deliveriesService.createDelivery({
          date: 'invalid-date-format',
          liters: 500,
          buyer: 'Test Buyer',
          price: 2500,
        })
      ).rejects.toThrow();

      console.log('✅ Date validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });
});
