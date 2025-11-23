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

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Set up test timeout
jest.setTimeout(10000);
