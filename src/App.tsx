/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, MessageSquare, FileText, User as UserIcon, Sparkles } from 'lucide-react';
import { useStudentStore } from './hooks/useStudentStore';
import Dashboard from './components/Dashboard';
import DoubtSolver from './components/DoubtSolver';
import NotesGenerator from './components/NotesGenerator';
import Profile from './components/Profile';

type Tab = 'dashboard' | 'doubts' | 'notes' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { student, updateMarks, updateAttendance, addXP, addBadge, setStudent } = useStudentStore();

  const handleUpdateProfile = (data: any) => {
    setStudent(prev => ({ ...prev, ...data }));
    addXP(50); // XP for updating profile
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { id: 'doubts', label: 'Doubt Solver', icon: MessageSquare, color: 'text-emerald-500' },
    { id: 'notes', label: 'Generator', icon: FileText, color: 'text-purple-500' },
    { id: 'profile', label: 'Profile', icon: UserIcon, color: 'text-slate-500' },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row text-ink">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white px-6 py-4 border-b-4 border-ink flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center border-2 border-ink shadow-hard-sm">
            <Sparkles className="text-white" size={18} />
          </div>
          <span className="font-display font-black text-xl tracking-tight">EduSpark <span className="text-primary">AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-black bg-accent text-ink px-3 py-1.5 rounded-full border-2 border-ink shadow-hard-sm uppercase">
            🔥 {student.level}
          </div>
        </div>
      </header>

      {/* Navigation (Left Sidebar / Bottom Nav) */}
      <nav className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:w-28 xl:w-72 bg-white border-t-4 md:border-t-0 md:border-r-4 border-ink z-50 px-3 py-4 md:py-10 flex md:flex-col justify-around md:justify-start gap-2 md:gap-6">
        {/* Logo (Desktop) */}
        <div className="hidden md:flex items-center gap-3 px-2 mb-10">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center border-2 border-ink shadow-hard-sm shrink-0">
            <Sparkles className="text-white" size={24} />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter xl:block hidden">EduSpark <span className="text-primary">AI</span></span>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-4 px-4 py-4 rounded-2xl transition-all grow md:grow-0 group border-2
              ${activeTab === item.id 
                ? 'bg-primary text-white border-ink shadow-hard-sm' 
                : 'bg-white text-ink border-transparent hover:border-ink hover:bg-slate-50'}`}
          >
            <item.icon size={activeTab === item.id ? 24 : 22} className={`${activeTab === item.id ? '' : 'group-hover:scale-110 transition-transform'}`} />
            <span className="text-[10px] md:text-sm font-black uppercase tracking-widest xl:block hidden">{item.label}</span>
            <span className="text-[10px] md:hidden font-black">{item.label.split(' ')[0]}</span>
          </button>
        ))}

        {/* Level Indicator (Desktop) */}
        <div className="hidden md:block mt-auto p-2">
          <div className="bg-accent rounded-3xl p-5 border-4 border-ink shadow-hard-sm xl:block hidden">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-ink uppercase">Energy</span>
              <span className="text-xs font-black text-ink">{student.xp % 1000} / 1000</span>
            </div>
            <div className="h-4 bg-white border-2 border-ink rounded-full overflow-hidden p-0.5">
              <motion.div 
                animate={{ width: `${(student.xp % 1000) / 10}%` }}
                className="h-full bg-primary rounded-full" 
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 h-screen">
        <AnimatePresence mode="wait">
          <motion.section
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTab === 'dashboard' && <Dashboard student={student} />}
            {activeTab === 'doubts' && <DoubtSolver onXPEarned={addXP} />}
            {activeTab === 'notes' && <NotesGenerator />}
            {activeTab === 'profile' && <Profile student={student} onUpdate={handleUpdateProfile} />}
          </motion.section>
        </AnimatePresence>
      </main>

      {/* Floating XP Notification (Toast simulation) */}
      <XPPopups />
    </div>
  );
}

// Simple internal component for popup effects
function XPPopups() {
  return null; // For future enhancement
}

