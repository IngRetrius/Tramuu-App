/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get API URL from environment variables
// For React Native, we need to use a local IP or production URL
// Localhost won't work on physical devices or iOS simulators

// Use localhost for web, IP/tunnel for mobile
const getApiUrl = () => {
  // If explicitly set in environment, use that
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // For web development, use localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  }

  // For mobile, use local IP (default)
  return 'http://192.168.1.23:3000/api';
};

const API_URL = getApiUrl();

// Log API URL for debugging
if (__DEV__) {
  console.log('🌐 API Configuration:');
  console.log('   Platform:', Platform.OS);
  console.log('   API URL:', API_URL);
  console.log('   ENV URL:', process.env.EXPO_PUBLIC_API_URL || 'Not set');
}

export const API_CONFIG = {
  BASE_URL: API_URL,
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_COMPANY: '/auth/register/company',
    REGISTER_EMPLOYEE: '/auth/register/employee',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },

  // Dashboard endpoints
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    ALERTS: '/dashboard/alerts',
    PRODUCTION_TRENDS: '/dashboard/production-trends',
  },

  // Cows endpoints
  COWS: {
    LIST: '/cows',
    CREATE: '/cows',
    GET_BY_ID: (id) => `/cows/${id}`,
    UPDATE: (id) => `/cows/${id}`,
    DELETE: (id) => `/cows/${id}`,
    SEARCH: '/cows/search',
    STATISTICS: '/cows/statistics',
  },

  // Milkings endpoints
  MILKINGS: {
    LIST: '/milkings',
    CREATE: '/milkings',
    CREATE_RAPID: '/milkings/rapid',
    CREATE_INDIVIDUAL: '/milkings/individual',
    CREATE_MASSIVE: '/milkings/massive',
    GET_BY_ID: (id) => `/milkings/${id}`,
    UPDATE: (id) => `/milkings/${id}`,
    DELETE: (id) => `/milkings/${id}`,
    STATISTICS: '/milkings/statistics',
  },

  // Quality endpoints
  QUALITY: {
    LIST: '/quality/tests',
    CREATE: '/quality/tests',
    GET_BY_ID: (id) => `/quality/tests/${id}`,
    UPDATE: (id) => `/quality/tests/${id}`,
    DELETE: (id) => `/quality/tests/${id}`,
    STATISTICS: '/quality/stats',
  },

  // Inventory endpoints
  INVENTORY: {
    LIST: '/inventory',
    CREATE: '/inventory',
    GET_BY_ID: (id) => `/inventory/${id}`,
    UPDATE: (id) => `/inventory/${id}`,
    DELETE: (id) => `/inventory/${id}`,
    STATISTICS: '/inventory/stats',
    MOVEMENTS: '/inventory/movements',
    CREATE_MOVEMENT: '/inventory/movements',
  },

  // Deliveries endpoints
  DELIVERIES: {
    LIST: '/deliveries',
    CREATE: '/deliveries',
    GET_BY_ID: (id) => `/deliveries/${id}`,
    UPDATE: (id) => `/deliveries/${id}`,
    DELETE: (id) => `/deliveries/${id}`,
    UPDATE_STATUS: (id) => `/deliveries/${id}/status`,
    STATISTICS: '/deliveries/stats',
  },

  // Employees endpoints
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees',
    GET_BY_ID: (id) => `/employees/${id}`,
    UPDATE: (id) => `/employees/${id}`,
    DELETE: (id) => `/employees/${id}`,
  },

  // Companies endpoints
  COMPANIES: {
    GET_PROFILE: '/companies/profile',
    UPDATE_PROFILE: '/companies/profile',
    GENERATE_CODE: '/companies/invitation-code',
  },

  // Auth endpoints (additional)
  AUTH_EXTRA: {
    CHANGE_PASSWORD: '/auth/change-password',
  },
};

export default API_CONFIG;
