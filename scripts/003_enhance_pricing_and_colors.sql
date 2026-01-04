-- Add color customization to site_settings
INSERT INTO site_settings (key, value) VALUES
  ('primary_color', '#14b8a6'),
  ('secondary_color', '#f97316'),
  ('accent_color', '#8b5cf6')
ON CONFLICT (key) DO NOTHING;

-- Add Stripe and availability fields to pricing table
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS stock_quantity INT;
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS sold_count INT DEFAULT 0;
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS features TEXT[];

-- Add Stripe and availability fields to company_services table
ALTER TABLE company_services ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
ALTER TABLE company_services ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE company_services ADD COLUMN IF NOT EXISTS stock_quantity INT;
ALTER TABLE company_services ADD COLUMN IF NOT EXISTS sold_count INT DEFAULT 0;
ALTER TABLE company_services ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd';

-- Create orders table for Stripe purchases
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_name TEXT,
  service_type TEXT,
  service_id UUID,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  amount_paid INT NOT NULL,
  currency TEXT DEFAULT 'usd',
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  status TEXT DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public can insert their own orders
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

-- Admin can read all orders
CREATE POLICY "Admin read orders" ON orders FOR SELECT USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
