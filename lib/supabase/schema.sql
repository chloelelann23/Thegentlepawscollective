-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('member', 'ambassador', 'admin');
CREATE TYPE event_type AS ENUM ('in-person', 'virtual');
CREATE TYPE event_status AS ENUM ('upcoming', 'past');
CREATE TYPE badge_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE badge_trigger AS ENUM ('event_rsvp', 'donation', 'photo_submit', 'manual', 'join');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'member',
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  type event_type NOT NULL DEFAULT 'in-person',
  spots_total INTEGER,
  spots_filled INTEGER NOT NULL DEFAULT 0,
  badge_reward UUID,
  cover_image_drive_path TEXT,
  status event_status NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Blog posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tag TEXT,
  cover_image_drive_path TEXT,
  read_time INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Charities
CREATE TABLE charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  animal_type TEXT,
  emoji TEXT DEFAULT '🐾',
  raised_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  goal_amount DECIMAL(10,2) NOT NULL DEFAULT 5000,
  drive_image_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  description TEXT,
  rarity badge_rarity NOT NULL DEFAULT 'common',
  trigger_type badge_trigger NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Donations
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  charity_id UUID NOT NULL REFERENCES charities(id) ON DELETE RESTRICT,
  amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event photos
CREATE TABLE event_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  drive_file_id TEXT NOT NULL,
  caption TEXT,
  submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ambassador applications
CREATE TABLE ambassador_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  why_ambassador TEXT NOT NULL,
  experience TEXT,
  approved BOOLEAN,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add foreign key for events.badge_reward after badges table is created
ALTER TABLE events ADD CONSTRAINT fk_event_badge FOREIGN KEY (badge_reward) REFERENCES badges(id) ON DELETE SET NULL;

-- ────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambassador_applications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Public profiles are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Events are publicly readable" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Event RSVPs
CREATE POLICY "Users can view own rsvps" ON event_rsvps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all rsvps" ON event_rsvps FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Authenticated users can rsvp" ON event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own rsvp" ON event_rsvps FOR DELETE USING (auth.uid() = user_id);

-- Blog posts
CREATE POLICY "Published posts are publicly readable" ON blog_posts FOR SELECT USING (published_at IS NOT NULL);
CREATE POLICY "Admins can manage blog posts" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Charities
CREATE POLICY "Charities are publicly readable" ON charities FOR SELECT USING (true);
CREATE POLICY "Admins can manage charities" ON charities FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Badges
CREATE POLICY "Badges are publicly readable" ON badges FOR SELECT USING (true);
CREATE POLICY "Admins can manage badges" ON badges FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- User badges
CREATE POLICY "User badges are publicly readable" ON user_badges FOR SELECT USING (true);
CREATE POLICY "System can insert user badges" ON user_badges FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage user badges" ON user_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Donations
CREATE POLICY "Users can view own donations" ON donations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all donations" ON donations FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert donations" ON donations FOR INSERT WITH CHECK (true);

-- Event photos
CREATE POLICY "Event photos are publicly readable" ON event_photos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit photos" ON event_photos FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins can manage photos" ON event_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Ambassador applications
CREATE POLICY "Users can view own application" ON ambassador_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all applications" ON ambassador_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Authenticated users can apply" ON ambassador_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update applications" ON ambassador_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- ────────────────────────────────────────────
-- Functions & Triggers
-- ────────────────────────────────────────────

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed default badges
INSERT INTO badges (name, emoji, description, rarity, trigger_type) VALUES
  ('New Sprout', '🌱', 'Welcome to the Collective! You just joined the family.', 'common', 'join'),
  ('Event Star', '⭐', 'You''ve attended 5 or more events. The animals thank you!', 'epic', 'manual'),
  ('Top Donor', '💝', 'You''ve donated $500 or more. You''re a legend in the rescue community.', 'legendary', 'donation'),
  ('Recap Hero', '📸', 'You''ve submitted 10 or more event photos. The memories live on!', 'epic', 'photo_submit'),
  ('Ambassador', '🎀', 'You''re an official Gentle Paws Ambassador. Thank you for leading the way.', 'legendary', 'manual');
