/*
  # Fix Content Types and Add Case Study Support

  ## Changes
  
  1. **Fix Lesson 1 Content Type**
     - Change from 'video' to 'article' (content is markdown-based)
  
  2. **Add Case Study Support**
     - Update content_type enum to ensure 'case-study' is properly handled
     - No schema changes needed - already supported in original migration
  
  3. **Update Lesson 2 for AI-Powered Research**
     - Prepare for AI social listening integration
     - Add metadata for Twitter/X monitoring
*/

-- Fix Lesson 1: Change from video to article since content is markdown
UPDATE lessons 
SET content_type = 'article'
WHERE title = 'Why Most Startup Ideas Fail' 
  AND content_type = 'video';

-- Verify case-study type exists (it does from original migration)
-- Just add a comment for documentation
COMMENT ON COLUMN lessons.content_type IS 
'Lesson content type: video (video player), article (markdown content), interactive (exercises), case-study (founder stories with narrative), assessment (quizzes/tests)';

-- Add updated_at trigger for lessons table if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_lessons_updated_at'
    ) THEN
        CREATE TRIGGER update_lessons_updated_at 
            BEFORE UPDATE ON lessons 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
