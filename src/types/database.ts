export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          enrolled_courses: string[]
          completed_lessons: string[]
          current_streak: number
          joined_date: string
          subscription_tier: 'free' | 'core' | 'premium' | 'elite'
          competency_scores: Json
          total_points: number
          current_level: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          enrolled_courses?: string[]
          completed_lessons?: string[]
          current_streak?: number
          joined_date?: string
          subscription_tier?: 'free' | 'core' | 'premium' | 'elite'
          competency_scores?: Json
          total_points?: number
          current_level?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          enrolled_courses?: string[]
          completed_lessons?: string[]
          current_streak?: number
          joined_date?: string
          subscription_tier?: 'free' | 'core' | 'premium' | 'elite'
          competency_scores?: Json
          total_points?: number
          current_level?: string
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          price: number
          tier: 'foundation' | 'growth' | 'scale' | 'mastery'
          competencies: string[]
          target_stage: 'idea' | 'pre-launch' | '0-10k' | '10k-100k' | 'scaling'
          prerequisites: string[]
          estimated_hours: number
          thumbnail: string | null
          status: 'draft' | 'published' | 'archived'
          enrolled_students: number
          completion_rate: number
          average_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          price: number
          tier: 'foundation' | 'growth' | 'scale' | 'mastery'
          competencies?: string[]
          target_stage: 'idea' | 'pre-launch' | '0-10k' | '10k-100k' | 'scaling'
          prerequisites?: string[]
          estimated_hours: number
          thumbnail?: string | null
          status?: 'draft' | 'published' | 'archived'
          enrolled_students?: number
          completion_rate?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          price?: number
          tier?: 'foundation' | 'growth' | 'scale' | 'mastery'
          competencies?: string[]
          target_stage?: 'idea' | 'pre-launch' | '0-10k' | '10k-100k' | 'scaling'
          prerequisites?: string[]
          estimated_hours?: number
          thumbnail?: string | null
          status?: 'draft' | 'published' | 'archived'
          enrolled_students?: number
          completion_rate?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          order: number
          title: string
          objectives: string[]
          estimated_minutes: number
          content_type: 'video' | 'article' | 'interactive' | 'case-study' | 'assessment'
          content: Json
          resources: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          order: number
          title: string
          objectives?: string[]
          estimated_minutes: number
          content_type: 'video' | 'article' | 'interactive' | 'case-study' | 'assessment'
          content: Json
          resources?: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          order?: number
          title?: string
          objectives?: string[]
          estimated_minutes?: number
          content_type?: 'video' | 'article' | 'interactive' | 'case-study' | 'assessment'
          content?: Json
          resources?: Json[]
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          lesson_id: string
          type: 'framework_builder' | 'analysis_tool' | 'decision_framework' | 'document_critique'
          prompt: string
          instructions: Json
          ai_coaching_prompt: string
          evaluation_criteria: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          type: 'framework_builder' | 'analysis_tool' | 'decision_framework' | 'document_critique'
          prompt: string
          instructions: Json
          ai_coaching_prompt: string
          evaluation_criteria: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          type?: 'framework_builder' | 'analysis_tool' | 'decision_framework' | 'document_critique'
          prompt?: string
          instructions?: Json
          ai_coaching_prompt?: string
          evaluation_criteria?: Json
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          user_response: Json
          ai_evaluation: Json | null
          scores: Json | null
          status: 'draft' | 'submitted' | 'evaluated' | 'revised'
          submitted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          user_response: Json
          ai_evaluation?: Json | null
          scores?: Json | null
          status?: 'draft' | 'submitted' | 'evaluated' | 'revised'
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          user_response?: Json
          ai_evaluation?: Json | null
          scores?: Json | null
          status?: 'draft' | 'submitted' | 'evaluated' | 'revised'
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          completed_lessons: string[]
          current_lesson_id: string | null
          completion_percentage: number
          time_spent_minutes: number
          last_accessed: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          completed_lessons?: string[]
          current_lesson_id?: string | null
          completion_percentage?: number
          time_spent_minutes?: number
          last_accessed?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          completed_lessons?: string[]
          current_lesson_id?: string | null
          completion_percentage?: number
          time_spent_minutes?: number
          last_accessed?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
