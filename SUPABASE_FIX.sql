-- =====================================================
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- =====================================================

-- 1. First, let's check if RLS is enabled on orders table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'orders';

-- 2. If RLS is enabled, add a policy to allow reading all orders
-- This allows any authenticated user to read all orders (for admin purposes)
CREATE POLICY IF NOT EXISTS "Allow authenticated users to read all orders"
ON orders
FOR SELECT
TO authenticated
USING (true);

-- 3. Also add policy for order_items
CREATE POLICY IF NOT EXISTS "Allow authenticated users to read all order items"
ON order_items
FOR SELECT
TO authenticated
USING (true);

-- 4. Alternative: If you want only admins to see all orders, 
-- first add an is_admin column to profiles if not exists
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Then create admin-only policy:
-- CREATE POLICY "Allow admins to read all orders"
-- ON orders
-- FOR SELECT
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM profiles 
--     WHERE profiles.id = auth.uid() 
--     AND profiles.is_admin = true
--   )
--   OR user_id = auth.uid()
-- );

-- =====================================================
-- IMPORTANT: Also update your backend .env.local
-- =====================================================
-- Get your SERVICE ROLE KEY from:
-- Supabase Dashboard > Settings > API > service_role (secret)
-- 
-- Update backend/.env.local:
-- SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVya3lzZWxsd25yaWh6bWpxb3ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6...
-- 
-- The service_role key is DIFFERENT from the anon key!
-- It bypasses RLS and has full database access.
