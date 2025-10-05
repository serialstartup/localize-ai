-- ================================
-- SUPABASE DATABASE SCHEMA
-- HelpMe App - LocalizeAI
-- ================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ================================
-- 1. USERS TABLE
-- ================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  onboarding_completed BOOLEAN DEFAULT false
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ================================
-- 2. USER PREFERENCES TABLE
-- ================================
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language VARCHAR(5) DEFAULT 'tr' CHECK (language IN ('tr', 'en')),
  
  -- Notification preferences
  push_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  recommendation_notifications BOOLEAN DEFAULT true,
  nearby_notifications BOOLEAN DEFAULT true,
  
  -- Privacy preferences  
  location_services BOOLEAN DEFAULT true,
  analytics BOOLEAN DEFAULT true,
  personalized_ads BOOLEAN DEFAULT false,
  
  -- Display preferences
  show_open_only BOOLEAN DEFAULT false,
  max_distance INTEGER DEFAULT 5000, -- meters
  currency VARCHAR(5) DEFAULT 'TRY' CHECK (currency IN ('TRY', 'USD', 'EUR')),
  
  -- Chat preferences
  voice_enabled BOOLEAN DEFAULT true,
  image_analysis BOOLEAN DEFAULT true,
  auto_location BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- ================================
-- 3. CHAT SESSIONS TABLE
-- ================================
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT false
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- ================================
-- 4. CHAT MESSAGES TABLE  
-- ================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
  content TEXT NOT NULL,
  is_image BOOLEAN DEFAULT false,
  image_url TEXT,
  
  -- Location data for the message
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  
  -- AI processing metadata
  processing_time INTEGER, -- milliseconds
  ai_model VARCHAR(50),
  search_query TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own messages" ON chat_messages
  FOR ALL USING (auth.uid() = user_id);

-- ================================
-- 5. PLACES TABLE (Cached Google Places data)
-- ================================
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_place_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  place_type VARCHAR(100),
  formatted_address TEXT,
  
  -- Location data
  location POINT, -- PostGIS geometry
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- Place details
  rating DECIMAL(2,1),
  user_ratings_total INTEGER,
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
  
  -- Business info
  phone VARCHAR(50),
  website TEXT,
  opening_hours JSONB,
  photos JSONB, -- Array of photo references
  
  -- Cached data management
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spatial index for location-based queries
CREATE INDEX idx_places_location ON places USING GIST (location);
CREATE INDEX idx_places_google_id ON places (google_place_id);
CREATE INDEX idx_places_type ON places (place_type);

-- Public read access for places
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to places" ON places FOR SELECT TO PUBLIC USING (true);

-- ================================
-- 6. USER FAVORITES TABLE
-- ================================
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  notes TEXT,
  tags TEXT[], -- Array of user tags
  is_visited BOOLEAN DEFAULT false,
  visited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, place_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- ================================
-- 7. SEARCH HISTORY TABLE
-- ================================
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  search_type VARCHAR(50) DEFAULT 'text', -- 'text', 'voice', 'image'
  
  -- Location context
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  
  -- Results metadata
  results_count INTEGER DEFAULT 0,
  processing_time INTEGER, -- milliseconds
  ai_response_quality DECIMAL(2,1), -- 1-5 rating for response quality
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own search history" ON search_history
  FOR ALL USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_search_history_user_created ON search_history (user_id, created_at DESC);

-- ================================
-- 8. MESSAGE RECOMMENDATIONS TABLE
-- ================================
CREATE TABLE message_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Recommendation metadata
  ai_reason TEXT, -- Why this place was recommended
  ai_highlight TEXT, -- Key highlight from AI
  confidence_score DECIMAL(3,2), -- 0.00-1.00
  rank_order INTEGER, -- Order in recommendation list
  
  -- User interaction
  was_clicked BOOLEAN DEFAULT false,
  was_visited BOOLEAN DEFAULT false,
  user_feedback INTEGER CHECK (user_feedback BETWEEN 1 AND 5), -- 1-5 star rating
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE message_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations" ON message_recommendations
  FOR ALL USING (auth.uid() = user_id);

