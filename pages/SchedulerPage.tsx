import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, Check, X, Video, MapPin } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useToast } from '@/context/ToastContext';
import { useData } from '@/context/DataContext';
import { tutors, currentUser } from '@/data/mockData';
import type { Session } from '@/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const TIME_SLOTS = ['09:00','10:30','12:00','14:00','15:30','17:00','18:30'];

export function SchedulerPage() {
  const { notify } = useToast();
  const { sessions, addSession, cancelSession } = useData();
  const [cursor, setCursor] = useState(new Date(2026, 8, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 8, 2));
  const [selectedTutor, setSelectedTutor] = useState(tutors[0].id);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [mode, setMode] = useState<'online' | 'in-person'>('online');
  const [confirming, setConfirming] = useState(false);

  const tutor = tutors.find((t) => t.id === selectedTutor)!;

  const monthGrid = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [cursor]);

  const sessionsForDate = (date: Date) =>
    sessions.filter((s) => new Date(s.date).toDateString() === date.toDateString());

  const bookedSlots = selectedDate
    ? sessionsForDate(selectedDate).map((s) => s.startTime)
    : [];

  const mySessions = sessions.filter((s) => s.studentId === currentUser.id);

  const confirmBooking = () => {
    if (!selectedDate || !selectedSlot) return;
    setConfirming(true);
  };

  const finalizeBooking = () => {
    if (!selectedDate || !selectedSlot) return;
    const dateStr = selectedDate.toISOString().slice(0, 10);
    const start = selectedSlot;
    const endH = parseInt(start.slice(0, 2)) + 1;
    const end = `${String(endH).padStart(2, '0')}:30`;
    const newSession: Session = {
      id: `ses-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      tutorId: tutor.id,
      tutorName: tutor.name,
      subject: tutor.subjects[0],
      date: dateStr,
      startTime: start,
      endTime: end,
      status: 'scheduled',
      mode,
    };
    addSession(newSession);
    notify('Session booked successfully!', 'success');
    setConfirming(false);
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl">Session Scheduler</h1>
        <p className="text-sm text-slate-500 mt-1">Pick a date, choose a tutor, and book an available time slot.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2"><CalIcon className="w-5 h-5 text-primary-500" /> {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</h2>
              <div className="flex gap-1">
                <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
              ))}
              {monthGrid.map((date, i) => {
                if (!date) return <div key={i} />;
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                const daySessions = sessionsForDate(date);
                return (
                  <button
                    key={i}
                    onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                    className={`aspect-square rounded-xl text-sm font-medium relative transition-all ${
                      isSelected ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow'
                      : isToday ? 'bg-primary-500/10 text-primary-600 dark:text-primary-300 ring-1 ring-primary-500/30'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {date.getDate()}
                    {daySessions.length > 0 && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Booking panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Book a Session</h2>

            <label className="text-xs font-medium text-slate-500">Select Tutor</label>
            <select
              value={selectedTutor}
              onChange={(e) => setSelectedTutor(e.target.value)}
              className="w-full mt-1 mb-4 px-3 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-sm border border-transparent focus:border-primary-500/40 focus:outline-none"
            >
              {tutors.map((t) => (
                <option key={t.id} value={t.id}>{t.name} — {t.subjects[0]}</option>
              ))}
            </select>

            <label className="text-xs font-medium text-slate-500">Selected Date</label>
            <div className="mt-1 mb-4 p-3 rounded-xl glass text-sm font-medium">
              {selectedDate ? selectedDate.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Pick a date'}
            </div>

            <label className="text-xs font-medium text-slate-500">Available Time Slots</label>
            <div className="grid grid-cols-3 gap-2 mt-2 mb-4">
              {TIME_SLOTS.map((slot) => {
                const booked = bookedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    disabled={booked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-xl text-xs font-medium transition-all ${
                      booked ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 cursor-not-allowed line-through'
                      : selectedSlot === slot ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow'
                      : 'glass hover:shadow-glass'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <label className="text-xs font-medium text-slate-500">Session Mode</label>
            <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
              {(['online', 'in-person'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    mode === m ? 'bg-primary-500 text-white' : 'glass'
                  }`}
                >
                  {m === 'online' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  {m === 'online' ? 'Online' : 'In-Person'}
                </button>
              ))}
            </div>

            <button
              onClick={confirmBooking}
              disabled={!selectedSlot}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-glow transition-shadow"
            >
              Confirm Booking
            </button>
          </GlassCard>
        </motion.div>
      </div>

      {/* My sessions */}
      <GlassCard className="p-6">
        <h2 className="font-display font-semibold text-lg mb-4">My Sessions</h2>
        <div className="space-y-2">
          {mySessions.length === 0 && <p className="text-sm text-slate-500 py-6 text-center">No sessions yet.</p>}
          {mySessions.map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex flex-col items-center justify-center text-white shrink-0">
                <span className="text-[9px] uppercase">{new Date(s.date).toLocaleDateString('en', { month: 'short' })}</span>
                <span className="font-bold">{new Date(s.date).getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{s.subject} with {s.tutorName}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {s.startTime}–{s.endTime} · {s.mode}</p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full ${
                s.status === 'scheduled' ? 'bg-success-500/15 text-success-600 dark:text-success-400'
                : s.status === 'completed' ? 'bg-primary-500/15 text-primary-600 dark:text-primary-300'
                : 'bg-error-500/15 text-error-600 dark:text-error-400'
              }`}>{s.status}</span>
              {s.status === 'scheduled' && (
                <button onClick={() => { cancelSession(s.id); notify('Session cancelled', 'info'); }} className="text-slate-400 hover:text-error-500">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Confirmation modal */}
      <AnimatePresence>
        {confirming && selectedDate && selectedSlot && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirming(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-strong rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-success-400 to-accent-500 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display font-bold text-lg text-center mb-1">Confirm Your Booking</h3>
              <p className="text-sm text-slate-500 text-center mb-5">Review the details before confirming.</p>
              <div className="space-y-2 mb-5">
                {[
                  ['Tutor', tutor.name],
                  ['Subject', tutor.subjects[0]],
                  ['Date', selectedDate.toLocaleDateString('en', { weekday: 'short', month: 'long', day: 'numeric' })],
                  ['Time', `${selectedSlot} – ${String(parseInt(selectedSlot.slice(0,2))+1).padStart(2,'0')}:30`],
                  ['Mode', mode],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-2 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-semibold capitalize">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setConfirming(false)} className="flex-1 py-3 rounded-xl glass font-medium">Cancel</button>
                <button onClick={finalizeBooking} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-glow transition-shadow">Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
