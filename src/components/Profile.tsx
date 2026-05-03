import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Trophy, Star, Settings, Save, Shield, Calendar, Book, Plus } from 'lucide-react';
import { StudentData, Badge, SubjectMarks } from '../types';

interface ProfileProps {
  student: StudentData;
  onUpdate: (data: Partial<StudentData>) => void;
}

export default function Profile({ student, onUpdate }: ProfileProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name,
    attendance: student.attendance,
    marks: { ...student.marks }
  });

  const handleSave = () => {
    onUpdate(formData);
    setEditing(false);
  };

  const addSubject = () => {
    const name = prompt('Enter subject name:');
    if (name) {
      setFormData(prev => ({
        ...prev,
        marks: { ...prev.marks, [name]: 0 }
      }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: User Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="brutalist-card p-10 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="w-40 h-40 bg-slate-100 rounded-full mx-auto mb-8 flex items-center justify-center border-4 border-ink shadow-hard-lg relative">
                <User size={80} className="text-ink/20" />
                <div className="absolute -bottom-2 -right-2 bg-accent text-ink w-12 h-12 rounded-full flex items-center justify-center border-4 border-ink shadow-hard-sm">
                  <Star size={24} fill="currentColor" />
                </div>
              </div>
              
              <h2 className="text-3xl font-black font-display text-ink uppercase tracking-tight">{student.name}</h2>
              <p className="text-primary text-xs mb-8 uppercase tracking-[0.2em] font-black italic">Rank: Lvl {student.level} Prodigy</p>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-ink/40 uppercase tracking-widest">
                  <span>Power Meter</span>
                  <span>{student.xp % 1000} / 1000 XP</span>
                </div>
                <div className="h-5 bg-white border-4 border-ink rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(student.xp % 1000) / 10}%` }}
                    className="h-full bg-primary rounded-full border border-ink/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white border-4 border-ink p-5 rounded-2xl shadow-hard-sm text-center">
                <div className="text-[10px] font-black text-ink/40 uppercase mb-1">Badges</div>
                <div className="text-3xl font-black text-ink">{student.badges.length}</div>
             </div>
             <div className="bg-accent border-4 border-ink p-5 rounded-2xl shadow-hard-sm text-center">
                <div className="text-[10px] font-black text-ink/40 uppercase mb-1">Total XP</div>
                <div className="text-3xl font-black text-ink">{student.xp}</div>
             </div>
          </div>
        </div>

        {/* Right Column: Settings or Badges */}
        <div className="lg:col-span-2 space-y-10">
          {/* Header Tabs */}
          <div className="flex items-center justify-between pb-4 border-b-4 border-ink border-dashed">
            <h3 className="text-3xl font-black font-display text-ink flex items-center gap-4 uppercase tracking-tighter italic">
               Manifesto & Honors
            </h3>
            <button 
              onClick={() => setEditing(!editing)}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all 
                ${editing ? 'bg-ink text-white border-ink shadow-none' : 'bg-white text-ink border-ink shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'}`}
            >
              {editing ? 'CANCEL' : 'EDIT PROFILE'}
            </button>
          </div>

          {editing ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="brutalist-card p-10 space-y-10"
            >
              <div className="space-y-6">
                <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                  <User size={16} /> Identity Parameters
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-ink/50 uppercase tracking-widest ml-1">Codename</label>
                    <input 
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-[#F5F5F5] border-4 border-ink rounded-2xl px-6 py-4 outline-none focus:bg-white transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-ink/50 uppercase tracking-widest ml-1">Attendance Protocol %</label>
                    <input 
                      type="number"
                      value={formData.attendance}
                      onChange={(e) => setFormData(p => ({ ...p, attendance: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-[#F5F5F5] border-4 border-ink rounded-2xl px-6 py-4 outline-none focus:bg-white transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                    <Book size={16} /> Performance Metrics
                  </h4>
                  <button onClick={addSubject} className="w-10 h-10 bg-accent border-2 border-ink rounded-xl flex items-center justify-center shadow-hard-sm hover:shadow-none transition-all">
                    <Plus size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.entries(formData.marks).map(([sub, mark]) => (
                    <div key={sub} className="space-y-3">
                      <label className="text-[10px] font-black text-ink/50 uppercase tracking-widest ml-1">{sub}</label>
                      <input 
                        type="number"
                        value={mark}
                        onChange={(e) => setFormData(p => ({ 
                          ...p, 
                          marks: { ...p.marks, [sub]: parseInt(e.target.value) || 0 } 
                        }))}
                        className="w-full bg-[#F5F5F5] border-4 border-ink rounded-2xl px-6 py-4 outline-none focus:bg-white transition-all font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-5 bg-primary text-white rounded-[2rem] border-4 border-ink font-black uppercase tracking-widest hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all shadow-hard-accent flex items-center justify-center gap-3 active:scale-95"
              >
                <Save size={20} />
                COMMIT CHANGES
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Achievement Shelf */}
              <div className="brutalist-card p-10 space-y-8">
                <h4 className="text-xs font-black text-ink/40 uppercase tracking-[0.3em] flex items-center gap-3">
                   Achievement Hub
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  {student.badges.map((badge, idx) => {
                    const colors = [
                      'bg-[#F0EBFF] border-[#7C3AED]',
                      'bg-[#FFF9E5] border-[#FFD60A]',
                      'bg-[#ECFDF5] border-[#059669]',
                    ];
                    return (
                      <div key={badge.id} className={`flex flex-col items-center gap-3 p-5 border-4 rounded-[2rem] shadow-hard-sm group transition-transform hover:-rotate-3 ${colors[idx % colors.length]}`}>
                        <div className="text-4xl group-hover:scale-125 transition-transform">{badge.icon}</div>
                        <div className="text-[10px] font-black uppercase text-center leading-tight tracking-tighter">{badge.name}</div>
                      </div>
                    );
                  })}
                  <div className="flex flex-col items-center gap-3 p-5 bg-[#F5F5F5] border-4 border-ink border-dashed rounded-[2rem] opacity-30 grayscale saturate-0">
                    <div className="text-4xl">?</div>
                    <div className="text-[10px] font-black uppercase text-center italic">Locked Intel</div>
                  </div>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="brutalist-card p-10 space-y-8 shadow-hard-accent">
                <h4 className="text-xs font-black text-ink/40 uppercase tracking-[0.3em] flex items-center gap-3">
                   Status Protocol
                </h4>
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#F5F5F5] border-4 border-ink rounded-[2rem] flex items-center justify-center shadow-hard-sm rotate-6">
                      {student.level < 5 ? <Calendar size={32} className="text-ink/60" /> : <Star size={32} className="text-accent fill-accent" />}
                    </div>
                    <div>
                      <div className="text-xl font-black text-ink tracking-tighter uppercase italic">
                        {student.level < 5 ? 'Rising Spark' : 'Deep Solver Elite'}
                      </div>
                      <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Level {student.level} Protocol Active</div>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t-2 border-ink/10 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-ink/40 uppercase tracking-widest">Daily Quest</span>
                      <span className="bg-[#ECFDF5] text-[#059669] px-3 py-1 rounded-lg border-2 border-[#059669] text-[10px] font-black uppercase tracking-widest shadow-hard-sm">Complete!</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-ink/40 uppercase tracking-widest">Growth Streak</span>
                      <span className="text-xl font-black text-ink italic">🔥 12 DAYS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
