-- ============================================
-- Migración: Salarios Dinámicos
-- ============================================
-- Ejecutar en el SQL Editor de Supabase
-- Reemplaza income / income_2 hardcodeados por tabla flexible

-- 1. Tabla de salarios
CREATE TABLE salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Salario',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_salaries_user ON salaries(user_id);

-- 2. RLS
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own salaries"
  ON salaries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own salaries"
  ON salaries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own salaries"
  ON salaries FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own salaries"
  ON salaries FOR DELETE USING (auth.uid() = user_id);

-- 3. Migrar datos existentes de profiles a salaries
INSERT INTO salaries (user_id, label, amount, sort_order)
SELECT id, 'Tu salario', income, 0 FROM profiles WHERE income > 0;

INSERT INTO salaries (user_id, label, amount, sort_order)
SELECT id, 'Salario esposa', income_2, 1 FROM profiles WHERE income_2 > 0;
