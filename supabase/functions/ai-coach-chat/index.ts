import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CoachingRequest {
  exerciseInstanceId: string;
  userMessage: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  currentResponse?: any;
}

interface CoachingResponse {
  message: string;
  probeQuestions: string[];
  hints?: string[];
  encouragement: string;
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

    const {
      exerciseInstanceId,
      userMessage,
      conversationHistory = [],
      currentResponse = {}
    }: CoachingRequest = await req.json();

    const { data: exercise, error: exerciseError } = await supabaseClient
      .from('exercise_instances')
      .select('*, exercise_templates!inner(*)')
      .eq('id', exerciseInstanceId)
      .single();

    if (exerciseError || !exercise) {
      throw new Error('Exercise not found');
    }

    const template = exercise.exercise_templates;
    const coachingResponse = await generateCoachingResponse(
      template.name,
      template.ai_coaching_prompt_template,
      template.template_config,
      userMessage,
      conversationHistory,
      currentResponse
    );

    return new Response(
      JSON.stringify({ success: true, ...coachingResponse }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in AI coaching:', error);
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

async function generateCoachingResponse(
  exerciseName: string,
  coachingPrompt: string,
  templateConfig: any,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  currentResponse: any
): Promise<CoachingResponse> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!geminiApiKey) {
    console.warn('No GEMINI_API_KEY found, using mock response');
    return generateMockCoachingResponse();
  }

  const systemPrompt = `${coachingPrompt}

EXERCISE: ${exerciseName}
TEMPLATE STRUCTURE: ${JSON.stringify(templateConfig)}

Your role as an AI coach:
1. Ask probing questions that deepen strategic thinking
2. Challenge assumptions with evidence-based reasoning
3. Provide examples from successful founders when relevant
4. Guide toward first principles thinking
5. Be supportive but maintain high standards
6. NEVER give direct answers - help them discover insights

CURRENT PROGRESS:
${JSON.stringify(currentResponse, null, 2)}

CONVERSATION SO FAR:
${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}`;

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
            parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}\n\nRespond in JSON format:\n{\n  "message": "your_coaching_message",\n  "probeQuestions": ["question1", "question2"],\n  "hints": ["optional_hint"],\n  "encouragement": "positive_reinforcement"\n}` }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const result = await response.json();
    const text = result.candidates[0].content.parts[0].text;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const coachingResponse = JSON.parse(jsonMatch[0]);
      return coachingResponse;
    }
    
    throw new Error('Invalid AI response format');
  } catch (error) {
    console.error('AI coaching failed, using mock:', error);
    return generateMockCoachingResponse();
  }
}

function generateMockCoachingResponse(): CoachingResponse {
  const responses = [
    {
      message: "That's a good start! Let's dig deeper into this. What evidence do you have that this is actually a pain point for your customers?",
      probeQuestions: [
        "How did you discover this pain?",
        "What are customers currently doing to work around this problem?",
        "How much time or money are they spending on workarounds?"
      ],
      hints: [
        "Look for direct customer quotes that express frustration",
        "Consider the urgency - is this a 'nice to have' or 'must solve'?"
      ],
      encouragement: "You're on the right track. Keep pushing for specificity!"
    },
    {
      message: "Interesting perspective. Now let's think about this strategically - what assumptions are you making here?",
      probeQuestions: [
        "What would need to be true for this to work?",
        "What could cause this approach to fail?",
        "Have you seen similar solutions succeed or fail? Why?"
      ],
      hints: [
        "Challenge your own thinking - play devil's advocate",
        "Think about second-order effects"
      ],
      encouragement: "Great progress! Strategic thinking is about questioning assumptions."
    }
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}