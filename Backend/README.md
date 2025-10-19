# Tramuu Backend API

Backend de la aplicación Tramuu - Sistema de gestión para lecherías construido con NestJS.

## Descripción

API RESTful desarrollada con NestJS que proporciona servicios de backend para la aplicación móvil Tramuu. El sistema permite gestionar la producción de leche, inventario, entregas, empleados y calidad de productos lácteos.

## Tecnologías

* Framework: NestJS 10.x
* Lenguaje: TypeScript 5.x
* Base de Datos: PostgreSQL (Supabase)
* Autenticación: JWT (JSON Web Tokens)
* Validación: class-validator, class-transformer
* Documentación: Swagger/OpenAPI
* Testing: Jest
* Seguridad: bcrypt para hashing de contraseñas

## Requisitos Previos

* Node.js >= 18.x
* npm >= 9.x
* PostgreSQL o cuenta de Supabase
* Git

## Instalación

1. Clonar el repositorio e ir al directorio del backend:

```bash
cd Backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Copiar el archivo de ejemplo y configurar las variables:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Database Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-supabase-anon-key
SUPABASE_SERVICE_KEY=tu-supabase-service-key

# JWT Configuration
JWT_SECRET=tu-jwt-secret-super-seguro-cambiar-en-produccion
JWT_REFRESH_SECRET=tu-refresh-secret-super-seguro

# Server Configuration
PORT=3000
NODE_ENV=development
```

4. Crear las tablas en la base de datos:

Ejecutar los scripts SQL en Supabase SQL Editor (ver sección “Estructura de Base de Datos”).

## Ejecución

### Modo Desarrollo

```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`

### Modo Producción

```bash
npm run build
npm run start:prod
```

### Modo Debug

```bash
npm run start:debug
```

## Documentación API

Una vez que el servidor esté corriendo, accede a la documentación Swagger en:

```
http://localhost:3000/api/docs
```

## Estructura del Proyecto

```
Backend/
├── src/
│   ├── common/               # Código compartido
│   │   ├── decorators/       # Decoradores personalizados
│   │   ├── guards/           # Guards de autenticación/autorización
│   │   └── interceptors/     # Interceptores de respuesta
│   ├── config/               # Configuración de la aplicación
│   ├── modules/              # Módulos de funcionalidad
│   │   ├── auth/             # Autenticación y registro
│   │   ├── companies/        # Gestión de empresas
│   │   ├── employees/        # Gestión de empleados
│   │   ├── cows/             # Gestión de ganado
│   │   ├── milkings/         # Registros de ordeño
│   │   ├── quality/          # Control de calidad
│   │   ├── inventory/        # Gestión de inventario
│   │   ├── deliveries/       # Gestión de entregas
│   │   └── dashboard/        # Dashboard y estadísticas
│   ├── app.module.ts         # Módulo raíz
│   └── main.ts               # Punto de entrada
├── test/                     # Tests e2e
├── .env.example              # Ejemplo de variables de entorno
├── nest-cli.json             # Configuración de NestJS CLI
├── package.json              # Dependencias y scripts
└── tsconfig.json             # Configuración de TypeScript
```

## Autenticación

La API utiliza JWT para autenticación. Para acceder a endpoints protegidos:

1. Registrarse o iniciar sesión:

```bash
POST /api/auth/register/company
POST /api/auth/login
```

2. Usar el token en las peticiones:

```bash
Authorization: Bearer <tu-access-token>
```

## Endpoints Principales

### Autenticación

* `POST /api/auth/register/company` - Registrar empresa
* `POST /api/auth/register/employee` - Registrar empleado
* `POST /api/auth/login` - Iniciar sesión
* `POST /api/auth/refresh` - Refrescar token
* `PUT /api/auth/change-password` - Cambiar contraseña

### Dashboard

* `GET /api/dashboard/summary` - Resumen del dashboard
* `GET /api/dashboard/alerts` - Alertas y notificaciones
* `GET /api/dashboard/production-trends` - Tendencias de producción

### Vacas

