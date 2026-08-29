import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Pencil, Trash2, X, Users, AlertTriangle, RotateCcw,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal, Field, ChipInput, SelectField } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { useData } from '@/context/DataContext';
import type { Student } from '@/types';

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear&backgroundColor=3366ff,06b6d4`;

const DEPARTMENTS = ['Computer Science', 'Electrical Engineering', 'Mathematics', 'Data Science', 'Mechanical'];

export function StudentsPage() {
  const { notify } = useToast();
  const { students, subjects, addStudent, updateStudent, deleteStudent, resetSampleData } = useData();
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Student | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const subjectNames = subjects.map((s) => s.name);

  // form state
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState('1');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.rollNumber.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setName(''); setRoll(''); setDept(DEPARTMENTS[0]); setYear('1'); setStrengths([]); setWeaknesses([]);
    setModalOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setName(s.name); setRoll(s.rollNumber); setDept(s.department); setYear(String(s.year));
    setStrengths(s.strengths); setWeaknesses(s.weaknesses);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !roll.trim()) {
      notify('Name and Roll Number are required', 'error');
      return;
    }
    if (editing) {
      updateStudent({
        ...editing,
        name: name.trim(),
        rollNumber: roll.trim(),
        department: dept,
        year: parseInt(year),
        strengths,
        weaknesses,
        weakSubjects: weaknesses,
        skills: strengths.map((subj) => ({ subject: subj, rating: 75 + Math.floor(Math.random() * 20) })),
      });
      notify('Student updated successfully', 'success');
    } else {
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        name: name.trim(),
        rollNumber: roll.trim(),
        email: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@university.edu',
        avatar: avatar(name.trim()),
        department: dept,
        year: parseInt(year),
        strengths,
        weaknesses,
        skills: strengths.map((subj) => ({ subject: subj, rating: 75 + Math.floor(Math.random() * 20) })),
        weakSubjects: weaknesses,
        learningPreferences: ['Visual learning', 'Hands-on projects'],
        availability: [],
        xp: 1000 + Math.floor(Math.random() * 500),
        level: 5 + Math.floor(Math.random() * 8),
        streak: Math.floor(Math.random() * 20),
        badges: ['First Session'],
        bio: 'Student passionate about learning and growth.',
      };
      addStudent(newStudent);
      notify('Student added successfully', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteStudent(confirmDelete.id);
      notify('Student deleted', 'info');
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl">Students Management</h1>
          <p className="text-sm text-slate-500 mt-1">Add, edit, and manage all student records. Data persists across refreshes.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setConfirmReset(true)} className="px-4 py-2.5 rounded-xl glass text-sm font-medium hover:shadow-glass transition-shadow flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset Sample
          </button>
          <button onClick={openAdd} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-glow hover:shadow-glow-cyan transition-shadow flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length, icon: Users, color: 'text-primary-500' },
          { label: 'With Strengths', value: students.filter((s) => s.strengths.length > 0).length, icon: Plus, color: 'text-success-500' },
          { label: 'With Weaknesses', value: students.filter((s) => s.weaknesses.length > 0).length, icon: AlertTriangle, color: 'text-warning-500' },
          { label: 'Subjects Available', value: subjects.length, icon: Search, color: 'text-accent-500' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlassCard hover className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${s.color} mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold font-display">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Search + Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or roll number..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-sm border border-transparent focus:border-primary-500/40 focus:outline-none"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No students found. Click "Add Student" to create one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-200/60 dark:border-slate-700/60">
                    <th className="py-3 px-2">Student</th>
                    <th className="py-3 px-2">Roll No.</th>
                    <th className="py-3 px-2">Department</th>
                    <th className="py-3 px-2">Year</th>
                    <th className="py-3 px-2">Strengths</th>
                    <th className="py-3 px-2">Weaknesses</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <img src={s.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-500 font-mono text-xs">{s.rollNumber}</td>
                      <td className="py-3 px-2 text-slate-500">{s.department}</td>
                      <td className="py-3 px-2 text-slate-500">{s.year}</td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {s.strengths.length === 0 && <span className="text-xs text-slate-400">—</span>}
                          {s.strengths.slice(0, 2).map((st) => (
                            <span key={st} className="text-[10px] px-1.5 py-0.5 rounded-full bg-success-500/15 text-success-600 dark:text-success-400">{st}</span>
                          ))}
                          {s.strengths.length > 2 && <span className="text-[10px] text-slate-400">+{s.strengths.length - 2}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {s.weaknesses.length === 0 && <span className="text-xs text-slate-400">—</span>}
                          {s.weaknesses.slice(0, 2).map((w) => (
                            <span key={w} className="text-[10px] px-1.5 py-0.5 rounded-full bg-error-500/15 text-error-600 dark:text-error-400">{w}</span>
                          ))}
                          {s.weaknesses.length > 2 && <span className="text-[10px] text-slate-400">+{s.weaknesses.length - 2}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary-500 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmDelete(s)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-error-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Student' : 'Add Student'}>
        <div className="space-y-4">
          <Field label="Student Name" value={name} onChange={setName} placeholder="e.g. John Doe" />
          <Field label="Roll Number" value={roll} onChange={setRoll} placeholder="e.g. CS21B001" />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Department" value={dept} onChange={setDept} options={DEPARTMENTS.map((d) => ({ value: d, label: d }))} />
            <SelectField label="Year" value={year} onChange={setYear} options={[1, 2, 3, 4].map((y) => ({ value: String(y), label: `Year ${y}` }))} />
          </div>
          <ChipInput label="Strengths (subjects this student can teach)" values={strengths} onChange={setStrengths} suggestions={subjectNames} placeholder="Type a subject and press Enter" />
          <ChipInput label="Weaknesses (subjects this student needs help with)" values={weaknesses} onChange={setWeaknesses} suggestions={subjectNames} placeholder="Type a subject and press Enter" />
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-glow transition-shadow"
          >
            {editing ? 'Update Student' : 'Save Student'}
          </button>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Student" maxWidth="max-w-sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-error-500/15 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-error-500" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
            Are you sure you want to delete <span className="font-semibold">{confirmDelete?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl glass font-medium">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-error-500 text-white font-semibold hover:opacity-90 transition-opacity">Delete</button>
          </div>
        </div>
      </Modal>

      {/* Reset confirmation */}
      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Reset to Sample Data" maxWidth="max-w-sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-warning-500/15 flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-7 h-7 text-warning-500" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
            This will replace all current students and subjects with the original sample data. Continue?
          </p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmReset(false)} className="flex-1 py-2.5 rounded-xl glass font-medium">Cancel</button>
            <button onClick={() => { resetSampleData(); notify('Sample data restored', 'success'); setConfirmReset(false); }} className="flex-1 py-2.5 rounded-xl bg-warning-500 text-white font-semibold hover:opacity-90 transition-opacity">Reset</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
