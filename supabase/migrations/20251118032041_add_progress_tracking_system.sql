/*
  # Progress Tracking and Gamification System

  1. New Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `completed_lessons` (text[]) - Array of lesson IDs
      - `current_lesson_id` (uuid)
      - `completion_percentage` (integer)
      - `total_time_spent` (integer) - minutes
      - `last_accessed` (timestamp)
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
    
    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `achievement_type` (text) - badge, milestone, streak
      - `achievement_id` (text) - identifier
      - `title` (text)
      - `description` (text)
      - `earned_at` (timestamp)
      - `metadata` (jsonb)
    
    - `user_stats`
      - `user_id` (uuid, primary key, foreign key to users)
      - `total_points` (integer)
      - `current_level` (integer)
      - `current_streak` (integer) - consecutive days
      - `longest_streak` (integer)
      - `last_activity_date` (date)
      - `competency_scores` (jsonb) - SC1-SC12 scores
      - `courses_completed` (integer)
      - `exercises_completed` (integer)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can view and update their own progress
    - Achievements are read-only for users
*/

-- User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons text[] DEFAULT '{}',
  current_lesson_id uuid REFERENCES lessons(id),
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  total_time_spent integer DEFAULT 0,
  last_accessed timestamptz DEFAULT now(),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, course_id)
);

-- User Achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL CHECK (achievement_type IN ('badge', 'milestone', 'streak', 'competency')),
  achievement_id text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  earned_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- User Stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points integer DEFAULT 0,
  current_level integer DEFAULT 1,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date,
  competency_scores jsonb DEFAULT '{
    "SC1": 0, "SC2": 0, "SC3": 0, "SC4": 0,
    "SC5": 0, "SC6": 0, "SC7": 0, "SC8": 0,
    "SC9": 0, "SC10": 0, "SC11": 0, "SC12": 0
  }',
  courses_completed integer DEFAULT 0,
  exercises_completed integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- User Progress policies
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User Achievements policies
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Stats policies
CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_earned ON user_achievements(earned_at DESC);

-- Function to initialize user stats when user signs up
CREATE OR REPLACE FUNCTION initialize_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create stats for new users
DROP TRIGGER IF EXISTS on_user_created ON users;
CREATE TRIGGER on_user_created
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_stats();
