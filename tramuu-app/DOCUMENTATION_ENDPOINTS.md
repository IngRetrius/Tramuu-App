# Documentación API - TRAMUU (Sistema de Gestión de Lecherías)

## Índice
- [Autenticación](#autenticación)
- [Empresas](#empresas)
- [Empleados](#empleados)
- [Vacas](#vacas)
- [Ordeños](#ordeños)
- [Calidad](#calidad)
- [Inventario](#inventario)
- [Entregas](#entregas)
- [Dashboard](#dashboard)

---

## Autenticación

### POST /api/auth/register/company
Registrar una nueva empresa.

**Request Body:**
```json
{
  "name": "Lácteos S.A",
  "nitId": "800197268-4",
  "address": "Cra 2 Bis Cl 22",
  "phone": "3145442377",
  "email": "admin@lacteos.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@lacteos.com",
      "userType": "company"
    },
    "company": {
      "id": "uuid",
      "name": "Lácteos S.A",
      "nitId": "800197268-4",
      "phone": "3145442377",
      "address": "Cra 2 Bis Cl 22",
      "invitationCode": "ABCD1234"
    },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token"
  },
  "statusCode": 201
}
```

---

### POST /api/auth/register/employee
Registrar un nuevo empleado.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "invitationCode": "ABCD1234",
  "phone": "3201234567",
  "email": "juan@email.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "juan@email.com",
      "userType": "employee"
    },
    "employee": {
      "id": "uuid",
      "name": "Juan Pérez",
      "phone": "3201234567",
      "companyId": "uuid"
    },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token"
  },
  "statusCode": 201
}
```

---

### POST /api/auth/login
Iniciar sesión.

**Request Body:**
```json
{
  "email": "admin@lacteos.com",
  "password": "Password123!"
}
```

**Response (Company):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@lacteos.com",
      "userType": "company"
    },
    "companyId": "uuid",
    "company": {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Lácteos S.A",
      "nit_id": "800197268-4",
      "phone": "3145442377",
      "address": "Cra 2 Bis Cl 22",
      "invitation_code": "ABCD1234",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token"
  },
  "statusCode": 200
}
```

**Response (Employee):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "juan@email.com",
      "userType": "employee"
    },
    "companyId": "uuid",
    "employeeId": "uuid",
    "employee": {
      "id": "uuid",
      "user_id": "uuid",
      "company_id": "uuid",
      "name": "Juan Pérez",
      "phone": "3201234567",
      "is_active": true,
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token"
  },
  "statusCode": 200
}
```

---

### POST /api/auth/refresh
Refrescar access token.

**Request Body:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token",
    "user": {
      "id": "uuid",
      "email": "admin@lacteos.com",
      "userType": "company"
    }
  },
  "statusCode": 200
}
```

---

### GET /api/auth/verify-code/:code
Verificar código de invitación.

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "company": {
      "id": "uuid",
      "name": "Lácteos S.A"
    }
  },
  "statusCode": 200
}
```

---

### PUT /api/auth/change-password
Cambiar contraseña (requiere autenticación).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Contraseña actualizada exitosamente"
  },
  "statusCode": 200
}
```

---

## Empresas

### GET /api/companies/me
Obtener información de mi empresa (solo para empresas).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Lácteos S.A",
    "nit": "800197268-4",
    "nitId": "800197268-4",
    "phone": "3145442377",
    "address": "Cra 2 Bis Cl 22",
    "invitationCode": "ABCD1234",
    "email": "admin@lacteos.com",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  },
  "statusCode": 200
}
```

---

### PUT /api/companies/me
Actualizar información de mi empresa (solo para empresas).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "name": "Lácteos S.A Actualizado",
  "nit": "800197268-4",
  "address": "Nueva Dirección 123",
  "phone": "3209876543"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Lácteos S.A Actualizado",
    "nit": "800197268-4",
    "nitId": "800197268-4",
    "phone": "3209876543",
    "address": "Nueva Dirección 123",
    "invitationCode": "ABCD1234",
    "email": "admin@lacteos.com",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  },
  "statusCode": 200
}
```

---

