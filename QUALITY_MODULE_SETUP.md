# 🧪 Módulo de Pruebas de Calidad - Configuración Completa

## ✅ Cambios Realizados

### Backend
- ✅ Actualizado `CreateQualityTestDto` con campos correctos
- ✅ Generación automática de `testId`
- ✅ Agregados campos: `lactose`, `acidity`, `photo`
- ✅ Mapeo de respuestas al formato del frontend
- ✅ Actualizado método `getStats` con lactosa y acidez

### Frontend
- ✅ Instalado `expo-image-picker`
- ✅ Implementada captura de foto (cámara + galería)
- ✅ Preview de imagen capturada
- ✅ Envío de foto en base64

### Base de Datos
- ✅ Creada migración SQL para agregar columnas faltantes
- ✅ Actualizado `schema.sql`

---

## 🚀 Pasos para Completar la Configuración

### Paso 1: Ejecutar Migración en Supabase

**⚠️ IMPORTANTE:** Debes ejecutar esta migración antes de probar el módulo.

1. Ve a **https://supabase.com/dashboard**
2. Selecciona tu proyecto: `othigdnkyieeuosilzxz`
3. Click en **"SQL Editor"** (menú lateral)
4. Click en **"New query"**
5. Copia y pega este SQL:

```sql
-- Agregar lactose_percentage
ALTER TABLE quality_tests
ADD COLUMN IF NOT EXISTS lactose_percentage DECIMAL(5, 2);

-- Agregar acidity
ALTER TABLE quality_tests
ADD COLUMN IF NOT EXISTS acidity DECIMAL(4, 2);

-- Agregar photo_url
ALTER TABLE quality_tests
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Agregar comentarios
COMMENT ON COLUMN quality_tests.lactose_percentage IS 'Porcentaje de lactosa en la leche';
COMMENT ON COLUMN quality_tests.acidity IS 'Nivel de acidez (pH) de la leche';
COMMENT ON COLUMN quality_tests.photo_url IS 'URL o base64 de la foto del ensayo de calidad';
```

6. Click en **"Run"** o presiona `Ctrl + Enter`
7. Verifica que diga **"Success. No rows returned"**

---

### Paso 2: Verificar la Migración

Ejecuta este query en Supabase SQL Editor:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quality_tests'
ORDER BY ordinal_position;
```

Deberías ver estas columnas:
- `id` → uuid
- `company_id` → uuid
- `milking_id` → uuid
- `test_id` → character varying
- `fat_percentage` → numeric
- `protein_percentage` → numeric
- `lactose_percentage` → numeric ✅ NUEVA
- `ufc` → integer
- `acidity` → numeric ✅ NUEVA
- `observations` → text
- `photo_url` → text ✅ NUEVA
- `test_date` → date
- `created_at` → timestamp

---

### Paso 3: Iniciar Backend Local

```bash
cd Backend
npm run start:dev
```

Verifica que inicie sin errores. Deberías ver:
```
[Nest] 12345  - LOG [NestApplication] Nest application successfully started
```

---

### Paso 4: Iniciar Frontend

```bash
cd tramuu-app
npm start
```

Presiona `a` para Android o `i` para iOS.

---

## 🧪 Probar el Módulo de Calidad

### 1. Ir a la pantalla de Calidad

1. Abre la app en tu emulador/dispositivo
2. Login con tu usuario de empresa
3. Navega al tab **"Calidad"**

### 2. Registrar Nueva Prueba

**Tab: Pruebas**

1. **Parámetros de Calidad:**
   - Grasa %: `3.25`
   - Proteína %: `3.10`
   - Lactosa %: `4.80`
   - UFC: `50000`
   - Acidez: `6.8`

2. **Foto del Ensayo:**
   - Click en "Capturar"
   - Selecciona "Tomar Foto" o "Elegir de Galería"
   - Captura/selecciona una imagen
   - Verifica que aparezca el preview

3. **Observaciones:**
   - Escribe: "Prueba de calidad estándar"

4. **Registrar:**
   - Click en "Registrar Prueba"
   - Deberías ver: "Registro exitoso"

### 3. Verificar en Historial

**Tab: Historial**

1. Deberías ver la prueba recién creada
2. Verifica que muestre:
   - Grasa: 3.25%
   - Proteína: 3.10%
   - Lactosa: 4.80%
   - UFC: 50,000
3. Si agregaste notas, deberían aparecer

### 4. Ver Estadísticas

**Tab: Alertas**

1. Si los parámetros están dentro del rango, verás: "Sin Alertas"
2. Si algún valor está fuera de rango, verás alertas:
   - Grasa < 3.0% → Warning
   - Proteína < 2.8% → Warning
   - UFC > 100,000 → Critical

---

## 🐛 Troubleshooting

### Error: "Cannot read properties of undefined"

**Problema:** La migración SQL no se ejecutó.

**Solución:**
1. Ve a Supabase SQL Editor
2. Ejecuta la migración del Paso 1
3. Reinicia el backend: `npm run start:dev`

---

### Error: "column quality_tests.lactose_percentage does not exist"

**Problema:** La migración no se aplicó correctamente.

**Solución:**
```sql
-- Verificar si existe la columna:
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'quality_tests'
AND column_name = 'lactose_percentage';

