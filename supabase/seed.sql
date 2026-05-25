-- AtlasGym Demo Seed Data
-- Run AFTER schema.sql
--
-- STEP 1: Create admin via API (easiest):
--   curl -X POST http://localhost:3000/api/auth/setup
--   Default: admin@atlasgym.com / admin123
--
-- OR run this SQL after generating hash:
--   node scripts/hash-password.js admin123

-- Demo members (run even without admin user)
INSERT INTO members (name, phone, photo_url, subscription_start, subscription_end, status) VALUES
  ('Ahmed Benali', '+212 612 345 678', NULL, '2025-04-01', '2025-05-01', 'expired'),
  ('Sara Idrissi', '+212 623 456 789', NULL, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '10 days', 'active'),
  ('Youssef Alami', '+212 634 567 890', NULL, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'active'),
  ('Fatima Zahra', '+212 645 678 901', NULL, '2025-03-15', '2025-04-15', 'expired'),
  ('Karim Mansouri', '+212 656 789 012', NULL, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 'active'),
  ('Nadia Berrada', '+212 667 890 123', NULL, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'active')
ON CONFLICT DO NOTHING;

-- Subscriptions for all members
INSERT INTO subscriptions (member_id, plan_type, start_date, end_date, status, amount)
SELECT
  id,
  'monthly',
  subscription_start,
  subscription_end,
  status,
  300.00
FROM members
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions s WHERE s.member_id = members.id
);

-- Demo payments
INSERT INTO payments (member_id, amount, payment_date, method, notes)
SELECT id, 300.00, subscription_start, 'cash', 'Monthly membership'
FROM members
WHERE NOT EXISTS (
  SELECT 1 FROM payments p WHERE p.member_id = members.id AND p.notes = 'Monthly membership'
);

-- Demo attendance
INSERT INTO attendance (member_id, check_in)
SELECT m.id, NOW() - (n || ' hours')::interval
FROM members m
CROSS JOIN generate_series(1, 5) AS n
WHERE m.status = 'active'
LIMIT 15;