### POST /api/companies/generate-code
Generar nuevo código de invitación (solo para empresas).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invitationCode": "XYZ98765"
  },
  "statusCode": 200
}
```

---

## Empleados

### GET /api/employees/me
Obtener perfil del empleado actual (solo para empleados).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Juan Pérez",
    "documentId": "123456789",
    "phone": "3201234567",
    "email": "juan@email.com",
    "isActive": true,
    "companyId": "uuid",
    "companyName": "Lácteos S.A",
    "companyInvitationCode": "ABCD1234",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  },
  "statusCode": 200
}
```

---

### PUT /api/employees/me
Actualizar perfil del empleado actual (solo para empleados).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "name": "Juan Pérez Actualizado",
  "documentId": "987654321",
  "phone": "3209876543"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Juan Pérez Actualizado",
    "documentId": "987654321",
    "phone": "3209876543",
    "email": "juan@email.com",
    "isActive": true,
    "companyId": "uuid",
    "companyName": "Lácteos S.A",
    "companyInvitationCode": "ABCD1234",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  },
  "statusCode": 200
}
```

---

### GET /api/employees
Obtener todos los empleados de la empresa (solo para empresas).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "company_id": "uuid",
      "name": "Juan Pérez",
      "phone": "3201234567",
      "is_active": true,
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ],
  "statusCode": 200
}
```

---

### GET /api/employees/:id
Obtener un empleado por ID.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "company_id": "uuid",
    "name": "Juan Pérez",
    "phone": "3201234567",
    "is_active": true,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  },
  "statusCode": 200
}
```

---

### POST /api/employees
Crear un nuevo empleado (solo para empresas).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "name": "María López",
  "phone": "3151234567",
  "email": "maria@email.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "company_id": "uuid",
    "name": "María López",
    "phone": "3151234567",
    "is_active": true,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  },
  "statusCode": 201
}
```

---

### PUT /api/employees/:id
Actualizar un empleado (solo para empresas).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "name": "María López Actualizada",
  "documentId": "555666777",
  "phone": "3159876543"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "company_id": "uuid",
    "name": "María López Actualizada",
    "phone": "3159876543",
    "is_active": true,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  },
  "statusCode": 200
}
```

---

### DELETE /api/employees/:id
Eliminar un empleado (solo para empresas).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Empleado eliminado exitosamente"
  },
  "statusCode": 200
}
```

---

### PUT /api/employees/:id/toggle-status
Activar/desactivar un empleado (solo para empresas).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "company_id": "uuid",
    "name": "Juan Pérez",
    "phone": "3201234567",
    "is_active": false,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  },
  "statusCode": 200
}
```

---

## Vacas

### GET /api/cows
Obtener todas las vacas.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Query Parameters:**
- `search` (opcional): Buscar por ID o nombre de vaca
- `breed` (opcional): Filtrar por raza
- `status` (opcional): Filtrar por estado
- `active` (opcional): Filtrar por vacas activas/inactivas (default: true)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company_id": "uuid",
      "cow_id": "C-001",
      "name": "Margarita",
      "breed": "Holstein",
      "status": "Lactante",
      "date_of_birth": "2020-05-15",
      "notes": "Observaciones adicionales",
      "daily_production": 25.50,
      "is_active": true,
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ],
  "statusCode": 200
}
```

---

### GET /api/cows/search?q={query}
Buscar vacas por ID o nombre.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Query Parameters:**
- `q`: Texto de búsqueda

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company_id": "uuid",
      "cow_id": "C-001",
      "name": "Margarita",
      "breed": "Holstein",
      "status": "Lactante",
      "date_of_birth": "2020-05-15",
      "notes": "Observaciones adicionales",
      "daily_production": 25.50,
      "is_active": true,
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ],
  "statusCode": 200
}
```

---

### GET /api/cows/stats
Obtener estadísticas de vacas.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "byBreed": {
      "Holstein": 30,
      "Jersey": 20
    },
    "byStatus": {
      "Lactante": 40,
      "Seca": 10
    },
    "avgProduction": 22.35
  },
  "statusCode": 200
}
```

---

