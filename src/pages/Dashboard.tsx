import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useProgress } from '../hooks/useProgress';
import { BookOpen, TrendingUp, Award, Flame, Play, CheckCircle } from 'lucide-react';

interface UserProfile {
  display_name: string | null;
  current_streak: number;
  total_points: number;
  current_level: string;
  competency_scores: Record<string, number>;
  enrolled_courses: string[];
}

interface EnrolledCourse {
  id: string;
  title: string;
  slug: string;
  progress?: {
    completion_percentage: number;
    current_lesson_id: string | null;
  };
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { stats, loading: statsLoading } = useProgress();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadEnrolledCourses();
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

  const loadEnrolledCourses = async () => {
    try {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('course_id, completion_percentage, current_lesson_id')
        .eq('user_id', user?.id);

      if (progressData && progressData.length > 0) {
        const courseIds = progressData.map(p => p.course_id);
        const { data: courses } = await supabase
          .from('courses')
          .select('id, title, slug')
          .in('id', courseIds);

        const coursesWithProgress = courses?.map(course => ({
          ...course,
          progress: progressData.find(p => p.course_id === course.id)
        })) || [];

        setEnrolledCourses(coursesWithProgress);
      }
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
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
            <div className="text-2xl font-bold text-slate-900 mb-1">{stats?.current_streak || 0} days</div>
            <div className="text-sm text-slate-600">Current Streak</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{stats?.courses_completed || 0}</div>
            <div className="text-sm text-slate-600">Courses Completed</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{stats?.total_points || 0}</div>
            <div className="text-sm text-slate-600">Total Points</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-slate-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">Level {stats?.current_level || 1}</div>
            <div className="text-sm text-slate-600">Current Level</div>
          </div>
        </div>

        {enrolledCourses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Your Courses</h2>
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">{course.title}</h3>
                    <span className="text-sm font-medium text-blue-600">
                      {course.progress?.completion_percentage || 0}%
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress?.completion_percentage || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {course.progress?.completion_percentage === 100 ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <Link
                        to={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        <Play className="h-4 w-4" />
                        Continue Learning
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Getting Started</h2>
          <p className="text-slate-600 mb-6">
            Welcome to Startup Academy! This platform will help you build strategic thinking skills
            and learn AI-powered frameworks for building your bootstrapped business.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Step 1: Browse Courses</h3>
              <p className="text-sm text-slate-600 mb-3">
                Explore our course catalog to find courses that match your startup stage and goals.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Browse Courses
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
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
