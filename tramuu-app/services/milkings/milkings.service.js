/**
 * Milkings Service
 * Handles all milking records API calls
 */

import { api } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

class MilkingsService {
  /**
   * Get list of milking records
   * @param {Object} params - Query parameters (page, limit, startDate, endDate)
   * @returns {Promise<Object>} List of milking records with pagination
   */
  async getMilkings(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.MILKINGS.LIST, { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get milking record by ID
   * @param {string} id - Milking ID
   * @returns {Promise<Object>} Milking record data
   */
  async getMilkingById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.MILKINGS.GET_BY_ID(id));
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create rapid milking record (total production only)
   * @param {Object} milkingData - { date, totalLiters, shift }
   * @returns {Promise<Object>} Created milking record
   */
  async createRapidMilking(milkingData) {
    try {
      const response = await api.post(
        API_ENDPOINTS.MILKINGS.CREATE_RAPID,
        milkingData
      );
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create individual milking record (one cow)
   * @param {Object} milkingData - { cowId, liters, date, shift }
   * @returns {Promise<Object>} Created milking record
   */
  async createIndividualMilking(milkingData) {
    try {
      const response = await api.post(
        API_ENDPOINTS.MILKINGS.CREATE_INDIVIDUAL,
        milkingData
      );
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create massive milking record (multiple cows at once)
   * @param {Object} milkingData - { date, shift, cows: [{ cowId, liters }] }
   * @returns {Promise<Object>} Created milking records
   */
  async createMassiveMilking(milkingData) {
    try {
      const response = await api.post(
        API_ENDPOINTS.MILKINGS.CREATE_MASSIVE,
        milkingData
      );
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update milking record
   * @param {string} id - Milking ID
   * @param {Object} milkingData - Updated milking data
   * @returns {Promise<Object>} Updated milking record
   */
  async updateMilking(id, milkingData) {
    try {
      const response = await api.put(
        API_ENDPOINTS.MILKINGS.UPDATE(id),
        milkingData
      );
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete milking record
   * @param {string} id - Milking ID
   * @returns {Promise<void>}
   */
  async deleteMilking(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.MILKINGS.DELETE(id));
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get milking statistics
   * @param {Object} params - Query parameters (period, startDate, endDate)
   * @returns {Promise<Object>} Milking statistics
   */
  async getStatistics(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.MILKINGS.STATISTICS, {
        params,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new MilkingsService();