### GET /api/cows/:id
Obtener una vaca por ID.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "cow_id": "C-001",
    "name": "Margarita",
    "breed": "Holstein",
    "status": "Lactante",
    "date_of_birth": "2020-05-15",
    "notes": "Observaciones adicionales",
    "daily_production": 25.50,
    "is_active": true,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  },
  "statusCode": 200
}
```

---

### POST /api/cows
Crear una nueva vaca.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "cowId": "C-001",
  "name": "Margarita",
  "breed": "Holstein",
  "status": "Lactante",
  "dateOfBirth": "2020-05-15",
  "notes": "Observaciones adicionales"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "cow_id": "C-001",
    "name": "Margarita",
    "breed": "Holstein",
    "status": "Lactante",
    "date_of_birth": "2020-05-15",
    "notes": "Observaciones adicionales",
    "daily_production": 0,
    "is_active": true,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  },
  "statusCode": 201
}
```

---

### PUT /api/cows/:id
Actualizar una vaca.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "name": "Margarita Actualizada",
  "breed": "Holstein",
  "status": "Seca"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "cow_id": "C-001",
    "name": "Margarita Actualizada",
    "breed": "Holstein",
    "status": "Seca",
    "date_of_birth": "2020-05-15",
    "notes": "Observaciones adicionales",
    "daily_production": 25.50,
    "is_active": true,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  },
  "statusCode": 200
}
```

---

### DELETE /api/cows/:id
Desactivar una vaca (soft delete).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Vaca desactivada exitosamente"
  },
  "statusCode": 200
}
```

---

## Ordeños

### POST /api/milkings/rapid
Crear ordeño rápido.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "shift": "AM",
  "cowCount": 25,
  "totalLiters": 520.5,
  "milkingDate": "2025-01-15",
  "milkingTime": "05:30",
  "notes": "Ordeño normal"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "employee_id": "uuid",
    "milking_type": "rapid",
    "shift": "AM",
    "cow_count": 25,
    "total_liters": 520.5,
    "notes": "Ordeño normal",
    "milking_date": "2025-01-15",
    "milking_time": "05:30",
    "created_at": "2025-01-15T05:30:00Z"
  },
  "statusCode": 201
}
```

---

### POST /api/milkings/individual
Crear ordeño individual (con trazabilidad por vaca).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "shift": "AM",
  "cows": [
    {
      "cowId": "uuid-cow-1",
      "liters": 18.5
    },
    {
      "cowId": "uuid-cow-2",
      "liters": 22.3
    }
  ],
  "milkingDate": "2025-01-15",
  "milkingTime": "05:30",
  "notes": "Ordeño individual"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "employee_id": "uuid",
    "milking_type": "individual",
    "shift": "AM",
    "cow_count": 2,
    "total_liters": 40.8,
    "notes": "Ordeño individual",
    "milking_date": "2025-01-15",
    "milking_time": "05:30",
    "created_at": "2025-01-15T05:30:00Z"
  },
  "statusCode": 201
}
```

---

### POST /api/milkings/massive
Crear ordeño masivo (múltiples vacas, litros totales).

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "shift": "PM",
  "cowIds": ["uuid-cow-1", "uuid-cow-2", "uuid-cow-3"],
  "totalLiters": 450.0,
  "milkingDate": "2025-01-15",
  "milkingTime": "17:30",
  "notes": "Ordeño masivo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "employee_id": "uuid",
    "milking_type": "massive",
    "shift": "PM",
    "cow_count": 3,
    "total_liters": 450.0,
    "milking_date": "2025-01-15",
    "milking_time": "17:30",
    "created_at": "2025-01-15T17:30:00Z"
  },
  "statusCode": 201
}
```

---

### GET /api/milkings
Obtener todos los ordeños.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Query Parameters:**
- `date` (opcional): Filtrar por fecha (YYYY-MM-DD)
- `shift` (opcional): Filtrar por turno (AM/PM)
- `employeeId` (opcional): Filtrar por empleado

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company_id": "uuid",
      "employee_id": "uuid",
      "milking_type": "rapid",
      "shift": "AM",
      "cow_count": 25,
      "total_liters": 520.5,
      "notes": "Ordeño normal",
      "milking_date": "2025-01-15",
      "milking_time": "05:30",
      "created_at": "2025-01-15T05:30:00Z",
      "employees": {
        "name": "Juan Pérez"
      }
    }
  ],
  "statusCode": 200
}
```

---

