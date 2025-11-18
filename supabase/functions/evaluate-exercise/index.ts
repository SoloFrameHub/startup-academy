import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EvaluationRequest {
  submissionId: string;
}

interface EvaluationCriteria {
  name: string;
  description: string;
  weight: number;
  scoringGuidance?: string;
}

interface EvaluationResult {
  overallScore: number;
  criteriaScores: Record<string, number>;
  feedback: string;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { submissionId }: EvaluationRequest = await req.json();

    const { data: submission, error: submissionError } = await supabaseClient
      .from('submissions')
      .select('*, exercise_instances!inner(*, exercise_templates!inner(*))')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      throw new Error('Submission not found');
    }

    const template = submission.exercise_instances.exercise_templates;
    const responseData = submission.response_data;
    const rubric = template.evaluation_rubric;

    const evaluation = await evaluateWithAI(
      template.name,
      template.ai_coaching_prompt_template,
      rubric,
      responseData
    );

    await supabaseClient
      .from('submissions')
      .update({
        ai_feedback: evaluation,
        score: evaluation.overallScore,
        status: 'evaluated',
        evaluated_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    return new Response(
      JSON.stringify({ success: true, evaluation }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error evaluating exercise:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

async function evaluateWithAI(
  exerciseName: string,
  coachingPrompt: string,
  rubric: any,
  responseData: any
): Promise<EvaluationResult> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!geminiApiKey) {
    console.warn('No GEMINI_API_KEY found, using mock evaluation');
    return generateMockEvaluation(rubric);
  }

  const prompt = `You are evaluating a founder's strategic thinking exercise.

EXERCISE: ${exerciseName}

CONTEXT:
${coachingPrompt}

STUDENT RESPONSE:
${JSON.stringify(responseData, null, 2)}

EVALUATION RUBRIC:
${JSON.stringify(rubric.criteria, null, 2)}

Provide a detailed evaluation with:
1. Score for each criterion (0-100)
2. Overall weighted score
3. Detailed feedback on strategic thinking quality
4. 3-5 specific strengths
5. 2-4 areas for improvement with actionable guidance
6. 2-3 next steps to deepen their thinking

Be supportive but maintain high standards. Focus on strategic depth, not just completion.

Respond in JSON format:
{
  "criteriaScores": { "criterion_name": score },
  "overallScore": weighted_average,
  "feedback": "detailed_feedback",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "nextSteps": ["step1", "step2"]
}`;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    const result = await response.json();
    const text = result.candidates[0].content.parts[0].text;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const evaluation = JSON.parse(jsonMatch[0]);
      return evaluation;
    }
    
    throw new Error('Invalid AI response format');
  } catch (error) {
    console.error('AI evaluation failed, using mock:', error);
    return generateMockEvaluation(rubric);
  }
}

function generateMockEvaluation(rubric: any): EvaluationResult {
  const criteriaScores: Record<string, number> = {};
  let totalWeight = 0;
  let weightedSum = 0;

  rubric.criteria.forEach((criterion: EvaluationCriteria) => {
    const score = Math.floor(Math.random() * 20) + 70;
    criteriaScores[criterion.name] = score;
    weightedSum += score * criterion.weight;
    totalWeight += criterion.weight;
  });

  const overallScore = Math.round(weightedSum / totalWeight);

  return {
    overallScore,
    criteriaScores,
    feedback: 'Great work on completing this exercise! Your responses show solid understanding of the framework. To take your strategic thinking to the next level, focus on providing more specific evidence and connecting your insights to measurable business outcomes.',
    strengths: [
      'Clear understanding of the framework structure',
      'Thoughtful consideration of multiple perspectives',
      'Good use of specific examples'
    ],
    improvements: [
      'Include more quantitative evidence to support claims',
      'Connect insights more explicitly to business outcomes',
      'Consider second-order effects and tradeoffs'
    ],
    nextSteps: [
      'Validate your assumptions with customer interviews',
      'Create a prioritization matrix for next actions',
      'Review successful case studies in your industry'
    ]
  };
}