import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Send, Loader, Lightbulb, MessageSquare, X } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  probeQuestions?: string[];
  hints?: string[];
  encouragement?: string;
}

interface Props {
  exerciseInstanceId: string;
  currentResponse: any;
  onClose?: () => void;
}

export function AICoachingChat({ exerciseInstanceId, currentResponse, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI coach. I'm here to help you think more deeply about this exercise. What would you like to explore?",
      probeQuestions: [
        "How can I validate this assumption?",
        "What evidence supports my thinking?",
        "What am I missing here?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText?: string) => {
    const userMessage = messageText || input.trim();
    if (!userMessage || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: userMessage
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach-chat`;
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseInstanceId,
          userMessage,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          currentResponse
        })
      });

      const result = await response.json();

      if (result.success) {
        const assistantMsg: Message = {
          role: 'assistant',
          content: result.message,
          probeQuestions: result.probeQuestions,
          hints: result.hints,
          encouragement: result.encouragement
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(result.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: Message = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">AI Coach</h3>
            <p className="text-xs text-slate-500">Strategic thinking guidance</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '500px' }}>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.role === 'assistant' && (
                <div className="mt-2 space-y-2">
                  {message.probeQuestions && message.probeQuestions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" />
                        Questions to consider:
                      </p>
                      {message.probeQuestions.map((question, qIndex) => (
                        <button
                          key={qIndex}
                          onClick={() => handleQuickQuestion(question)}
                          className="block w-full text-left text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded p-2 transition"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}

                  {message.hints && message.hints.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-2">
                      <p className="text-xs font-medium text-amber-900 mb-1">Hints:</p>
                      {message.hints.map((hint, hIndex) => (
                        <p key={hIndex} className="text-xs text-amber-800">• {hint}</p>
                      ))}
                    </div>
                  )}

                  {message.encouragement && (
                    <p className="text-xs italic text-green-600">{message.encouragement}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg p-3">
              <Loader className="h-4 w-4 animate-spin text-slate-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for guidance..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
