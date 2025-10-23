-- ============================================
-- Migration: Agregar campo address a tabla companies
-- Fecha: 2025-10-23
-- ============================================

-- Agregar columna address
ALTER TABLE companies
ADD COLUMN address TEXT;

-- Agregar comentario a la columna
COMMENT ON COLUMN companies.address IS 'Dirección física de la empresa/finca';
