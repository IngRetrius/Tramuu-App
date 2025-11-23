/**
 * Test Configuration
 * Configuración centralizada para todos los tests de integración
 * 
 * IMPORTANTE: Estas son credenciales REALES del backend de pruebas
 */

export const TEST_CREDENTIALS = {
  // Usuario Empresa
  COMPANY: {
    email: 'test@gmail.com',
    password: '123456',
    userId: '2569f03b-3e14-44f2-9a16-381fd92d7188',
    companyId: 'a2ffe1a6-6f63-48b7-8502-1ec7b0c65b04',
    companyName: 'test',
    invitationCode: 'BA13C1A4', // ✅ Updated from backend response (changes when regenerated)
  },

  // Usuario Empleado
  EMPLOYEE: {
    email: 'testemployee@gmail.com',
    password: '123456',
    userId: '2063a6cb-2f9b-4181-b3eb-e0e0819b6367',
    employeeId: '4d25d4ac-28a5-4ef0-a9d8-cba65bc1de89',
    companyId: 'a2ffe1a6-6f63-48b7-8502-1ec7b0c65b04',
    employeeName: 'test',
  },
};

// Datos de ejemplo para tests de creación
export const TEST_DATA_TEMPLATES = {
  COW: {
    // Backend solo acepta: name, cowId, breed, status
    // Rechaza: birthDate, weight, code
    name: (suffix = Date.now()) => `Test Cow ${suffix}`,
    cowId: (suffix = Date.now()) => `COW${suffix}`,
    breed: 'Holstein',
    status: 'Lactando', // Estados válidos: Lactando, Seca, Novilla, etc.
  },

  MILKING: {
    shift: 'AM', // ✅ Cambiado de 'session' a 'shift'
    totalLiters: 15.5, // ✅ Cambiado de 'liters' a 'totalLiters'
    temperature: 4.0,
    notes: 'Test milking record', // ✅ Cambiado de 'observations' a 'notes'
  },

  QUALITY_TEST: {
    fat: 3.5,
    protein: 3.2,
    lactose: 4.8,
    solids: 12.5,
    temperature: 4.0,
    ph: 6.7,
    acidity: 16.0, // ✅ Agregado
    ufc: 100000, // ✅ Agregado
    observations: 'Test quality test',
    // ❌ REMOVIDO: testDate (se agrega dinámicamente en los tests)
    // ❌ REMOVIDO: date como función
  },

  INVENTORY_ITEM: {
    batchId: (suffix = Date.now()) => `BATCH${suffix}`, // ✅ Cambiado según documentación
    quantity: 100,
    category: 'FRESH_MILK', // ✅ Cambiado a valor válido
    status: 'COLD', // ✅ Agregado según documentación
    temperature: 4.0, // ✅ Agregado
    notes: 'Test inventory item',
  },

  DELIVERY: {
    clientName: 'Test Client', // ✅ Agregado según documentación
    liters: 200,
    destination: 'Test Dairy Plant',
    deliveryDate: new Date().toISOString().split('T')[0],
    status: 'PENDING', // ✅ Cambiado a mayúscula
    notes: 'Test delivery', // ✅ Cambiado de 'observations' a 'notes'
  },

  EMPLOYEE: {
    name: (suffix = Date.now()) => `Test Employee ${suffix}`,
    phone: '3001234567',
    email: (suffix = Date.now()) => `test.employee.${suffix}@tramuu.test`,
    password: 'TestPassword123!',
    role: 'WORKER',
  },
};

// Timeouts para diferentes tipos de operaciones
// ✅ Aumentados para servidor free tier (Render cold start)
export const TEST_TIMEOUTS = {
  SHORT: 60000,    // 1 minuto - operaciones rápidas
  MEDIUM: 120000,  // 2 minutos - operaciones normales
  LONG: 180000,    // 3 minutos - operaciones lentas o batch
};

// Pausas entre tests para evitar rate limiting
export const TEST_DELAYS = {
  BETWEEN_TESTS: 1000,      // 1 segundo entre tests
  AFTER_CREATE: 500,         // 500ms después de crear
  AFTER_DELETE: 500,         // 500ms después de eliminar
  BEFORE_BATCH: 2000,        // 2 segundos antes de operaciones batch
};

export default TEST_CREDENTIALS;
