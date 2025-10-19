/**
 * Token Storage Service
 * Handles secure storage and retrieval of authentication tokens
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@tramuu_access_token';
const REFRESH_TOKEN_KEY = '@tramuu_refresh_token';
const USER_KEY = '@tramuu_user';

class TokenStorage {
  /**
   * Save access token
   */
  async saveToken(token) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }

  /**
   * Get access token
   */
  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Save refresh token
   */
  async saveRefreshToken(token) {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw error;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Save user data
   */
  async saveUser(user) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  /**
   * Get user data
   */
  async getUser() {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }
}

export default new TokenStorage();
