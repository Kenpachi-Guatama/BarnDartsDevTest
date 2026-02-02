-- King Family Dart League Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SEASONS TABLE
-- ============================================
CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LOCATIONS TABLE
-- ============================================
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEAMS TABLE (can be individual players or actual teams)
-- ============================================
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teams_season ON teams(season_id);

-- ============================================
-- MATCHES TABLE
-- Each match has 3 games, each game won = 1 point
-- ============================================
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    -- Scores represent games won (0-3 each, total = 3)
    home_score INTEGER DEFAULT NULL CHECK (home_score >= 0 AND home_score <= 3),
    away_score INTEGER DEFAULT NULL CHECK (away_score >= 0 AND away_score <= 3),
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure home and away teams are different
    CONSTRAINT different_teams CHECK (home_team_id != away_team_id),
    -- Ensure total games = 3 when completed
    CONSTRAINT valid_score CHECK (
        (is_completed = false) OR
        (home_score IS NOT NULL AND away_score IS NOT NULL AND home_score + away_score = 3)
    )
);

CREATE INDEX idx_matches_season ON matches(season_id);
CREATE INDEX idx_matches_date ON matches(scheduled_date);
CREATE INDEX idx_matches_home_team ON matches(home_team_id);
CREATE INDEX idx_matches_away_team ON matches(away_team_id);

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_news_published ON news(published_at DESC) WHERE is_published = true;

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_published ON documents(created_at DESC) WHERE is_published = true;

-- ============================================
-- ADMINS TABLE (linked to Supabase Auth)
-- ============================================
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VIEWS FOR STANDINGS CALCULATION
-- ============================================
CREATE OR REPLACE VIEW team_standings AS
SELECT
    t.id,
    t.name,
    t.season_id,
    s.name as season_name,
    -- Games played (completed matches)
    COALESCE(
        (SELECT COUNT(*) FROM matches m
         WHERE (m.home_team_id = t.id OR m.away_team_id = t.id)
         AND m.is_completed = true
         AND m.season_id = t.season_id), 0
    ) as played,
    -- Wins (matches where team won more games)
    COALESCE(
        (SELECT COUNT(*) FROM matches m
         WHERE m.is_completed = true
         AND m.season_id = t.season_id
         AND (
             (m.home_team_id = t.id AND m.home_score > m.away_score) OR
             (m.away_team_id = t.id AND m.away_score > m.home_score)
         )), 0
    ) as wins,
    -- Losses
    COALESCE(
        (SELECT COUNT(*) FROM matches m
         WHERE m.is_completed = true
         AND m.season_id = t.season_id
         AND (
             (m.home_team_id = t.id AND m.home_score < m.away_score) OR
             (m.away_team_id = t.id AND m.away_score < m.home_score)
         )), 0
    ) as losses,
    -- Ties (shouldn't happen with 3 games, but included for completeness)
    COALESCE(
        (SELECT COUNT(*) FROM matches m
         WHERE m.is_completed = true
         AND m.season_id = t.season_id
         AND m.home_score = m.away_score
         AND (m.home_team_id = t.id OR m.away_team_id = t.id)), 0
    ) as ties,
    -- Points FOR (total games won)
    COALESCE(
        (SELECT SUM(
            CASE
                WHEN m.home_team_id = t.id THEN m.home_score
                WHEN m.away_team_id = t.id THEN m.away_score
                ELSE 0
            END
         ) FROM matches m
         WHERE (m.home_team_id = t.id OR m.away_team_id = t.id)
         AND m.is_completed = true
         AND m.season_id = t.season_id), 0
    ) as points_for,
    -- Points AGAINST (total games lost)
    COALESCE(
        (SELECT SUM(
            CASE
                WHEN m.home_team_id = t.id THEN m.away_score
                WHEN m.away_team_id = t.id THEN m.home_score
                ELSE 0
            END
         ) FROM matches m
         WHERE (m.home_team_id = t.id OR m.away_team_id = t.id)
         AND m.is_completed = true
         AND m.season_id = t.season_id), 0
    ) as points_against
FROM teams t
JOIN seasons s ON t.season_id = s.id;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public read access for most tables
CREATE POLICY "Public read seasons" ON seasons FOR SELECT USING (true);
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read published news" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published docs" ON documents FOR SELECT USING (is_published = true);

-- Admin write access (check if user is in admins table)
CREATE POLICY "Admin insert seasons" ON seasons FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin update seasons" ON seasons FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin delete seasons" ON seasons FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

CREATE POLICY "Admin insert locations" ON locations FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin update locations" ON locations FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin delete locations" ON locations FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

CREATE POLICY "Admin insert teams" ON teams FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin update teams" ON teams FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin delete teams" ON teams FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

CREATE POLICY "Admin insert matches" ON matches FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin update matches" ON matches FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin delete matches" ON matches FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

CREATE POLICY "Admin insert news" ON news FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin update news" ON news FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin delete news" ON news FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin read all news" ON news FOR SELECT USING (
    is_published = true OR EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

CREATE POLICY "Admin insert documents" ON documents FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin update documents" ON documents FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin delete documents" ON documents FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "Admin read all documents" ON documents FOR SELECT USING (
    is_published = true OR EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

-- Admins can read their own record
CREATE POLICY "Admins read own" ON admins FOR SELECT USING (id = auth.uid());

-- ============================================
-- STORAGE BUCKET FOR DOCUMENTS
-- ============================================
-- Run this separately in Supabase Dashboard > Storage
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- ============================================
-- FUNCTION TO UPDATE updated_at TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON seasons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
