# 🚀 Tramuu - Información de Deployment

## ✅ Backend Deployado

**URL de Producción:**
```
https://tramuu-backend.onrender.com
```

**Swagger Docs (Documentación API):**
```
https://tramuu-backend.onrender.com/api/docs
```

**Plataforma:** Render.com (Plan Free)
**Repositorio:** https://github.com/IngRetrius/Tramuu-App

---

## 📱 Frontend - Próximos Pasos

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login a Expo

```bash
cd tramuu-app
eas login
```

### 3. Configurar Proyecto

```bash
eas build:configure
```

Esto te dará un `projectId`. Actualiza `app.json`:

```json
"extra": {
  "eas": {
    "projectId": "TU-PROJECT-ID-AQUI"
  }
}
```

### 4. Build de Prueba (APK)

```bash
eas build --platform android --profile preview
```

Esto genera un APK que puedes instalar directamente en tu celular.

### 5. Build de Producción (Para Play Store)

```bash
eas build --platform android --profile production
```

Esto genera un AAB (Android App Bundle) listo para subir a Google Play Store.

---

## 🔐 Credenciales y Accesos

### Render
- Dashboard: https://dashboard.render.com
- Servicio: tramuu-backend
- Plan: Free (se duerme después de 15 min de inactividad)

### Supabase
- URL: https://othigdnkyieeuosilzxz.supabase.co
- Dashboard: https://supabase.com/dashboard

### GitHub
- Repositorio: https://github.com/IngRetrius/Tramuu-App

---

## 📊 Arquitectura Actual

```
┌─────────────────────────────────────────────┐
│         USUARIOS (Android/iOS)              │
└─────────────────┬───────────────────────────┘
                  │
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────┐
│   Backend API (NestJS)                      │
│   https://tramuu-backend.onrender.com       │
│   Render.com (US West)                      │
└─────────────────┬───────────────────────────┘
                  │
                  │ PostgreSQL
                  ▼
┌─────────────────────────────────────────────┐
│   Database (PostgreSQL)                     │
│   Supabase Cloud                            │
└─────────────────────────────────────────────┘
```

---

## ⚠️ Importante

### Variables de Entorno

**Producción (.env):**
```bash
EXPO_PUBLIC_API_URL=https://tramuu-backend.onrender.com/api
NODE_ENV=production
```

**Desarrollo Local (.env.local):**
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.23:3000/api
NODE_ENV=development
```

Para desarrollo local:
1. Renombra `.env.local` a `.env`
2. Inicia el backend local: `cd Backend && npm run start:dev`
3. Inicia la app: `cd tramuu-app && npm start`

---

## 🔄 Actualizar Backend en Producción

Cada vez que hagas cambios en el backend:

```bash
# 1. Commit y push
git add .
git commit -m "descripción del cambio"
git push origin main

# 2. Render detectará el cambio y hará redeploy automático
# Espera 3-5 minutos
```

O desde Render Dashboard:
- Click en "Manual Deploy" → "Deploy latest commit"

---

## 💰 Costos Actuales

| Servicio | Plan | Costo |
|----------|------|-------|
| Render (Backend) | Free | $0/mes |
| Supabase (Database) | Free | $0/mes |
| EAS Build | Free | $0/mes (30 builds/mes) |
| **Total** | - | **$0/mes** |

### Costos Futuros (Opcional)

- Google Play Developer: $25 (una sola vez)
- Apple Developer: $99/año (solo si quieres iOS)
- Render Hobby: $7/mes (si necesitas que no se duerma)
- EAS Build Pro: $29/mes (builds ilimitados)

---

## 📞 Soporte

- **Render Docs**: https://render.com/docs
- **Expo Docs**: https://docs.expo.dev
- **NestJS Docs**: https://docs.nestjs.com
- **Supabase Docs**: https://supabase.com/docs

---

**Última actualización:** 2025-10-24
**Versión Backend:** 1.0.0
**Versión Frontend:** 1.0.0
