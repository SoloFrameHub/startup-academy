/*
  # Make exercise_id nullable in submissions table

  ## Problem
  The submissions table has exercise_id as NOT NULL, but the new system uses exercise_instance_id.
  This causes insert failures when submitting exercises.

  ## Changes
  1. Make exercise_id column nullable for backward compatibility
  2. Add check constraint to ensure at least one of exercise_id or exercise_instance_id is provided
  
  ## Security
  No RLS changes needed - existing policies remain in place
*/

-- Make exercise_id nullable
ALTER TABLE submissions 
ALTER COLUMN exercise_id DROP NOT NULL;

-- Add check constraint to ensure at least one ID is provided
ALTER TABLE submissions
ADD CONSTRAINT submissions_exercise_reference_check 
CHECK (exercise_id IS NOT NULL OR exercise_instance_id IS NOT NULL);

-- Add helpful comment
COMMENT ON TABLE submissions IS 
'Exercise submissions. Must have either exercise_id (legacy) or exercise_instance_id (new system).';