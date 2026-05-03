import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Zap, BookOpen, Brain, Lightbulb, Trophy, HelpCircle, Loader2 } from 'lucide-react';
import { solveDoubt } from '../services/gemini';
import { StudentLevel, DoubtResponse } from '../types';

interface DoubtSolverProps {
  onXPEarned: (amount: number) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string | DoubtResponse;
}

export default function DoubtSolver({ onXPEarned }: DoubtSolverProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<StudentLevel>(StudentLevel.BEGINNER);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await solveDoubt(userMsg, level);
      setMessages(prev => [...prev, { role: 'assistant', content: res }]);
      onXPEarned(res.xpEarned || 20);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Oops! I hit a snag while thinking. Let's try again!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto w-full p-4 md:p-8">
      {/* Level Selector */}
      <div className="flex justify-center gap-3 mb-10">
        {Object.values(StudentLevel).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest border-2
              ${level === l 
                ? 'bg-primary text-white border-ink shadow-hard-sm' 
                : 'bg-white text-ink border-ink/10 hover:border-ink hover:bg-slate-50'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-10 pb-32 px-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-6"
            >
              <div className="w-24 h-24 bg-accent rounded-[32px] border-4 border-ink shadow-hard flex items-center justify-center rotate-3 scale-110">
                <Brain className="text-ink animate-pulse" size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-ink tracking-tighter uppercase">What's the doubt today?</h2>
                <p className="text-ink/50 font-bold uppercase tracking-widest text-[10px]">Ask me anything about your subjects</p>
              </div>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="bg-[#F5F5F5] text-ink px-8 py-4 rounded-[2rem] rounded-tr-none border-4 border-ink shadow-hard font-bold text-lg">
                  {msg.content as string}
                </div>
              ) : (
                <div className="w-full space-y-6">
                  {typeof msg.content === 'string' ? (
                    <div className="bg-white px-8 py-5 rounded-[2rem] rounded-tl-none border-4 border-ink shadow-hard font-bold text-lg">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="space-y-6 max-w-3xl">
                      {/* Concept Card */}
                      <div className="bg-white rounded-[2rem] border-4 border-ink shadow-hard-primary overflow-hidden flex flex-col">
                        <div className="bg-primary p-4 border-b-4 border-ink flex items-center gap-3 text-white">
                          <BookOpen size={20} className="shrink-0" />
                          <h3 className="text-sm font-black uppercase tracking-widest">Concept Breakdown</h3>
                        </div>
                        <div className="p-8">
                          <p className="text-ink font-bold text-lg leading-relaxed">{(msg.content as DoubtResponse).concept}</p>
                        </div>
                      </div>

                      {/* Example Card */}
                      <div className="bg-white rounded-[2rem] border-4 border-ink shadow-hard-accent overflow-hidden flex flex-col">
                        <div className="bg-accent p-4 border-b-4 border-ink flex items-center gap-3 text-ink">
                          <Lightbulb size={20} className="shrink-0" />
                          <h3 className="text-sm font-black uppercase tracking-widest text-ink">Real-World Logic</h3>
                        </div>
                        <div className="p-8 bg-[#FFFBEB]">
                          <p className="text-ink font-bold leading-relaxed italic">{(msg.content as DoubtResponse).example}</p>
                        </div>
                      </div>

                      {/* Notes Card */}
                      <div className="bg-white rounded-[2rem] border-4 border-ink shadow-hard p-8 space-y-4">
                        <div className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs">
                          <Zap size={18} />
                          Quick Notes
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(msg.content as DoubtResponse).notes.map((note, i) => (
                            <div key={i} className="flex items-start gap-3 bg-canvas/30 p-4 rounded-xl border-2 border-ink/5 font-bold text-sm">
                              <span className="mt-1 h-3 w-3 bg-primary rounded-sm shrink-0 border border-ink" />
                              {note}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Summary & Challenge */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#F5F5F5] p-8 rounded-[2rem] border-4 border-ink shadow-hard-sm">
                          <div className="text-ink/40 font-black text-[10px] uppercase mb-2 tracking-widest">Summary</div>
                          <p className="text-ink font-bold text-sm leading-relaxed">{(msg.content as DoubtResponse).summary}</p>
                        </div>
                        <div className="bg-[#ECFDF5] p-8 rounded-[2rem] border-4 border-[#059669] shadow-[4px_4px_0px_0px_#059669] relative group overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-all">
                            <Trophy size={60} />
                          </div>
                          <div className="text-[#065F46] font-black text-[10px] uppercase mb-2 tracking-widest flex items-center gap-2">
                             🎮 Skill Check
                          </div>
                          <p className="text-ink font-black text-sm leading-relaxed">{(msg.content as DoubtResponse).quickChallenge}</p>
                          <button className="mt-4 bg-white border-2 border-ink px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-hard-sm active:translate-y-1">Answer for +10 XP</button>
                        </div>
                      </div>

                      {/* XP Reward */}
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-3 bg-accent border-4 border-ink px-6 py-3 rounded-2xl shadow-hard font-black uppercase text-xs tracking-widest"
                      >
                        <Trophy size={18} />
                        🎉 +{(msg.content as DoubtResponse).xpEarned} XP EARNED!
                      </motion.div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div className="flex justify-start">
            <div className="bg-white px-8 py-5 rounded-[2rem] rounded-tl-none border-4 border-ink shadow-hard flex items-center gap-3 text-ink font-black uppercase text-xs">
              <Loader2 className="animate-spin" size={20} />
              Solving your doubt...
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-10 left-0 right-0 px-4 md:left-28 xl:left-72">
        <form 
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto relative flex items-center"
        >
          <div className="w-full relative group">
             <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about Biology, Math, or Physics..."
              className="w-full bg-white pl-8 pr-20 py-6 rounded-[2rem] border-4 border-ink shadow-hard focus:shadow-hard-primary outline-none transition-all text-ink font-bold text-lg placeholder:text-ink/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-primary text-white rounded-2xl border-2 border-ink shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:bg-slate-200 transition-all active:scale-95 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
