import { useEffect, useState } from 'react';
import { Trophy, Star, Zap, Award, TrendingUp } from 'lucide-react';

interface Props {
  type: 'lesson' | 'exercise' | 'course' | 'badge' | 'level-up';
  title: string;
  message?: string;
  points?: number;
  onClose: () => void;
}

export function CelebrationAnimation({ type, title, message, points, onClose }: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500);
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'lesson':
        return <Star className="h-16 w-16 text-yellow-400" />;
      case 'exercise':
        return <Trophy className="h-16 w-16 text-blue-400" />;
      case 'course':
        return <Award className="h-16 w-16 text-purple-400" />;
      case 'badge':
        return <Zap className="h-16 w-16 text-green-400" />;
      case 'level-up':
        return <TrendingUp className="h-16 w-16 text-orange-400" />;
      default:
        return <Star className="h-16 w-16 text-yellow-400" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'lesson':
        return 'from-yellow-400 to-orange-500';
      case 'exercise':
        return 'from-blue-400 to-indigo-500';
      case 'course':
        return 'from-purple-400 to-pink-500';
      case 'badge':
        return 'from-green-400 to-emerald-500';
      case 'level-up':
        return 'from-orange-400 to-red-500';
      default:
        return 'from-blue-400 to-indigo-500';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][
                Math.floor(Math.random() * 5)
              ],
            }}
          />
        ))}
      </div>

      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-bounce-in ${
          show ? 'animate-celebrate' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="relative animate-float">
            <div className={`absolute inset-0 bg-gradient-to-br ${getColor()} blur-xl opacity-50 animate-glow`} />
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              {getIcon()}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 animate-fade-in">
            {title}
          </h2>
          {message && (
            <p className="text-slate-600 mb-4 animate-fade-in-delay-1">
              {message}
            </p>
          )}
          {points && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold animate-scale-in shadow-lg">
              <Star className="h-5 w-5" />
              <span>+{points} points</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${getColor()} animate-progress-fill" />
      </div>

      <style>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti 3s ease-out forwards;
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
