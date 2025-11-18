import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, Clock, Award, Users } from 'lucide-react';

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

export function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<string>('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    filterStage === 'all' || course.target_stage === filterStage
  );

  const stageLabels: Record<string, string> = {
    'all': 'All Stages',
    'idea': 'Idea Stage',
    'pre-launch': 'Pre-Launch',
    '0-10k': '$0-$10K MRR',
    '10k-100k': '$10K-$100K MRR',
    'scaling': 'Scaling'
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
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Course Catalog</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Master the strategic frameworks and AI-powered tools to build your bootstrapped startup
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {Object.entries(stageLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilterStage(value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStage === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No courses found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.slug}`}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition group"
              >
                {course.thumbnail && (
                  <div className="h-48 overflow-hidden bg-slate-200">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {stageLabels[course.target_stage]}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full capitalize">
                      {course.tier}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">
                    {course.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.estimated_hours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolled_students}</span>
                    </div>
                    {course.competencies.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        <span>{course.competencies.length} skills</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="text-2xl font-bold text-slate-900">
                      ${course.price.toFixed(0)}
                    </div>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      View Course
                      <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
