import { Users, Calendar, DollarSign, TrendingUp, Lightbulb, MessageSquare } from 'lucide-react';

interface CaseStudyContent {
  founderName: string;
  founderPhoto?: string;
  companyName: string;
  industry: string;
  timeline: string;
  outcome: string;
  narrative: string;
  keyLessons: string[];
  metrics?: {
    timeToFirstCustomer?: string;
    timeToFirstRevenue?: string;
    currentMRR?: string;
    growthRate?: string;
  };
  discussionPrompts: string[];
  relevantFrameworks?: string[];
}

interface Props {
  content: CaseStudyContent;
}

export function CaseStudyRenderer({ content }: Props) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
        <div className="flex items-start gap-6">
          {content.founderPhoto && (
            <div className="flex-shrink-0">
              <img
                src={content.founderPhoto}
                alt={content.founderName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
              <Users className="h-4 w-4" />
              <span>Founder Success Story</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {content.companyName}
            </h2>
            <p className="text-lg text-slate-700 mb-3">
              by {content.founderName}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{content.timeline}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span>{content.industry}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-blue-200">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Outcome</p>
              <p className="text-lg font-semibold text-slate-900">{content.outcome}</p>
            </div>
          </div>
        </div>
      </div>

      {content.metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {content.metrics.timeToFirstCustomer && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-colors">
              <p className="text-xs text-slate-500 mb-1">First Customer</p>
              <p className="text-xl font-bold text-slate-900">{content.metrics.timeToFirstCustomer}</p>
            </div>
          )}
          {content.metrics.timeToFirstRevenue && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-colors">
              <p className="text-xs text-slate-500 mb-1">First Revenue</p>
              <p className="text-xl font-bold text-slate-900">{content.metrics.timeToFirstRevenue}</p>
            </div>
          )}
          {content.metrics.currentMRR && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-colors">
              <p className="text-xs text-slate-500 mb-1">Current MRR</p>
              <p className="text-xl font-bold text-slate-900">{content.metrics.currentMRR}</p>
            </div>
          )}
          {content.metrics.growthRate && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-colors">
              <p className="text-xs text-slate-500 mb-1">Growth Rate</p>
              <p className="text-xl font-bold text-slate-900">{content.metrics.growthRate}</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-slate-900">The Story</h3>
        </div>
        <div
          className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-700"
          dangerouslySetInnerHTML={{ __html: content.narrative }}
        />
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-600 rounded-lg">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Key Lessons</h3>
        </div>
        <div className="space-y-4">
          {content.keyLessons.map((lesson, index) => (
            <div
              key={index}
              className="flex gap-4 items-start group hover:translate-x-1 transition-transform"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                {index + 1}
              </div>
              <p className="flex-1 text-slate-700 leading-relaxed pt-1">{lesson}</p>
            </div>
          ))}
        </div>
      </div>

      {content.relevantFrameworks && content.relevantFrameworks.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">Frameworks Used</h4>
          <div className="flex flex-wrap gap-2">
            {content.relevantFrameworks.map((framework, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-white text-blue-700 rounded-lg text-sm font-medium border border-blue-200 hover:border-blue-400 transition-colors"
              >
                {framework}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-600 rounded-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Reflect & Discuss</h3>
        </div>
        <p className="text-slate-600 mb-6">
          Take a moment to think deeply about how this case study applies to your business:
        </p>
        <div className="space-y-4">
          {content.discussionPrompts.map((prompt, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 rounded-lg border-l-4 border-green-600 hover:bg-slate-100 transition-colors"
            >
              <p className="text-slate-800 font-medium">{prompt}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500 italic">
            💡 Share your insights in the community or discuss with your accountability pod
          </p>
        </div>
      </div>

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
