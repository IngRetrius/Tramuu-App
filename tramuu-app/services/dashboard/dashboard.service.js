/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

import { api } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

class DashboardService {
  /**
   * Get dashboard summary
   * @returns {Promise<Object>} Dashboard summary data
   */
  async getSummary() {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get dashboard alerts
   * @returns {Promise<Array>} List of alerts
   */
  async getAlerts() {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.ALERTS);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get production trends
   * @param {Object} params - Query parameters (period, startDate, endDate)
   * @returns {Promise<Object>} Production trends data
   */
  async getProductionTrends(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.PRODUCTION_TRENDS, {
        params,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get production data by period
   * @param {string} period - 'day', 'week', or 'month'
   * @returns {Promise<Object>} Production data for the specified period
   */
  async getProductionByPeriod(period = 'week') {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.PRODUCTION, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching production by period:', error);
      throw error;
    }
  }
}

export default new DashboardService();
