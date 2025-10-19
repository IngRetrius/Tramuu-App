# Tramuu - Sistema de Gestión para Lecherías

<div align="center">

**Plataforma completa para la gestión eficiente de producción lechera**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge\&logo=expo\&logoColor=white)](https://expo.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge\&logo=nestjs\&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge\&logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Descripción

Tramuu es una solución integral de gestión lechera que combina una aplicación móvil multiplataforma con un robusto backend API. El sistema permite a productores lecheros gestionar todos los aspectos de su operación: desde el registro de ordeños y control de calidad hasta la gestión de inventario, entregas y empleados.

## Características Principales

### Aplicación Móvil

* Dashboard inteligente con métricas, gráficas y alertas
* Gestión de ganado con historial y estadísticas
* Registro de ordeños en tres modalidades (rápido, individual, masivo)
* Control de calidad de leche
* Gestión de inventario con movimientos y alertas
* Módulo de entregas y asignación de lecheros
* Gestión de empleados, roles y permisos
* Configuración de empresa, perfil y contraseñas

### Backend API

* Autenticación segura con JWT y refresh tokens
* Base de datos PostgreSQL (Supabase)
* API RESTful documentada con Swagger
* Trazabilidad completa de operaciones
* Validación de datos con class-validator
* Arquitectura modular y mantenible

## Arquitectura del Proyecto

```
TramuuApp/
├── tramuu-app/              # Frontend - Aplicación móvil React Native
│   ├── app/                 # Pantallas y navegación (Expo Router)
│   ├── components/          # Componentes reutilizables
│   ├── services/            # Capa de servicios API
│   ├── constants/           # Temas y constantes
│   └── README.md            # Documentación del frontend
│
├── Backend/                 # Backend - API NestJS
│   ├── src/
│   │   ├── modules/         # Módulos principales
│   │   │   ├── auth/
│   │   │   ├── cows/
│   │   │   ├── milkings/
│   │   │   ├── quality/
│   │   │   ├── inventory/
│   │   │   ├── deliveries/
│   │   │   ├── companies/
│   │   │   ├── employees/
│   │   │   └── dashboard/
│   │   ├── common/
│   │   └── config/
│   └── README.md
│
├── CLAUDE.md
├── INTEGRATION.md
└── README.md
```

## Quick Start

### Prerrequisitos

* Node.js >= 18.x
* npm >= 9.x
* PostgreSQL o cuenta de Supabase
* Expo CLI
* Git

### Instalación Completa

#### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd TramuuApp
```

#### 2. Configurar Backend

```bash
cd Backend
npm install
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase y secretos JWT.

Ejecuta los scripts SQL mencionados en `tramuu-app/INTEGRATION.md` (líneas 634-690) y luego inicia el servidor:

```bash
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`
Documentación Swagger: `http://localhost:3000/api/docs`

#### 3. Configurar Frontend

```bash
cd tramuu-app
npm install
```

Crea un archivo `.env`:

```env
API_URL=http://192.168.1.X:3000/api
NODE_ENV=development
```

Inicia la aplicación:

```bash
npm start
```

Presiona:

* `a` para Android
* `i` para iOS
* `w` para Web

## Documentación

| Documento                                     | Descripción                          |
| --------------------------------------------- | ------------------------------------ |
| [Backend README](./Backend/README.md)         | Documentación del API backend        |
| [Frontend README](./tramuu-app/README.md)     | Documentación de la app móvil        |
| [INTEGRATION.md](./tramuu-app/INTEGRATION.md) | Guía de integración frontend-backend |
| [CLAUDE.md](./tramuu-app/CLAUDE.md)           | Guía para desarrollo con Claude Code |

## Stack Tecnológico

### Frontend

* React Native + Expo SDK ~54.0.13
* Expo Router ~6.0.11
* Axios, AsyncStorage
* Lucide Icons, react-native-chart-kit
* Reanimated, Gesture Handler

### Backend

* NestJS 10.x
* TypeScript 5.x
* PostgreSQL / Supabase
* JWT, class-validator, Swagger, Jest

## Seguridad

* Autenticación JWT con refresh tokens
* Hashing de contraseñas con bcrypt (10 salt rounds)
* Guards de autorización
* Validación exhaustiva de datos
* Variables de entorno seguras
* CORS configurado correctamente

## Módulos del Sistema

| Módulo        | Frontend | Backend | Descripción                               |
| ------------- | -------- | ------- | ----------------------------------------- |
| Dashboard     | Sí       | Sí      | Métricas y alertas                        |
| Autenticación | Sí       | Sí      | Login, JWT, contraseñas                   |
| Vacas         | Sí       | Sí      | CRUD y estadísticas                       |
| Ordeños       | Sí       | Sí      | Registros rápidos, individuales y masivos |
| Calidad       | Sí       | Sí      | Pruebas y resultados                      |
| Inventario    | Sí       | Sí      | Movimientos y alertas                     |
| Entregas      | Sí       | Sí      | Programación y seguimiento                |
| Empresas      | Sí       | Sí      | Perfiles y códigos de invitación          |
| Empleados     | Sí       | Sí      | Gestión de personal                       |

## Base de Datos

El sistema usa PostgreSQL con las tablas principales:

* companies
* employees
* cows
* milkings
* quality_tests
* inventory
* inventory_movements
* deliveries

Consulta los scripts SQL en `tramuu-app/INTEGRATION.md`.

## Testing

### Backend

```bash
cd Backend
npm run test
npm run test:cov
npm run test:e2e
```

### Frontend

```bash
cd tramuu-app
npm test
```

## Deployment

### Backend

```bash
cd Backend
npm run build
npm run start:prod
```

### Frontend

**Desarrollo**

```bash
npx eas build --platform android --profile development
npx eas build --platform ios --profile development
```

**Producción**

```bash
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

## Flujo de Desarrollo

1. Desarrollo local: Backend en `localhost:3000`, Frontend con Expo Dev
2. Testing: ejecutar pruebas
3. Build: compilar backend y crear builds móviles
4. Deploy: subir backend a servidor y app a stores

## Troubleshooting

**Backend no inicia**

* Verifica PostgreSQL o Supabase
* Revisa variables `.env`
* Asegura que las tablas existen

**La app no conecta al backend**

* Verifica IP en `API_URL`
* Confirma que ambos dispositivos estén en la misma red
* Asegura que el backend esté corriendo

**Errores de autenticación**

* Limpia AsyncStorage
* Revisa JWT secrets
* Regenera tokens

## Roadmap

* Notificaciones push con Expo
* Modo offline con sincronización
* Reportes PDF
* Gráficas avanzadas
* Integración IoT
* Panel web administrativo

## Contribución

1. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
2. Haz commit: `git commit -m 'Agregar nueva funcionalidad'`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request

## Licencia

Proyecto privado y confidencial. Todos los derechos reservados.

## Equipo

Desarrollado para **Tramuu** - Sistema de Gestión Lechera

## Contacto

Para soporte o consultas, contactar al equipo de desarrollo.

---

<div align="center">

**Hecho con dedicación para la industria lechera**
[Documentación](./tramuu-app/INTEGRATION.md) • [Backend API](./Backend/README.md) • [Frontend App](./tramuu-app/README.md)

</div>

---
