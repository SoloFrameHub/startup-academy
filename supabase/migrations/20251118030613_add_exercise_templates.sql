/*
  # Exercise Template System

  1. New Tables
    - `exercise_templates`
      - `id` (uuid, primary key)
      - `name` (text) - Template name
      - `description` (text) - What this template is for
      - `category` (text) - canvas, matrix, framework, critique, decision, list
      - `template_config` (jsonb) - Template structure and fields
      - `ai_coaching_prompt_template` (text) - Base prompt for AI coaching
      - `evaluation_rubric` (jsonb) - How to evaluate submissions
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `exercise_instances`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, foreign key to lessons)
      - `template_id` (uuid, foreign key to exercise_templates)
      - `custom_config` (jsonb) - Lesson-specific overrides
      - `prompt` (text) - Exercise instructions
      - `estimated_minutes` (integer)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Public read access to templates
    - Authenticated users can view exercise instances
    - Admin-only write access
*/

-- Exercise Templates table
CREATE TABLE IF NOT EXISTS exercise_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('canvas', 'matrix', 'framework', 'critique', 'decision', 'list')),
  template_config jsonb NOT NULL DEFAULT '{}',
  ai_coaching_prompt_template text,
  evaluation_rubric jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Exercise Instances table
CREATE TABLE IF NOT EXISTS exercise_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES exercise_templates(id) ON DELETE RESTRICT,
  custom_config jsonb DEFAULT '{}',
  prompt text NOT NULL,
  estimated_minutes integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE exercise_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_instances ENABLE ROW LEVEL SECURITY;

-- Templates are readable by everyone
CREATE POLICY "Exercise templates are viewable by everyone"
  ON exercise_templates FOR SELECT
  TO authenticated
  USING (true);

-- Exercise instances viewable by authenticated users
CREATE POLICY "Exercise instances viewable by authenticated users"
  ON exercise_instances FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can modify templates (placeholder - implement admin role later)
CREATE POLICY "Only admins can modify templates"
  ON exercise_templates FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Only admins can modify exercise instances"
  ON exercise_instances FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exercise_instances_lesson 
  ON exercise_instances(lesson_id);

CREATE INDEX IF NOT EXISTS idx_exercise_instances_template 
  ON exercise_instances(template_id);

CREATE INDEX IF NOT EXISTS idx_exercise_templates_category 
  ON exercise_templates(category);