* `GET /api/cows` - Listar vacas
* `POST /api/cows` - Crear vaca
* `GET /api/cows/:id` - Obtener vaca por ID
* `PUT /api/cows/:id` - Actualizar vaca
* `DELETE /api/cows/:id` - Eliminar vaca
* `GET /api/cows/search` - Buscar vacas
* `GET /api/cows/statistics` - Estadísticas de ganado

### Ordeños

* `GET /api/milkings` - Listar ordeños
* `POST /api/milkings/rapid` - Crear ordeño rápido
* `POST /api/milkings/individual` - Crear ordeño individual
* `POST /api/milkings/massive` - Crear ordeño masivo
* `GET /api/milkings/statistics` - Estadísticas de producción

### Calidad

* `GET /api/quality/tests` - Listar pruebas de calidad
* `POST /api/quality/tests` - Crear prueba de calidad
* `GET /api/quality/stats` - Estadísticas de calidad

### Inventario

* `GET /api/inventory` - Listar items de inventario
* `POST /api/inventory` - Crear item
* `GET /api/inventory/statistics` - Estadísticas de inventario
* `GET /api/inventory/:id` - Obtener item por ID
* `PUT /api/inventory/:id` - Actualizar item
* `DELETE /api/inventory/:id` - Eliminar item
* `POST /api/inventory/movements` - Crear movimiento
* `GET /api/inventory/:id/movements` - Historial de movimientos

### Entregas

* `GET /api/deliveries` - Listar entregas
* `POST /api/deliveries` - Crear entrega
* `GET /api/deliveries/statistics` - Estadísticas de entregas
* `GET /api/deliveries/:id` - Obtener entrega por ID
* `PUT /api/deliveries/:id` - Actualizar entrega
* `PATCH /api/deliveries/:id/status` - Actualizar estado
* `DELETE /api/deliveries/:id` - Eliminar entrega

### Empresas

* `GET /api/companies/profile` - Obtener perfil de empresa
* `PUT /api/companies/profile` - Actualizar perfil
* `POST /api/companies/generate-code` - Generar código de invitación

### Empleados

* `GET /api/employees` - Listar empleados
* `GET /api/employees/:id` - Obtener empleado por ID
* `POST /api/employees` - Crear empleado
* `PUT /api/employees/:id` - Actualizar empleado
* `DELETE /api/employees/:id` - Eliminar empleado

## Estructura de Base de Datos

Ejecutar los siguientes scripts SQL en Supabase:

<details>
<summary>Ver scripts SQL</summary>

```sql
-- Tabla de inventario
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  batch_id VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_company ON inventory(company_id);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_status ON inventory(status);

-- Tabla de movimientos de inventario
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_item_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  reason TEXT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_movements_item ON inventory_movements(inventory_item_id);
CREATE INDEX idx_movements_type ON inventory_movements(type);

-- Tabla de entregas
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  client_name VARCHAR(255) NOT NULL,
  delivery_address TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  scheduled_date DATE NOT NULL,
  assigned_employee_id UUID REFERENCES employees(id),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
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

</details>

## Testing

```bash
npm run test           # Tests unitarios
npm run test:cov       # Tests con cobertura
npm run test:e2e       # Tests end-to-end
npm run test:watch     # Tests en modo watch
```

## Scripts Disponibles

```bash
npm run start
npm run start:dev
npm run start:debug
npm run start:prod
npm run build
npm run lint
npm run format
npm run test
npm run test:cov
npm run test:e2e
```

## Seguridad

* Contraseñas hasheadas con bcrypt (10 salt rounds)
* Autenticación JWT con tokens de acceso y refresh
* Validación de datos con class-validator
* Guards de autenticación en endpoints protegidos
* CORS configurado
* Variables de entorno para secretos

## CORS

Por defecto, CORS está habilitado para todas las origins en desarrollo.
En producción, configurar origins específicas en `main.ts`.

## Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

## Equipo de Desarrollo

Desarrollado para Tramuu - Sistema de Gestión Lechera

## Soporte

Para soporte técnico, contactar al equipo de desarrollo.

