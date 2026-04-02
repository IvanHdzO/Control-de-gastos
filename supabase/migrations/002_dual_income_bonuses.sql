-- ============================================
-- Migración: Doble ingreso + Bonos
-- ============================================
-- Ejecutar en el SQL Editor de Supabase

-- 1. Agregar segundo salario al perfil
ALTER TABLE profiles ADD COLUMN income_2 NUMERIC(12,2) NOT NULL DEFAULT 0;

-- 2. Tabla de bonos/ingresos extra
CREATE TABLE bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Índice
CREATE INDEX idx_bonuses_user_id ON bonuses(user_id);

-- 4. RLS en bonuses
ALTER TABLE bonuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bonuses"
  ON bonuses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bonuses"
  ON bonuses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bonuses"
  ON bonuses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bonuses"
  ON bonuses FOR DELETE
  USING (auth.uid() = user_id);
