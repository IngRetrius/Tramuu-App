# Guía de Integración Frontend-Backend - Tramuu App

Este documento describe la arquitectura de integración entre el frontend (React Native/Expo) y el backend (NestJS) de la aplicación Tramuu.

## 📋 Tabla de Contenidos

1. [Resumen de la Integración](#resumen-de-la-integración)
2. [Arquitectura de Servicios](#arquitectura-de-servicios)
3. [Configuración](#configuración)
4. [Autenticación](#autenticación)
5. [Pantallas Integradas](#pantallas-integradas)
6. [Flujo de Datos](#flujo-de-datos)
7. [Manejo de Errores](#manejo-de-errores)
8. [Próximos Pasos](#próximos-pasos)

---

## Resumen de la Integración

La integración implementa una arquitectura modular y profesional que conecta el frontend React Native con el backend NestJS mediante una capa de servicios centralizada.

### Tecnologías Utilizadas

**Frontend:**
- React Native 0.81.4
- Expo SDK ~54.0.13
- Axios 1.x (cliente HTTP)
- AsyncStorage (almacenamiento persistente)

**Backend:**
- NestJS
- PostgreSQL via Supabase
- JWT Authentication
- API REST en `http://localhost:3000/api`

---

## Arquitectura de Servicios

### Estructura de Carpetas

```
tramuu-app/
├── services/
│   ├── config/
│   │   └── api.config.js          # Configuración centralizada de endpoints
│   ├── storage/
│   │   └── tokenStorage.js        # Manejo de tokens y datos de usuario
│   ├── api/
│   │   └── apiClient.js           # Cliente HTTP con interceptores
│   ├── auth/
│   │   └── auth.service.js        # Servicio de autenticación
│   ├── dashboard/
│   │   └── dashboard.service.js   # Servicio de dashboard
│   ├── cows/
│   │   └── cows.service.js        # Servicio de gestión de vacas
│   ├── milkings/
│   │   └── milkings.service.js    # Servicio de registros de ordeño
│   ├── quality/
│   │   └── quality.service.js     # Servicio de calidad de leche
│   ├── inventory/                  # ✨ NUEVO
│   │   └── inventory.service.js   # Servicio de inventario
│   ├── deliveries/                # ✨ NUEVO
│   │   └── deliveries.service.js  # Servicio de entregas
│   ├── companies/                 # ✨ NUEVO
│   │   └── companies.service.js   # Servicio de empresas
│   ├── employees/                 # ✨ NUEVO
│   │   └── employees.service.js   # Servicio de empleados
│   └── index.js                   # Barrel export
└── .env                           # Variables de entorno
```

### Componentes Clave

#### 1. API Client (`services/api/apiClient.js`)

Cliente HTTP centralizado con interceptores automáticos:

**Características:**
- Auto-inyección de tokens JWT en cada request
- Manejo automático de refresh tokens
- Logging en modo desarrollo
- Manejo centralizado de errores de red
- Timeout configurable (30 segundos)

**Ejemplo de uso:**
```javascript
import { api } from '@/services';

const response = await api.get('/endpoint');
const data = await api.post('/endpoint', payload);
```

#### 2. Token Storage (`services/storage/tokenStorage.js`)

Gestión segura de tokens y datos de usuario:

**Métodos:**
- `saveToken(token)` - Guarda access token
- `getToken()` - Obtiene access token
- `saveRefreshToken(token)` - Guarda refresh token
- `saveUser(user)` - Guarda datos de usuario
- `getUser()` - Obtiene datos de usuario
- `clearAll()` - Limpia todos los datos
- `isAuthenticated()` - Verifica autenticación

#### 3. Servicios Modulares

Cada módulo del backend tiene su servicio correspondiente:

**AuthService** (`services/auth/auth.service.js`):
- `login(email, password)` - Inicio de sesión
- `registerCompany(data)` - Registro de empresa
- `registerEmployee(data)` - Registro de empleado
- `logout()` - Cierre de sesión
- `getCurrentUser()` - Obtener usuario actual
- `isAuthenticated()` - Verificar autenticación
- `changePassword(currentPassword, newPassword)` - Cambiar contraseña ✨ NUEVO

**DashboardService** (`services/dashboard/dashboard.service.js`):
- `getSummary()` - Obtener resumen del dashboard
- `getAlerts()` - Obtener alertas
- `getProductionTrends(params)` - Obtener tendencias de producción

**CowsService** (`services/cows/cows.service.js`):
- `getCows(params)` - Listar vacas con paginación
- `getCowById(id)` - Obtener vaca por ID
- `createCow(data)` - Crear nueva vaca
- `updateCow(id, data)` - Actualizar vaca
- `deleteCow(id)` - Eliminar vaca
- `searchCows(query)` - Buscar vacas
- `getStatistics()` - Obtener estadísticas

**MilkingsService** (`services/milkings/milkings.service.js`):
- `getMilkings(params)` - Listar registros de ordeño
- `createRapidMilking(data)` - Crear ordeño rápido
- `createIndividualMilking(data)` - Crear ordeño individual
- `createMassiveMilking(data)` - Crear ordeño masivo
- `getStatistics(params)` - Obtener estadísticas

**QualityService** (`services/quality/quality.service.js`):
- `getTests(params)` - Listar pruebas de calidad
- `createTest(data)` - Crear prueba de calidad
- `getStatistics()` - Obtener estadísticas de calidad

**InventoryService** (`services/inventory/inventory.service.js`) ✨ NUEVO:
- `getItems(params)` - Listar items de inventario
- `getItemById(id)` - Obtener item por ID
- `createItem(data)` - Crear item de inventario
- `updateItem(id, data)` - Actualizar item
- `deleteItem(id)` - Eliminar item
- `getStatistics()` - Obtener estadísticas de inventario
- `getMovements(itemId, params)` - Obtener movimientos de un item
- `createMovement(data)` - Crear movimiento (entrada/salida/ajuste)

**DeliveriesService** (`services/deliveries/deliveries.service.js`) ✨ NUEVO:
- `getDeliveries(params)` - Listar entregas (filtros: status, date)
- `getDeliveryById(id)` - Obtener entrega por ID
- `createDelivery(data)` - Crear nueva entrega
- `updateDelivery(id, data)` - Actualizar entrega
- `updateStatus(id, status)` - Actualizar estado de entrega
- `deleteDelivery(id)` - Eliminar entrega
- `getStatistics()` - Obtener estadísticas de entregas

**CompaniesService** (`services/companies/companies.service.js`) ✨ NUEVO:
- `getProfile()` - Obtener perfil de la empresa
- `updateProfile(data)` - Actualizar perfil
- `generateInvitationCode()` - Generar código de invitación para empleados

**EmployeesService** (`services/employees/employees.service.js`) ✨ NUEVO:
- `getEmployees()` - Listar empleados de la empresa
- `getEmployeeById(id)` - Obtener empleado por ID
- `createEmployee(data)` - Crear empleado
- `updateEmployee(id, data)` - Actualizar empleado
- `deleteEmployee(id)` - Eliminar empleado

---

## Configuración

### Variables de Entorno

Archivo `.env` en `tramuu-app/`:

```env
# API Configuration
API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
```

**Importante:** Para dispositivos físicos, reemplaza `localhost` con la IP de tu computadora:
```env
API_URL=http://192.168.1.XXX:3000/api
```

### Configuración de Endpoints

Los endpoints están centralizados en `services/config/api.config.js`:

```javascript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_COMPANY: '/auth/register/company',
    REGISTER_EMPLOYEE: '/auth/register/employee',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    ALERTS: '/dashboard/alerts',
  },
  COWS: {
    LIST: '/cows',
    CREATE: '/cows',
    GET_BY_ID: (id) => `/cows/${id}`,
  },
  // ... más endpoints
};
```

---

## Autenticación

### Flujo de Autenticación

1. **Login/Registro:**
   ```javascript
   // Usuario ingresa credenciales
   const response = await authService.login(email, password);

   // El servicio automáticamente:
   // - Guarda el access token
   // - Guarda el refresh token
   // - Guarda los datos del usuario

   // Navega a la app principal
   router.replace('/(tabs)');
   ```

2. **Requests Autenticados:**
   ```javascript
   // El apiClient automáticamente inyecta el token
   const data = await dashboardService.getSummary();
   // Header: Authorization: Bearer <token>
   ```

3. **Token Refresh:**
   ```javascript
   // Si el token expira (401), el apiClient automáticamente:
   // 1. Obtiene el refresh token
   // 2. Llama a /auth/refresh
   // 3. Guarda el nuevo access token
   // 4. Reintenta la petición original
   ```

4. **Logout:**
   ```javascript
   await authService.logout();
   // Limpia todos los datos y tokens
   router.replace('/login');
   ```

### Protección de Rutas

Para verificar autenticación al cargar la app:

```javascript
useEffect(() => {
  const checkAuth = async () => {
    const isAuth = await authService.isAuthenticated();
    if (!isAuth) {
      router.replace('/login');
    }
  };

  checkAuth();
}, []);
```

---

## Pantallas Integradas

### 1. Login (`app/login.jsx`)

**Funcionalidad:**
- Formulario de email y contraseña
- Validación de campos
- Loading state durante autenticación
- Manejo de errores con mensajes
- Navegación automática tras login exitoso

**Características:**
- Estados de loading/error
- Validación de campos
- Alertas de error
- Navegación condicional

### 2. Registro de Empresa (`app/register/company.jsx`)

**Funcionalidad:**
- Formulario completo de registro de empresa
- Validación de campos requeridos
- Manejo de errores del backend
- Auto-login tras registro exitoso

**Campos:**
- Nombre, NIT/ID, Dirección (opcional)
- Teléfono (opcional), Email, Contraseña

### 3. Registro de Empleado (`app/register/employee.jsx`)

**Funcionalidad:**
- Formulario de registro de empleado
- Código de invitación de empresa
- Validación de código
- Auto-login tras registro exitoso

**Campos:**
- Nombre, Teléfono (opcional)
- Email, Contraseña, Código de empresa

### 4. Dashboard de Empresa (`components/dashboard/CompanyDashboard.jsx`)

**Funcionalidad:**
- Carga automática de datos al montar
- Pull-to-refresh para actualizar datos
- Estados de loading/error con reintentos
- Métricas en tiempo real del backend

**Datos mostrados:**
- Producción de hoy
- Calidad promedio
- Entregas del día
- Lecheros activos

### 5. Gestión de Vacas (`app/(tabs)/management.jsx`)

**Funcionalidad:**
- Lista de vacas con datos del backend
- Búsqueda en tiempo real
- Pull-to-refresh
- Estados de loading/error/vacío

**Features:**
- Filtros por raza y estado
- Búsqueda con debounce
- Imágenes placeholder
- Navegación a detalles

### 6. Registro de Ordeño (`app/milkingRecord.jsx`)

**Funcionalidad:**
- 3 tipos de registro (rápido, individual, masivo)
- Selección de turno (AM/PM)
- Validación de datos
- Guardado en backend

**Tipos de ordeño:**
- **Rápido:** Solo litros totales
- **Individual:** Por vaca (en desarrollo)
- **Masivo:** Múltiples vacas (en desarrollo)

---

## Flujo de Datos

### Ejemplo: Cargar Dashboard

```javascript
// 1. Componente se monta
useEffect(() => {
  loadDashboardData();
}, []);

// 2. Servicio hace la llamada
const loadDashboardData = async () => {
  try {
    // 3. dashboardService llama al API
    const data = await dashboardService.getSummary();

    // 4. apiClient inyecta el token automáticamente
    // Request: GET /api/dashboard/summary
    // Header: Authorization: Bearer <token>

    // 5. Backend procesa y devuelve datos

    // 6. Componente mapea datos al formato UI
    setDashboardData({
      produccionHoy: {
        value: `${data.todayProduction}L`,
        change: data.productionChange,
        isPositive: data.productionChange.includes('+')
      },
      // ... más datos
    });

  } catch (error) {
    // 7. Error handling automático
    setError(error.message);
  }
};
```

### Ejemplo: Crear Ordeño

```javascript
const handleRegisterMilking = async () => {
  try {
    setLoading(true);

    // 1. Validar datos
    if (!totalLiters || parseFloat(totalLiters) <= 0) {
      Alert.alert('Error', 'Ingresa litros válidos');
      return;
    }

    // 2. Preparar payload
    const milkingData = {
      date: new Date().toISOString(),
      shift: selectedShift,
      totalLiters: parseFloat(totalLiters),
      notes: notes.trim() || undefined
    };

    // 3. Llamar servicio
    await milkingsService.createRapidMilking(milkingData);

    // 4. Mostrar éxito y navegar
    Alert.alert('Éxito', 'Ordeño registrado', [
      { text: 'OK', onPress: () => router.back() }
    ]);

  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## Manejo de Errores

### Niveles de Error

1. **Errores de Red:**
   - Detectados por apiClient
   - Mensaje: "Network error. Please check your connection."
   - Bandera: `error.isNetworkError = true`

2. **Errores del Backend:**
   - Status code + mensaje del servidor
   - Ejemplo: `{ status: 401, message: "Invalid credentials" }`

3. **Errores de Validación:**
   - Validación local antes de enviar
   - Alertas inmediatas al usuario

### Estrategias de Manejo

**En Componentes:**

```javascript
try {
  const data = await service.method();
  // Success
} catch (error) {
  console.error('Error:', error);

  if (error.isNetworkError) {
    Alert.alert('Sin conexión', 'Verifica tu conexión a internet');
  } else if (error.status === 401) {
    Alert.alert('Sesión expirada', 'Por favor inicia sesión nuevamente');
    router.replace('/login');
  } else {
    Alert.alert('Error', error.message || 'Algo salió mal');
  }
}
```

**Estados de Error en UI:**

```javascript
const [error, setError] = useState(null);

// Mostrar error
{error && (
  <View style={styles.errorContainer}>
    <AlertCircle color="#EF4444" />
    <Text>{error}</Text>
    <TouchableOpacity onPress={retry}>
      <Text>Reintentar</Text>
    </TouchableOpacity>
  </View>
)}
```

---

## Nuevos Módulos Backend

### Módulo de Inventario

**Ubicación:** `Backend/src/modules/inventory/`

**Descripción:** Gestión completa de inventario de leche con control de stock, movimientos y alertas automáticas.

**Endpoints:**
- `POST /api/inventory` - Crear item de inventario
- `GET /api/inventory` - Listar items (con paginación)
- `GET /api/inventory/statistics` - Estadísticas de inventario
- `GET /api/inventory/:id` - Obtener item por ID
- `PUT /api/inventory/:id` - Actualizar item
- `DELETE /api/inventory/:id` - Eliminar item
- `POST /api/inventory/movements` - Crear movimiento de inventario
- `GET /api/inventory/:id/movements` - Historial de movimientos

**Categorías de Inventario:**
- `FRESH_MILK` - Leche fresca recién ordeñada
- `PROCESSING` - Leche en proceso de transformación
- `STORED` - Leche almacenada lista para entrega

**Estados:**
- `COLD` - Refrigerada (4°C)
- `HOT` - Temperatura ambiente
- `PROCESS` - En procesamiento

**Tipos de Movimiento:**
- `IN` - Entrada (nueva producción)
- `OUT` - Salida (entrega, venta)
- `ADJUSTMENT` - Ajuste manual

**Características:**
- Alertas automáticas cuando stock < 1000L
- Cálculo automático de stock disponible
- Trazabilidad completa de movimientos
- Filtros por categoría y estado
- Integración con ordeños para entradas automáticas

### Módulo de Entregas

**Ubicación:** `Backend/src/modules/deliveries/`

**Descripción:** Sistema completo de gestión de entregas con tracking de estado y asignación de empleados.

**Endpoints:**
- `POST /api/deliveries` - Crear entrega
- `GET /api/deliveries` - Listar entregas (filtros: status, date)
- `GET /api/deliveries/statistics` - Estadísticas de entregas
- `GET /api/deliveries/:id` - Obtener entrega por ID
- `PUT /api/deliveries/:id` - Actualizar entrega
- `PATCH /api/deliveries/:id/status` - Actualizar solo estado
- `DELETE /api/deliveries/:id` - Eliminar entrega

**Estados de Entrega:**
- `PENDING` - Pendiente (recién creada)
- `IN_PROGRESS` - En camino (asignada a empleado)
- `COMPLETED` - Completada (entregada)
- `CANCELLED` - Cancelada

**Datos de Entrega:**
```typescript
{
  clientName: string;           // Nombre del cliente
  deliveryAddress: string;      // Dirección de entrega
  quantity: number;             // Litros a entregar
  scheduledDate: string;        // Fecha programada (ISO)
  assignedEmployeeId?: string;  // Empleado asignado (opcional)
  status: DeliveryStatus;       // Estado actual
  notes?: string;               // Notas adicionales
  completedAt?: Date;          // Timestamp de completado (auto)
}
```

**Características:**
- Asignación de empleados lecheros
- Tracking automático de timestamps
- Filtros por estado y fecha
- Validación de empleado asignado
- Estadísticas de entregas completadas/pendientes

### Módulo de Cambio de Contraseña

**Ubicación:** `Backend/src/modules/auth/` (extensión del módulo Auth)

**Descripción:** Funcionalidad segura para cambio de contraseña con validación de contraseña actual.

**Endpoint:**
- `PUT /api/auth/change-password` - Cambiar contraseña (requiere autenticación)

**Flujo de Cambio:**
1. Usuario autenticado envía contraseña actual y nueva
2. Backend verifica contraseña actual con bcrypt.compare
3. Si es correcta, hashea la nueva contraseña con bcrypt.hash
4. Actualiza en base de datos
5. Retorna confirmación (no invalida sesión actual)

**Validaciones:**
- Contraseña actual debe ser correcta
- Nueva contraseña mínimo 6 caracteres
- Ambos campos son requeridos
- Usuario debe estar autenticado (JWT)

**DTO:**
```typescript
class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
```

**Frontend:**
- Modal dedicado: `components/configuration/ChangePasswordModal.jsx`
- Validación local antes de enviar
- Muestra/oculta contraseñas con iconos Eye/EyeOff
- Confirmación de nueva contraseña (validación local)
- Integrado en pantalla de configuración

### Tablas de Base de Datos Requeridas

Para usar los nuevos módulos, crear las siguientes tablas en Supabase:

**Tabla `inventory`:**
```sql
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  batch_id VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL, -- FRESH_MILK, PROCESSING, STORED
  status VARCHAR(50) NOT NULL,   -- COLD, HOT, PROCESS
  location VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_company ON inventory(company_id);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_status ON inventory(status);
```

**Tabla `inventory_movements`:**
```sql
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_item_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,     -- IN, OUT, ADJUSTMENT
  quantity DECIMAL(10,2) NOT NULL,
  reason TEXT,
  created_by UUID,               -- employee_id or user_id
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_movements_item ON inventory_movements(inventory_item_id);
CREATE INDEX idx_movements_type ON inventory_movements(type);
```

**Tabla `deliveries`:**
```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  client_name VARCHAR(255) NOT NULL,
  delivery_address TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  scheduled_date DATE NOT NULL,
  assigned_employee_id UUID REFERENCES employees(id),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deliveries_company ON deliveries(company_id);
CREATE INDEX idx_deliveries_employee ON deliveries(assigned_employee_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_date ON deliveries(scheduled_date);
```

---

## Próximos Pasos

### Implementaciones Completadas Recientemente

1. **✅ Registro de Ordeño Individual/Masivo:**
   - ✅ Selección de vacas implementada (CowSelector integrado)
   - ✅ UI para múltiples registros completada
   - ✅ Validación de datos por vaca

2. **✅ Gestión de Calidad:**
   - ✅ Pantalla integrada con backend (quality.jsx)
   - ✅ Historial de pruebas con pull-to-refresh
   - ✅ Estadísticas y alertas inteligentes

3. **✅ Inventario (Backend + Servicio Frontend):**
   - ✅ Backend: CRUD completo en NestJS
   - ✅ Backend: Alertas de stock bajo (<1000L)
   - ✅ Backend: Historial de movimientos
   - ✅ Frontend: Servicio completo (inventory.service.js)
   - ⏳ Pendiente: Integrar UI con el servicio

4. **✅ Entregas (Backend + Servicio Frontend):**
   - ✅ Backend: CRUD completo en NestJS
   - ✅ Backend: Tracking de estado (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
   - ✅ Backend: Asignación de empleados
   - ✅ Frontend: Servicio completo (deliveries.service.js)
   - ⏳ Pendiente: Integrar UI con el servicio

5. **✅ Perfil y Configuración:**
   - ✅ Edición de perfil con backend
   - ✅ Cambio de contraseña (modal + backend)
   - ✅ Gestión de empleados
   - ✅ Generación de códigos de invitación

### Implementaciones Pendientes

6. **Notificaciones Push:**
   - Integrar Expo Notifications
   - Alertas de producción
   - Recordatorios de ordeño

7. **Modo Offline:**
   - Cache de datos con AsyncStorage
   - Queue de operaciones offline
   - Sincronización automática

### Mejoras de Calidad

1. **Testing:**
   - Unit tests para servicios
   - Integration tests para flujos
   - E2E tests con Detox

2. **Performance:**
   - Implementar memoization (React.memo, useMemo)
   - Virtualización de listas largas
   - Lazy loading de imágenes

3. **UX:**
   - Skeleton screens durante carga
   - Animaciones con Reanimated
   - Feedback háptico

4. **Seguridad:**
   - Implementar biometría (Face ID/Touch ID)
   - Encriptación de datos sensibles
   - Certificate pinning para APIs

---

## Soporte

Para dudas o problemas con la integración:

1. Revisar logs en consola (modo desarrollo)
2. Verificar configuración de `.env`
3. Comprobar que el backend esté corriendo
4. Revisar documentación de NestJS backend

---

**Última actualización:** Octubre 2025
**Versión:** 1.0.0
