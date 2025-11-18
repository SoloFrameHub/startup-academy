import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Award, Trophy, Flame, Target, BookOpen, Star,
  TrendingUp, Zap, CheckCircle, Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_id: string;
  title: string;
  description: string;
  earned_at: string;
  metadata: any;
}

const achievementIcons: Record<string, any> = {
  'badge': Award,
  'milestone': Trophy,
  'streak': Flame,
  'competency': Target
};

const allPossibleAchievements = [
  {
    id: 'first-lesson',
    type: 'milestone',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: BookOpen
  },
  {
    id: 'first-exercise',
    type: 'milestone',
    title: 'Getting Started',
    description: 'Submit your first exercise',
    icon: CheckCircle
  },
  {
    id: 'first-course',
    type: 'milestone',
    title: 'Course Complete',
    description: 'Finish your first course',
    icon: Trophy
  },
  {
    id: '7-day-streak',
    type: 'streak',
    title: '7-Day Streak',
    description: 'Learn something every day for a week',
    icon: Flame
  },
  {
    id: '30-day-streak',
    type: 'streak',
    title: '30-Day Streak',
    description: 'Learn something every day for a month',
    icon: Flame
  },
  {
    id: 'SC1-master',
    type: 'competency',
    title: 'Market Validation Master',
    description: 'Achieved 90+ score in SC1 (Market Validation)',
    icon: Target
  },
  {
    id: 'SC2-master',
    type: 'competency',
    title: 'Product Strategy Master',
    description: 'Achieved 90+ score in SC2 (Product Strategy)',
    icon: Target
  },
  {
    id: 'SC3-master',
    type: 'competency',
    title: 'Customer Development Master',
    description: 'Achieved 90+ score in SC3 (Customer Development)',
    icon: Target
  },
  {
    id: '100-points',
    type: 'milestone',
    title: 'Level Up',
    description: 'Reach 100 total points',
    icon: Star
  },
  {
    id: '500-points',
    type: 'milestone',
    title: 'Rising Star',
    description: 'Reach 500 total points',
    icon: TrendingUp
  },
  {
    id: '1000-points',
    type: 'milestone',
    title: 'Power User',
    description: 'Reach 1000 total points',
    icon: Zap
  }
];

export function Achievements() {
  const { user, signOut } = useAuth();
  const [earnedAchievements, setEarnedAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user?.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setEarnedAchievements(data || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEarned = (achievementId: string) => {
    return earnedAchievements.some(a => a.achievement_id === achievementId);
  };

  const getEarnedDate = (achievementId: string) => {
    const achievement = earnedAchievements.find(a => a.achievement_id === achievementId);
    return achievement ? new Date(achievement.earned_at).toLocaleDateString() : null;
  };

  const earnedCount = earnedAchievements.length;
  const totalCount = allPossibleAchievements.length;
  const completionPercentage = Math.round((earnedCount / totalCount) * 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-slate-900">Startup Academy</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                  Dashboard
                </Link>
                <Link to="/courses" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                  Courses
                </Link>
                <Link to="/achievements" className="text-sm font-medium text-blue-600">
                  Achievements
                </Link>
              </div>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Achievements</h1>
          <p className="text-slate-600">Track your learning milestones and unlock new badges</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Progress</h2>
              <p className="text-sm text-slate-600">
                {earnedCount} of {totalCount} achievements unlocked
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {earnedCount > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recently Earned</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedAchievements.slice(0, 6).map((achievement) => {
                const Icon = achievementIcons[achievement.achievement_type] || Award;
                return (
                  <div
                    key={achievement.id}
                    className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border-2 border-blue-200 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">{achievement.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{achievement.description}</p>
                        <p className="text-xs text-blue-600">
                          Earned {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">All Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPossibleAchievements.map((achievement) => {
              const earned = isEarned(achievement.id);
              const Icon = achievement.icon;
              const earnedDate = getEarnedDate(achievement.id);

              return (
                <div
                  key={achievement.id}
                  className={`rounded-xl border-2 p-6 transition ${
                    earned
                      ? 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-200'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        earned ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      {earned ? (
                        <Icon className="h-6 w-6 text-white" />
                      ) : (
                        <Lock className="h-6 w-6 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold mb-1 ${earned ? 'text-slate-900' : 'text-slate-600'}`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm mb-2 ${earned ? 'text-slate-600' : 'text-slate-500'}`}>
                        {achievement.description}
                      </p>
                      {earned && earnedDate && (
                        <p className="text-xs text-blue-600">Earned {earnedDate}</p>
                      )}
                      {!earned && (
                        <p className="text-xs text-slate-500">Not yet unlocked</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {earnedCount === 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Start Your Journey!</h3>
            <p className="text-slate-600 mb-4">
              Complete lessons, submit exercises, and maintain streaks to unlock achievements.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
