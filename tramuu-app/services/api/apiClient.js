/**
 * API Client
 * Centralized HTTP client with request/response interceptors
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import tokenStorage from '../storage/tokenStorage';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getToken();

    console.log('🔑 Token retrieved:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set');
    } else {
      console.warn('⚠️ No token available for request');
    }

    // Log request in development
    if (__DEV__) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error in development
    if (__DEV__) {
      console.error('[API Response Error]', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();

        if (refreshToken) {
          // Attempt to refresh token
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken } = response.data;

          // Save new token
          await tokenStorage.saveToken(accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        await tokenStorage.clearAll();
        // Note: Navigation should be handled in the component
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
      });
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

/**
 * API Helper Methods
 */
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};

export default apiClient;