### GET /api/milkings/:id
Obtener detalle de un ordeño.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "employee_id": "uuid",
    "milking_type": "individual",
    "shift": "AM",
    "cow_count": 2,
    "total_liters": 40.8,
    "notes": "Ordeño individual",
    "milking_date": "2025-01-15",
    "milking_time": "05:30",
    "created_at": "2025-01-15T05:30:00Z",
    "employees": {
      "id": "uuid",
      "name": "Juan Pérez"
    },
    "individual_milkings": [
      {
        "id": "uuid",
        "liters": 18.5,
        "cows": {
          "id": "uuid",
          "cow_id": "C-001",
          "name": "Margarita",
          "breed": "Holstein"
        }
      },
      {
        "id": "uuid",
        "liters": 22.3,
        "cows": {
          "id": "uuid",
          "cow_id": "C-002",
          "name": "Clarita",
          "breed": "Jersey"
        }
      }
    ]
  },
  "statusCode": 200
}
```

---

### GET /api/milkings/cow/:cowId/history
Historial completo de ordeños de una vaca.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "cow_id": "uuid",
      "milking_id": "uuid",
      "liters": 18.5,
      "created_at": "2025-01-15T05:30:00Z",
      "milkings": {
        "id": "uuid",
        "shift": "AM",
        "milking_date": "2025-01-15",
        "milking_time": "05:30",
        "milking_type": "individual",
        "employees": {
          "name": "Juan Pérez"
        }
      }
    }
  ],
  "statusCode": 200
}
```

---

### GET /api/milkings/employee/:employeeId/history
Historial de ordeños registrados por un empleado.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "milkings": [
      {
        "id": "uuid",
        "company_id": "uuid",
        "employee_id": "uuid",
        "milking_type": "rapid",
        "shift": "AM",
        "cow_count": 25,
        "total_liters": 520.5,
        "notes": "Ordeño normal",
        "milking_date": "2025-01-15",
        "milking_time": "05:30",
        "created_at": "2025-01-15T05:30:00Z"
      }
    ],
    "summary": {
      "totalMilkings": 10,
      "totalLiters": 5205.0,
      "avgPerMilking": 520.5
    }
  },
  "statusCode": 200
}
```

---

### GET /api/milkings/stats/daily?date={date}
Estadísticas diarias de producción.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Query Parameters:**
- `date` (requerido): Fecha (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2025-01-15",
    "totalLiters": 1040.5,
    "shifts": {
      "AM": {
        "count": 2,
        "liters": 520.5
      },
      "PM": {
        "count": 2,
        "liters": 520.0
      }
    }
  },
  "statusCode": 200
}
```

---

### DELETE /api/milkings/:id
Eliminar un ordeño.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Ordeño eliminado exitosamente"
  },
  "statusCode": 200
}
```

---

## Calidad

### POST /api/quality/tests
Crear prueba de calidad.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "fat": 3.8,
  "protein": 3.2,
  "lactose": 4.8,
  "ufc": 50000,
  "acidity": 6.8,
  "notes": "Buena calidad",
  "photo": "base64-image-string",
  "date": "2025-01-15",
  "milkingId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "milking_id": "uuid",
    "test_id": "TEST-20250115-123456",
    "fat_percentage": 3.8,
    "protein_percentage": 3.2,
    "lactose_percentage": 4.8,
    "ufc": 50000,
    "acidity": 6.8,
    "observations": "Buena calidad",
    "photo_url": "base64-image-string",
    "test_date": "2025-01-15",
    "created_at": "2025-01-15T10:00:00Z"
  },
  "statusCode": 201
}
```

---

### GET /api/quality/tests
Obtener todas las pruebas de calidad.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tests": [
      {
        "id": "uuid",
        "testId": "TEST-20250115-123456",
        "fat": 3.8,
        "protein": 3.2,
        "lactose": 4.8,
        "ufc": 50000,
        "acidity": 6.8,
        "notes": "Buena calidad",
        "photo": "base64-image-string",
        "date": "2025-01-15",
        "createdAt": "2025-01-15T10:00:00Z"
      }
    ]
  },
  "statusCode": 200
}
```

---

### GET /api/quality/tests/:id
Obtener una prueba de calidad.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "milking_id": "uuid",
    "test_id": "TEST-20250115-123456",
    "fat_percentage": 3.8,
    "protein_percentage": 3.2,
    "lactose_percentage": 4.8,
    "ufc": 50000,
    "acidity": 6.8,
    "observations": "Buena calidad",
    "photo_url": "base64-image-string",
    "test_date": "2025-01-15",
    "created_at": "2025-01-15T10:00:00Z",
    "milkings": {
      "id": "uuid",
      "shift": "AM",
      "milking_date": "2025-01-15"
    }
  },
  "statusCode": 200
}
```

