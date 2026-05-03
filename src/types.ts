export enum StudentLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface SubjectMarks {
  [subject: string]: number;
}

export interface StudentData {
  name: string;
  attendance: number;
  marks: SubjectMarks;
  xp: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface PerformanceAnalysis {
  student_name: string;
  attendance: string;
  marks: SubjectMarks;
  performance_analysis: string;
  weak_areas: string[];
  suggestions: string[];
}

export interface DoubtResponse {
  concept: string;
  example: string;
  notes: string[];
  deepDive?: string;
  summary: string;
  quickChallenge: string;
  xpEarned: number;
}

export interface NoteGeneratorResponse {
  title: string;
  keyPoints: string[];
  definitions: { term: string; definition: string }[];
  examples: string[];
  summary: string;
}
