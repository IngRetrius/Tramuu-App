/**
 * Deliveries Service
 * Handles all delivery management API calls
 */

import { api } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

class DeliveriesService {
  /**
   * Get list of deliveries
   * @param {Object} params - Query parameters (status, date)
   * @returns {Promise<Array>} List of deliveries
   */
  async getDeliveries(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.DELIVERIES.LIST, { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getDeliveries:', error);
      throw error;
    }
  }

  /**
   * Get delivery by ID
   * @param {string} id - Delivery ID
   * @returns {Promise<Object>} Delivery data
   */
  async getDeliveryById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.DELIVERIES.GET_BY_ID(id));
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getDeliveryById:', error);
      throw error;
    }
  }

  /**
   * Create new delivery
   * @param {Object} deliveryData - Delivery data
   * @returns {Promise<Object>} Created delivery
   */
  async createDelivery(deliveryData) {
    try {
      const response = await api.post(API_ENDPOINTS.DELIVERIES.CREATE, deliveryData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in createDelivery:', error);
      throw error;
    }
  }

  /**
   * Update delivery
   * @param {string} id - Delivery ID
   * @param {Object} deliveryData - Updated delivery data
   * @returns {Promise<Object>} Updated delivery
   */
  async updateDelivery(id, deliveryData) {
    try {
      const response = await api.put(API_ENDPOINTS.DELIVERIES.UPDATE(id), deliveryData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in updateDelivery:', error);
      throw error;
    }
  }

  /**
   * Update delivery status
   * @param {string} id - Delivery ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated delivery
   */
  async updateStatus(id, status) {
    try {
      const response = await api.patch(API_ENDPOINTS.DELIVERIES.UPDATE_STATUS(id), { status });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in updateStatus:', error);
      throw error;
    }
  }

  /**
   * Delete delivery
   * @param {string} id - Delivery ID
   * @returns {Promise<void>}
   */
  async deleteDelivery(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.DELIVERIES.DELETE(id));
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in deleteDelivery:', error);
      throw error;
    }
  }

  /**
   * Get delivery statistics
   * @returns {Promise<Object>} Delivery statistics
   */
  async getStatistics() {
    try {
      const response = await api.get(API_ENDPOINTS.DELIVERIES.STATISTICS);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getStatistics:', error);
      throw error;
    }
  }
}

export default new DeliveriesService();
