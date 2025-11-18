import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, Award, Users, CheckCircle, Play, FileText, Code } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  tier: string;
  competencies: string[];
  target_stage: string;
  estimated_hours: number;
  thumbnail: string | null;
  enrolled_students: number;
  average_rating: number;
}

interface Lesson {
  id: string;
  lesson_order: number;
  title: string;
  objectives: string[];
  estimated_minutes: number;
  content_type: string;
}

export function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (slug) {
      loadCourse();
    }
  }, [slug]);

  const loadCourse = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (courseError) throw courseError;
      if (!courseData) {
        navigate('/courses');
        return;
      }

      setCourse(courseData);

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, lesson_order, title, objectives, estimated_minutes, content_type')
        .eq('course_id', courseData.id)
        .order('lesson_order', { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('enrolled_courses')
          .eq('id', user.id)
          .maybeSingle();

        if (!userError && userData) {
          setIsEnrolled(userData.enrolled_courses.includes(courseData.id));
        }
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user || !course) return;

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('enrolled_courses')
        .eq('id', user.id)
        .maybeSingle();

      const currentCourses = userData?.enrolled_courses || [];
      if (!currentCourses.includes(course.id)) {
        await supabase
          .from('users')
          .update({
            enrolled_courses: [...currentCourses, course.id]
          })
          .eq('id', user.id);
      }

      await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          course_id: course.id
        });

      setIsEnrolled(true);

      navigate(`/learn/${course.slug}/1`);
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Error enrolling in course. Please try again.');
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'interactive':
        return <Code className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {course.target_stage}
                </span>
                <span className="px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full capitalize">
                  {course.tier} Track
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {course.title}
              </h1>

              <p className="text-xl text-blue-100 mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.estimated_hours} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.enrolled_students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>{course.competencies.length} competencies</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-2xl">
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="text-3xl font-bold text-slate-900 mb-4">
                  ${course.price.toFixed(0)}
                </div>

                {isEnrolled ? (
                  <Link
                    to={`/learn/${course.slug}/1`}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Continue Learning
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Enroll Now
                  </button>
                )}

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">This course includes:</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {lessons.length} lessons
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Interactive exercises with AI coaching
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Lifetime access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Community support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-200">
            <nav className="flex gap-8 px-6">
              {['overview', 'curriculum', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 border-b-2 font-medium capitalize transition ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lessons.slice(0, 6).map((lesson) => (
                      <div key={lesson.id} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{lesson.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Competencies Covered</h2>
                  <div className="flex flex-wrap gap-2">
                    {course.competencies.map((comp) => (
                      <span
                        key={comp}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Curriculum</h2>
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition"
                    >
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {getContentIcon(lesson.content_type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{lesson.title}</div>
                        <div className="text-sm text-slate-600 capitalize">{lesson.content_type}</div>
                      </div>
                      <div className="text-sm text-slate-500">{lesson.estimated_minutes} min</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-slate-600">Reviews coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
