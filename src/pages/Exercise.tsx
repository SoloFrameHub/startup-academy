import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ExerciseTemplateRenderer } from '../components/ExerciseTemplateRenderer';
import { AICoachingChat } from '../components/AICoachingChat';
import {
  Save, Send, MessageSquare, ChevronLeft,
  CheckCircle, AlertCircle, Loader
} from 'lucide-react';

interface ExerciseInstance {
  id: string;
  lesson_id: string;
  template_id: string;
  prompt: string;
  estimated_minutes: number;
  custom_config: any;
}

interface ExerciseTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template_config: any;
  ai_coaching_prompt_template: string;
  evaluation_rubric: any;
}

interface Submission {
  id: string;
  user_id: string;
  exercise_instance_id: string;
  user_response: any;
  ai_evaluation: any;
  scores: any;
  status: string;
  submitted_at: string;
}

export function Exercise() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState<ExerciseInstance | null>(null);
  const [template, setTemplate] = useState<ExerciseTemplate | null>(null);
  const [responseData, setResponseData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [showAICoach, setShowAICoach] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (exerciseId) {
      loadExercise();
    }
  }, [exerciseId]);

  const loadExercise = async () => {
    try {
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercise_instances')
        .select('*')
        .eq('id', exerciseId)
        .maybeSingle();

      if (exerciseError) throw exerciseError;
      if (!exerciseData) {
        navigate('/dashboard');
        return;
      }

      setExercise(exerciseData);

      const { data: templateData, error: templateError } = await supabase
        .from('exercise_templates')
        .select('*')
        .eq('id', exerciseData.template_id)
        .maybeSingle();

      if (templateError) throw templateError;
      setTemplate(templateData);

      const { data: submissionData } = await supabase
        .from('submissions')
        .select('*')
        .eq('exercise_instance_id', exerciseId)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (submissionData) {
        setSubmission(submissionData);
        setResponseData(submissionData.user_response || {});
      }
    } catch (error) {
      console.error('Error loading exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!exercise || !user) return;

    setSaving(true);
    try {
      const { data: existingDraft } = await supabase
        .from('submissions')
        .select('id')
        .eq('exercise_instance_id', exercise.id)
        .eq('user_id', user.id)
        .is('submitted_at', null)
        .maybeSingle();

      if (existingDraft) {
        await supabase
          .from('submissions')
          .update({
            user_response: responseData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDraft.id);
      } else {
        await supabase
          .from('submissions')
          .insert({
            user_id: user.id,
            exercise_instance_id: exercise.id,
            user_response: responseData,
            status: 'draft'
          });
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!exercise || !user || !template) return;

    if (!validateSubmission()) {
      alert('Please complete all required fields before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const { data: submissionData, error } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          exercise_instance_id: exercise.id,
          user_response: responseData,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setSubmission(submissionData);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate-exercise`;
      const { data: { session } } = await supabase.auth.getSession();

      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId: submissionData.id })
      }).then(async (response) => {
        const result = await response.json();
        if (result.success) {
          setSubmission(prev => prev ? {
            ...prev,
            ai_evaluation: result.evaluation,
            scores: { overall: result.evaluation.overallScore },
            status: 'evaluated'
          } : null);
          alert(`Exercise evaluated! Score: ${result.evaluation.overallScore}/100`);
        }
      }).catch((error) => {
        console.error('Error evaluating exercise:', error);
      });

      alert('Exercise submitted successfully! AI evaluation in progress...');
    } catch (error) {
      console.error('Error submitting exercise:', error);
      alert('Failed to submit exercise');
    } finally {
      setSubmitting(false);
    }
  };

  const validateSubmission = () => {
    if (!template || !responseData) return false;

    const config = template.template_config;

    if (config.sections) {
      return config.sections.every((section: any) => {
        const value = responseData[section.id];
        if (!value) return false;

        if (section.inputType === 'multiline') {
          return Array.isArray(value) && value.length > 0 && value.some((item: string) => item && item.trim().length > 0);
        }
        return typeof value === 'string' && value.trim().length > 0;
      });
    }

    if (config.quadrants) {
      return config.quadrants.every((quadrant: any) => {
        const value = responseData[quadrant.id];
        return Array.isArray(value) && value.length > 0 && value.some((item: string) => item && item.trim().length > 0);
      });
    }

    if (config.steps) {
      return config.steps.every((step: any) => {
        const value = responseData[step.id];
        if (!Array.isArray(value)) return false;
        if (step.minItems) {
          return value.length >= step.minItems && value.every((item: string) => item && item.trim().length > 0);
        }
        return value.length > 0 && value.every((item: string) => item && item.trim().length > 0);
      });
    }

    return Object.keys(responseData).length > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!exercise || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Exercise not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Lesson
            </button>

            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="text-sm text-slate-500">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}

              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
              >
                {saving ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Draft
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting || !!submission?.submitted_at}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit for Evaluation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
              {template.category}
            </div>
            <span className="text-sm text-slate-500">
              Estimated time: {exercise.estimated_minutes} minutes
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {template.name}
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-slate-900 mb-2">Exercise Instructions</h2>
            <p className="text-slate-700 whitespace-pre-wrap">{exercise.prompt}</p>
          </div>

          {submission?.submitted_at && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900">Exercise Submitted</p>
                  <p className="text-sm text-green-700">
                    Submitted on {new Date(submission.submitted_at).toLocaleString()}
                  </p>
                  {submission.scores?.overall && (
                    <p className="text-sm text-green-700 mt-1">
                      Score: {submission.scores.overall}/100
                    </p>
                  )}
                </div>
              </div>

              {submission.ai_evaluation && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">AI Evaluation Feedback</h2>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">Overall Score</span>
                      <span className={`text-2xl font-bold ${
                        submission.ai_evaluation.overallScore >= 80 ? 'text-green-600' :
                        submission.ai_evaluation.overallScore >= 70 ? 'text-blue-600' :
                        'text-amber-600'
                      }`}>
                        {submission.ai_evaluation.overallScore}/100
                      </span>
                    </div>
                    {submission.ai_evaluation.criteriaScores && (
                      <div className="space-y-2">
                        {Object.entries(submission.ai_evaluation.criteriaScores).map(([criterion, score]) => (
                          <div key={criterion} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{criterion}</span>
                            <span className="font-medium text-slate-900">{score as number}/100</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-2">Detailed Feedback</h3>
                    <p className="text-slate-700 whitespace-pre-wrap">{submission.ai_evaluation.feedback}</p>
                  </div>

                  {submission.ai_evaluation.strengths && submission.ai_evaluation.strengths.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {submission.ai_evaluation.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span className="text-slate-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {submission.ai_evaluation.improvements && submission.ai_evaluation.improvements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {submission.ai_evaluation.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-amber-600 mt-1">•</span>
                            <span className="text-slate-700">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {submission.ai_evaluation.nextSteps && submission.ai_evaluation.nextSteps.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Next Steps</h3>
                      <ol className="space-y-2">
                        {submission.ai_evaluation.nextSteps.map((step: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 font-medium">{index + 1}.</span>
                            <span className="text-slate-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {!submission?.submitted_at && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Draft Mode</p>
                <p className="text-sm text-amber-700">
                  Your work is automatically saved. Submit when ready for AI evaluation.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ExerciseTemplateRenderer
              templateConfig={template.template_config}
              initialData={responseData}
              onChange={setResponseData}
              readOnly={!!submission?.submitted_at}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">AI Coaching</h3>
                <button
                  onClick={() => setShowAICoach(!showAICoach)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {showAICoach ? 'Hide' : 'Show'}
                </button>
              </div>

              {showAICoach ? (
                <AICoachingChat
                  exerciseInstanceId={exercise.id}
                  currentResponse={responseData}
                  onClose={() => setShowAICoach(false)}
                />
              ) : (
                <p className="text-sm text-slate-500">
                  Click "Show" to get AI guidance as you work through this exercise.
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3">Evaluation Criteria</h4>
                <div className="space-y-3">
                  {template.evaluation_rubric.criteria?.map((criterion: any) => (
                    <div key={criterion.name}>
                      <div className="font-medium text-sm text-slate-900">{criterion.name}</div>
                      <div className="text-xs text-slate-600">{criterion.description}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        Weight: {(criterion.weight * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <div className="text-sm font-medium text-slate-900">
                    Passing Score: {template.evaluation_rubric.passingScore}/100
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
