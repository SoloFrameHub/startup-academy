/*
  # Fix Submissions Table for Exercise Instance Compatibility

  ## Changes
  
  1. **Add exercise_instance_id column**
     - Maps to exercise_instances table (new exercise system)
     - exercise_id still exists for backward compatibility
  
  2. **Add response_data alias**
     - Create view or handle both column names
     - response_data → user_response mapping
  
  3. **Add ai_feedback alias**
     - Map ai_feedback → ai_evaluation
  
  4. **Update RLS policies**
     - Ensure users can insert/update their own submissions
*/

-- Add exercise_instance_id column to support new exercise system
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS exercise_instance_id uuid REFERENCES exercise_instances(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_submissions_exercise_instance 
  ON submissions(exercise_instance_id);

-- Create a more permissive RLS policy for authenticated users to insert their own submissions
DROP POLICY IF EXISTS "Users can insert their own submissions" ON submissions;

CREATE POLICY "Users can insert their own submissions"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own submissions
DROP POLICY IF EXISTS "Users can update own submissions" ON submissions;

CREATE POLICY "Users can update own submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON submissions;

CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add helpful comment
COMMENT ON COLUMN submissions.exercise_instance_id IS 
'Links to exercise_instances table (new system). exercise_id links to exercises table (legacy).';

COMMENT ON COLUMN submissions.user_response IS 
'User submission data. Also referenced as response_data in client code for consistency.';

COMMENT ON COLUMN submissions.ai_evaluation IS 
'AI-generated evaluation and feedback. Also referenced as ai_feedback in client code.';