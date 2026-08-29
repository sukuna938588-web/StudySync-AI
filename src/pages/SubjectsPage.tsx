import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Pencil, Trash2, BookOpen, Layers,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal, Field, SelectField } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { useData } from '@/context/DataContext';
import type { Subject } from '@/types';

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-success-500/15 text-success-600 dark:text-success-400',
  Intermediate: 'bg-warning-500/15 text-warning-600 dark:text-warning-400',
  Advanced: 'bg-error-500/15 text-error-600 dark:text-error-400',
};

export function SubjectsPage() {
  const { notify } = useToast();
  const { subjects, addSubject, updateSubject, deleteSubject } = useData();
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Subject | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');

  const filtered = subjects.filter(
    (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setName(''); setCode(''); setDifficulty('Beginner');
    setModalOpen(true);
  };

  const openEdit = (s: Subject) => {
    setEditing(s);
    setName(s.name); setCode(s.code); setDifficulty(s.difficulty);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !code.trim()) {
      notify('Subject Name and Code are required', 'error');
      return;
    }
    if (editing) {
      updateSubject({ ...editing, name: name.trim(), code: code.trim(), difficulty });
      notify('Subject updated successfully', 'success');
    } else {
      addSubject({ id: `sub-${Date.now()}`, name: name.trim(), code: code.trim(), difficulty });
      notify('Subject added successfully', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteSubject(confirmDelete.id);
      notify('Subject deleted', 'info');
      setConfirmDelete(null);
    }
  };

  const diffCount = {
    Beginner: subjects.filter((s) => s.difficulty === 'Beginner').length,
    Intermediate: subjects.filter((s) => s.difficulty === 'Intermediate').length,
    Advanced: subjects.filter((s) => s.difficulty === 'Advanced').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl">Subjects Management</h1>
          <p className="text-sm text-slate-500 mt-1">Add, edit, and manage all subjects. Data persists across refreshes.</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-glow hover:shadow-glow-cyan transition-shadow flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Subjects', value: subjects.length, icon: BookOpen, color: 'text-primary-500' },
          { label: 'Beginner', value: diffCount.Beginner, icon: Layers, color: 'text-success-500' },
          { label: 'Intermediate', value: diffCount.Intermediate, icon: Layers, color: 'text-warning-500' },
          { label: 'Advanced', value: diffCount.Advanced, icon: Layers, color: 'text-error-500' },
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

      {/* Search + Grid */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6">
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or code..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-sm border border-transparent focus:border-primary-500/40 focus:outline-none"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No subjects found. Click "Add Subject" to create one.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                  <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 hover:shadow-glass transition-shadow group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary-500" />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-500 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setConfirmDelete(s)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-error-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{s.code}</p>
                    <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[s.difficulty]}`}>
                      {s.difficulty}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Subject' : 'Add Subject'} maxWidth="max-w-md">
        <div className="space-y-4">
          <Field label="Subject Name" value={name} onChange={setName} placeholder="e.g. Machine Learning" />
          <Field label="Subject Code" value={code} onChange={setCode} placeholder="e.g. CS401" />
          <SelectField
            label="Difficulty Level"
            value={difficulty}
            onChange={(v) => setDifficulty(v as 'Beginner' | 'Intermediate' | 'Advanced')}
            options={[
              { value: 'Beginner', label: 'Beginner' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
            ]}
          />
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-glow transition-shadow"
          >
            {editing ? 'Update Subject' : 'Save Subject'}
          </button>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Subject" maxWidth="max-w-sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-error-500/15 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-error-500" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
            Are you sure you want to delete <span className="font-semibold">{confirmDelete?.name}</span> ({confirmDelete?.code})? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl glass font-medium">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-error-500 text-white font-semibold hover:opacity-90 transition-opacity">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
