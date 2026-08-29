export type Role = 'student' | 'tutor' | 'admin';

export interface SkillRating {
  subject: string;
  rating: number; // 0-100 mastery
}

export interface AvailabilitySlot {
  day: string; // 'Mon','Tue',...
  start: string; // '09:00'
  end: string; // '11:00'
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  avatar: string;
  department: string;
  year: number;
  strengths: string[];
  weaknesses: string[];
  skills: SkillRating[];
  weakSubjects: string[];
  learningPreferences: string[];
  availability: AvailabilitySlot[];
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  bio: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Review {
  id: string;
  tutorId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Tutor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  subjects: string[];
  expertise: SkillRating[];
  rating: number;
  reviewCount: number;
  successRate: number;
  sessionsCompleted: number;
  availability: AvailabilitySlot[];
  hourlyRate: number;
  bio: string;
  badges: string[];
  reviews: Review[];
}

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Session {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  date: string; // ISO date
  startTime: string;
  endTime: string;
  status: SessionStatus;
  mode: 'online' | 'in-person';
  topic?: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'booking' | 'achievement' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  department: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export interface MatchResult {
  tutor: Tutor;
  score: number;
  confidence: number;
  reasons: string[];
  breakdown: { label: string; weight: number; value: number }[];
}

export interface PeerMatch {
  student: Student;
  matchedSubjects: string[];
  score: number;
  reason: string;
}
