/**
 * Cows Service
 * Handles all cow management API calls
 */

import { api } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

class CowsService {
  /**
   * Get list of cows
   * @param {Object} params - Query parameters (page, limit, search)
   * @returns {Promise<Object>} List of cows with pagination
   */
  async getCows(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.COWS.LIST, { params });
      // Backend wraps responses in { success, data, statusCode }
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get cow by ID
   * @param {string} id - Cow ID
   * @returns {Promise<Object>} Cow data
   */
  async getCowById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.COWS.GET_BY_ID(id));
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new cow
   * @param {Object} cowData - Cow data
   * @returns {Promise<Object>} Created cow
   */
  async createCow(cowData) {
    try {
      const response = await api.post(API_ENDPOINTS.COWS.CREATE, cowData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update cow
   * @param {string} id - Cow ID
   * @param {Object} cowData - Updated cow data
   * @returns {Promise<Object>} Updated cow
   */
  async updateCow(id, cowData) {
    try {
      const response = await api.put(API_ENDPOINTS.COWS.UPDATE(id), cowData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete cow
   * @param {string} id - Cow ID
   * @returns {Promise<void>}
   */
  async deleteCow(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.COWS.DELETE(id));
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search cows
   * @param {string} query - Search query
   * @returns {Promise<Array>} List of matching cows
   */
  async searchCows(query) {
    try {
      const response = await api.get(API_ENDPOINTS.COWS.SEARCH, {
        params: { q: query },
      });
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get cow statistics
   * @returns {Promise<Object>} Cow statistics
   */
  async getStatistics() {
    try {
      const response = await api.get(API_ENDPOINTS.COWS.STATISTICS);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CowsService();
