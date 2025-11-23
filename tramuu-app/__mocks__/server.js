/**
 * MSW Server Setup
 * Configura el servidor mock para tests
 */

import { setupServer } from 'msw/node';
import handlers from './handlers';

export const server = setupServer(...handlers);

// Configuración global del servidor
export const setupMockServer = () => {
  // Enable API mocking before tests
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

  // Reset any request handlers that are declared in individual tests
  afterEach(() => server.resetHandlers());

  // Clean up after the tests are finished
  afterAll(() => server.close());
};
