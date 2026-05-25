-- Run once if you already created tables from an older schema.sql

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 1);
ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews INTEGER;

ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_type_check
  CHECK (plan_type IN ('monthly', 'quarterly', 'six_months', 'yearly'));