---

### PUT /api/quality/tests/:id
Actualizar prueba de calidad.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "fatPercentage": 4.0,
  "proteinPercentage": 3.5,
  "ufc": 45000,
  "observations": "Calidad mejorada"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "milking_id": "uuid",
    "test_id": "TEST-20250115-123456",
    "fat_percentage": 4.0,
    "protein_percentage": 3.5,
    "lactose_percentage": 4.8,
    "ufc": 45000,
    "acidity": 6.8,
    "observations": "Calidad mejorada",
    "photo_url": "base64-image-string",
    "test_date": "2025-01-15",
    "created_at": "2025-01-15T10:00:00Z"
  },
  "statusCode": 200
}
```

---

### DELETE /api/quality/tests/:id
Eliminar prueba de calidad.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Prueba eliminada exitosamente"
  },
  "statusCode": 200
}
```

---

### GET /api/quality/stats
Obtener estadísticas de calidad.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "averageFat": 3.75,
    "averageProtein": 3.25,
    "averageLactose": 4.70,
    "averageUfc": 48000,
    "averageAcidity": 6.75
  },
  "statusCode": 200
}
```

---

## Inventario

### POST /api/inventory
Crear item de inventario.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "batchId": "LOTE-001",
  "quantity": 1000,
  "category": "FRESH_MILK",
  "status": "COLD",
  "milkingId": "uuid",
  "notes": "Leche fresca del ordeño matutino"
}
```

**Enums:**
- **category**: `FRESH_MILK`, `PROCESSING`, `STORED`
- **status**: `COLD`, `HOT`, `PROCESS`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "batch_id": "LOTE-001",
    "quantity": 1000,
    "category": "FRESH_MILK",
    "status": "COLD",
    "milking_id": "uuid",
    "location": null,
    "notes": "Leche fresca del ordeño matutino",
    "created_by": "uuid",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  },
  "statusCode": 201
}
```

---

### GET /api/inventory
Obtener todos los items de inventario.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "batchId": "LOTE-001",
      "quantity": 1000,
      "category": "FRESH_MILK",
      "status": "COLD",
      "milkingId": "uuid",
      "location": null,
      "notes": "Leche fresca del ordeño matutino",
      "createdBy": "uuid",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "statusCode": 200
}
```

---

### GET /api/inventory/stats
Obtener estadísticas de inventario.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalQuantity": 5000,
    "coldQuantity": 3000,
    "hotQuantity": 2000,
    "freshMilk": 3500,
    "processing": 1000,
    "stored": 500,
    "lowStockItems": [
      {
        "id": "uuid",
        "batchId": "LOTE-005",
        "quantity": 500,
        "category": "STORED"
      }
    ]
  },
  "statusCode": 200
}
```

---

### GET /api/inventory/:id
Obtener un item de inventario.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "batch_id": "LOTE-001",
    "quantity": 1000,
    "category": "FRESH_MILK",
    "status": "COLD",
    "milking_id": "uuid",
    "location": null,
    "notes": "Leche fresca del ordeño matutino",
    "created_by": "uuid",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z",
    "milkings": {
      "id": "uuid",
      "shift": "AM",
      "milking_date": "2025-01-15"
    },
    "employees": {
      "name": "Juan Pérez"
    }
  },
  "statusCode": 200
}
```

---

### PUT /api/inventory/:id
Actualizar item de inventario.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "quantity": 800,
  "status": "PROCESS",
  "notes": "Actualización de cantidad"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "batch_id": "LOTE-001",
    "quantity": 800,
    "category": "FRESH_MILK",
    "status": "PROCESS",
    "milking_id": "uuid",
    "location": null,
    "notes": "Actualización de cantidad",
    "created_by": "uuid",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  },
  "statusCode": 200
}
```

---

### DELETE /api/inventory/:id
Eliminar item de inventario.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Item eliminado exitosamente"
  },
  "statusCode": 200
}
```

