# TRAMUU - Documentación Técnica Completa para Claude Code

> Sistema Integral de Gestión para Lecherías
> Stack: React Native (Expo) + NestJS + PostgreSQL (Supabase)
> Última actualización: 2025-10-22

---

## Tabla de Contenidos

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Backend - Documentación Completa](#3-backend---documentación-completa)
4. [Frontend - Documentación Completa](#4-frontend---documentación-completa)
5. [Integración Frontend-Backend](#5-integración-frontend-backend)
6. [Base de Datos](#6-base-de-datos)
7. [Flujos de Trabajo Principales](#7-flujos-de-trabajo-principales)
8. [Guía de Desarrollo](#8-guía-de-desarrollo)
9. [Troubleshooting](#9-troubleshooting)
10. [Roadmap y Mejoras Futuras](#10-roadmap-y-mejoras-futuras)

---

## 1. Visión General del Proyecto

### 1.1 Descripción

**Tramuu** es una plataforma completa para la gestión eficiente de producción lechera que combina:
- **Aplicación móvil multiplataforma** (iOS/Android) para uso diario en campo
- **Backend API RESTful** con autenticación robusta y validaciones exhaustivas
- **Base de datos relacional** en PostgreSQL (Supabase) con trazabilidad completa

### 1.2 Características Principales

#### Para Empresas Lecheras:
- Dashboard inteligente con métricas en tiempo real, gráficas y alertas
- Gestión completa de ganado con historial y estadísticas por vaca
- Registro de ordeños en tres modalidades (rápido, individual, masivo)
- Control de calidad de leche con parámetros técnicos
- Gestión de inventario con movimientos y alertas de stock bajo
- Módulo de entregas con asignación de lecheros
- Gestión de empleados con roles y permisos
- Configuración de empresa y generación de códigos de invitación

#### Para Empleados:
- Dashboard personalizado con tareas asignadas
- Registro rápido de ordeños desde campo
- Consulta de información de vacas
- Seguimiento de entregas asignadas

### 1.3 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  React Native 0.81.4 + Expo SDK 54.0.13                     │
│  Expo Router 6.0.11 (navegación basada en archivos)         │
│  Axios 1.12.2 + AsyncStorage                                │
│  Lucide React Native (iconos) + Chart Kit (gráficos)        │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ HTTPS/REST
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│  NestJS 10.0.0 (Node.js framework)                          │
│  TypeScript 5.1.3                                           │
│  JWT Authentication + Passport                              │
│  class-validator + class-transformer                        │
│  Swagger/OpenAPI (documentación automática)                 │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ SQL
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                             │
│  PostgreSQL (Supabase)                                      │
│  8 tablas principales + relaciones                          │
│  Trazabilidad completa de operaciones                       │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 Estructura del Proyecto

```
TramuuApp/
├── Backend/                 # API NestJS
│   ├── src/
│   │   ├── modules/         # 9 módulos funcionales
│   │   ├── common/          # Guards, decorators, interceptors
│   │   ├── config/          # Configuración JWT y app
│   │   ├── database/        # Servicio Supabase
│   │   ├── main.ts          # Entry point
│   │   └── app.module.ts    # Módulo raíz
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── tramuu-app/              # Frontend React Native
│   ├── app/                 # Rutas y pantallas (Expo Router)
│   │   ├── (tabs)/          # Navegación principal
│   │   ├── register/        # Flujo de registro
│   │   ├── login.jsx
│   │   └── _layout.jsx
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/
│   │   ├── dashboard/
│   │   ├── management/
│   │   └── configuration/
│   ├── services/            # Capa de servicios API
│   │   ├── api/             # Cliente Axios
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── cows/
│   │   ├── milkings/
│   │   ├── quality/
│   │   ├── inventory/
│   │   ├── deliveries/
│   │   ├── companies/
│   │   └── employees/
│   ├── constants/           # Temas y constantes
│   ├── assets/
│   ├── .env
│   ├── app.json
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── README.md                # Documentación principal
└── claude.md                # Este archivo
```

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura

```
┌──────────────────┐
│   Mobile App     │
│  (React Native)  │
└────────┬─────────┘
         │
         │ HTTP/JSON
         │ JWT Auth
         │
         ▼
┌──────────────────┐       ┌──────────────────┐
│   API Gateway    │       │   Supabase       │
│   (NestJS)       │◄─────►│   (PostgreSQL)   │
└──────────────────┘       └──────────────────┘
         │
         ├─► Auth Module (JWT + bcrypt)
         ├─► Companies Module
         ├─► Employees Module
         ├─► Cows Module
         ├─► Milkings Module (3 tipos)
         ├─► Quality Module
         ├─► Inventory Module
         ├─► Deliveries Module
         └─► Dashboard Module
```

### 2.2 Flujo de Autenticación

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │  Server  │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │ 1. POST /auth/login                    │
     │    { email, password }                 │
     │────────────────────────────────────────►
     │                                         │
     │                              2. Validate credentials
     │                                  Hash comparison (bcrypt)
     │                                         │
     │ 3. Response                            │
     │    { accessToken, refreshToken, user } │
     │◄────────────────────────────────────────
     │                                         │
     │ 4. Store tokens                        │
     │    AsyncStorage.setItem()              │
     │                                         │
     │ 5. Subsequent requests                 │
     │    Authorization: Bearer <token>       │
     │────────────────────────────────────────►
     │                                         │
     │                              6. JWT Verify
     │                                 Extract payload
     │                                         │
     │ 7. Response with data                  │
     │◄────────────────────────────────────────
     │                                         │
```

### 2.3 Módulos del Sistema

| Módulo | Descripción | Endpoints Principales | Frontend |
|--------|-------------|----------------------|----------|
| **Auth** | Autenticación y registro | `/auth/login`, `/auth/register/*` | login.jsx, register/*.jsx |
| **Dashboard** | Métricas y análisis | `/dashboard/summary`, `/dashboard/metrics` | (tabs)/index.jsx |
| **Cows** | Gestión de ganado | `/cows`, `/cows/search`, `/cows/stats` | (tabs)/management.jsx |
| **Milkings** | Registro de ordeños | `/milkings/rapid`, `/milkings/individual`, `/milkings/massive` | milkingRecord.jsx |
| **Quality** | Control de calidad | `/quality/tests`, `/quality/stats` | (tabs)/quality.jsx |
| **Inventory** | Gestión de inventario | `/inventory`, `/inventory/movements` | (tabs)/inventory.jsx |
| **Deliveries** | Entregas | `/deliveries`, `/deliveries/stats` | (tabs)/deliveries.jsx |
| **Companies** | Perfil de empresa | `/companies/me`, `/companies/generate-code` | configurationProfile.jsx |
| **Employees** | Gestión de empleados | `/employees`, `/employees/:id` | components/configuration/ |

---

## 3. Backend - Documentación Completa

### 3.1 Configuración Principal

#### main.ts - Entry Point

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // API Prefix
  app.setGlobalPrefix(process.env.API_PREFIX || 'api');

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Tramuu API')
    .setDescription('API para gestión de lecherías')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
```

#### Variables de Entorno (.env)

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:8081,exp://192.168.1.100:8081
```

### 3.2 Sistema de Seguridad

#### JWT Guard (Global)

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Verificar si es ruta pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido o expirado');
    }
    return user;
  }
}
```

#### Decoradores Personalizados

```typescript
// @Public() - Marca endpoints públicos
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// @CurrentUser() - Obtiene usuario actual del request
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return data ? user?.[data] : user;
  },
);
```

### 3.3 Módulos Principales

#### Auth Module

**Endpoints:**
- `POST /auth/register/company` - Registrar empresa (público)
- `POST /auth/register/employee` - Registrar empleado (público)
- `POST /auth/login` - Iniciar sesión (público)
- `GET /auth/verify-code/:code` - Verificar código de invitación (público)
- `PUT /auth/change-password` - Cambiar contraseña (protegido)

**Flujo de Registro de Empresa:**
1. Validar email único
2. Validar NIT único
3. Hash de contraseña (bcrypt, 10 rounds)
4. Crear usuario en tabla `users`
5. Generar código de invitación único
6. Crear empresa en tabla `companies`
7. Generar JWT token
8. Retornar usuario, empresa y token

**DTOs Principales:**

```typescript
class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

class RegisterCompanyDto {
  @IsString() name: string;
  @IsString() nitId: string;
  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() phone?: string;
  @IsEmail() email: string;
  @MinLength(6) password: string;
}

class RegisterEmployeeDto {
  @IsString() name: string;
  @IsString() invitationCode: string;
  @IsString() @IsOptional() phone?: string;
  @IsEmail() email: string;
  @MinLength(6) password: string;
}
```

#### Cows Module

**Endpoints:**
- `GET /cows` - Listar vacas (filtros: breed, status, active)
- `GET /cows/search?q=query` - Buscar vaca por ID o nombre
- `GET /cows/stats` - Estadísticas de ganado
- `GET /cows/:id` - Obtener vaca por ID
- `POST /cows` - Crear vaca
- `PUT /cows/:id` - Actualizar vaca
- `DELETE /cows/:id` - Desactivar vaca (soft delete)

**Estadísticas retornadas:**
- Total de vacas activas
- Distribución por raza
- Distribución por estado (lactante, preñada, seca)
- Promedio de producción diaria

#### Milkings Module

**3 Tipos de Ordeño:**

1. **Rápido (Rapid):**
   - Entrada: cantidad total de litros + número de vacas
   - Sin trazabilidad individual
   - Uso: control rápido de producción diaria

2. **Individual:**
   - Entrada detallada por vaca
   - Crea registros en `individual_milkings`
   - Trazabilidad completa

3. **Masivo (Massive):**
   - Múltiples vacas con cantidad total
   - Calcula promedio automático por vaca
   - Producción en lotes

**Endpoints:**
- `POST /milkings/rapid` - Ordeño rápido
- `POST /milkings/individual` - Ordeño individual
- `POST /milkings/massive` - Ordeño masivo
- `GET /milkings` - Listar ordeños
- `GET /milkings/cow/:cowId/history` - Historial de vaca
- `GET /milkings/stats/daily?date=YYYY-MM-DD` - Estadísticas diarias

**DTOs:**

```typescript
class CreateMilkingRapidDto {
  @IsIn(['AM', 'PM']) shift: string;
  @IsInt() @Min(1) cowCount: number;
  @IsNumber() @Min(0) totalLiters: number;
  @IsDateString() milkingDate: string;
  @IsString() milkingTime: string;
  @IsOptional() notes?: string;
}

class CreateMilkingIndividualDto {
  @IsIn(['AM', 'PM']) shift: string;
  @IsArray() @ValidateNested({ each: true })
  cows: CowMilkingDto[];
  @IsDateString() milkingDate: string;
  @IsString() milkingTime: string;
  @IsOptional() notes?: string;
}
```

#### Quality Module

**Parámetros de Calidad:**
- Porcentaje de grasa (fat_percentage)
- Porcentaje de proteína (protein_percentage)
- UFC - Unidades Formadoras de Colonias (ufc)
- Acidez (acidity)
- Lactosa (lactose)

**Endpoints:**
- `POST /quality/tests` - Crear prueba
- `GET /quality/tests` - Listar pruebas
- `GET /quality/stats` - Estadísticas (promedios)

#### Inventory Module

**Categorías:**
- FRESH_MILK - Leche fresca
- PROCESSING - En proceso
- STORED - Almacenada

**Estados:**
- COLD - Fría (refrigerada)
- HOT - Caliente
- PROCESS - En proceso

**Tipos de Movimiento:**
- IN - Entrada
- OUT - Salida
- ADJUSTMENT - Ajuste

**Endpoints:**
- `POST /inventory` - Crear item
- `GET /inventory` - Listar items
- `GET /inventory/stats` - Estadísticas (litros fríos/calientes, por categoría)
- `POST /inventory/movements` - Crear movimiento (actualiza cantidad automáticamente)
- `GET /inventory/movements` - Historial de movimientos

#### Deliveries Module

**Estados de Entrega:**
- PENDING - Pendiente
- IN_PROGRESS - En camino
- COMPLETED - Completada
- CANCELLED - Cancelada

**Endpoints:**
- `POST /deliveries` - Crear entrega
- `GET /deliveries` - Listar (filtros: status, date)
- `PATCH /deliveries/:id/status` - Cambiar estado
- `GET /deliveries/stats` - Estadísticas

#### Dashboard Module

**Endpoints:**
- `GET /dashboard/summary` - Resumen ejecutivo
- `GET /dashboard/metrics` - Métricas detalladas

**Datos del Summary:**
- Producción de hoy (total litros, turnos AM/PM)
- Top 5 vacas productoras
- Últimos 10 ordeños
- Alertas críticas
- Eficiencia por vaca/empleado

### 3.4 Rutas API (Path Aliases)

```json
{
  "paths": {
    "@/*": ["src/*"],
    "@config/*": ["src/config/*"],
    "@common/*": ["src/common/*"],
    "@database/*": ["src/database/*"],
    "@modules/*": ["src/modules/*"]
  }
}
```

### 3.5 Supabase Service

```typescript
@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
```

---

## 4. Frontend - Documentación Completa

### 4.1 Navegación con Expo Router

Tramuu usa **Expo Router** con navegación basada en archivos (file-based routing).

#### Estructura de Rutas

```
app/
├── index.jsx                    → /
├── login.jsx                    → /login
├── typeRegister.jsx             → /typeRegister
├── register/
│   ├── company.jsx              → /register/company
│   └── employee.jsx             → /register/employee
├── (tabs)/
│   ├── index.jsx                → /(tabs)
│   ├── management.jsx           → /(tabs)/management
│   ├── quality.jsx              → /(tabs)/quality
│   ├── inventory.jsx            → /(tabs)/inventory
│   └── deliveries.jsx           → /(tabs)/deliveries
├── milkingRecord.jsx            → /milkingRecord
├── configurationProfile.jsx     → /configurationProfile
├── notifications.jsx            → /notifications
└── reports.jsx                  → /reports
```

#### Root Layout

```javascript
export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
```

#### Tabs Layout

```javascript
<Tabs
  screenOptions={{
    headerShown: true,
    header: () => <HeaderUser />,
    tabBarStyle: {
      backgroundColor: '#FFF',
      borderTopLeftRadius: 20,
      height: 80,
    },
  }}
>
  <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
  <Tabs.Screen name="management" options={{ title: 'Gestión' }} />
  <Tabs.Screen name="quality" options={{ title: 'Calidad' }} />
  <Tabs.Screen name="inventory" options={{ title: 'Inventario' }} />
  <Tabs.Screen name="deliveries" options={{ title: 'Entregas' }} />
</Tabs>
```

### 4.2 Capa de Servicios

#### API Client (services/api/apiClient.js)

```javascript
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Agrega token automáticamente
apiClient.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Maneja errores y refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401: Token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        await tokenStorage.saveToken(accessToken);

        // Reintentar request original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await tokenStorage.clearAll();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

#### Auth Service (services/auth/auth.service.js)

```javascript
class AuthService {
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    const { accessToken, refreshToken, user } = response.data.data;

    // Guardar tokens y usuario
    await tokenStorage.saveToken(accessToken);
    await tokenStorage.saveRefreshToken(refreshToken);
    await tokenStorage.saveUser(user);

    return response.data.data;
  }

  async registerCompany(companyData) {
    const response = await api.post(
      API_ENDPOINTS.AUTH.REGISTER_COMPANY,
      companyData
    );

    const { accessToken, refreshToken, user } = response.data.data;

    await tokenStorage.saveToken(accessToken);
    await tokenStorage.saveRefreshToken(refreshToken);
    await tokenStorage.saveUser(user);

    return response.data.data;
  }

  async logout() {
    await tokenStorage.clearAll();
  }
}

export default new AuthService();
```

#### Otros Servicios

Cada módulo tiene su servicio correspondiente:
- `dashboardService` - Métricas y resumen
- `cowsService` - Gestión de vacas
- `milkingsService` - Registro de ordeños
- `qualityService` - Pruebas de calidad
- `inventoryService` - Gestión de inventario
- `deliveriesService` - Entregas
- `companiesService` - Perfil de empresa
- `employeesService` - Gestión de empleados

Todos siguen el mismo patrón:

```javascript
class ServiceName {
  async getAll(params = {}) {
    const response = await api.get(ENDPOINT, { params });
    return response.data.data || response.data;
  }

  async getById(id) {
    const response = await api.get(ENDPOINT(id));
    return response.data.data || response.data;
  }

  async create(data) {
    const response = await api.post(ENDPOINT, data);
    return response.data.data || response.data;
  }

  // ... update, delete, etc.
}
```

### 4.3 Componentes Reutilizables

#### SimpleButton

```javascript
export default function SimpleButton({
  onPress,
  children,
  addStylesButton,
  disabled
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, addStylesButton]}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
}
```

#### InputField

```javascript
export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}
```

#### CowCard

```javascript
export default function CowCard({ cow }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.id}>{cow.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: cow.statusColor }]}>
          <Text style={styles.statusText}>{cow.status}</Text>
        </View>
      </View>
      <Text style={styles.breed}>{cow.breed}</Text>
      <View style={styles.stats}>
        <Text>Producción: {cow.production}</Text>
        <Text>Edad: {cow.age}</Text>
      </View>
    </View>
  );
}
```

### 4.4 Pantallas Principales

#### Dashboard (tabs/index.jsx)

**Componentes:**
- Métricas principales (2x2 grid)
  - Producción Hoy (litros)
  - Calidad Promedio (%)
  - Entregas Hoy
  - Lecheros Activos
- Gráfico semanal (LineChart)
- Top 5 Vacas Productoras
- Alertas Críticas
- Estado de Inventario

**Carga de datos:**

```javascript
const loadDashboardData = async () => {
  try {
    setLoading(true);
    const data = await dashboardService.getSummary();

    setDashboardData({
      produccionHoy: {
        value: `${data.todayProduction}L`,
        change: data.productionChange,
        isPositive: true
      },
      calidadPromedio: {
        value: `${data.averageQuality}%`,
        label: data.qualityLabel
      },
      // ... más métricas
    });
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useFocusEffect(
  useCallback(() => {
    loadDashboardData();
  }, [])
);
```

#### Gestión de Vacas (tabs/management.jsx)

**Características:**
- Búsqueda en tiempo real
- Filtros por raza y estado
- Lista con scroll infinito
- Pull-to-refresh
- Botón flotante para agregar vaca

```javascript
const loadCows = async () => {
  try {
    const data = await cowsService.getCows({
      search: searchText || undefined,
      breed: selectedBreed || undefined,
      status: selectedStatus || undefined
    });

    const mappedCows = data.cows.map(cow => ({
      id: cow.id,
      status: cow.status,
      breed: cow.breed,
      production: `${cow.averageProduction}L`,
      age: `${cow.age} años`,
      statusColor: cow.status === 'Preñada' ? '#10B981' : '#F59E0B',
    }));

    setCowsData(mappedCows);
  } catch (err) {
    setError(err.message);
  }
};
```

#### Registro de Ordeño (milkingRecord.jsx)

**3 Modos de Registro:**

1. **Rápido:**
   - Número de vacas
   - Litros totales

2. **Individual:**
   - Seleccionar vaca (CowSelector)
   - Ingresar litros por vaca
   - Registrar

3. **Masivo:**
   - Seleccionar múltiples vacas
   - Tabla con inputs de litros
   - Cálculo automático de total
   - Registrar todo en batch

**Componentes:**
- Selector de turno (AM/PM)
- Selector de fecha y hora
- CowSelector (modal)
- Tabla de vacas seleccionadas
- Input de notas

#### Pruebas de Calidad (tabs/quality.jsx)

**3 Pestañas:**

1. **Pruebas (Nueva Prueba):**
   - Formulario con parámetros:
     - Grasa (%)
     - Proteína (%)
     - Lactosa (%)
     - UFC
     - Acidez (pH)
   - Foto del ensayo (cámara)
   - Observaciones
   - Botón "Registrar Prueba"

2. **Historial:**
   - Lista de pruebas anteriores
   - Fecha, parámetros, notas

3. **Alertas:**
   - Alertas automáticas basadas en rangos
   - Grasa < 3.0% → Warning
   - UFC > 100,000 → Critical

### 4.5 Almacenamiento Local (AsyncStorage)

```javascript
// Keys usadas
@tramuu_access_token       // Token JWT
@tramuu_refresh_token      // Refresh token
@tramuu_user               // Datos del usuario (JSON)

// TokenStorage Service
class TokenStorage {
  async saveToken(token) {
    await AsyncStorage.setItem('@tramuu_access_token', token);
  }

  async getToken() {
    return await AsyncStorage.getItem('@tramuu_access_token');
  }

  async saveUser(user) {
    await AsyncStorage.setItem('@tramuu_user', JSON.stringify(user));
  }

  async getUser() {
    const user = await AsyncStorage.getItem('@tramuu_user');
    return user ? JSON.parse(user) : null;
  }

  async clearAll() {
    await AsyncStorage.multiRemove([
      '@tramuu_access_token',
      '@tramuu_refresh_token',
      '@tramuu_user'
    ]);
  }
}
```

---

## 5. Integración Frontend-Backend

### 5.1 Endpoints y Servicios

| Backend Endpoint | Frontend Service | Pantalla |
|------------------|------------------|----------|
| `POST /auth/login` | `authService.login()` | login.jsx |
| `POST /auth/register/company` | `authService.registerCompany()` | register/company.jsx |
| `GET /dashboard/summary` | `dashboardService.getSummary()` | (tabs)/index.jsx |
| `GET /cows` | `cowsService.getCows()` | (tabs)/management.jsx |
| `POST /milkings/rapid` | `milkingsService.createRapidMilking()` | milkingRecord.jsx |
| `POST /quality/tests` | `qualityService.createQualityTest()` | (tabs)/quality.jsx |
| `GET /inventory/stats` | `inventoryService.getStatistics()` | (tabs)/inventory.jsx |
| `POST /deliveries` | `deliveriesService.createDelivery()` | (tabs)/deliveries.jsx |

### 5.2 Flujo de Request Completo

```
1. Usuario hace acción (ej: login)
   ↓
2. Pantalla llama a servicio
   authService.login(email, password)
   ↓
3. Servicio llama a api.post()
   ↓
4. apiClient.interceptors.request.use()
   - Obtiene token de AsyncStorage
   - Agrega Authorization header
   ↓
5. Request HTTP a backend
   POST http://192.168.1.X:3000/api/auth/login
   ↓
6. Backend procesa
   - Valida datos
   - Verifica credenciales
   - Genera JWT
   ↓
7. Backend responde
   { success: true, data: { accessToken, user } }
   ↓
8. apiClient.interceptors.response.use()
   - Si 200: retornar data
   - Si 401: intentar refresh token
   - Si error: formatear error
   ↓
9. Servicio retorna datos
   ↓
10. Pantalla actualiza estado
    setUser(data.user)
    ↓
11. Navegación
    router.replace('/(tabs)')
```

### 5.3 Manejo de Errores

```javascript
// En servicios
try {
  const response = await api.post(endpoint, data);
  return response.data.data || response.data;
} catch (error) {
  console.error('Error:', error);
  throw error;
}

// En componentes
try {
  await service.method();
} catch (err) {
  // Opciones:
  Alert.alert('Error', err.message);
  // o
  setError(err.message);
  // o
  Toast.show({ text: err.message });
}
```

---

## 6. Base de Datos

### 6.1 Tablas Principales

```sql
-- Usuarios (autenticación)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL, -- 'company' o 'employee'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Empresas
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  nit_id VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  invitation_code VARCHAR(8) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Empleados
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vacas
CREATE TABLE cows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  cow_id VARCHAR(50) NOT NULL,
  name VARCHAR(100),
  breed VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  date_of_birth DATE,
  daily_production DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, cow_id)
);

-- Ordeños (maestro)
CREATE TABLE milkings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  employee_id UUID REFERENCES employees(id),
  milking_type VARCHAR(20) NOT NULL, -- 'rapid', 'individual', 'massive'
  shift VARCHAR(2) NOT NULL, -- 'AM' o 'PM'
  cow_count INTEGER NOT NULL,
  total_liters DECIMAL(10,2) NOT NULL,
  milking_date DATE NOT NULL,
  milking_time TIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ordeños individuales (detalle)
CREATE TABLE individual_milkings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milking_id UUID NOT NULL REFERENCES milkings(id) ON DELETE CASCADE,
  cow_id UUID NOT NULL REFERENCES cows(id),
  liters DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pruebas de calidad
CREATE TABLE quality_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  milking_id UUID REFERENCES milkings(id),
  test_id VARCHAR(50) NOT NULL,
  fat_percentage DECIMAL(5,2),
  protein_percentage DECIMAL(5,2),
  lactose_percentage DECIMAL(5,2),
  ufc INTEGER,
  acidity DECIMAL(5,2),
  observations TEXT,
  test_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, test_id)
);

-- Inventario
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  batch_id VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'FRESH_MILK', 'PROCESSING', 'STORED'
  status VARCHAR(50) NOT NULL, -- 'COLD', 'HOT', 'PROCESS'
  milking_id UUID REFERENCES milkings(id),
  location VARCHAR(255),
  notes TEXT,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, batch_id)
);

-- Movimientos de inventario
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  inventory_item_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'IN', 'OUT', 'ADJUSTMENT'
  quantity DECIMAL(10,2) NOT NULL,
  reason TEXT,
  notes TEXT,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Entregas
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(20),
  delivery_address TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  assigned_employee_id UUID REFERENCES employees(id),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  completed_at TIMESTAMP,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6.2 Índices

```sql
-- Usuarios
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);

-- Empresas
CREATE INDEX idx_companies_user ON companies(user_id);
CREATE INDEX idx_companies_code ON companies(invitation_code);

-- Empleados
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_employees_user ON employees(user_id);

-- Vacas
CREATE INDEX idx_cows_company ON cows(company_id);
CREATE INDEX idx_cows_breed ON cows(breed);
CREATE INDEX idx_cows_status ON cows(status);

-- Ordeños
CREATE INDEX idx_milkings_company ON milkings(company_id);
CREATE INDEX idx_milkings_date ON milkings(milking_date);
CREATE INDEX idx_milkings_employee ON milkings(employee_id);

-- Inventario
CREATE INDEX idx_inventory_company ON inventory(company_id);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_status ON inventory(status);

-- Entregas
CREATE INDEX idx_deliveries_company ON deliveries(company_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_date ON deliveries(scheduled_date);
```

### 6.3 Relaciones

```
users (1) ──► (1) companies
users (1) ──► (1) employees

companies (1) ──► (N) employees
companies (1) ──► (N) cows
companies (1) ──► (N) milkings
companies (1) ──► (N) quality_tests
companies (1) ──► (N) inventory
companies (1) ──► (N) deliveries

milkings (1) ──► (N) individual_milkings
milkings (1) ──► (N) quality_tests
milkings (1) ──► (N) inventory

cows (1) ──► (N) individual_milkings

employees (1) ──► (N) milkings (created)
employees (1) ──► (N) inventory (created)
employees (1) ──► (N) deliveries (assigned)
```

---

## 7. Flujos de Trabajo Principales

### 7.1 Flujo de Registro de Empresa

```
1. Usuario abre app
   ↓
2. Splash screen (index.jsx)
   ↓
3. Click "Comenzar"
   ↓
4. Login (login.jsx)
   ↓
5. Click "Registrar"
   ↓
6. Type Register (typeRegister.jsx)
   ↓
7. Click "Empresa"
   ↓
8. Registro Empresa (register/company.jsx)
   - Nombre: "Lacteos S.A"
   - NIT: "800197268-4"
   - Email: "admin@lacteos.com"
   - Contraseña: "******"
   ↓
9. Click "Registrar"
   ↓
10. Validaciones locales
    - Nombre no vacío
    - NIT no vacío
    - Email válido
    - Password >= 6 caracteres
    ↓
11. POST /auth/register/company
    {
      name, nitId, email, password
    }
    ↓
12. Backend valida y crea:
    - Usuario en tabla users
    - Empresa en tabla companies
    - Genera código de invitación
    - Genera JWT
    ↓
13. Response
    {
      accessToken: "jwt...",
      user: { id, email, userType: "company" },
      company: { id, name, invitationCode }
    }
    ↓
14. Frontend guarda:
    - Token en AsyncStorage
    - User en AsyncStorage
    ↓
15. router.replace("/(tabs)")
    ↓
16. Dashboard carga datos
```

### 7.2 Flujo de Registro de Ordeño (Masivo)

```
1. Usuario en Dashboard
   ↓
2. Click ícono "+" (HeaderUser)
   ↓
3. milkingRecord.jsx
   ↓
4. Seleccionar modo "Masivo"
   ↓
5. Seleccionar turno (AM/PM)
   ↓
6. Click "Agregar Vacas"
   ↓
7. CowSelector modal
   - Lista de vacas
   - Checkboxes
   ↓
8. Seleccionar vacas (3 vacas)
   ↓
9. Click "Confirmar"
   ↓
10. Modal cierra
    - Tabla muestra vacas seleccionadas
    ↓
11. Para cada vaca, ingresar litros:
    - Vaca 001: 28.5 L
    - Vaca 002: 25.3 L
    - Vaca 003: 22.1 L
    - Total: 75.9 L (auto-calculado)
    ↓
12. Opcional: Agregar notas
    ↓
13. Click "Registrar Ordeño"
    ↓
14. Validaciones:
    - ¿Hay vacas? SI
    - ¿Todas tienen litros > 0? SI
    ↓
15. POST /milkings/massive
    {
      date: "2024-10-22",
      shift: "AM",
      cowIds: ["uuid1", "uuid2", "uuid3"],
      totalLiters: 75.9
    }
    ↓
16. Backend procesa:
    - Crea registro en milkings
    - Crea registros en individual_milkings
    - Actualiza producción de vacas
    ↓
17. Response exitosa
    ↓
18. Alert "Registro exitoso"
    ↓
19. Limpiar formulario
    ↓
20. router.back() → Dashboard
    ↓
21. Dashboard recarga datos
```

### 7.3 Flujo de Prueba de Calidad

```
1. Usuario en Tabs → Calidad
   ↓
2. Tab "Pruebas"
   ↓
3. Formulario de parámetros:
   - Grasa: 3.25 %
   - Proteína: 3.10 %
   - Lactosa: 4.80 %
   - UFC: 50000
   - Acidez: 6.8
   - Observaciones: "..."
   ↓
4. Click "Registrar Prueba"
   ↓
5. Validaciones:
   - Todos los campos requeridos completos
   ↓
6. POST /quality/tests
   {
     fat: 3.25,
     protein: 3.10,
     lactose: 4.80,
     ufc: 50000,
     acidity: 6.8,
     notes: "...",
     date: "2024-10-22"
   }
   ↓
7. Backend valida rangos:
   - Grasa: OK (3.0-4.5%)
   - Proteína: OK (2.8-3.5%)
   - UFC: OK (<100,000)
   ↓
8. Crea registro en quality_tests
   ↓
9. Response exitosa
   ↓
10. Alert "Registro exitoso"
    ↓
11. Cambiar a tab "Historial"
    - Nueva prueba aparece
    ↓
12. Tab "Alertas"
    - Sistema verifica parámetros
    - Si fuera de rango → genera alerta
```

### 7.4 Flujo de Entrega

```
1. Usuario en Tabs → Entregas
   ↓
2. Tab "Programar"
   ↓
3. Seleccionar fecha en calendario
   ↓
4. Formulario:
   - Cliente: "Lechería Central"
   - Cantidad: 100 L
   - Hora: 10:00
   - Dirección: "Cra 5 No. 10-20"
   - Lechero: (seleccionar de dropdown)
   - Notas: "..."
   ↓
5. Click "Programar Entrega"
   ↓
6. POST /deliveries
   {
     clientName: "Lechería Central",
     deliveryAddress: "Cra 5 No. 10-20",
     quantity: 100,
     scheduledDate: "2024-10-22",
     scheduledTime: "10:00",
     assignedEmployeeId: "uuid",
     notes: "..."
   }
   ↓
7. Backend crea registro:
   - status: "PENDING"
   ↓
8. Response exitosa
   ↓
9. Alert "Entrega programada"
   ↓
10. Recarga lista de entregas
    - Nueva entrega aparece
    ↓
11. Cuando lechero sale:
    Tab "Entregar"
    Click en entrega
    → Cambiar estado a "IN_PROGRESS"
    ↓
12. Al completar:
    → Cambiar estado a "COMPLETED"
    - Backend registra completed_at
```

---

## 8. Guía de Desarrollo

### 8.1 Setup Local

#### Prerrequisitos
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL o cuenta de Supabase
- Expo CLI
- Android Studio / Xcode (opcional)

#### Backend Setup

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd TramuuApp/Backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Ejecutar migraciones SQL en Supabase
# (Ver scripts en Backend/README.md)

# 5. Iniciar servidor
npm run start:dev

# 6. Verificar
curl http://localhost:3000/api
# Swagger: http://localhost:3000/api/docs
```

#### Frontend Setup

```bash
# 1. Ir a directorio frontend
cd TramuuApp/tramuu-app

# 2. Instalar dependencias
npm install

# 3. Configurar .env
echo "API_URL=http://192.168.1.X:3000/api" > .env
echo "NODE_ENV=development" >> .env

# 4. Iniciar Expo
npm start

# 5. Opciones:
# - Presionar 'a' para Android
# - Presionar 'i' para iOS
# - Presionar 'w' para Web
# - Escanear QR con Expo Go en dispositivo físico
```

### 8.2 Estructura de un Módulo Backend

```
modules/nombre-modulo/
├── nombre-modulo.controller.ts    # Endpoints
├── nombre-modulo.service.ts       # Lógica de negocio
├── nombre-modulo.module.ts        # Módulo NestJS
└── dto/
    ├── create-nombre.dto.ts       # DTO para crear
    └── update-nombre.dto.ts       # DTO para actualizar
```

**Ejemplo: Crear nuevo módulo "Reports"**

```typescript
// reports.module.ts
@Module({
  controllers: [ReportsController],
  providers: [ReportsService, SupabaseService],
})
export class ReportsModule {}

// reports.controller.ts
@Controller('reports')
@ApiTags('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  async getReports(@CurrentUser() user: JwtPayload) {
    return this.reportsService.findAll(user.companyId);
  }
}

// reports.service.ts
@Injectable()
export class ReportsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('company_id', companyId);

    return data;
  }
}
```

### 8.3 Agregar Nueva Pantalla Frontend

```bash
# 1. Crear archivo en app/
touch tramuu-app/app/nueva-pantalla.jsx

# 2. Implementar
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function NuevaPantalla() {
  const router = useRouter();

  return (
    <View>
      <Text>Nueva Pantalla</Text>
    </View>
  );
}

# 3. Navegar desde otra pantalla
router.push('/nueva-pantalla');
```

### 8.4 Agregar Nuevo Servicio Frontend

```javascript
// services/nombre/nombre.service.js
import { api } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

class NombreService {
  async getAll(params = {}) {
    const response = await api.get(API_ENDPOINTS.NOMBRE.LIST, { params });
    return response.data.data || response.data;
  }

  async create(data) {
    const response = await api.post(API_ENDPOINTS.NOMBRE.CREATE, data);
    return response.data.data || response.data;
  }
}

export default new NombreService();

// Agregar endpoints en api.config.js
export const API_ENDPOINTS = {
  // ...
  NOMBRE: {
    LIST: '/nombre',
    CREATE: '/nombre',
  }
};

// Exportar en services/index.js
export { default as nombreService } from './nombre/nombre.service';
```

### 8.5 Testing

#### Backend

```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests e2e
npm run test:e2e

# Watch mode
npm run test:watch
```

#### Frontend

```bash
# Ejecutar tests (configurar Jest primero)
npm test
```

### 8.6 Build y Deploy

#### Backend

```bash
# Build
npm run build

# Producción
npm run start:prod

# Deploy (ejemplo con PM2)
pm2 start dist/main.js --name tramuu-api
```

#### Frontend

```bash
# Development build
npx eas build --platform android --profile development
npx eas build --platform ios --profile development

# Production build
npx eas build --platform android --profile production
npx eas build --platform ios --profile production

# Submit a stores
npx eas submit --platform android
npx eas submit --platform ios
```

---

## 9. Troubleshooting

### 9.1 Backend no inicia

**Síntoma:** Error al iniciar servidor

**Soluciones:**
```bash
# 1. Verificar variables de entorno
cat .env
# Asegurar que existan todas las keys

# 2. Verificar Supabase
curl https://your-project.supabase.co
# Debe responder

# 3. Verificar puerto
lsof -i :3000
# Si está ocupado, cambiar PORT en .env

# 4. Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### 9.2 App no conecta al backend

**Síntoma:** Errores de red en la app

**Soluciones:**
```javascript
// 1. Verificar API_URL en .env
// Debe ser la IP de tu computadora, no localhost
API_URL=http://192.168.1.100:3000/api

// 2. Verificar que ambos dispositivos estén en la misma red WiFi

// 3. Verificar que backend esté corriendo
curl http://192.168.1.100:3000/api
// Debe responder

// 4. En desarrollo, permitir todas las origins en backend
// main.ts
app.enableCors({ origin: '*' });

// 5. Verificar firewall
# Windows: Permitir Node.js en Firewall
# macOS: Permitir conexiones en Preferencias del Sistema
```

### 9.3 Errores de autenticación

**Síntoma:** Token inválido, 401 Unauthorized

**Soluciones:**
```javascript
// 1. Limpiar AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();

// 2. Verificar JWT_SECRET en backend
// Debe ser el mismo en desarrollo y producción

// 3. Verificar expiración
// JWT_EXPIRES_IN en .env

// 4. Verificar interceptor de Axios
// services/api/apiClient.js
// Debe agregar token correctamente

// 5. Debug token
const token = await tokenStorage.getToken();
console.log('Token:', token);
```

### 9.4 Errores de build (Frontend)

**Síntoma:** Build falla en Expo

**Soluciones:**
```bash
# 1. Limpiar caché
npx expo start -c

# 2. Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# 3. Verificar versiones compatibles
# package.json debe tener versiones correctas

# 4. Si error de Metro
watchman watch-del-all
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# 5. iOS: Limpiar pods
cd ios
pod install --repo-update
cd ..
```

### 9.5 Performance issues

**Síntoma:** App lenta, lag

**Soluciones:**
```javascript
// 1. Usar React.memo para componentes pesados
const CowCard = React.memo(({ cow }) => {
  // ...
});

// 2. Usar useMemo para cálculos costosos
const filteredCows = useMemo(() => {
  return cows.filter(cow => cow.breed === selectedBreed);
}, [cows, selectedBreed]);

// 3. Usar FlatList en lugar de ScrollView para listas largas
<FlatList
  data={cows}
  renderItem={({ item }) => <CowCard cow={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>

// 4. Optimizar imágenes
// Usar expo-image en lugar de Image

// 5. Deshabilitar animaciones innecesarias
```

---

## 10. Roadmap y Mejoras Futuras

### 10.1 Features Planificados

#### Fase 1 (Corto plazo)
- [ ] Notificaciones push con Expo Notifications
- [ ] Modo offline con sincronización (SQLite local)
- [ ] Exportar reportes a PDF
- [ ] Gráficas avanzadas (tendencias, predicciones)
- [ ] Filtros avanzados en todas las pantallas
- [ ] Paginación en listas largas

#### Fase 2 (Mediano plazo)
- [ ] Panel web administrativo (React)
- [ ] Integración con IoT (sensores de temperatura, peso)
- [ ] Sistema de alertas automáticas (SMS, WhatsApp)
- [ ] Módulo de finanzas (costos, ingresos)
- [ ] Módulo de alimentación de ganado
- [ ] Módulo de sanidad animal (vacunas, tratamientos)

#### Fase 3 (Largo plazo)
- [ ] Machine Learning para predicción de producción
- [ ] Geolocalización de entregas
- [ ] Chat en tiempo real entre empresa y empleados
- [ ] Integración con sistemas contables (facturación)
- [ ] Multi-idioma (español, inglés, portugués)
- [ ] Dark mode completo

### 10.2 Mejoras Técnicas

#### Backend
- [ ] Implementar caché con Redis
- [ ] Agregar rate limiting
- [ ] Implementar logging con Winston
- [ ] Agregar monitoreo con Sentry
- [ ] Tests de integración completos
- [ ] Documentación OpenAPI completa
- [ ] Optimización de queries con índices

#### Frontend
- [ ] Migrar a TypeScript completo
- [ ] Implementar React Query para caché
- [ ] Agregar tests con Jest + Testing Library
- [ ] Optimizar bundle size
- [ ] Implementar Suspense y Error Boundaries
- [ ] Mejorar accesibilidad (a11y)

### 10.3 Seguridad

- [ ] Implementar 2FA (autenticación de dos factores)
- [ ] Encriptación de datos sensibles en AsyncStorage
- [ ] Auditoría de dependencias (npm audit)
- [ ] Implementar CSP (Content Security Policy)
- [ ] Logs de auditoría (quién hizo qué y cuándo)
- [ ] Rate limiting por usuario
- [ ] Validación de archivos subidos

---

## Conclusión

Este documento proporciona una visión completa del proyecto Tramuu. Para contextos futuros con Claude Code:

**Estructura:**
- Backend: NestJS con 9 módulos (Auth, Companies, Employees, Cows, Milkings, Quality, Inventory, Deliveries, Dashboard)
- Frontend: React Native + Expo Router con navegación basada en archivos
- Base de datos: PostgreSQL (Supabase) con 8 tablas principales

**Autenticación:**
- JWT con refresh tokens
- Guards globales en backend
- Interceptores de Axios en frontend
- AsyncStorage para persistencia

**Flujos principales:**
- Registro de empresa/empleado
- Login y autenticación
- Registro de ordeños (3 modos)
- Control de calidad
- Gestión de inventario
- Programación de entregas

**Ubicación de archivos clave:**
- Backend: `Backend/src/modules/`
- Frontend: `tramuu-app/app/` y `tramuu-app/services/`
- Base de datos: Supabase (PostgreSQL)

Para desarrollo futuro, consultar las secciones de Guía de Desarrollo y Troubleshooting.

---

**Última actualización:** 2025-10-22
**Versión:** 1.0.0
**Generado para:** Claude Code
