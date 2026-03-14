-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  name VARCHAR,
  anxiety_areas JSONB DEFAULT '[]'::jsonb,
  is_pro BOOLEAN DEFAULT false,
  free_scripts_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own row
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own row
CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own row
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);
