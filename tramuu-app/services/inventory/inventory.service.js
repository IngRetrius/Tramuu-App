/**
 * Inventory Service
 * Handles all inventory management API calls
 */

import { api } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

class InventoryService {
  /**
   * Get list of inventory items
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} List of inventory items
   */
  async getItems(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.INVENTORY.LIST, { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getItems:', error);
      throw error;
    }
  }

  /**
   * Get inventory item by ID
   * @param {string} id - Item ID
   * @returns {Promise<Object>} Item data
   */
  async getItemById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.INVENTORY.GET_BY_ID(id));
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getItemById:', error);
      throw error;
    }
  }

  /**
   * Create new inventory item
   * @param {Object} itemData - Item data
   * @returns {Promise<Object>} Created item
   */
  async createItem(itemData) {
    try {
      const response = await api.post(API_ENDPOINTS.INVENTORY.CREATE, itemData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in createItem:', error);
      throw error;
    }
  }

  /**
   * Update inventory item
   * @param {string} id - Item ID
   * @param {Object} itemData - Updated item data
   * @returns {Promise<Object>} Updated item
   */
  async updateItem(id, itemData) {
    try {
      const response = await api.put(API_ENDPOINTS.INVENTORY.UPDATE(id), itemData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in updateItem:', error);
      throw error;
    }
  }

  /**
   * Delete inventory item
   * @param {string} id - Item ID
   * @returns {Promise<void>}
   */
  async deleteItem(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.INVENTORY.DELETE(id));
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in deleteItem:', error);
      throw error;
    }
  }

  /**
   * Get inventory statistics
   * @returns {Promise<Object>} Inventory statistics
   */
  async getStatistics() {
    try {
      const response = await api.get(API_ENDPOINTS.INVENTORY.STATISTICS);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getStatistics:', error);
      throw error;
    }
  }

  /**
   * Get inventory movements
   * @param {string} inventoryItemId - Optional item ID to filter movements
   * @returns {Promise<Array>} List of movements
   */
  async getMovements(inventoryItemId = null) {
    try {
      const params = inventoryItemId ? { inventoryItemId } : {};
      const response = await api.get(API_ENDPOINTS.INVENTORY.MOVEMENTS, { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getMovements:', error);
      throw error;
    }
  }

  /**
   * Create inventory movement
   * @param {Object} movementData - Movement data
   * @returns {Promise<Object>} Created movement
   */
  async createMovement(movementData) {
    try {
      const response = await api.post(API_ENDPOINTS.INVENTORY.CREATE_MOVEMENT, movementData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in createMovement:', error);
      throw error;
    }
  }
}

export default new InventoryService();
