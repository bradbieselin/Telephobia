-- Create scripts table
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  situation TEXT NOT NULL,
  script_content JSONB NOT NULL,
  category VARCHAR(20),
  phone_number VARCHAR(20),
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index on user_id for fast lookups
CREATE INDEX idx_scripts_user_id ON scripts (user_id);

-- Enable RLS
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Users can read their own scripts
CREATE POLICY "scripts_select_own" ON scripts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own scripts
CREATE POLICY "scripts_insert_own" ON scripts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own scripts
CREATE POLICY "scripts_update_own" ON scripts
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own scripts
CREATE POLICY "scripts_delete_own" ON scripts
  FOR DELETE USING (auth.uid() = user_id);
