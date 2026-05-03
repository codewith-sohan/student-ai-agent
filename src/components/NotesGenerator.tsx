import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, Download, CheckCircle, ChevronRight, Loader2, Sparkles, Upload, File } from 'lucide-react';
import { generateNotes } from '../services/gemini';
import { NoteGeneratorResponse } from '../types';

export default function NotesGenerator() {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState<NoteGeneratorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() && !file) return;

    setLoading(true);
    try {
      // For now, we use the topic + file name as context
      const res = await generateNotes(file ? `Context from file ${file.name}: ${topic}` : topic);
      setNotes(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-12 pb-20">
      <header className="text-center space-y-6">
        <div className="w-20 h-20 bg-primary rounded-[32px] rotate-12 flex items-center justify-center mx-auto mb-10 border-4 border-ink shadow-hard transition-transform hover:rotate-0 duration-500">
          <FileText className="text-white -rotate-12" size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-display text-ink tracking-tight uppercase">Scholar Engine</h1>
          <p className="text-ink/60 font-bold max-w-md mx-auto uppercase tracking-widest text-xs">Instantly synthesize master study guides from any topic</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="relative group">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a complex topic (e.g., Quantum Mechanics)..."
              className="w-full bg-white pl-14 pr-12 py-6 rounded-[2rem] border-4 border-ink shadow-hard-primary outline-none focus:bg-canvas transition-all text-ink font-bold text-lg placeholder:text-ink/30"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/40" size={24} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border-4 border-dashed border-ink/20 rounded-[2rem] p-5 flex items-center justify-center gap-4 cursor-pointer hover:border-primary hover:bg-white transition-all group bg-white/50"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onFileChange} 
                className="hidden" 
                accept=".pdf,.txt,.doc,.docx"
              />
              <Upload className="text-ink/40 group-hover:text-primary" size={24} />
              <span className="text-xs font-black text-ink/50 uppercase tracking-widest group-hover:text-ink truncate max-w-[150px]">
                {file ? file.name : 'Upload Documents'}
              </span>
            </div>
            
            <button
              type="submit"
              disabled={loading || (!topic.trim() && !file)}
              className="px-10 py-5 bg-primary text-white rounded-[2rem] border-4 border-ink font-black uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all shadow-hard-accent disabled:bg-slate-200 flex items-center justify-center gap-3 active:scale-95 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
              GENERATE GUIDE
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 space-y-6"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-accent rounded-full border-4 border-ink animate-bounce flex items-center justify-center">
                 <Sparkles className="text-ink" size={48} />
              </div>
            </div>
            <div className="text-center">
              <p className="font-black text-ink uppercase tracking-widest">Synthesizing Intel...</p>
              <p className="text-[10px] font-bold text-ink/40 mt-2">ALGORITHMIC REVISION IN PROGRESS</p>
            </div>
          </motion.div>
        ) : notes ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="brutalist-card overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary px-8 py-14 text-white text-center border-b-4 border-ink relative">
              <div className="absolute top-4 left-4 text-[10px] font-black bg-white/20 px-3 py-1 rounded-lg uppercase tracking-tighter">Guide ID: #ESP-{Math.floor(Math.random() * 9000) + 1000}</div>
              <h2 className="text-5xl font-black font-display mb-4 tracking-tighter uppercase">{notes.title}</h2>
              <p className="text-white/70 text-xs tracking-widest uppercase font-black">Elite Academic Mastery Sheet</p>
            </div>

            <div className="p-8 md:p-14 space-y-16">
              {/* Definitions Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent border-4 border-ink rounded-xl flex items-center justify-center font-black text-lg shadow-hard-sm">01</div>
                  <h3 className="text-2xl font-black text-ink uppercase tracking-tighter italic">Foundational Lexicon</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {notes.definitions.map((def, i) => (
                    <div key={i} className="p-8 bg-[#F5F5F5] rounded-3xl border-4 border-ink shadow-hard-sm hover:shadow-hard hover:-translate-y-1 transition-all group">
                      <div className="font-black text-primary mb-3 uppercase tracking-widest text-sm">{def.term}</div>
                      <p className="text-ink font-bold text-sm leading-relaxed">{def.definition}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Points Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary border-4 border-ink rounded-xl flex items-center justify-center font-black text-lg text-white shadow-hard-sm">02</div>
                  <h3 className="text-2xl font-black text-ink uppercase tracking-tighter italic">Core Architectural Logic</h3>
                </div>
                <div className="space-y-6">
                  {notes.keyPoints.map((point, i) => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white border-4 border-ink shadow-hard hover:shadow-hard-primary transition-all">
                      <div className="w-10 h-10 border-4 border-ink rounded-xl bg-[#ECFDF5] flex items-center justify-center shrink-0">
                         <CheckCircle className="text-[#059669]" size={20} />
                      </div>
                      <p className="text-ink font-bold leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Examples Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF4D4D] border-4 border-ink rounded-xl flex items-center justify-center font-black text-lg text-white shadow-hard-sm">03</div>
                  <h3 className="text-2xl font-black text-ink uppercase tracking-tighter italic">Practical Case Matrix</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {notes.examples.map((ex, i) => (
                    <div key={i} className="p-8 bg-[#FFFBEB] rounded-[2.5rem] border-4 border-ink relative overflow-hidden group shadow-hard-accent">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                        <Sparkles size={80} />
                      </div>
                      <p className="text-ink font-bold italic leading-relaxed">"{ex}"</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Summary Section */}
              <section className="pt-10 border-t-4 border-ink border-dashed">
                <div className="bg-ink rounded-[2.5rem] p-10 text-white shadow-hard-lg">
                  <h4 className="text-primary font-black uppercase text-xs tracking-[0.3em] mb-6">Strategic Synthesis</h4>
                  <p className="text-2xl font-black leading-relaxed italic tracking-tight">"{notes.summary}"</p>
                  <div className="mt-10 flex justify-end">
                    <button className="bg-primary px-8 py-3 rounded-xl border-2 border-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                      Download PDF Guide
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
