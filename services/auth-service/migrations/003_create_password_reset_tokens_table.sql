-- =====================================================
-- 4. PASSWORD RESET TOKENS TABLE (For Password Recovery Flow)
-- =====================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL, -- hashed for security
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS password_reset_tokens_token_idx ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS password_reset_tokens_expires_at_idx ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS password_reset_tokens_used_idx ON password_reset_tokens(used);

-- Enable Row Level Security
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASSWORD RESET TOKENS TABLE POLICIES
-- =====================================================
-- Users can view their own reset tokens
CREATE POLICY "Users can view own reset tokens" ON password_reset_tokens
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- =====================================================
-- 5. EMAIL VERIFICATION TOKENS TABLE (Optional - For Email Confirmation Flow)
-- =====================================================
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL, -- hashed for security
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS email_verification_tokens_user_id_idx ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS email_verification_tokens_token_idx ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS email_verification_tokens_expires_at_idx ON email_verification_tokens(expires_at);
CREATE INDEX IF NOT EXISTS email_verification_tokens_used_idx ON email_verification_tokens(used);

-- Enable Row Level Security
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- EMAIL VERIFICATION TOKENS TABLE POLICIES
-- =====================================================
-- Users can view their own verification tokens
CREATE POLICY "Users can view own verification tokens" ON email_verification_tokens
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- =====================================================
-- TOKEN MANAGEMENT FUNCTIONS
-- =====================================================
-- Function to clean up expired reset tokens
DROP FUNCTION IF EXISTS public.cleanup_expired_reset_tokens();
CREATE OR REPLACE FUNCTION public.cleanup_expired_reset_tokens()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM password_reset_tokens 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired verification tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_tokens()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM email_verification_tokens 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate secure reset token
DROP FUNCTION IF EXISTS public.generate_reset_token(UUID, INTEGER);
CREATE OR REPLACE FUNCTION public.generate_reset_token(
  p_user_id UUID,
  p_expires_in_hours INTEGER DEFAULT 1
)
RETURNS TEXT AS $$
DECLARE
  reset_token TEXT;
BEGIN
  -- Generate a secure random token
  reset_token := encode(gen_random_bytes(32), 'base64url');
  
  -- Insert the token with specified expiration
  INSERT INTO password_reset_tokens (user_id, token, expires_at)
  VALUES (p_user_id, reset_token, NOW() + (p_expires_in_hours || ' hours')::INTERVAL);
  
  RETURN reset_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate secure verification token
CREATE OR REPLACE FUNCTION public.generate_verification_token(
  p_user_id UUID,
  p_expires_in_hours INTEGER DEFAULT 24
)
RETURNS TEXT AS $$
DECLARE
  verification_token TEXT;
BEGIN
  -- Generate a secure random token
  verification_token := encode(gen_random_bytes(32), 'base64url');
  
  -- Insert the token with specified expiration
  INSERT INTO email_verification_tokens (user_id, token, expires_at)
  VALUES (p_user_id, verification_token, NOW() + (p_expires_in_hours || ' hours')::INTERVAL);
  
  RETURN verification_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate and use reset token
CREATE OR REPLACE FUNCTION public.validate_reset_token(p_token TEXT)
RETURNS TABLE(user_id UUID, is_valid BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    prt.user_id,
    (prt.expires_at > NOW() AND prt.used = FALSE) as is_valid
  FROM password_reset_tokens prt
  WHERE prt.token = p_token;
  
  -- Mark token as used if valid
  UPDATE password_reset_tokens 
  SET used = TRUE, used_at = NOW()
  WHERE token = p_token AND expires_at > NOW() AND used = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate and use verification token
CREATE OR REPLACE FUNCTION public.validate_verification_token(p_token TEXT)
RETURNS TABLE(user_id UUID, is_valid BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    evt.user_id,
    (evt.expires_at > NOW() AND evt.used = FALSE) as is_valid
  FROM email_verification_tokens evt
  WHERE evt.token = p_token;
  
  -- Mark token as used if valid
  UPDATE email_verification_tokens 
  SET used = TRUE, used_at = NOW()
  WHERE token = p_token AND expires_at > NOW() AND used = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
