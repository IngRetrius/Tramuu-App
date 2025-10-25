# 📋 Migraciones de Base de Datos

## 🚀 Cómo Ejecutar Migraciones en Supabase

### Paso 1: Acceder al SQL Editor de Supabase

1. Ve a **https://supabase.com/dashboard**
2. Selecciona tu proyecto: `othigdnkyieeuosilzxz`
3. En el menú lateral, click en **"SQL Editor"**

### Paso 2: Ejecutar la Migración

1. Click en **"New query"**
2. Copia el contenido del archivo de migración
3. Pega en el editor SQL
4. Click en **"Run"** o presiona `Ctrl + Enter`
5. Verifica que diga "Success" en la respuesta

---

## 📁 Migraciones Disponibles

### ✅ `add_lactose_acidity_photo_to_quality_tests.sql`

**Fecha:** 2025-10-24
**Descripción:** Agrega columnas faltantes a pruebas de calidad

**Qué hace:**
- Agrega `lactose_percentage` (DECIMAL) - Porcentaje de lactosa
- Agrega `acidity` (DECIMAL) - Nivel de pH
- Agrega `photo_url` (TEXT) - URL o base64 de foto del ensayo

**Cómo ejecutar:**

```sql
-- Copiar y pegar este contenido en Supabase SQL Editor:

ALTER TABLE quality_tests
ADD COLUMN IF NOT EXISTS lactose_percentage DECIMAL(5, 2);

ALTER TABLE quality_tests
ADD COLUMN IF NOT EXISTS acidity DECIMAL(4, 2);

ALTER TABLE quality_tests
ADD COLUMN IF NOT EXISTS photo_url TEXT;

COMMENT ON COLUMN quality_tests.lactose_percentage IS 'Porcentaje de lactosa en la leche';
COMMENT ON COLUMN quality_tests.acidity IS 'Nivel de acidez (pH) de la leche';
COMMENT ON COLUMN quality_tests.photo_url IS 'URL o base64 de la foto del ensayo de calidad';
```

**Verificar que funcionó:**

```sql
-- Verificar la estructura de la tabla:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quality_tests'
ORDER BY ordinal_position;
```

Deberías ver las nuevas columnas:
- `lactose_percentage` → numeric
- `acidity` → numeric
- `photo_url` → text

---

### ✅ `add_address_to_companies.sql`

**Fecha:** Anterior
**Descripción:** Agrega columna address a empresas

---

## ⚠️ Troubleshooting

### Error: "column already exists"

Esto es normal si ya ejecutaste la migración antes. Los comandos usan `IF NOT EXISTS` para evitar errores.

### Error: "permission denied"

Asegúrate de estar usando el **Service Role Key** en Supabase, no el Anon Key.

### Error: "syntax error"

Verifica que copiaste el SQL completo, sin truncar.

---

## 📊 Estado de Migraciones

| Migración | Estado | Fecha Ejecución |
|-----------|--------|-----------------|
| `add_address_to_companies.sql` | ⏳ Pendiente | - |
| `add_lactose_acidity_photo_to_quality_tests.sql` | ⏳ Pendiente | - |

**Actualiza esta tabla después de ejecutar cada migración.**

---

## 🔄 Próximos Pasos

Después de ejecutar la migración:

1. ✅ Verifica que las columnas existan
2. ✅ Reinicia el backend local: `npm run start:dev`
3. ✅ Prueba crear una prueba de calidad desde la app
4. ✅ Verifica que se guarden todos los campos

---

**Última actualización:** 2025-10-24
