# Tramuu App - Frontend

Aplicación móvil de Tramuu - Sistema de gestión para lecherías desarrollada con React Native y Expo.

## Descripción

Aplicación móvil multiplataforma (iOS y Android) que permite a productores lecheros gestionar su producción diaria, inventario, entregas, empleados y control de calidad de manera eficiente desde dispositivos móviles.

## Tecnologías

* **Framework**: React Native con Expo SDK ~54.0.13
* **Navegación**: Expo Router ~6.0.11
* **Lenguaje**: JavaScript/JSX
* **UI**: Componentes nativos de React Native
* **Iconos**: Lucide React Native
* **Gráficas**: react-native-chart-kit
* **HTTP Client**: Axios
* **Storage**: AsyncStorage
* **Animaciones**: react-native-reanimated ~4.1.1
* **Gestos**: react-native-gesture-handler ~2.28.0

## Requisitos Previos

* Node.js >= 18.x
* npm >= 9.x
* Expo CLI
* Cuenta de Expo (opcional, para builds)
* Android Studio (para desarrollo Android)
* Xcode (para desarrollo iOS, solo en macOS)

## Instalación

1. Ir al directorio del frontend:

```bash
cd tramuu-app
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Crear un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
API_URL=http://192.168.1.X:3000/api

# Environment
NODE_ENV=development
```

Reemplaza `192.168.1.X` con la IP de tu computadora si vas a probar en un dispositivo físico.
Para emuladores:

* Android: `http://10.0.2.2:3000/api`
* iOS: `http://localhost:3000/api`

## Ejecución

### Iniciar el servidor de desarrollo

```bash
npm start
```

Esto abrirá Expo Dev Tools. Desde ahí puedes:

### Ejecutar en Android

```bash
npm run android
```

### Ejecutar en iOS (solo macOS)

```bash
npm run ios
```

### Ejecutar en Web

```bash
npm run web
```

## Instalación en Dispositivo Físico

1. Instalar **Expo Go** desde:

   * Google Play Store (Android)
   * App Store (iOS)
2. Escanear el código QR que aparece en la terminal después de `npm start`
3. Asegúrate de que el dispositivo y tu computadora estén en la misma red Wi-Fi

## Estructura del Proyecto

```
tramuu-app/
├── app/                          
│   ├── (tabs)/                   
│   │   ├── index.jsx             
│   │   ├── management.jsx        
│   │   ├── quality.jsx           
│   │   ├── inventory.jsx         
│   │   └── deliveries.jsx        
│   ├── register/                 
│   │   ├── company.jsx           
│   │   └── employee.jsx          
│   ├── _layout.jsx               
│   ├── index.jsx                 
│   ├── login.jsx                 
│   ├── typeRegister.jsx          
│   ├── cowDetails.jsx            
│   ├── milkingRecord.jsx         
│   └── cowForm.jsx               
├── components/                   
│   ├── ui/                       
│   │   ├── SimpleButton.jsx
│   │   ├── InputForm.jsx
│   │   ├── ToggleSwitch.jsx
│   │   └── ...
│   ├── dashboard/                
│   │   ├── CompanyDashboard.jsx
│   │   └── EmployeeDashboard.jsx
│   ├── configuration/            
│   │   ├── ConfigurationCompany.jsx
│   │   └── ChangePasswordModal.jsx
│   └── ...
├── services/                     
│   ├── config/
│   │   └── api.config.js         
│   ├── api/
│   │   └── apiClient.js          
│   ├── storage/
│   │   └── tokenStorage.js       
│   ├── auth/
│   │   └── auth.service.js       
│   ├── dashboard/
│   ├── cows/
│   ├── milkings/
│   ├── quality/
│   ├── inventory/                
│   ├── deliveries/               
│   ├── companies/                
│   ├── employees/                
│   └── index.js                  
├── constants/                    
│   └── theme.ts                  
├── assets/                       
│   ├── images/
│   └── fonts/
├── .env                          
├── app.json                      
├── package.json                  
└── tsconfig.json                 
```

## Arquitectura

### Navegación

La app usa **Expo Router** con navegación basada en archivos:

