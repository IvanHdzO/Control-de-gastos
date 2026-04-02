-- ============================================
-- Migración: Tracking Mensual
-- ============================================
-- Ejecutar en el SQL Editor de Supabase
-- NOTA: Los registros existentes se backfillean con el mes actual

-- 1. Agregar columna month a expenses
ALTER TABLE expenses ADD COLUMN month TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM');

-- 2. Agregar columna month a bonuses
ALTER TABLE bonuses ADD COLUMN month TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM');

-- 3. Índices compuestos para queries por usuario+mes
CREATE INDEX idx_expenses_user_month ON expenses(user_id, month);
CREATE INDEX idx_bonuses_user_month ON bonuses(user_id, month);
