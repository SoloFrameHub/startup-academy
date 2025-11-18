/*
  # Fix All Security and Performance Issues

  1. Add Missing Indexes
    - Add indexes for foreign key columns to improve query performance
    
  2. Optimize RLS Policies
    - Use (select auth.uid()) to prevent re-evaluation per row
    - Fix array containment checks with proper operators
    
  3. Consolidate Policies
    - Remove duplicate permissive policies
*/

-- Add missing indexes for foreign key columns
CREATE INDEX IF NOT EXISTS idx_progress_current_lesson_id 
  ON public.progress(current_lesson_id) WHERE current_lesson_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_progress_current_lesson_id 
  ON public.user_progress(current_lesson_id) WHERE current_lesson_id IS NOT NULL;

-- Optimize RLS policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- Optimize RLS policies for lessons table
DROP POLICY IF EXISTS "Lessons viewable for enrolled students" ON public.lessons;

CREATE POLICY "Lessons viewable for enrolled students"
  ON public.lessons
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = (select auth.uid())
      AND course_id::text = ANY(enrolled_courses)
    )
  );

-- Optimize RLS policies for exercises table  
DROP POLICY IF EXISTS "Exercises viewable for enrolled students" ON public.exercises;

CREATE POLICY "Exercises viewable for enrolled students"
  ON public.exercises
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.lessons l
      JOIN public.users u ON l.course_id::text = ANY(u.enrolled_courses)
      WHERE l.id = exercises.lesson_id
      AND u.id = (select auth.uid())
    )
  );

-- Optimize RLS policies for submissions table
DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can create submissions for enrolled courses" ON public.submissions;
DROP POLICY IF EXISTS "Users can update own draft submissions" ON public.submissions;

CREATE POLICY "Users can view own submissions"
  ON public.submissions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create submissions for enrolled courses"
  ON public.submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.exercises e
      JOIN public.lessons l ON l.id = e.lesson_id
      JOIN public.users u ON l.course_id::text = ANY(u.enrolled_courses)
      WHERE e.id = submissions.exercise_id
      AND u.id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own draft submissions"
  ON public.submissions
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()) AND status = 'draft')
  WITH CHECK (user_id = (select auth.uid()));

-- Optimize RLS policies for progress table
DROP POLICY IF EXISTS "Users can view own progress" ON public.progress;
DROP POLICY IF EXISTS "Users can create progress for enrolled courses" ON public.progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.progress;

CREATE POLICY "Users can view own progress"
  ON public.progress
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create progress for enrolled courses"
  ON public.progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = (select auth.uid())
      AND course_id::text = ANY(enrolled_courses)
    )
  );

CREATE POLICY "Users can update own progress"
  ON public.progress
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Optimize RLS policies for user_progress table
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

CREATE POLICY "Users can view own progress"
  ON public.user_progress
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own progress"
  ON public.user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own progress"
  ON public.user_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Optimize RLS policies for user_achievements table
DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Optimize RLS policies for user_stats table
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;

CREATE POLICY "Users can view own stats"
  ON public.user_stats
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update own stats"
  ON public.user_stats
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own stats"
  ON public.user_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Fix multiple permissive policies for exercise_instances
DROP POLICY IF EXISTS "Exercise instances viewable by authenticated users" ON public.exercise_instances;
DROP POLICY IF EXISTS "Only admins can modify exercise instances" ON public.exercise_instances;

CREATE POLICY "Users can view enrolled exercise instances"
  ON public.exercise_instances
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.lessons l
      JOIN public.users u ON l.course_id::text = ANY(u.enrolled_courses)
      WHERE l.id = exercise_instances.lesson_id
      AND u.id = (select auth.uid())
    )
  );

-- Fix multiple permissive policies for exercise_templates
DROP POLICY IF EXISTS "Exercise templates are viewable by everyone" ON public.exercise_templates;
DROP POLICY IF EXISTS "Only admins can modify templates" ON public.exercise_templates;

CREATE POLICY "Users can view all templates"
  ON public.exercise_templates
  FOR SELECT
  TO authenticated
  USING (true);
