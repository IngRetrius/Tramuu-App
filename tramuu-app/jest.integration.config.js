/**
 * Jest Integration Test Configuration
 * Configuración para tests de integración que consumen la API real
 */

module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.js'],
  testMatch: ['**/__tests__/*.integration.test.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  testTimeout: 120000, // 120 segundos (2 minutos) para tests que llaman API real en Render
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    'components/**/*.{js,jsx}',
    'services/**/*.{js,jsx}',
    'hooks/**/*.{js,jsx}',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
