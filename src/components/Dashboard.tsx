import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TrendingUp, Target, AlertCircle, Lightbulb, User } from 'lucide-react';
import { StudentData, PerformanceAnalysis } from '../types';
import { analyzeStudentPerformance } from '../services/gemini';

interface DashboardProps {
  student: StudentData;
}

export default function Dashboard({ student }: DashboardProps) {
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const res = await analyzeStudentPerformance({
          name: student.name,
          attendance: student.attendance,
          marks: student.marks
        });
        setAnalysis(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [student.marks, student.attendance, student.name]);

  const radarData = Object.entries(student.marks).map(([subject, score]) => ({
    subject,
    score,
    fullMark: 100,
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8 p-4 md:p-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-display text-ink tracking-tight">Yo, {student.name}! 🚀</h1>
          <p className="text-ink/60 font-bold uppercase tracking-wider text-xs mt-2">EduSpark AI Intelligence Hub</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white text-ink px-6 py-2 rounded-2xl flex items-center gap-2 border-4 border-ink shadow-hard-accent font-black uppercase text-sm">
            <Target size={18} />
            <span>92% ATTENDANCE</span>
          </div>
          <div className="bg-primary text-white px-6 py-2 rounded-2xl flex items-center gap-2 border-4 border-ink shadow-hard-accent font-black uppercase text-sm">
            <TrendingUp size={18} />
            <span>LEVEL {student.level} SCHOLAR</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="brutalist-card p-8"
        >
          <div className="bg-primary -mx-8 -mt-8 p-4 border-b-4 border-ink rounded-t-[28px] mb-8 flex justify-between items-center text-white">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={18} />
              Subject Proficiency
            </h3>
            <div className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg uppercase">Live Data</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1A1A1A" strokeOpacity={0.1} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#1A1A1A', fontSize: 10, fontWeight: 900 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#7C3AED"
                  fill="#7C3AED"
                  fillOpacity={0.6}
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Analysis Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-4 border-ink shadow-hard-primary p-8 rounded-[32px] text-ink relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Lightbulb size={120} />
          </div>
          
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tighter">
            <Lightbulb className="text-primary" />
            AI Insight Engine
          </h3>
          
          {loading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce" />
              <p className="text-primary font-black italic text-sm uppercase">Calculating potential...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-8 relative z-10">
              <div className="bg-primary/5 p-6 rounded-2xl border-2 border-ink border-dashed">
                <p className="text-ink leading-relaxed font-bold italic text-lg">
                  "{analysis.performance_analysis}"
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary/20 pb-1">Weak Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.weak_areas.map((area, i) => (
                      <span key={i} className="bg-ink text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-hard-sm border border-white/20">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#D97706] border-b-2 border-[#D97706]/20 pb-1">Action Plan</h4>
                  <ul className="space-y-2">
                    {analysis.suggestions.slice(0, 2).map((sug, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-bold text-ink">
                        <div className="mt-1 h-3 w-3 border-2 border-ink rounded-sm bg-accent shrink-0" />
                        {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-ink/40 font-bold">No analysis available yet. Keep feeding the engine!</p>
          )}
        </motion.div>
      </div>

      {/* Marks Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="brutalist-card p-8"
      >
        <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Academic Performance Matrix</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(student.marks).map(([subject, score], i) => (
            <div key={subject} className="p-5 rounded-2xl border-4 border-ink bg-[#F5F5F5] hover:bg-white transition-all group shadow-hard-sm hover:shadow-hard duration-300">
              <div className="text-[10px] font-black text-ink/40 uppercase mb-2 tracking-widest">{subject}</div>
              <div className="flex items-end justify-between border-b-2 border-ink/10 pb-3 mb-4">
                <span className="text-3xl font-black text-ink">{score}</span>
                <span className="text-xs font-black text-ink/30 mb-1">GRADE: {score > 90 ? 'A+' : score > 80 ? 'A' : 'B'}</span>
              </div>
              <div className="h-4 bg-white border-2 border-ink rounded-full overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className={`h-full rounded-full border border-ink/20 ${score > 85 ? 'bg-[#00E676]' : score > 70 ? 'bg-primary' : 'bg-accent'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