---

### POST /api/inventory/movements
Crear movimiento de inventario.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "inventoryItemId": "uuid",
  "type": "OUT",
  "quantity": 200,
  "reason": "Venta a cliente",
  "notes": "Entrega realizada"
}
```

**Enums:**
- **type**: `IN` (entrada), `OUT` (salida), `ADJUSTMENT` (ajuste)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "inventory_item_id": "uuid",
    "type": "OUT",
    "quantity": 200,
    "reason": "Venta a cliente",
    "notes": "Entrega realizada",
    "created_by": "uuid",
    "created_at": "2025-01-15T10:00:00Z"
  },
  "statusCode": 201
}
```

---

### GET /api/inventory/movements
Obtener movimientos de inventario.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Query Parameters:**
- `inventoryItemId` (opcional): Filtrar por item de inventario

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "inventoryItemId": "uuid",
      "type": "OUT",
      "quantity": 200,
      "reason": "Venta a cliente",
      "notes": "Entrega realizada",
      "createdBy": "uuid",
      "createdAt": "2025-01-15T10:00:00Z",
      "inventory": {
        "batch_id": "LOTE-001"
      },
      "employees": {
        "name": "Juan Pérez"
      }
    }
  ],
  "statusCode": 200
}
```

---

## Entregas

### POST /api/deliveries
Crear entrega.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "clientName": "Restaurante La Esquina",
  "clientEmail": "contacto@laesquina.com",
  "clientPhone": "3201234567",
  "deliveryAddress": "Calle 10 # 5-20",
  "quantity": 50,
  "scheduledDate": "2025-01-16",
  "scheduledTime": "08:00",
  "assignedEmployeeId": "uuid",
  "notes": "Entrega temprano"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "client_name": "Restaurante La Esquina",
    "client_email": "contacto@laesquina.com",
    "client_phone": "3201234567",
    "delivery_address": "Calle 10 # 5-20",
    "quantity": 50,
    "scheduled_date": "2025-01-16",
    "scheduled_time": "08:00",
    "assigned_employee_id": "uuid",
    "status": "PENDING",
    "notes": "Entrega temprano",
    "created_by": "uuid",
    "created_at": "2025-01-15T10:00:00Z",
    "completed_at": null
  },
  "statusCode": 201
}
```

---

### GET /api/deliveries
Obtener todas las entregas.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Query Parameters:**
- `status` (opcional): Filtrar por estado (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
- `date` (opcional): Filtrar por fecha (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company_id": "uuid",
      "client_name": "Restaurante La Esquina",
      "client_email": "contacto@laesquina.com",
      "client_phone": "3201234567",
      "delivery_address": "Calle 10 # 5-20",
      "quantity": 50,
      "scheduled_date": "2025-01-16",
      "scheduled_time": "08:00",
      "assigned_employee_id": "uuid",
      "status": "PENDING",
      "notes": "Entrega temprano",
      "created_by": "uuid",
      "created_at": "2025-01-15T10:00:00Z",
      "completed_at": null,
      "assigned_employee": {
        "id": "uuid",
        "name": "Juan Pérez"
      }
    }
  ],
  "statusCode": 200
}
```

---

### GET /api/deliveries/stats
Obtener estadísticas de entregas.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "pending": 20,
    "inProgress": 10,
    "completed": 65,
    "cancelled": 5,
    "totalLitersDelivered": 5000
  },
  "statusCode": 200
}
```

---

