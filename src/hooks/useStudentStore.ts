import { useState, useEffect, useCallback } from 'react';
import { StudentData, Badge, StudentLevel, SubjectMarks } from '../types';

const INITIAL_DATA: StudentData = {
  name: 'Sparky',
  attendance: 85,
  marks: {
    'Mathematics': 78,
    'Science': 82,
    'English': 88,
    'History': 70,
  },
  xp: 120,
  level: 1,
  badges: [
    {
      id: 'welcome',
      name: 'Alpha Spark',
      icon: '✨',
      description: 'Joined the EduSpark community!',
      unlockedAt: new Date().toISOString(),
    },
  ],
};

export const useStudentStore = () => {
  const [student, setStudent] = useState<StudentData>(() => {
    const saved = localStorage.getItem('eduspark_student');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('eduspark_student', JSON.stringify(student));
  }, [student]);

  const updateMarks = (newMarks: SubjectMarks) => {
    setStudent(prev => ({ ...prev, marks: newMarks }));
  };

  const updateAttendance = (val: number) => {
    setStudent(prev => ({ ...prev, attendance: val }));
  };

  const addXP = (amount: number) => {
    setStudent(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const addBadge = (badge: Omit<Badge, 'unlockedAt'>) => {
    setStudent(prev => {
      if (prev.badges.find(b => b.id === badge.id)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, { ...badge, unlockedAt: new Date().toISOString() }],
      };
    });
  };

  return { student, updateMarks, updateAttendance, addXP, addBadge, setStudent };
};
