import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, TrendingUp, Flame, Zap, Trophy, ArrowRight,
  BookOpen, Target, Sparkles, Activity, Plus, Layers, Users,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useData } from '@/context/DataContext';
import { currentUser, weeklyPerformance, liveActivity, leaderboard } from '@/data/mockData';

export function DashboardPage() {
  const { sessions, notifications, xp } = useData();
  const upcoming = sessions.filter((s) => s.status === 'scheduled' && s.studentId === currentUser.id);
  const completed = sessions.filter((s) => s.status === 'completed' && s.studentId === currentUser.id);
  const avgScore = Math.round(weeklyPerformance.reduce((a, w) => a + w.score, 0) / weeklyPerformance.length);
  const levelProgress = ((xp % 500) / 500) * 100;
  const myRank = leaderboard.find((e) => e.name === currentUser.name)?.rank ?? 8;

  const stats = [
    { label: 'Sessions Completed', value: completed.length, icon: BookOpen, color: 'text-primary-500' },
    { label: 'Upcoming Sessions', value: upcoming.length, icon: Calendar, color: 'text-accent-500' },
    { label: 'Learning Streak', value: `${currentUser.streak} days`, icon: Flame, color: 'text-warning-500' },
    { label: 'Leaderboard Rank', value: `#${myRank}`, icon: Trophy, color: 'text-success-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-500/15 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={currentUser.avatar} alt="" className="w-16 h-16 rounded-2xl bg-slate-200" />
              <div>
                <p className="text-sm text-slate-500">Welcome back,</p>
                <h1 className="font-display font-bold text-2xl lg:text-3xl">{currentUser.name}</h1>
                <p className="text-sm text-slate-500">{currentUser.department} · Year {currentUser.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <ProgressRing value={Math.round(levelProgress)} size={90} stroke={8} label={`${Math.round(levelProgress)}%`} sublabel="to next level" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-warning-500">
                  <Trophy className="w-5 h-5" />
                  <span className="font-display font-bold text-xl">Level {currentUser.level}</span>
                </div>
                <p className="text-2xl font-bold font-display text-gradient">{xp.toLocaleString()} XP</p>
                <p className="text-xs text-slate-500 flex items-center gap-1"><Flame className="w-3 h-3 text-warning-500" /> {currentUser.streak}-day streak</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/students" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-glow hover:shadow-glow-cyan transition-shadow flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Student
        </Link>
        <Link to="/subjects" className="px-4 py-2.5 rounded-xl glass text-sm font-medium hover:shadow-glass transition-shadow flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Subject
        </Link>
        <Link to="/students" className="px-4 py-2.5 rounded-xl glass text-sm font-medium hover:shadow-glass transition-shadow flex items-center gap-2">
          <Users className="w-4 h-4" /> Manage Students
        </Link>
        <Link to="/subjects" className="px-4 py-2.5 rounded-xl glass text-sm font-medium hover:shadow-glass transition-shadow flex items-center gap-2">
          <Layers className="w-4 h-4" /> Manage Subjects
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlassCard hover className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming sessions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-500" /> Upcoming Sessions</h2>
              <Link to="/scheduler" className="text-sm text-primary-500 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            <div className="space-y-3">
              {upcoming.length === 0 && <p className="text-sm text-slate-500 py-8 text-center">No upcoming sessions. Book one!</p>}
              {upcoming.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex flex-col items-center justify-center text-white shrink-0">
                    <span className="text-[10px] uppercase">{new Date(s.date).toLocaleDateString('en', { month: 'short' })}</span>
                    <span className="font-bold text-lg leading-none">{new Date(s.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{s.subject} — {s.topic}</p>
                    <p className="text-xs text-slate-500">with {s.tutorName} · {s.startTime}–{s.endTime}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full ${s.mode === 'online' ? 'bg-accent-500/15 text-accent-600 dark:text-accent-400' : 'bg-primary-500/15 text-primary-600 dark:text-primary-400'}`}>
                    {s.mode}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-warning-500" /> Notifications</h2>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className={`p-3 rounded-xl ${!n.read ? 'bg-primary-500/5' : ''}`}>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly performance mini chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-success-500" /> Weekly Performance</h2>
              <Link to="/analytics" className="text-sm text-primary-500 hover:underline">Details</Link>
            </div>
            <div className="flex items-end gap-2 h-40">
              {weeklyPerformance.map((w, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-accent-500"
                      initial={{ height: 0 }}
                      animate={{ height: `${w.score}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">{w.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Avg. score this week</span>
              <span className="font-bold text-success-500">{avgScore}%</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Live activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <GlassCard className="p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-accent-500" /> Live Activity</h2>
            <div className="space-y-3">
              {liveActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success-500 mt-1.5 shrink-0 animate-pulse" />
                  <div>
                    <p className="text-sm">{a.text}</p>
                    <p className="text-[10px] text-slate-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Skills overview */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard className="p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary-500" /> Skill Mastery Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentUser.skills.map((s) => (
              <div key={s.subject}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{s.subject}</span>
                  <span className={`font-semibold ${s.rating >= 75 ? 'text-success-500' : s.rating >= 50 ? 'text-warning-500' : 'text-error-500'}`}>{s.rating}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${s.rating >= 75 ? 'bg-success-500' : s.rating >= 50 ? 'bg-warning-500' : 'bg-error-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.rating}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