### GET /api/deliveries/:id
Obtener una entrega.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "client_name": "Restaurante La Esquina",
    "client_email": "contacto@laesquina.com",
    "client_phone": "3201234567",
    "delivery_address": "Calle 10 # 5-20",
    "quantity": 50,
    "scheduled_date": "2025-01-16",
    "scheduled_time": "08:00",
    "assigned_employee_id": "uuid",
    "status": "PENDING",
    "notes": "Entrega temprano",
    "created_by": "uuid",
    "created_at": "2025-01-15T10:00:00Z",
    "completed_at": null,
    "assigned_employee": {
      "id": "uuid",
      "name": "Juan Pérez"
    },
    "created_by_employee": {
      "name": "María López"
    }
  },
  "statusCode": 200
}
```

---

### PUT /api/deliveries/:id
Actualizar entrega.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "clientName": "Restaurante La Esquina Actualizado",
  "clientEmail": "nuevo@laesquina.com",
  "clientPhone": "3209876543",
  "deliveryAddress": "Nueva Dirección 456",
  "quantity": 60,
  "scheduledDate": "2025-01-17",
  "scheduledTime": "09:00",
  "assignedEmployeeId": "uuid",
  "status": "IN_PROGRESS",
  "notes": "Actualización de entrega"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "client_name": "Restaurante La Esquina Actualizado",
    "client_email": "nuevo@laesquina.com",
    "client_phone": "3209876543",
    "delivery_address": "Nueva Dirección 456",
    "quantity": 60,
    "scheduled_date": "2025-01-17",
    "scheduled_time": "09:00",
    "assigned_employee_id": "uuid",
    "status": "IN_PROGRESS",
    "notes": "Actualización de entrega",
    "created_by": "uuid",
    "created_at": "2025-01-15T10:00:00Z",
    "completed_at": null
  },
  "statusCode": 200
}
```

---

### PATCH /api/deliveries/:id/status
Actualizar estado de entrega.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Enums:**
- **status**: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "client_name": "Restaurante La Esquina",
    "client_email": "contacto@laesquina.com",
    "client_phone": "3201234567",
    "delivery_address": "Calle 10 # 5-20",
    "quantity": 50,
    "scheduled_date": "2025-01-16",
    "scheduled_time": "08:00",
    "assigned_employee_id": "uuid",
    "status": "COMPLETED",
    "notes": "Entrega temprano",
    "created_by": "uuid",
    "created_at": "2025-01-15T10:00:00Z",
    "completed_at": "2025-01-16T08:30:00Z"
  },
  "statusCode": 200
}
```

---

### DELETE /api/deliveries/:id
Eliminar entrega.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Entrega eliminada exitosamente"
  },
  "statusCode": 200
}
```

---

## Dashboard

### GET /api/dashboard/summary
Obtener resumen del dashboard.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "today": {
      "totalLiters": 1040.50,
      "milkingsAM": 2,
      "milkingsPM": 2,
      "activeCows": 50,
      "avgPerCow": 20.81
    },
    "thisWeek": {
      "totalLiters": 7283.50,
      "avgDaily": 1040.50,
      "trend": "stable",
      "dailyProduction": [
        {
          "date": "2025-01-09",
          "dayName": "Lun",
          "totalLiters": 1000.00,
          "milkingsCount": 4
        },
        {
          "date": "2025-01-10",
          "dayName": "Mar",
          "totalLiters": 1050.00,
          "milkingsCount": 4
        },
        {
          "date": "2025-01-11",
          "dayName": "Mié",
          "totalLiters": 1020.00,
          "milkingsCount": 4
        },
        {
          "date": "2025-01-12",
          "dayName": "Jue",
          "totalLiters": 1030.00,
          "milkingsCount": 4
        },
        {
          "date": "2025-01-13",
          "dayName": "Vie",
          "totalLiters": 1100.00,
          "milkingsCount": 4
        },
        {
          "date": "2025-01-14",
          "dayName": "Sáb",
          "totalLiters": 1043.00,
          "milkingsCount": 4
        },
        {
          "date": "2025-01-15",
          "dayName": "Dom",
          "totalLiters": 1040.50,
          "milkingsCount": 4
        }
      ]
    },
    "topProducers": [
      {
        "id": "uuid",
        "cow_id": "C-001",
        "name": "Margarita",
        "daily_production": 28.50
      },
      {
        "id": "uuid",
        "cow_id": "C-002",
        "name": "Clarita",
        "daily_production": 26.30
      }
    ],
    "recentMilkings": [
      {
        "id": "uuid",
        "company_id": "uuid",
        "employee_id": "uuid",
        "milking_type": "rapid",
        "shift": "PM",
        "cow_count": 25,
        "total_liters": 520.50,
        "milking_date": "2025-01-15",
        "milking_time": "17:30",
        "created_at": "2025-01-15T17:30:00Z",
        "employees": {
          "name": "Juan Pérez"
        }
      }
    ],
    "alerts": []
  },
  "statusCode": 200
}
```

---

### GET /api/dashboard/metrics
Obtener métricas del dashboard.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "production": {
      "daily": 1040.50,
      "weekly": 7283.50,
      "monthly": 31205.00
    },
    "efficiency": {
      "avgPerCow": 20.81,
      "avgPerEmployee": 260.13
    },
    "quality": {
      "avgFat": 3.75,
      "avgProtein": 3.25,
      "testsCount": 50
    }
  },
  "statusCode": 200
}
```

