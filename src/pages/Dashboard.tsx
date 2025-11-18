import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BookOpen, TrendingUp, Award, Flame } from 'lucide-react';

interface UserProfile {
  display_name: string | null;
  current_streak: number;
  total_points: number;
  current_level: string;
  competency_scores: Record<string, number>;
  enrolled_courses: string[];
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">Startup Academy</span>
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {profile?.display_name || 'Founder'}
          </h1>
          <p className="text-slate-600">Continue building your startup knowledge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{profile?.current_streak || 0} days</div>
            <div className="text-sm text-slate-600">Current Streak</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{profile?.enrolled_courses?.length || 0}</div>
            <div className="text-sm text-slate-600">Enrolled Courses</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{profile?.total_points || 0}</div>
            <div className="text-sm text-slate-600">Total Points</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-slate-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{profile?.current_level || 'Aspiring Founder'}</div>
            <div className="text-sm text-slate-600">Current Level</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Getting Started</h2>
          <p className="text-slate-600 mb-6">
            Welcome to Startup Academy! This platform will help you build strategic thinking skills
            and learn AI-powered frameworks for building your bootstrapped business.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Step 1: Browse Courses</h3>
              <p className="text-sm text-slate-600">
                Explore our course catalog to find courses that match your startup stage and goals.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Step 2: Enroll and Learn</h3>
              <p className="text-sm text-slate-600">
                Work through interactive lessons, complete exercises, and get AI coaching to deepen your thinking.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Step 3: Apply and Build</h3>
              <p className="text-sm text-slate-600">
                Take what you learn and apply it directly to your business. Track your progress and celebrate milestones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