* Splash: `index.jsx`
* Flujo de autenticación: `login.jsx` → `typeRegister.jsx` → `register/(company|employee).jsx`
* App principal (Tabs):

  * Dashboard
  * Gestión de Vacas
  * Control de Calidad
  * Inventario
  * Entregas

### Servicios

Cada módulo del backend tiene su servicio correspondiente:

```javascript
import { authService, cowsService, inventoryService } from '@/services';

const { user, accessToken } = await authService.login(email, password);
const items = await inventoryService.getItems();
await deliveriesService.createDelivery(deliveryData);
```

### Gestión de Estado

* Local State: `useState`
* Persistent Storage: AsyncStorage
* API Integration: Servicios modulares con Axios

### Path Aliases

```javascript
import { SimpleButton } from '@/components/ui';
import { authService } from '@/services';
```

## Autenticación

1. El usuario inicia sesión y obtiene un token JWT
2. El token se guarda en AsyncStorage
3. Un interceptor de Axios agrega el token a todas las peticiones
4. Se renueva el token automáticamente cuando expira

## Pantallas Principales

### Dashboard

* Métricas de producción
* Gráficas de tendencias
* Alertas importantes
* Acciones rápidas

### Gestión de Vacas

* Lista con búsqueda
* Agregar/editar vacas
* Detalles e historial de producción
* Estadísticas por vaca

### Registro de Ordeño

* Ordeño rápido, individual o masivo
* Selección de turno y fecha

### Control de Calidad

* Registro de pruebas
* Estadísticas y alertas

### Inventario

* Estado de bodega
* Lotes activos
* Historial de movimientos
* Alertas de stock bajo

### Entregas

* Programar entregas
* Entregas activas
* Gestión de clientes
* Asignación de lecheros

### Configuración

* Perfil de empresa/empleado
* Gestión de empleados
* Códigos de invitación
* Cambio de contraseña

## Temas y Estilos

Sistema de temas centralizado en `constants/theme.ts`:

```javascript
import { Colors, Fonts } from '@/constants/theme';

const styles = StyleSheet.create({
  text: {
    color: Colors.light.text,
    fontFamily: Fonts.regular,
  }
});
```

### Responsive Design

Usa dimensiones dinámicas del dispositivo:

```javascript
const { width, height } = Dimensions.get('window');
```

## Scripts Disponibles

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
npm run reset-project
```

## Configuración Adicional

### Expo Configuration (`app.json`)

* New Architecture habilitada
* Typed Routes habilitadas
* React Compiler habilitado
* URL Scheme: `tramuuapp://`

### TypeScript/JavaScript

Soporte para ambos.
Los componentes usan JavaScript/JSX, las configuraciones y constantes usan TypeScript.

## Testing

```bash
npm test
```

## Build

### Development Build

```bash
npx eas build --platform android --profile development
npx eas build --platform ios --profile development
```

### Production Build

```bash
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

Requiere cuenta de Expo y configuración de `eas.json`.

## Debugging

### React Native Debugger

1. Instalar React Native Debugger
2. Abrir la app en modo desarrollo
3. Presionar `Cmd+D` (iOS) o `Cmd+M` (Android)
4. Seleccionar "Debug"

### Logs

```bash
npx react-native log-android
npx react-native log-ios
```

## Deployment

### Android (Google Play)

1. Configurar `app.json`
2. Crear build de producción
3. Subir a Google Play Console

### iOS (App Store)

1. Configurar provisioning profiles
2. Crear build de producción
3. Subir a App Store Connect

## Documentación Adicional

* [Expo Documentation](https://docs.expo.dev/)
* [React Native Documentation](https://reactnative.dev/)
* [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
* [INTEGRATION.md](./INTEGRATION.md)

## Seguridad

* Tokens JWT guardados en AsyncStorage
* Refresh automático de tokens
* Validación de formularios
* Manejo seguro de credenciales
* Sin secrets hardcodeados

## Compatibilidad

* iOS: 13.0+
* Android: API 21+ (Android 5.0+)
* Web: Navegadores modernos

## Licencia

Proyecto privado y confidencial.

## Equipo de Desarrollo

Desarrollado para Tramuu - Sistema de Gestión Lechera

## Soporte

Para soporte técnico, contactar al equipo de desarrollo.

---

**Happy Coding!** 🐄🥛