---

### GET /api/dashboard/production
Obtener datos de producción por período.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Query Parameters:**
- `period` (opcional): Período de tiempo (`day`, `week`, `month`) - default: `week`

**Response (period=day):**
```json
{
  "success": true,
  "data": {
    "period": "day",
    "labels": ["AM", "PM"],
    "dataPoints": [
      {
        "date": "2025-01-15",
        "label": "AM",
        "totalLiters": 520.50,
        "milkingsCount": 2
      },
      {
        "date": "2025-01-15",
        "label": "PM",
        "totalLiters": 520.00,
        "milkingsCount": 2
      }
    ],
    "summary": {
      "totalLiters": 1040.50,
      "avgLiters": 520.25,
      "dataPointsCount": 2
    }
  },
  "statusCode": 200
}
```

**Response (period=week):**
```json
{
  "success": true,
  "data": {
    "period": "week",
    "labels": ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    "dataPoints": [
      {
        "date": "2025-01-09",
        "label": "Lun",
        "totalLiters": 1000.00,
        "milkingsCount": 4
      },
      {
        "date": "2025-01-10",
        "label": "Mar",
        "totalLiters": 1050.00,
        "milkingsCount": 4
      },
      {
        "date": "2025-01-11",
        "label": "Mié",
        "totalLiters": 1020.00,
        "milkingsCount": 4
      },
      {
        "date": "2025-01-12",
        "label": "Jue",
        "totalLiters": 1030.00,
        "milkingsCount": 4
      },
      {
        "date": "2025-01-13",
        "label": "Vie",
        "totalLiters": 1100.00,
        "milkingsCount": 4
      },
      {
        "date": "2025-01-14",
        "label": "Sáb",
        "totalLiters": 1043.00,
        "milkingsCount": 4
      },
      {
        "date": "2025-01-15",
        "label": "Dom",
        "totalLiters": 1040.50,
        "milkingsCount": 4
      }
    ],
    "summary": {
      "totalLiters": 7283.50,
      "avgLiters": 1040.50,
      "dataPointsCount": 7
    }
  },
  "statusCode": 200
}
```

**Response (period=month):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "labels": ["S1", "S2", "S3", "S4"],
    "dataPoints": [
      {
        "date": "2024-12-17",
        "label": "S1",
        "totalLiters": 7200.00,
        "milkingsCount": 28
      },
      {
        "date": "2024-12-24",
        "label": "S2",
        "totalLiters": 7350.00,
        "milkingsCount": 28
      },
      {
        "date": "2024-12-31",
        "label": "S3",
        "totalLiters": 7100.00,
        "milkingsCount": 28
      },
      {
        "date": "2025-01-07",
        "label": "S4",
        "totalLiters": 7283.50,
        "milkingsCount": 28
      }
    ],
    "summary": {
      "totalLiters": 28933.50,
      "avgLiters": 7233.38,
      "dataPointsCount": 4
    }
  },
  "statusCode": 200
}
```

---

## Notas Importantes

### Autenticación
- Todos los endpoints (excepto los de registro, login, refresh y verify-code) requieren autenticación mediante JWT Bearer Token
- El token debe incluirse en el header: `Authorization: Bearer {access-token}`
- Los tokens expiran según la configuración del servidor (default: 7 días para access token, 30 días para refresh token)

### Permisos
- **Empresas (user_type: company)**: Tienen acceso completo a todos los recursos de su empresa
- **Empleados (user_type: employee)**: Tienen acceso limitado según el endpoint