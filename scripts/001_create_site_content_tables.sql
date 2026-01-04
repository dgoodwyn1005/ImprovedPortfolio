-- Site settings table for general text content
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social links table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech TEXT[] DEFAULT '{}',
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing table for services
CREATE TABLE IF NOT EXISTS pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL, -- 'music' or 'basketball'
  price DECIMAL(10,2) NOT NULL,
  unit TEXT DEFAULT 'per hour',
  description TEXT,
  booking_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos table for music and basketball sections
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  embed_id TEXT NOT NULL,
  section TEXT NOT NULL, -- 'music' or 'basketball'
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quick stats table for about section
CREATE TABLE IF NOT EXISTS quick_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables (admin-only access)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_stats ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view)
CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read on social_links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Allow public read on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on pricing" ON pricing FOR SELECT USING (true);
CREATE POLICY "Allow public read on videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Allow public read on quick_stats" ON quick_stats FOR SELECT USING (true);

-- Admin write policies (only authenticated users with is_admin metadata)
CREATE POLICY "Allow admin insert on site_settings" ON site_settings FOR INSERT WITH CHECK (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin update on site_settings" ON site_settings FOR UPDATE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin delete on site_settings" ON site_settings FOR DELETE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);

CREATE POLICY "Allow admin insert on social_links" ON social_links FOR INSERT WITH CHECK (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin update on social_links" ON social_links FOR UPDATE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin delete on social_links" ON social_links FOR DELETE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);

CREATE POLICY "Allow admin insert on projects" ON projects FOR INSERT WITH CHECK (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin update on projects" ON projects FOR UPDATE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin delete on projects" ON projects FOR DELETE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);

CREATE POLICY "Allow admin insert on pricing" ON pricing FOR INSERT WITH CHECK (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin update on pricing" ON pricing FOR UPDATE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin delete on pricing" ON pricing FOR DELETE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);

CREATE POLICY "Allow admin insert on videos" ON videos FOR INSERT WITH CHECK (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin update on videos" ON videos FOR UPDATE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin delete on videos" ON videos FOR DELETE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);

CREATE POLICY "Allow admin insert on quick_stats" ON quick_stats FOR INSERT WITH CHECK (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin update on quick_stats" ON quick_stats FOR UPDATE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
CREATE POLICY "Allow admin delete on quick_stats" ON quick_stats FOR DELETE USING (
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
);
