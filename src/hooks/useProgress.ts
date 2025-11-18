import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CourseProgress {
  id: string;
  course_id: string;
  completed_lessons: string[];
  current_lesson_id: string | null;
  completion_percentage: number;
  total_time_spent: number;
  last_accessed: string;
  started_at: string;
  completed_at: string | null;
}

interface UserStats {
  user_id: string;
  total_points: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  competency_scores: Record<string, number>;
  courses_completed: number;
  exercises_completed: number;
}

export function useProgress() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setStats(data);
      } else {
        const { data: newStats } = await supabase
          .from('user_stats')
          .insert({ user_id: user.id })
          .select()
          .single();
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseProgress = async (courseId: string): Promise<CourseProgress | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error loading course progress:', error);
      return null;
    }
  };

  const startCourse = async (courseId: string) => {
    if (!user) return;

    try {
      const existing = await getCourseProgress(courseId);
      if (existing) return existing;

      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting course:', error);
    }
  };

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    if (!user) return;

    try {
      const progress = await getCourseProgress(courseId);

      if (!progress) {
        await startCourse(courseId);
      }

      const completedLessons = progress?.completed_lessons || [];

      if (completedLessons.includes(lessonId)) {
        return;
      }

      const { data: allLessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);

      const totalLessons = allLessons?.length || 1;
      const newCompletedLessons = [...completedLessons, lessonId];
      const completionPercentage = Math.round((newCompletedLessons.length / totalLessons) * 100);

      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          completed_lessons: newCompletedLessons,
          completion_percentage: completionPercentage,
          last_accessed: new Date().toISOString(),
          completed_at: completionPercentage === 100 ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,course_id'
        });

      await awardPoints('lesson_completed', 5);

      if (completionPercentage === 100) {
        await awardPoints('course_completed', 50);
        await supabase
          .from('user_stats')
          .update({
            courses_completed: (stats?.courses_completed || 0) + 1
          })
          .eq('user_id', user.id);
      }

      await loadStats();
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const updateCurrentLesson = async (courseId: string, lessonId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          current_lesson_id: lessonId,
          last_accessed: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id'
        });

      await updateStreak();
    } catch (error) {
      console.error('Error updating current lesson:', error);
    }
  };

  const awardPoints = async (activityType: string, points: number) => {
    if (!user || !stats) return;

    try {
      const newTotal = stats.total_points + points;
      const newLevel = Math.floor(newTotal / 100) + 1;

      await supabase
        .from('user_stats')
        .update({
          total_points: newTotal,
          current_level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      setStats(prev => prev ? {
        ...prev,
        total_points: newTotal,
        current_level: newLevel
      } : null);
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const updateStreak = async () => {
    if (!user || !stats) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = stats.last_activity_date;

      let newStreak = stats.current_streak;

      if (!lastActivity) {
        newStreak = 1;
      } else {
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          return;
        } else if (diffDays === 1) {
          newStreak = stats.current_streak + 1;
        } else {
          newStreak = 1;
        }
      }

      const longestStreak = Math.max(newStreak, stats.longest_streak);

      await supabase
        .from('user_stats')
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_activity_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (newStreak === 7 || newStreak === 30) {
        await awardAchievement('streak', `${newStreak}-day-streak`, {
          title: `${newStreak}-Day Streak`,
          description: `Learned something every day for ${newStreak} days`,
          days: newStreak
        });
      }

      setStats(prev => prev ? {
        ...prev,
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_activity_date: today
      } : null);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const awardAchievement = async (
    type: string,
    achievementId: string,
    details: { title: string; description: string; [key: string]: any }
  ) => {
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_id', achievementId)
        .maybeSingle();

      if (existing) return;

      await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: type,
          achievement_id: achievementId,
          title: details.title,
          description: details.description,
          metadata: details
        });
    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  };

  const updateCompetencyScore = async (competency: string, score: number) => {
    if (!user || !stats) return;

    try {
      const currentScores = stats.competency_scores || {};
      const currentScore = currentScores[competency] || 0;
      const newScore = Math.round((currentScore + score) / 2);

      const updatedScores = {
        ...currentScores,
        [competency]: newScore
      };

      await supabase
        .from('user_stats')
        .update({
          competency_scores: updatedScores,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      setStats(prev => prev ? {
        ...prev,
        competency_scores: updatedScores
      } : null);

      if (newScore >= 90) {
        await awardAchievement('competency', `${competency}-master`, {
          title: `${competency} Master`,
          description: `Achieved 90+ score in ${competency}`,
          competency,
          score: newScore
        });
      }
    } catch (error) {
      console.error('Error updating competency score:', error);
    }
  };

  return {
    stats,
    loading,
    getCourseProgress,
    startCourse,
    markLessonComplete,
    updateCurrentLesson,
    awardPoints,
    updateCompetencyScore,
    awardAchievement,
    refreshStats: loadStats
  };
}
