/**
 * Jest Integration Test Setup
 * Setup para tests de integración (SIN MSW - API real)
 */

import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useFocusEffect: jest.fn(),
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: jest.fn(),
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  AlertTriangle: 'AlertTriangle',
  Bell: 'Bell',
  Blocks: 'Blocks',
  ChartLine: 'ChartLine',
  CirclePlus: 'CirclePlus',
  ClipboardPlus: 'ClipboardPlus',
  Clock: 'Clock',
  Droplet: 'Droplet',
  Star: 'Star',
  Syringe: 'Syringe',
  TrendingDown: 'TrendingDown',
  TrendingUp: 'TrendingUp',
  TriangleAlert: 'TriangleAlert',
  Truck: 'Truck',
  User: 'User',
  Users: 'Users',
}));

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
  LineChart: 'LineChart',
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Path: 'Path',
}));

// NO mockear MSW - queremos llamar a la API real

// Configurar variables de entorno para tests
// Usar la URL del .env o fallback a Render
if (!process.env.EXPO_PUBLIC_API_URL) {
  process.env.EXPO_PUBLIC_API_URL = 'https://tramuu-backend.onrender.com/api';
}

// Log configuración
console.log('🧪 Integration Test Setup:');
console.log('   API URL:', process.env.EXPO_PUBLIC_API_URL);
console.log('   Timeout:', 120000, '(2 minutes)');

// Suppress console warnings in tests (opcional)
const originalWarn = console.warn;
const originalError = console.error;

global.console = {
  ...console,
  warn: jest.fn((...args) => {
    // Solo mostrar warnings importantes
    if (!args[0]?.includes('⚠️ WARNING: No EXPO_PUBLIC_API_URL')) {
      originalWarn(...args);
    }
  }),
  error: jest.fn((...args) => {
    // Mostrar todos los errores
    originalError(...args);
  }),
};

// Set up test timeout - 120 segundos para APIs lentas (Render free tier)
jest.setTimeout(120000);
