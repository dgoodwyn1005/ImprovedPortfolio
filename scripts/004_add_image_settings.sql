-- Add image URL fields to site_settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_background_image', ''),
  ('about_profile_image', ''),
  ('site_logo', ''),
  ('site_favicon', '')
ON CONFLICT (key) DO NOTHING;
