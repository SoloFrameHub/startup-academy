import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../hooks/useProgress';
import {
  BookOpen, ChevronLeft, ChevronRight, CheckCircle,
  Play, FileText, Code, Clock, Target
} from 'lucide-react';

function GetExerciseButton({ lessonId }: { lessonId: string }) {
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercise();
  }, [lessonId]);

  const loadExercise = async () => {
    try {
      const { data } = await supabase
        .from('exercise_instances')
        .select('id')
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (data) {
        setExerciseId(data.id);
      }
    } catch (error) {
      console.error('Error loading exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="inline-flex items-center px-6 py-3 bg-slate-200 text-slate-400 rounded-lg">
        Loading...
      </div>
    );
  }

  if (!exerciseId) {
    return (
      <div className="text-sm text-slate-500">
        Exercise not yet configured for this lesson
      </div>
    );
  }

  return (
    <Link
      to={`/exercise/${exerciseId}`}
      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
    >
      Start Exercise
      <ChevronRight className="ml-2 h-5 w-5" />
    </Link>
  );
}

interface Lesson {
  id: string;
  course_id: string;
  lesson_order: number;
  title: string;
  objectives: string[];
  estimated_minutes: number;
  content_type: 'video' | 'article' | 'interactive' | 'case-study' | 'assessment';
  content: any;
  resources: any[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

export function LessonPlayer() {
  const { courseSlug, lessonOrder } = useParams<{ courseSlug: string; lessonOrder: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { markLessonComplete, updateCurrentLesson, getCourseProgress } = useProgress();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    if (courseSlug && lessonOrder) {
      loadLesson();
    }
  }, [courseSlug, lessonOrder]);

  const loadLesson = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, slug')
        .eq('slug', courseSlug)
        .maybeSingle();

      if (courseError) throw courseError;
      if (!courseData) {
        navigate('/courses');
        return;
      }

      setCourse(courseData);

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .order('lesson_order', { ascending: true });

      if (lessonsError) throw lessonsError;
      setAllLessons(lessonsData || []);

      const currentLesson = lessonsData?.find(
        (l) => l.lesson_order === parseInt(lessonOrder || '1')
      );

      if (!currentLesson) {
        navigate(`/courses/${courseSlug}`);
        return;
      }

      setLesson(currentLesson);

      updateCurrentLesson(courseData.id, currentLesson.id);

      const progress = await getCourseProgress(courseData.id);
      if (progress) {
        setCompletedLessons(progress.completed_lessons || []);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextLesson = () => {
    if (lesson && allLessons.length > 0) {
      const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
      if (currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        navigate(`/learn/${courseSlug}/${nextLesson.lesson_order}`);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (lesson && allLessons.length > 0) {
      const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
      if (currentIndex > 0) {
        const prevLesson = allLessons[currentIndex - 1];
        navigate(`/learn/${courseSlug}/${prevLesson.lesson_order}`);
      }
    }
  };

  const handleMarkComplete = async () => {
    if (!lesson || !course) return;

    try {
      await markLessonComplete(course.id, lesson.id);
      setCompletedLessons(prev => {
        if (prev.includes(lesson.id)) return prev;
        return [...prev, lesson.id];
      });

      handleNextLesson();
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-5 w-5" />;
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'interactive':
        return <Code className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const renderContent = () => {
    if (!lesson) return null;

    switch (lesson.content_type) {
      case 'video':
        return (
          <div className="space-y-6">
            <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400">Video player placeholder</p>
                <p className="text-sm text-slate-500 mt-2">
                  Video URL: {lesson.content?.videoUrl || 'Not configured'}
                </p>
              </div>
            </div>
            {lesson.content?.transcript && (
              <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Transcript</h3>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {lesson.content.transcript}
                </p>
              </div>
            )}
          </div>
        );

      case 'article':
        return (
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content?.content || '<p>No content available</p>' }}
          />
        );

      case 'interactive':
        return (
          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600 text-white rounded-lg">
                  <Code className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Interactive Exercise</h3>
                  <p className="text-sm text-slate-600">Hands-on practice with AI coaching</p>
                </div>
              </div>
              <p className="text-slate-700 mb-4">{lesson.content?.prompt || 'Complete this interactive exercise to deepen your understanding.'}</p>
              <GetExerciseButton lessonId={lesson.id} />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 bg-slate-50 rounded-lg text-center text-slate-600">
            Content type not yet implemented: {lesson.content_type}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Lesson not found</p>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4 border-b border-slate-200">
            <Link
              to={`/courses/${courseSlug}`}
              className="flex items-center text-sm text-slate-600 hover:text-slate-900 mb-3"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Course
            </Link>
            <h2 className="font-bold text-slate-900">{course.title}</h2>
            <div className="mt-2 flex items-center text-sm text-slate-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              {currentIndex + 1} of {allLessons.length} lessons
            </div>
          </div>

          <div className="p-2">
            {allLessons.map((l, index) => (
              <Link
                key={l.id}
                to={`/learn/${courseSlug}/${l.lesson_order}`}
                className={`flex items-center gap-3 p-3 rounded-lg mb-1 transition ${
                  l.id === lesson.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  l.id === lesson.id ? 'bg-blue-100' : 'bg-slate-100'
                }`}>
                  {getContentIcon(l.content_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{l.title}</div>
                  <div className="text-xs text-slate-500">{l.estimated_minutes} min</div>
                </div>
                {completedLessons.includes(l.id) && (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <BookOpen className="h-4 w-4" />
              <span>Lesson {lesson.lesson_order}</span>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{lesson.estimated_minutes} minutes</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {lesson.title}
            </h1>

            {lesson.objectives.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Learning Objectives</h3>
                </div>
                <ul className="space-y-2">
                  {lesson.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            {renderContent()}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousLesson}
              disabled={!hasPrevious}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous Lesson
            </button>

            <button
              onClick={handleMarkComplete}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              {hasNext ? 'Complete & Continue' : 'Complete Lesson'}
            </button>

            <button
              onClick={handleNextLesson}
              disabled={!hasNext}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Lesson
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
