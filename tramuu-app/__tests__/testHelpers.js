/**
 * Test Helpers
 * Utilidades comunes para todos los tests de integración
 */

/**
 * Extrae data de la respuesta del backend
 * Backend siempre devuelve: { success, data, statusCode }
 * 
 * @param {Object} response - Respuesta del backend
 * @returns {any} Los datos extraídos
 */
export const extractData = (response) => {
  if (!response) return null;
  
  // Si ya es el data directo (array o no tiene propiedad data), retornarlo
  if (Array.isArray(response) || !response.data) {
    return response;
  }
  
  // Si tiene la estructura { success, data, statusCode }
  if (response.success !== undefined && response.data !== undefined) {
    return response.data;
  }
  
  // Extraer data de la estructura estándar
  return response.data;
};

/**
 * Valida que sea una respuesta exitosa del backend
 * 
 * @param {Object} response - Respuesta del backend
 * @returns {boolean} True si es exitosa
 */
export const isSuccessResponse = (response) => {
  return response && 
         response.success === true && 
         response.statusCode >= 200 && 
         response.statusCode < 300;
};

/**
 * Maneja errores esperados en tests
 * Útil para reemplazar .rejects.toThrow()
 * 
 * @param {Promise} promise - Promesa que debería fallar
 * @param {number|null} expectedStatus - Status code esperado (opcional)
 * @returns {Promise<Error>} El error capturado
 * 
 * @example
 * await expectError(
 *   authService.login('invalid@email.com', 'wrong'),
 *   401
 * );
 */
export const expectError = async (promise, expectedStatus = null) => {
  try {
    await promise;
    throw new Error('Expected error but none was thrown');
  } catch (error) {
    // Si el error es nuestro mensaje, significa que no se lanzó error
    if (error.message === 'Expected error but none was thrown') {
      throw error;
    }
    
    expect(error).toBeDefined();
    
    if (expectedStatus) {
      expect(error.status || error.statusCode).toBe(expectedStatus);
    } else {
      const status = error.status || error.statusCode || 0;
      expect(status).toBeGreaterThanOrEqual(400);
    }
    
    return error;
  }
};

/**
 * Delay entre tests para evitar rate limiting
 * 
 * @param {number} ms - Milisegundos de espera
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Genera un email único para tests
 * 
 * @param {string} prefix - Prefijo del email
 * @returns {string} Email único
 */
export const generateTestEmail = (prefix = 'test') => {
  const timestamp = Date.now();
  return `${prefix}.${timestamp}@tramuu.test`;
};

/**
 * Genera un ID único para tests
 * 
 * @param {string} prefix - Prefijo del ID
 * @returns {string} ID único
 */
export const generateTestId = (prefix = 'TEST') => {
  const timestamp = Date.now();
  return `${prefix}_${timestamp}`;
};

/**
 * Limpia un array de IDs creados durante los tests
 * 
 * @param {Function} deleteFunction - Función de eliminación
 * @param {Array<string>} ids - Array de IDs a eliminar
 * @returns {Promise<void>}
 */
export const cleanupCreatedItems = async (deleteFunction, ids) => {
  for (const id of ids) {
    try {
      await deleteFunction(id);
      await delay(500); // Delay entre deletes
    } catch (error) {
      console.warn(`Failed to delete item ${id}:`, error.message);
    }
  }
};

/**
 * Valida que un objeto tenga las propiedades esperadas
 * 
 * @param {Object} obj - Objeto a validar
 * @param {Array<string>} requiredProps - Propiedades requeridas
 */
export const expectToHaveProperties = (obj, requiredProps) => {
  requiredProps.forEach(prop => {
    expect(obj).toHaveProperty(prop);
  });
};

/**
 * Valida estructura de respuesta estándar del backend
 * 
 * @param {Object} response - Respuesta del backend
 */
export const expectStandardResponse = (response) => {
  expect(response).toHaveProperty('success');
  expect(response).toHaveProperty('data');
  expect(response).toHaveProperty('statusCode');
  expect(response.success).toBe(true);
  expect(response.statusCode).toBeGreaterThanOrEqual(200);
  expect(response.statusCode).toBeLessThan(300);
};
