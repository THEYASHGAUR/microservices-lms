-- =====================================================
-- 3. USER SESSIONS TABLE (Track Logins & Active Sessions)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL, -- hashed version for security
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  device_info JSONB DEFAULT '{}' -- store device fingerprint, location, etc.
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_refresh_token_idx ON user_sessions(refresh_token);
CREATE INDEX IF NOT EXISTS user_sessions_expires_at_idx ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS user_sessions_active_idx ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS user_sessions_device_info_idx ON user_sessions USING GIN(device_info);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER SESSIONS TABLE POLICIES
-- =====================================================
-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions" ON user_sessions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Users can update their own sessions (for logout)
CREATE POLICY "Users can update own sessions" ON user_sessions
  FOR UPDATE USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Admins can view all sessions
CREATE POLICY "Admins can view all sessions" ON user_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- =====================================================
-- SESSION MANAGEMENT FUNCTIONS
-- =====================================================
-- Function to clean up expired sessions
DROP FUNCTION IF EXISTS public.cleanup_expired_sessions();
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_sessions 
  WHERE expires_at < NOW() OR is_active = FALSE;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deactivate all user sessions (logout all devices)
DROP FUNCTION IF EXISTS public.deactivate_user_sessions(UUID);
CREATE OR REPLACE FUNCTION public.deactivate_user_sessions(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE user_sessions 
  SET is_active = FALSE, updated_at = NOW()
  WHERE user_id = target_user_id AND is_active = TRUE;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create new session
CREATE OR REPLACE FUNCTION public.create_user_session(
  p_user_id UUID,
  p_refresh_token TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_device_info JSONB DEFAULT '{}'::jsonb,
  p_expires_in_hours INTEGER DEFAULT 168 -- 7 days
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO user_sessions (
    user_id, 
    refresh_token, 
    ip_address, 
    user_agent, 
    device_info, 
    expires_at
  )
  VALUES (
    p_user_id,
    p_refresh_token,
    p_ip_address,
    p_user_agent,
    p_device_info,
    NOW() + (p_expires_in_hours || ' hours')::INTERVAL
  )
  RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================
-- Trigger to update updated_at on user_sessions table
DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON user_sessions;
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
