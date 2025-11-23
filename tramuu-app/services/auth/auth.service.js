/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { api } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import tokenStorage from '../storage/tokenStorage';

class AuthService {
  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} User data and tokens
   */
  async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      // Backend wraps responses in { success, data, statusCode }
      const responseData = response.data.data || response.data;

      console.log('📥 Login response received:', {
        hasAccessToken: !!responseData.accessToken,
        hasUser: !!responseData.user,
      });

      const { accessToken, refreshToken, user, company, employee } = responseData;

      if (!accessToken) {
        console.error('❌ No accessToken in login response!', response.data);
        throw new Error('No access token received from server');
      }

      // Enrich user object with name from company or employee data
      const enrichedUser = {
        ...user,
        name: company?.name || employee?.name || user.email,
        phone: company?.phone || employee?.phone || null,
        companyId: responseData.companyId,
        employeeId: responseData.employeeId,
        // Store full company/employee data for reference
        companyData: company || null,
        employeeData: employee || null,
      };

      console.log('👤 Enriched user data:', {
        name: enrichedUser.name,
        userType: enrichedUser.userType,
        email: enrichedUser.email,
      });

      // Store tokens and enriched user data
      console.log('💾 Saving token to storage...');
      await tokenStorage.saveToken(accessToken);
      console.log('✅ Token saved successfully');

      if (refreshToken) {
        await tokenStorage.saveRefreshToken(refreshToken);
      }
      await tokenStorage.saveUser(enrichedUser);

      return responseData;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  /**
   * Register company
   * @param {Object} companyData
   * @returns {Promise<Object>} User data and tokens
   */
  async registerCompany(companyData) {
    try {
      const response = await api.post(
        API_ENDPOINTS.AUTH.REGISTER_COMPANY,
        companyData
      );

      // Backend wraps responses in { success, data, statusCode }
      const responseData = response.data.data || response.data;

      console.log('📥 Register response received:', {
        hasAccessToken: !!responseData.accessToken,
        hasUser: !!responseData.user,
      });

      const { accessToken, refreshToken, user, company, employee } = responseData;

      if (!accessToken) {
        console.error('❌ No accessToken in register response!', response.data);
        throw new Error('No access token received from server');
      }

      // Enrich user object with name from company or employee data
      const enrichedUser = {
        ...user,
        name: company?.name || employee?.name || user.email,
        phone: company?.phone || employee?.phone || null,
        companyId: responseData.companyId,
        employeeId: responseData.employeeId,
        companyData: company || null,
        employeeData: employee || null,
      };

      console.log('👤 Enriched user data (register):', {
        name: enrichedUser.name,
        userType: enrichedUser.userType,
        email: enrichedUser.email,
      });

      // Store tokens and enriched user data
      console.log('💾 Saving token to storage...');
      await tokenStorage.saveToken(accessToken);
      console.log('✅ Token saved successfully');

      if (refreshToken) {
        await tokenStorage.saveRefreshToken(refreshToken);
      }
      await tokenStorage.saveUser(enrichedUser);

      return responseData;
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error;
    }
  }

  /**
   * Register employee
   * @param {Object} employeeData
   * @returns {Promise<Object>} User data and tokens
   */
  async registerEmployee(employeeData) {
    try {
      const response = await api.post(
        API_ENDPOINTS.AUTH.REGISTER_EMPLOYEE,
        employeeData
      );

      // Backend wraps responses in { success, data, statusCode }
      const responseData = response.data.data || response.data;

      const { accessToken, refreshToken, user, company, employee } = responseData;

      // Enrich user object with name from company or employee data
      const enrichedUser = {
        ...user,
        name: company?.name || employee?.name || user.email,
        phone: company?.phone || employee?.phone || null,
        companyId: responseData.companyId,
        employeeId: responseData.employeeId,
        companyData: company || null,
        employeeData: employee || null,
      };

      // Store tokens and enriched user data
      await tokenStorage.saveToken(accessToken);
      if (refreshToken) {
        await tokenStorage.saveRefreshToken(refreshToken);
      }
      await tokenStorage.saveUser(enrichedUser);

      return responseData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout endpoint if exists
      // await api.post(API_ENDPOINTS.AUTH.LOGOUT);

      // Clear all stored data
      await tokenStorage.clearAll();
    } catch (error) {
      // Always clear local data even if API call fails
      await tokenStorage.clearAll();
      throw error;
    }
  }

  /**
   * Get current user
   * @returns {Promise<Object|null>} Current user or null
   */
  async getCurrentUser() {
    try {
      return await tokenStorage.getUser();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    return await tokenStorage.isAuthenticated();
  }

  /**
   * Refresh access token
   * @returns {Promise<string>} New access token
   */
  async refreshToken() {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });

      const { accessToken } = response.data;
      await tokenStorage.saveToken(accessToken);

      return accessToken;
    } catch (error) {
      // If refresh fails, clear tokens
      await tokenStorage.clearAll();
      throw error;
    }
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put(API_ENDPOINTS.AUTH_EXTRA.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
