-- ============================================
-- BASE DE DATOS - TRAMUU
-- Sistema de Gestión de Lecherías
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USUARIOS Y AUTENTICACIÓN
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('company', 'employee')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. EMPRESAS
-- ============================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  nit_id VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  invitation_code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. EMPLEADOS
-- ============================================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. VACAS
-- ============================================
CREATE TABLE cows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  cow_id VARCHAR(50) NOT NULL,
  name VARCHAR(100),
  breed VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  date_of_birth DATE,
  notes TEXT,
  daily_production DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, cow_id)
);

-- ============================================
-- 5. ORDEÑOS (CORE DEL SISTEMA)
-- ============================================
CREATE TABLE milkings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  milking_type VARCHAR(20) NOT NULL CHECK (milking_type IN ('rapid', 'individual', 'massive')),
  shift VARCHAR(5) NOT NULL CHECK (shift IN ('AM', 'PM')),
  cow_count INTEGER NOT NULL,
  total_liters DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  milking_date DATE NOT NULL,
  milking_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. ORDEÑOS INDIVIDUALES (TRAZABILIDAD)
-- ============================================
CREATE TABLE individual_milkings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milking_id UUID REFERENCES milkings(id) ON DELETE CASCADE,
  cow_id UUID REFERENCES cows(id) ON DELETE CASCADE,
  liters DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. PRUEBAS DE CALIDAD
-- ============================================
CREATE TABLE quality_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  milking_id UUID REFERENCES milkings(id) ON DELETE SET NULL,
  test_id VARCHAR(50) NOT NULL,
  fat_percentage DECIMAL(5, 2),
  protein_percentage DECIMAL(5, 2),
  ufc INTEGER,
  observations TEXT,
  test_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, test_id)
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_cows_company ON cows(company_id);
CREATE INDEX idx_cows_active ON cows(company_id, is_active);
CREATE INDEX idx_milkings_company_date ON milkings(company_id, milking_date DESC);
CREATE INDEX idx_milkings_employee ON milkings(employee_id);
CREATE INDEX idx_individual_milkings_cow ON individual_milkings(cow_id);
CREATE INDEX idx_quality_tests_company ON quality_tests(company_id, test_date DESC);

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cows_updated_at BEFORE UPDATE ON cows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIÓN PARA CÓDIGO DE INVITACIÓN
-- ============================================
CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
        SELECT EXISTS(SELECT 1 FROM companies WHERE invitation_code = code) INTO exists;
        EXIT WHEN NOT exists;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN PARA ACTUALIZAR PRODUCCIÓN DIARIA
-- ============================================
CREATE OR REPLACE FUNCTION update_cow_daily_production()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cows
    SET daily_production = (
        SELECT COALESCE(SUM(im.liters), 0)
        FROM individual_milkings im
        JOIN milkings m ON m.id = im.milking_id
        WHERE im.cow_id = NEW.cow_id
        AND m.milking_date = CURRENT_DATE
    )
    WHERE id = NEW.cow_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_daily_production
AFTER INSERT ON individual_milkings
FOR EACH ROW EXECUTE FUNCTION update_cow_daily_production();

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================
COMMENT ON TABLE users IS 'Usuarios del sistema (empresas y empleados)';
COMMENT ON TABLE companies IS 'Empresas registradas en el sistema';
COMMENT ON TABLE employees IS 'Empleados asociados a empresas';
COMMENT ON TABLE cows IS 'Ganado registrado por empresa';
COMMENT ON TABLE milkings IS 'Registros de ordeños (rápido, individual, masivo)';
COMMENT ON TABLE individual_milkings IS 'Detalles de producción por vaca en cada ordeño';
COMMENT ON TABLE quality_tests IS 'Pruebas de calidad de la leche';