-- Si no existe, ejecutar:
ALTER TABLE quality_tests
ADD COLUMN lactose_percentage DECIMAL(5, 2);
```

---

### Error: "Request failed with status code 400"

**Problema:** Faltan campos obligatorios.

**Solución:**
1. Verifica que todos los campos estén llenos
2. Verifica que los valores sean numéricos
3. Revisa la consola del backend para más detalles

---

### La foto no aparece en el historial

**Normal:** Por ahora, el historial no muestra las fotos. Solo se guardan en la base de datos. Para verlas:

```sql
SELECT test_id, photo_url
FROM quality_tests
WHERE company_id = 'tu-company-id'
ORDER BY test_date DESC
LIMIT 1;
```

---

## 📊 Verificar Datos en Supabase

### Ver todas las pruebas:

```sql
SELECT
  test_id,
  fat_percentage,
  protein_percentage,
  lactose_percentage,
  ufc,
  acidity,
  observations,
  test_date,
  CASE
    WHEN photo_url IS NOT NULL THEN 'Sí'
    ELSE 'No'
  END as tiene_foto
FROM quality_tests
WHERE company_id = 'tu-company-id'
ORDER BY test_date DESC;
```

### Ver estadísticas:

```sql
SELECT
  COUNT(*) as total_pruebas,
  ROUND(AVG(fat_percentage)::numeric, 2) as grasa_promedio,
  ROUND(AVG(protein_percentage)::numeric, 2) as proteina_promedio,
  ROUND(AVG(lactose_percentage)::numeric, 2) as lactosa_promedio,
  ROUND(AVG(ufc)::numeric, 0) as ufc_promedio,
  ROUND(AVG(acidity)::numeric, 2) as acidez_promedio
FROM quality_tests
WHERE company_id = 'tu-company-id';
```

---

## 📝 Flujo Completo de Prueba

```
1. Usuario abre app
   ↓
2. Login → Dashboard
   ↓
3. Tab "Calidad" → Tab "Pruebas"
   ↓
4. Completa parámetros:
   - Grasa: 3.25
   - Proteína: 3.10
   - Lactosa: 4.80
   - UFC: 50000
   - Acidez: 6.8
   ↓
5. Click "Capturar" foto
   ↓
6. Selecciona "Tomar Foto"
   ↓
7. Toma foto del ensayo
   ↓
8. Preview de foto aparece
   ↓
9. Escribe observaciones (opcional)
   ↓
10. Click "Registrar Prueba"
    ↓
11. Backend valida datos
    ↓
12. Backend genera testId automático
    ↓
13. Backend guarda en DB (incluye foto en base64)
    ↓
14. Response exitosa
    ↓
15. Frontend muestra "Registro exitoso"
    ↓
16. Frontend limpia formulario
    ↓
17. Frontend cambia a tab "Historial"
    ↓
18. Nueva prueba aparece en lista
```

---

## ✅ Checklist Final

- [ ] Migración SQL ejecutada en Supabase
- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo sin errores
- [ ] Puedes completar el formulario de calidad
- [ ] Puedes capturar/seleccionar foto
- [ ] Se muestra preview de foto
- [ ] Puedes registrar prueba exitosamente
- [ ] La prueba aparece en historial
- [ ] Los datos se guardan correctamente en Supabase

---

**Última actualización:** 2025-10-24
**Versión:** 1.0.0
