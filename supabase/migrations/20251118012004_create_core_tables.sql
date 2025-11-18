/*
  # Startup Academy - Core Database Schema

  ## Overview
  This migration creates the foundational database structure for the Startup Academy platform,
  an AI-powered educational platform for solo founders and small teams building bootstrapped businesses.

  ## New Tables

  ### 1. `users`
  Extended user profiles with learning progress and gamification data
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email address
  - `display_name` (text) - User's display name
  - `enrolled_courses` (text[]) - Array of enrolled course IDs
  - `completed_lessons` (text[]) - Array of completed lesson IDs
  - `current_streak` (integer) - Consecutive days of activity
  - `joined_date` (timestamptz) - Account creation date
  - `subscription_tier` (enum) - Subscription level: free, core, premium, elite
  - `competency_scores` (jsonb) - SC1-SC12 competency scores (0-100)
  - `total_points` (integer) - Gamification points total
  - `current_level` (text) - Current progression level

  ### 2. `courses`
  Course catalog with metadata and statistics
  - `id` (uuid, primary key) - Unique course identifier
  - `title` (text) - Course title
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Detailed course description
  - `price` (numeric) - Course price in USD
  - `tier` (enum) - Course tier: foundation, growth, scale, mastery
  - `competencies` (text[]) - Competencies covered (SC1-SC12)
  - `target_stage` (enum) - Target startup stage
  - `prerequisites` (text[]) - Required prerequisite course IDs
  - `estimated_hours` (integer) - Estimated completion time
  - `thumbnail` (text) - Course thumbnail URL
  - `status` (enum) - Publication status
  - `enrolled_students` (integer) - Total enrollment count
  - `completion_rate` (numeric) - Percentage of students who complete
  - `average_rating` (numeric) - Average rating 0-5

  ### 3. `lessons`
  Individual lesson content within courses
  - `id` (uuid, primary key) - Unique lesson identifier
  - `course_id` (uuid, foreign key) - Parent course
  - `lesson_order` (integer) - Lesson sequence order
  - `title` (text) - Lesson title
  - `objectives` (text[]) - Learning objectives
  - `estimated_minutes` (integer) - Estimated completion time
  - `content_type` (enum) - Type: video, article, interactive, case-study, assessment
  - `content` (jsonb) - Lesson content and metadata
  - `resources` (jsonb[]) - Downloadable resources

  ### 4. `exercises`
  Interactive exercises and assessments
  - `id` (uuid, primary key) - Unique exercise identifier
  - `lesson_id` (uuid, foreign key) - Parent lesson
  - `type` (enum) - Exercise type: framework_builder, analysis_tool, etc.
  - `prompt` (text) - Exercise instructions
  - `instructions` (jsonb) - Detailed step-by-step instructions
  - `ai_coaching_prompt` (text) - AI coaching system prompt
  - `evaluation_criteria` (jsonb) - Rubric for AI evaluation

  ### 5. `submissions`
  Student exercise submissions and AI evaluations
  - `id` (uuid, primary key) - Unique submission identifier
  - `user_id` (uuid, foreign key) - Student who submitted
  - `exercise_id` (uuid, foreign key) - Exercise being completed
  - `user_response` (jsonb) - Student's submission data
  - `ai_evaluation` (jsonb) - AI-generated evaluation and feedback
  - `scores` (jsonb) - Evaluation scores
  - `status` (enum) - Submission status: draft, submitted, evaluated, revised
  - `submitted_at` (timestamptz) - Submission timestamp

  ### 6. `progress`
  Student progress tracking per course
  - `id` (uuid, primary key) - Unique progress record
  - `user_id` (uuid, foreign key) - Student
  - `course_id` (uuid, foreign key) - Course
  - `completed_lessons` (text[]) - Array of completed lesson IDs
  - `current_lesson_id` (uuid) - Currently active lesson
  - `completion_percentage` (numeric) - Progress 0-100
  - `time_spent_minutes` (integer) - Total time spent
  - `last_accessed` (timestamptz) - Last activity timestamp

  ## Security

  Row Level Security enabled on all tables with policies restricting access appropriately.

  ## Indexes
  Performance indexes on frequently queried columns and foreign keys.
*/

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'core', 'premium', 'elite');
CREATE TYPE course_tier AS ENUM ('foundation', 'growth', 'scale', 'mastery');
CREATE TYPE target_stage AS ENUM ('idea', 'pre-launch', '0-10k', '10k-100k', 'scaling');
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE content_type AS ENUM ('video', 'article', 'interactive', 'case-study', 'assessment');
CREATE TYPE exercise_type AS ENUM ('framework_builder', 'analysis_tool', 'decision_framework', 'document_critique');
CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'evaluated', 'revised');

