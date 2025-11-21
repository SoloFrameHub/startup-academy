import { useState } from 'react';
import { Search, Twitter, MessageCircle, TrendingUp, AlertCircle, Loader, Check, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

export function SocialListeningTool() {
  const [topic, setTopic] = useState('');
  const [platforms, setPlatforms] = useState<string[]>(['twitter', 'reddit']);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or problem to research');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/social-listening`;
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          platforms,
          depth: 'comprehensive'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API response:', result);
        throw new Error(result.error || result.message || `Request failed with status ${response.status}`);
      }

      if (result.success) {
        setResults(result.analysis);
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              AI-Powered Sales Safari
            </h2>
            <p className="text-slate-700 mb-4">
              Instead of manually lurking in forums, let AI analyze thousands of conversations
              to find real pain points, patterns, and opportunities.
            </p>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-slate-600 mb-2">
                <strong>How it works:</strong> Enter your target problem or market, select platforms,
                and AI will analyze recent conversations to identify:
              </p>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li>• Recurring pain points with emotional language</li>
                <li>• Who's complaining (ideal customer profile)</li>
                <li>• What solutions they're currently using (competitors)</li>
                <li>• Gaps in existing solutions (your opportunity)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              What problem or market do you want to research?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder='e.g., "podcast hosting for multiple shows" or "freelance contract management"'
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={analyzing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Platforms to analyze
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => togglePlatform('twitter')}
                disabled={analyzing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                  platforms.includes('twitter')
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                }`}
              >
                <Twitter className="h-4 w-4" />
                Twitter/X
                {platforms.includes('twitter') && <Check className="h-4 w-4" />}
              </button>
              <button
                onClick={() => togglePlatform('reddit')}
                disabled={analyzing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                  platforms.includes('reddit')
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-orange-400'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                Reddit
                {platforms.includes('reddit') && <Check className="h-4 w-4" />}
              </button>
              <button
                onClick={() => togglePlatform('forums')}
                disabled={analyzing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                  platforms.includes('forums')
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-green-400'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Forums
                {platforms.includes('forums') && <Check className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              💡 More platforms = more data, but takes longer to analyze
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !topic.trim() || platforms.length === 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Analyzing conversations... (this may take 30-60 seconds)
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Analyze with AI
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {results && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Analysis Results</h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Opportunity Score:</span>
                <span className={`text-2xl font-bold ${
                  results.opportunityScore >= 80 ? 'text-green-600' :
                  results.opportunityScore >= 60 ? 'text-blue-600' :
                  'text-amber-600'
                }`}>
                  {results.opportunityScore}/100
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Top Pain Points Discovered
                </h4>
                <div className="space-y-4">
                  {results.topPainPoints.map((pain, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 rounded-lg border-l-4 border-red-500 hover:bg-slate-100 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-slate-900">{pain.theme}</h5>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getUrgencyColor(pain.urgency)}`}>
                            {pain.urgency} urgency
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {pain.frequency} mentions
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 font-medium">Real quotes:</p>
                        {pain.examples.slice(0, 2).map((example, i) => (
                          <blockquote key={i} className="pl-3 border-l-2 border-slate-300 text-sm text-slate-700 italic">
                            "{example}"
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">
                    Ideal Customer Profile
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-green-900 mb-1">Demographics:</p>
                      <ul className="space-y-1">
                        {results.idealCustomerProfile.demographics.map((item, i) => (
                          <li key={i} className="text-sm text-slate-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-green-900 mb-1">Behaviors:</p>
                      <ul className="space-y-1">
                        {results.idealCustomerProfile.behaviors.map((item, i) => (
                          <li key={i} className="text-sm text-slate-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">
                    Competitor Gaps
                  </h4>
                  <p className="text-xs text-amber-900 mb-2">
                    What existing solutions are missing:
                  </p>
                  <ul className="space-y-2">
                    {results.competitorGaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-amber-600 mt-0.5">⚠️</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Strategic Recommendations
                </h4>
                <ol className="space-y-2">
                  {results.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="font-bold text-blue-600">{i + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-3">
              🎯 Next Steps
            </h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use these pain points as your landing page problem section (copy their exact words)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Target your ICP on the platforms where they're most active</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Build your MVP to address the top 2-3 high-urgency pain points</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Validate with pre-sales by directly reaching out to people who complained</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
