/**
 * Inventory Service - Integration Tests (REAL API)
 * 
 * Tests all inventory endpoints against the real backend API
 * Backend endpoints (8 total):
 * - POST /inventory
 * - GET /inventory
 * - GET /inventory/stats
 * - GET /inventory/:id
 * - PUT /inventory/:id
 * - DELETE /inventory/:id
 * - POST /inventory/movements
 * - GET /inventory/movements
 */

import { TEST_CREDENTIALS, TEST_DATA_TEMPLATES, TEST_TIMEOUTS } from '../../../__tests__/testConfig';
import authService from '../../auth/auth.service';
import inventoryService from '../inventory.service';

describe('Inventory Service - Integration Tests (REAL API)', () => {
  const TEST_COMPANY = {
    email: TEST_CREDENTIALS.COMPANY.email,
    password: TEST_CREDENTIALS.COMPANY.password,
  };

  let createdItemIds = [];
  let createdMovementIds = [];

  beforeAll(async () => {
    console.log('🔐 Logging in as COMPANY for Inventory tests...');
    await authService.login(TEST_COMPANY.email, TEST_COMPANY.password);
  }, TEST_TIMEOUTS.LONG);

  afterAll(async () => {
    console.log('🧹 Cleaning up inventory tests...');
    
    for (const id of createdItemIds) {
      try {
        await inventoryService.deleteItem(id);
        console.log(`✅ Deleted inventory item: ${id}`);
      } catch (error) {
        console.log(`⚠️ Could not delete item ${id}:`, error.message);
      }
    }

    await authService.logout();
  });

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  // ==================== POST /inventory ====================
  describe('POST /inventory - Create Inventory Item', () => {
    it('should create inventory item successfully', async () => {
      console.log('🧪 Testing inventory item creation');

      const itemData = {
        name: TEST_DATA_TEMPLATES.INVENTORY_ITEM.name(),
        category: TEST_DATA_TEMPLATES.INVENTORY_ITEM.category,
        quantity: TEST_DATA_TEMPLATES.INVENTORY_ITEM.quantity,
        unit: TEST_DATA_TEMPLATES.INVENTORY_ITEM.unit,
        minStock: TEST_DATA_TEMPLATES.INVENTORY_ITEM.minStock,
        maxStock: TEST_DATA_TEMPLATES.INVENTORY_ITEM.maxStock,
        price: TEST_DATA_TEMPLATES.INVENTORY_ITEM.price,
        supplier: TEST_DATA_TEMPLATES.INVENTORY_ITEM.supplier,
        description: 'Integration test item',
      };

      const result = await inventoryService.createItem(itemData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(itemData.name);
      expect(result.quantity).toBe(itemData.quantity);

      createdItemIds.push(result.id);
      console.log('✅ Inventory item created:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when creating item with invalid data', async () => {
      console.log('🧪 Testing inventory item with invalid data');

      await expect(
        inventoryService.createItem({
          name: 'Test Item',
          quantity: -10, // Invalid: negative
        })
      ).rejects.toThrow();

      console.log('✅ Validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== GET /inventory ====================
  describe('GET /inventory - List Inventory Items', () => {
    it('should list all inventory items', async () => {
      console.log('🧪 Testing list all inventory items');

      const result = await inventoryService.getItems();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Inventory items listed:', result.length);
    }, TEST_TIMEOUTS.LONG);

    it('should filter inventory items by category', async () => {
      console.log('🧪 Testing filter inventory by category');

      const result = await inventoryService.getItems({
        category: 'FEED',
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Filtered inventory items:', result.length);
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /inventory/stats ====================
  describe('GET /inventory/stats - Inventory Statistics', () => {
    it('should get inventory statistics', async () => {
      console.log('🧪 Testing inventory statistics');

      const result = await inventoryService.getStatistics();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      console.log('✅ Inventory statistics retrieved:', result);
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /inventory/:id ====================
  describe('GET /inventory/:id - Get Inventory Item by ID', () => {
    it('should get specific inventory item by ID', async () => {
      console.log('🧪 Testing get inventory item by ID');

      // Crear un item primero
      const created = await inventoryService.createItem({
        name: 'Test Feed Item',
        category: 'FEED',
        quantity: 100,
        unit: 'kg',
        minStock: 20,
        maxStock: 200,
        price: 50,
        supplier: 'Test Supplier',
        description: 'Test for GET by ID',
      });
      createdItemIds.push(created.id);

      const result = await inventoryService.getItemById(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.name).toBe('Test Feed Item');

      console.log('✅ Inventory item retrieved:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when getting non-existent item', async () => {
      console.log('🧪 Testing get non-existent inventory item');

      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(
        inventoryService.getItemById(fakeId)
      ).rejects.toThrow();

      console.log('✅ Error handling working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== PUT /inventory/:id ====================
  describe('PUT /inventory/:id - Update Inventory Item', () => {
    it('should update inventory item successfully', async () => {
      console.log('🧪 Testing update inventory item');

      // Crear un item primero
      const created = await inventoryService.createItem({
        name: 'Original Medicine',
        category: 'MEDICINE',
        quantity: 50,
        unit: 'units',
        minStock: 10,
        maxStock: 100,
        price: 150,
        supplier: 'Original Supplier',
      });
      createdItemIds.push(created.id);

      // Actualizar
      const updateData = {
        name: 'Updated Medicine',
        quantity: 75,
        price: 175,
      };

      const result = await inventoryService.updateItem(created.id, updateData);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Medicine');
      expect(result.quantity).toBe(75);
      expect(result.price).toBe(175);

      console.log('✅ Inventory item updated:', result.id);
    }, TEST_TIMEOUTS.LONG);

    it('should fail when updating non-existent item', async () => {
      console.log('🧪 Testing update non-existent inventory item');

      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(
        inventoryService.updateItem(fakeId, { quantity: 100 })
      ).rejects.toThrow();

      console.log('✅ Error handling working correctly');
    }, TEST_TIMEOUTS.MEDIUM);
  });

  // ==================== DELETE /inventory/:id ====================
  describe('DELETE /inventory/:id - Delete Inventory Item', () => {
    it('should delete inventory item successfully', async () => {
      console.log('🧪 Testing delete inventory item');

      // Crear un item para eliminar
      const created = await inventoryService.createItem({
        name: 'Item to Delete',
        category: 'EQUIPMENT',
        quantity: 5,
        unit: 'units',
        minStock: 1,
        maxStock: 10,
        price: 500,
      });

      const result = await inventoryService.deleteItem(created.id);

      expect(result).toBeDefined();

      // Verificar que ya no existe
      await expect(
        inventoryService.getItemById(created.id)
      ).rejects.toThrow();

      console.log('✅ Inventory item deleted successfully');
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== POST /inventory/movements ====================
  describe('POST /inventory/movements - Create Movement', () => {
    it('should create inventory movement successfully', async () => {
      console.log('🧪 Testing inventory movement creation');

      // Primero crear un item
      const item = await inventoryService.createItem({
        name: 'Item for Movement',
        category: 'FEED',
        quantity: 100,
        unit: 'kg',
        minStock: 20,
        maxStock: 200,
        price: 50,
      });
      createdItemIds.push(item.id);

      // Crear movimiento
      const movementData = {
        itemId: item.id,
        type: 'IN',
        quantity: 50,
        reason: 'Test purchase',
        date: new Date().toISOString(),
      };

      const result = await inventoryService.createMovement(movementData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.itemId).toBe(item.id);
      expect(result.quantity).toBe(50);
      expect(result.type).toBe('IN');

      createdMovementIds.push(result.id);
      console.log('✅ Inventory movement created:', result.id);
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== GET /inventory/movements ====================
  describe('GET /inventory/movements - List Movements', () => {
    it('should list all inventory movements', async () => {
      console.log('🧪 Testing list all inventory movements');

      const result = await inventoryService.getMovements();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Inventory movements listed:', result.length);
    }, TEST_TIMEOUTS.LONG);

    it('should filter movements by type', async () => {
      console.log('🧪 Testing filter movements by type');

      const result = await inventoryService.getMovements({
        type: 'IN',
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✅ Filtered movements:', result.length);
    }, TEST_TIMEOUTS.LONG);
  });

  // ==================== EDGE CASES & VALIDATION ====================
  describe('Edge Cases & Validation', () => {
    it('should validate quantity range', async () => {
      console.log('🧪 Testing quantity validation');

      await expect(
        inventoryService.createItem({
          name: 'Invalid Item',
          category: 'FEED',
          quantity: -50, // Invalid: negative
          unit: 'kg',
        })
      ).rejects.toThrow();

      console.log('✅ Quantity validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);

    it('should validate min/max stock relationship', async () => {
      console.log('🧪 Testing stock validation');

      await expect(
        inventoryService.createItem({
          name: 'Invalid Stock Item',
          category: 'FEED',
          quantity: 100,
          unit: 'kg',
          minStock: 150, // Invalid: min > max
          maxStock: 100,
        })
      ).rejects.toThrow();

      console.log('✅ Stock validation working correctly');
    }, TEST_TIMEOUTS.MEDIUM);

    it('should handle missing required fields', async () => {
      console.log('🧪 Testing missing required fields');

      await expect(
        inventoryService.createItem({
          // Missing required fields
          description: 'Invalid test',
        })
      ).rejects.toThrow();

      console.log('✅ Required fields validation working');
    }, TEST_TIMEOUTS.MEDIUM);

    it('should validate movement type', async () => {
      console.log('🧪 Testing movement type validation');

      const item = await inventoryService.createItem({
        name: 'Movement Test Item',
        category: 'FEED',
        quantity: 100,
        unit: 'kg',
      });
      createdItemIds.push(item.id);

      await expect(
        inventoryService.createMovement({
          itemId: item.id,
          type: 'INVALID_TYPE', // Invalid type
          quantity: 10,
        })
      ).rejects.toThrow();

      console.log('✅ Movement type validation working');
    }, TEST_TIMEOUTS.MEDIUM);
  });
});