-- Users table (extended profiles)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text,
  enrolled_courses text[] DEFAULT '{}',
  completed_lessons text[] DEFAULT '{}',
  current_streak integer DEFAULT 0,
  joined_date timestamptz DEFAULT now(),
  subscription_tier subscription_tier DEFAULT 'free',
  competency_scores jsonb DEFAULT '{"SC1":0,"SC2":0,"SC3":0,"SC4":0,"SC5":0,"SC6":0,"SC7":0,"SC8":0,"SC9":0,"SC10":0,"SC11":0,"SC12":0}',
  total_points integer DEFAULT 0,
  current_level text DEFAULT 'Aspiring Founder',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  tier course_tier NOT NULL,
  competencies text[] DEFAULT '{}',
  target_stage target_stage NOT NULL,
  prerequisites text[] DEFAULT '{}',
  estimated_hours integer NOT NULL,
  thumbnail text,
  status course_status DEFAULT 'draft',
  enrolled_students integer DEFAULT 0,
  completion_rate numeric(5,2) DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_order integer NOT NULL,
  title text NOT NULL,
  objectives text[] DEFAULT '{}',
  estimated_minutes integer NOT NULL,
  content_type content_type NOT NULL,
  content jsonb NOT NULL,
  resources jsonb[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, lesson_order)
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type exercise_type NOT NULL,
  prompt text NOT NULL,
  instructions jsonb NOT NULL,
  ai_coaching_prompt text NOT NULL,
  evaluation_criteria jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  user_response jsonb NOT NULL,
  ai_evaluation jsonb,
  scores jsonb,
  status submission_status DEFAULT 'draft',
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons text[] DEFAULT '{}',
  current_lesson_id uuid REFERENCES lessons(id),
  completion_percentage numeric(5,2) DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_exercise_id ON submissions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_id ON progress(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for courses table
CREATE POLICY "Published courses are viewable by authenticated users"
  ON courses FOR SELECT
  TO authenticated
  USING (status = 'published');

-- RLS Policies for lessons table
CREATE POLICY "Lessons viewable for enrolled students"
  ON lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND course_id::text = ANY(users.enrolled_courses)
    )
    OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.status = 'published'
    )
  );

-- RLS Policies for exercises table
CREATE POLICY "Exercises viewable for enrolled students"
  ON exercises FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      JOIN users ON auth.uid() = users.id
      WHERE lessons.id = exercises.lesson_id
      AND lessons.course_id::text = ANY(users.enrolled_courses)
    )
  );

-- RLS Policies for submissions table
CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions for enrolled courses"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM exercises
      JOIN lessons ON lessons.id = exercises.lesson_id
      JOIN users ON users.id = auth.uid()
      WHERE exercises.id = exercise_id
      AND lessons.course_id::text = ANY(users.enrolled_courses)
    )
  );

CREATE POLICY "Users can update own draft submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'draft')
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for progress table
CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create progress for enrolled courses"
  ON progress FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND course_id::text = ANY(users.enrolled_courses)
    )
  );

CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
