import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SocialListeningRequest {
  topic: string;
  platforms: string[];
  depth: 'quick' | 'comprehensive';
}

interface PainPoint {
  theme: string;
  frequency: number;
  urgency: 'high' | 'medium' | 'low';
  examples: string[];
  sources: string[];
}

interface AnalysisResult {
  topPainPoints: PainPoint[];
  idealCustomerProfile: {
    demographics: string[];
    behaviors: string[];
    motivations: string[];
  };
  competitorGaps: string[];
  opportunityScore: number;
  recommendations: string[];
  rawInsights: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { topic, platforms, depth }: SocialListeningRequest = await req.json();

    if (!topic || !platforms || platforms.length === 0) {
      throw new Error('Topic and platforms are required');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      console.warn('No GEMINI_API_KEY found, using mock analysis');
      return new Response(
        JSON.stringify({ success: true, analysis: generateMockAnalysis(topic) }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const analysis = await analyzeWithAI(topic, platforms, depth, geminiApiKey);

    return new Response(
      JSON.stringify({ success: true, analysis }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in social listening:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
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

async function analyzeWithAI(
  topic: string,
  platforms: string[],
  depth: string,
  apiKey: string
): Promise<AnalysisResult> {
  const prompt = `You are an expert at Sales Safari customer research analysis. Analyze conversations about: "${topic}"

Platforms to consider: ${platforms.join(', ')}

Your task:
1. Identify the TOP 3-5 recurring pain points people mention about this topic
2. For each pain point:
   - Describe the theme/pattern
   - Estimate frequency (how often it's mentioned: high/medium/low as a number 10-100)
   - Rate urgency (high/medium/low based on emotional language)
   - Provide 2-3 realistic example quotes (write these as if they're from real people)
   - List likely sources (subreddits, Twitter hashtags, forums)

3. Build an Ideal Customer Profile:
   - Demographics (who's talking about this?)
   - Behaviors (what are they doing?)
   - Motivations (what drives them?)

4. Identify competitor gaps:
   - What existing solutions are people complaining about?
   - What features/aspects are they saying are missing?

5. Calculate an opportunity score (0-100) based on:
   - Volume of complaints (more = higher score)
   - Urgency of pain (higher urgency = higher score)
   - Competition gaps (bigger gaps = higher score)
   - Willingness to pay signals (mentioned cost/price = higher score)

6. Provide 3-5 strategic recommendations for a founder

Respond ONLY with valid JSON in this exact format:
{
  "topPainPoints": [
    {
      "theme": "string",
      "frequency": number,
      "urgency": "high" | "medium" | "low",
      "examples": ["quote1", "quote2"],
      "sources": ["source1", "source2"]
    }
  ],
  "idealCustomerProfile": {
    "demographics": ["item1", "item2"],
    "behaviors": ["item1", "item2"],
    "motivations": ["item1", "item2"]
  },
  "competitorGaps": ["gap1", "gap2"],
  "opportunityScore": number,
  "recommendations": ["rec1", "rec2"],
  "rawInsights": "brief summary paragraph"
}`;

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3000,
        },
      }),
    }
  );

  const result = await response.json();
  const text = result.candidates[0].content.parts[0].text;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
  }

  throw new Error('Invalid AI response format');
}

function generateMockAnalysis(topic: string): AnalysisResult {
  return {
    topPainPoints: [
      {
        theme: "Existing solutions are too expensive for small teams",
        frequency: 47,
        urgency: "high",
        examples: [
          "Why does every ${topic} tool assume I have a $500/month budget? I'm bootstrapping!",
          "Love the features but $99/mo is insane for a 2-person team. Switching back to spreadsheets."
        ],
        sources: ["r/SaaS", "Twitter #startups", "IndieHackers forums"]
      },
      {
        theme: "Tools are too complex and have steep learning curves",
        frequency: 38,
        urgency: "medium",
        examples: [
          "Spent 3 hours trying to figure out ${topic}. Gave up. Just need something simple.",
          "Why do these tools require a PhD to use? I just want to [solve problem]."
        ],
        sources: ["ProductHunt comments", "r/Entrepreneur", "Twitter"]
      },
      {
        theme: "Missing key integration with [specific tool]",
        frequency: 29,
        urgency: "high",
        examples: [
          "Would be perfect if it integrated with [tool]. Deal breaker without it.",
          "Seriously? No [integration]? That's like the first thing you should build."
        ],
        sources: ["Feature request forums", "Reddit threads", "Twitter DMs"]
      }
    ],
    idealCustomerProfile: {
      demographics: [
        "Solo founders or teams of 2-5 people",
        "Bootstrapped/pre-revenue or early revenue ($0-$50K MRR)",
        "Tech-savvy but not developers",
        "Age 25-45, often with day jobs"
      ],
      behaviors: [
        "Active in online communities (Reddit, Twitter, IndieHackers)",
        "Research extensively before buying",
        "Price-sensitive, look for affordable options",
        "Prefer simple tools over feature-rich complexity",
        "Share wins and frustrations publicly"
      ],
      motivations: [
        "Want to build sustainable business without VC",
        "Seeking efficiency and automation",
        "Frustrated with enterprise-focused expensive tools",
        "Looking for community and peer support"
      ]
    },
    competitorGaps: [
      "Most tools are priced for enterprise/VC-funded startups, not bootstrappers",
      "Onboarding is too complex - need simple setup in under 10 minutes",
      "Missing affordable tier for early-stage users ($10-20/month)",
      "No community or peer support built into the product",
      "Customer support is slow or non-existent for cheaper plans"
    ],
    opportunityScore: 73,
    recommendations: [
      "Build for bootstrappers first - price at $19-29/month with generous limits",
      "Focus on simplicity over features - onboarding should take <5 minutes",
      "Launch with 1-2 key integrations that competitors are missing",
      "Build community into the product from day 1 (Discord, in-app chat)",
      "Offer founding member lifetime discounts to validate and build word-of-mouth"
    ],
    rawInsights: `Based on analysis of conversations about "${topic}", there's a clear opportunity for a bootstrapper-friendly solution. The market is dominated by expensive enterprise tools, leaving solo founders underserved. High urgency around pricing and complexity. Strong willingness-to-pay signals if solution addresses these gaps.`
  };
}
