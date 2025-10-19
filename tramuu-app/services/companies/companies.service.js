/**
 * Companies Service
 * Handles all company management API calls
 */

import { api } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

class CompaniesService {
  /**
   * Get company profile
   * @returns {Promise<Object>} Company profile data
   */
  async getProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.COMPANIES.GET_PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update company profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated company profile
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put(
        API_ENDPOINTS.COMPANIES.UPDATE_PROFILE,
        profileData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate invitation code for employees
   * @returns {Promise<Object>} Invitation code data
   */
  async generateInvitationCode() {
    try {
      const response = await api.post(API_ENDPOINTS.COMPANIES.GENERATE_CODE);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CompaniesService();
