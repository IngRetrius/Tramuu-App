/**
 * Employees Service
 * Handles all employee management API calls
 */

import { api } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

class EmployeesService {
  /**
   * Get employee profile (for logged-in employee)
   * @returns {Promise<Object>} Employee profile data
   */
  async getProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.EMPLOYEES.GET_PROFILE);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  }

  /**
   * Update employee profile (for logged-in employee)
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated employee profile
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put(
        API_ENDPOINTS.EMPLOYEES.UPDATE_PROFILE,
        profileData
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  /**
   * Get list of employees
   * @param {Object} params - Query parameters (page, limit)
   * @returns {Promise<Object>} List of employees with pagination
   */
  async getEmployees(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.EMPLOYEES.LIST, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get employee by ID
   * @param {string} id - Employee ID
   * @returns {Promise<Object>} Employee data
   */
  async getEmployeeById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.EMPLOYEES.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new employee
   * @param {Object} employeeData - Employee data
   * @returns {Promise<Object>} Created employee
   */
  async createEmployee(employeeData) {
    try {
      const response = await api.post(
        API_ENDPOINTS.EMPLOYEES.CREATE,
        employeeData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update employee
   * @param {string} id - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @returns {Promise<Object>} Updated employee
   */
  async updateEmployee(id, employeeData) {
    try {
      const response = await api.put(
        API_ENDPOINTS.EMPLOYEES.UPDATE(id),
        employeeData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete employee
   * @param {string} id - Employee ID
   * @returns {Promise<void>}
   */
  async deleteEmployee(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.EMPLOYEES.DELETE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new EmployeesService();
