-- Add interests array column to user_preferences table
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_preferences_interests 
ON user_preferences USING GIN (interests);

-- Comment on column
COMMENT ON COLUMN user_preferences.interests IS 'Array of user interest categories';