-- ================================
-- 9. USER ACTIVITY LOG TABLE  
-- ================================
CREATE TABLE user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'chat', 'search', 'favorite', 'visit', etc.
  activity_data JSONB, -- Flexible JSON data for activity details
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON user_activity_log
  FOR SELECT USING (auth.uid() = user_id);

-- Index for analytics queries
CREATE INDEX idx_activity_log_user_type_date ON user_activity_log (user_id, activity_type, created_at DESC);

-- ================================
-- 10. FEEDBACK TABLE
-- ================================
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  feedback_type VARCHAR(50) NOT NULL, -- 'bug', 'feature', 'general', 'place_error'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  is_resolved BOOLEAN DEFAULT false,
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create feedback" ON user_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback" ON user_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- ================================
-- FUNCTIONS AND TRIGGERS
-- ================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_favorites_updated_at BEFORE UPDATE ON user_favorites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update chat session's last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions 
  SET last_message_at = NEW.created_at 
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_session_last_message_trigger 
  AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_session_last_message();

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- Chat-related indexes
CREATE INDEX idx_chat_sessions_user_updated ON chat_sessions (user_id, updated_at DESC);
CREATE INDEX idx_chat_messages_session_created ON chat_messages (session_id, created_at ASC);
CREATE INDEX idx_message_recommendations_message ON message_recommendations (message_id, rank_order ASC);

-- Location-based indexes
CREATE INDEX idx_places_lat_lng ON places (latitude, longitude);
CREATE INDEX idx_search_history_location ON search_history (location_lat, location_lng);

-- Favorites and activity indexes
CREATE INDEX idx_favorites_user_created ON user_favorites (user_id, created_at DESC);
CREATE INDEX idx_activity_created ON user_activity_log (created_at DESC);

-- ================================
-- VIEWS FOR COMMON QUERIES
-- ================================

-- View for user profile with preferences
CREATE VIEW user_profiles AS
SELECT 
  u.id,
  u.email,
  u.name,
  u.avatar_url,
  u.created_at,
  u.last_login_at,
  up.theme,
  up.language,
  up.push_notifications,
  up.location_services,
  up.max_distance,
  up.currency
FROM users u
LEFT JOIN user_preferences up ON u.id = up.user_id;

-- View for recent chat sessions with message counts
CREATE VIEW chat_sessions_summary AS
SELECT 
  cs.id,
  cs.user_id,
  cs.title,
  cs.created_at,
  cs.last_message_at,
  COUNT(cm.id) as message_count,
  MAX(cm.created_at) as latest_message_at
FROM chat_sessions cs
LEFT JOIN chat_messages cm ON cs.id = cm.session_id
WHERE cs.is_archived = false
GROUP BY cs.id, cs.user_id, cs.title, cs.created_at, cs.last_message_at;

-- ================================
-- SEED DATA (Optional)
-- ================================

-- Insert default user preferences for existing users
CREATE OR REPLACE FUNCTION create_default_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_user_preferences_trigger
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_default_preferences();

-- ================================
-- COMMENTS FOR DOCUMENTATION
-- ================================

COMMENT ON TABLE users IS 'Main user accounts table with authentication data';
COMMENT ON TABLE user_preferences IS 'User-specific app preferences and settings';  
COMMENT ON TABLE chat_sessions IS 'Chat conversation sessions between user and AI';
COMMENT ON TABLE chat_messages IS 'Individual messages within chat sessions';
COMMENT ON TABLE places IS 'Cached Google Places data for performance';
COMMENT ON TABLE user_favorites IS 'User-saved favorite places with personal notes';
COMMENT ON TABLE search_history IS 'History of user searches for analytics';
COMMENT ON TABLE message_recommendations IS 'AI place recommendations linked to messages';
COMMENT ON TABLE user_activity_log IS 'General user activity tracking for analytics';
COMMENT ON TABLE user_feedback IS 'User feedback and bug reports';