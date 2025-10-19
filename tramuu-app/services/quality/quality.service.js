/**
 * Quality Service
 * Handles all milk quality testing API calls
 */

import { api } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

class QualityService {
  /**
   * Get list of quality tests
   * @param {Object} params - Query parameters (page, limit, startDate, endDate)
   * @returns {Promise<Object>} List of quality tests with pagination
   */
  async getQualityTests(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.QUALITY.LIST, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get quality test by ID
   * @param {string} id - Quality test ID
   * @returns {Promise<Object>} Quality test data
   */
  async getQualityTestById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.QUALITY.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create quality test
   * @param {Object} qualityData - Quality test data
   * @returns {Promise<Object>} Created quality test
   */
  async createQualityTest(qualityData) {
    try {
      const response = await api.post(API_ENDPOINTS.QUALITY.CREATE, qualityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update quality test
   * @param {string} id - Quality test ID
   * @param {Object} qualityData - Updated quality data
   * @returns {Promise<Object>} Updated quality test
   */
  async updateQualityTest(id, qualityData) {
    try {
      const response = await api.put(
        API_ENDPOINTS.QUALITY.UPDATE(id),
        qualityData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete quality test
   * @param {string} id - Quality test ID
   * @returns {Promise<void>}
   */
  async deleteQualityTest(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.QUALITY.DELETE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get quality statistics
   * @param {Object} params - Query parameters (period, startDate, endDate)
   * @returns {Promise<Object>} Quality statistics
   */
  async getStatistics(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.QUALITY.STATISTICS, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new QualityService();
