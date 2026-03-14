-- Create practice_sessions table
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  script_id UUID NOT NULL REFERENCES scripts (id) ON DELETE CASCADE,
  messages JSONB NOT NULL,
  feedback TEXT,
  mode VARCHAR(10) CHECK (mode IN ('text', 'voice')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index on user_id for fast lookups
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions (user_id);

-- Enable RLS
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- Users can read their own sessions
CREATE POLICY "practice_sessions_select_own" ON practice_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "practice_sessions_insert_own" ON practice_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "practice_sessions_update_own" ON practice_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own sessions
CREATE POLICY "practice_sessions_delete_own" ON practice_sessions
  FOR DELETE USING (auth.uid() = user_id);
