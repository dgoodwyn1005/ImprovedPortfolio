-- Seed site settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_title', 'Deshawn Goodwyn'),
  ('hero_subtitle', 'D2 Basketball Starter · Wyntech Founder · Gospel Pianist · Full-Stack Developer'),
  ('hero_description', 'Former Virginia HS 3-point record holder (107 + 105 threes) → 4.56 GPA → Now building web apps and playing keys.'),
  ('about_paragraph_1', 'I''m a student-athlete, developer, and musician who believes in pursuing excellence across every arena. Currently starting as a guard at the D2 level while running Wyntech, my web development company.'),
  ('about_paragraph_2', 'My journey started on the courts of Virginia, where I broke the state high school 3-point record with 107 threes in a single season—then broke it again the next year with 105. Off the court, I maintained a 4.56 GPA and discovered my love for building software and playing gospel piano.'),
  ('about_paragraph_3', 'Today, I blend these passions: writing code that solves real problems, playing keys at church and sessions, and continuing to compete at the highest level I can.'),
  ('music_description', '200+ chord charts in ForScore · Specializing in gospel reharmonization and accompaniment. Available for worship services, studio sessions, and live performances.'),
  ('basketball_description', 'Current D2 starter · Private shooting and guard training available. Two-time Virginia HS 3-point record holder with a proven track record of elite marksmanship.'),
  ('contact_heading', 'Let''s connect and create something great together.')
ON CONFLICT (key) DO NOTHING;

-- Seed social links
INSERT INTO social_links (name, url, icon, display_order) VALUES
  ('Email', 'mailto:hello@deshawngoodwyn.com', 'Mail', 1),
  ('LinkedIn', '#', 'Linkedin', 2),
  ('GitHub', '#', 'Github', 3),
  ('Instagram', '#', 'Instagram', 4)
ON CONFLICT DO NOTHING;

-- Seed projects
INSERT INTO projects (title, description, tech, image_url, live_url, github_url, display_order) VALUES
  ('Wyntech', 'Full-service web development agency building custom solutions for businesses.', ARRAY['Next.js', 'TypeScript', 'Tailwind'], '/placeholder.svg?height=300&width=400', '#', '#', 1),
  ('Wynora', 'AI-powered productivity assistant for students and professionals.', ARRAY['React', 'OpenAI', 'Node.js'], '/placeholder.svg?height=300&width=400', '#', '#', 2),
  ('TrueMusiq', 'Platform connecting gospel musicians for sessions and collaborations.', ARRAY['Next.js', 'Supabase', 'Stripe'], '/placeholder.svg?height=300&width=400', '#', '#', 3),
  ('RPG Defense', 'Tower defense game with RPG elements and strategic gameplay.', ARRAY['Unity', 'C#', 'Game Design'], '/placeholder.svg?height=300&width=400', '#', '#', 4),
  ('Basketball Analytics Tool', 'Track shooting percentages, tendencies, and performance metrics.', ARRAY['Python', 'React', 'D3.js'], '/placeholder.svg?height=300&width=400', '#', '#', 5),
  ('Church Media System', 'Streamlined presentation and media management for worship services.', ARRAY['Electron', 'React', 'SQLite'], '/placeholder.svg?height=300&width=400', '#', '#', 6)
ON CONFLICT DO NOTHING;

-- Seed pricing
INSERT INTO pricing (service_type, price, unit, description, booking_url) VALUES
  ('music', 150.00, 'per hour', 'Gospel piano sessions for worship, studio recordings, and live events', '#'),
  ('basketball', 100.00, 'per hour', 'Private shooting and guard training sessions', '#')
ON CONFLICT DO NOTHING;

-- Seed videos
INSERT INTO videos (title, embed_id, section, display_order) VALUES
  ('Sunday Morning Worship Set', 'dQw4w9WgXcQ', 'music', 1),
  ('Gospel Reharmonization Session', 'dQw4w9WgXcQ', 'music', 2),
  ('Studio Recording Highlights', 'dQw4w9WgXcQ', 'music', 3),
  ('Junior Season Highlights - 107 Threes', 'dQw4w9WgXcQ', 'basketball', 1),
  ('Senior Season Highlights - 105 Threes', 'dQw4w9WgXcQ', 'basketball', 2),
  ('D2 College Highlights', 'dQw4w9WgXcQ', 'basketball', 3)
ON CONFLICT DO NOTHING;

-- Seed quick stats
INSERT INTO quick_stats (label, value, display_order) VALUES
  ('GPA', '4.56', 1),
  ('3PT Record', '107 (Junior)', 2),
  ('Chord Charts', '200+', 3),
  ('Projects', '6+', 4)
ON CONFLICT DO NOTHING;
