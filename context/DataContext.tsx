import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Session, Notification, Student, Subject } from '@/types';
import { sessions as initialSessions, notifications as initialNotifications, currentUser, sampleStudents, sampleSubjects } from '@/data/mockData';
import { loadState, saveState } from '@/lib/storage';

interface DataContext {
  sessions: Session[];
  notifications: Notification[];
  addSession: (s: Session) => void;
  cancelSession: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  xp: number;
  addXp: (amount: number) => void;
  students: Student[];
  addStudent: (s: Student) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;
  subjects: Subject[];
  addSubject: (s: Subject) => void;
  updateSubject: (s: Subject) => void;
  deleteSubject: (id: string) => void;
  resetSampleData: () => void;
}
const Ctx = createContext<DataContext | null>(null);

const STUDENTS_KEY = 'ss_students';
const SUBJECTS_KEY = 'ss_subjects';

export function DataProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [xp, setXp] = useState(currentUser.xp);
  const [students, setStudents] = useState<Student[]>(() => {
    const stored = loadState<Student[]>(STUDENTS_KEY, []);
    if (stored.length > 0) return stored;
    return sampleStudents;
  });
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const stored = loadState<Subject[]>(SUBJECTS_KEY, []);
    if (stored.length > 0) return stored;
    return sampleSubjects;
  });

  useEffect(() => { saveState(STUDENTS_KEY, students); }, [students]);
  useEffect(() => { saveState(SUBJECTS_KEY, subjects); }, [subjects]);

  const addSession = (s: Session) => setSessions((prev) => [s, ...prev]);
  const cancelSession = (id: string) =>
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s)));
  const markNotificationRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const addXp = (amount: number) => setXp((x) => x + amount);

  const addStudent = (s: Student) => setStudents((prev) => [...prev, s]);
  const updateStudent = (s: Student) => setStudents((prev) => prev.map((x) => (x.id === s.id ? s : x)));
  const deleteStudent = (id: string) => setStudents((prev) => prev.filter((x) => x.id !== id));

  const addSubject = (s: Subject) => setSubjects((prev) => [...prev, s]);
  const updateSubject = (s: Subject) => setSubjects((prev) => prev.map((x) => (x.id === s.id ? s : x)));
  const deleteSubject = (id: string) => setSubjects((prev) => prev.filter((x) => x.id !== id));

  const resetSampleData = () => {
    setStudents(sampleStudents);
    setSubjects(sampleSubjects);
  };

  return (
    <Ctx.Provider value={{
      sessions, notifications, addSession, cancelSession, markNotificationRead, markAllRead, xp, addXp,
      students, addStudent, updateStudent, deleteStudent,
      subjects, addSubject, updateSubject, deleteSubject, resetSampleData,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
