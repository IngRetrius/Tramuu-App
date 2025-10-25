-- ============================================
-- Migración: Agregar lactosa, acidez y foto a pruebas de calidad
-- Fecha: 2025-10-24
-- Descripción: Agrega columnas faltantes a la tabla quality_tests
-- ============================================

-- Agregar columna lactose_percentage
ALTER TABLE quality_tests
ADD COLUMN IF NOT EXISTS lactose_percentage DECIMAL(5, 2);

-- Agregar columna acidity (pH)
ALTER TABLE quality_tests
ADD COLUMN IF NOT EXISTS acidity DECIMAL(4, 2);

-- Agregar columna photo_url para almacenar foto del ensayo
ALTER TABLE quality_tests
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Agregar comentarios a las nuevas columnas
COMMENT ON COLUMN quality_tests.lactose_percentage IS 'Porcentaje de lactosa en la leche';
COMMENT ON COLUMN quality_tests.acidity IS 'Nivel de acidez (pH) de la leche';
COMMENT ON COLUMN quality_tests.photo_url IS 'URL o base64 de la foto del ensayo de calidad';
