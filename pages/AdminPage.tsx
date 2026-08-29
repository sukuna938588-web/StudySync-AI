import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  Users, GraduationCap, Calendar, TrendingUp, Search,
  Star, MoreHorizontal, Shield, Activity, BookOpen,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { tutors, adminStats, liveActivity } from '@/data/mockData';

const PIE_COLORS = ['#3366ff', '#06b6d4', '#10b981', '#f59e0b'];

type Tab = 'overview' | 'students' | 'tutors' | 'sessions';

export function AdminPage() {
  const { theme } = useTheme();
  const { sessions, students, subjects } = useData();
  const [tab, setTab] = useState<Tab>('overview');
  const [query, setQuery] = useState('');

  const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8';
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(148,163,184,0.3)',
    borderRadius: '12px',
    fontSize: '12px',
  };

  const stats = [
    { icon: Users, label: 'Total Students', value: students.length, suffix: '', color: 'text-primary-500' },
    { icon: BookOpen, label: 'Total Subjects', value: subjects.length, suffix: '', color: 'text-accent-500' },
    { icon: Calendar, label: 'Sessions Scheduled', value: sessions.filter((s) => s.status === 'scheduled').length, suffix: '', color: 'text-success-500' },
    { icon: TrendingUp, label: 'Completed Sessions', value: sessions.filter((s) => s.status === 'completed').length, suffix: '', color: 'text-warning-500' },
  ];

  const filteredStudents = students.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  const filteredTutors = tutors.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary-500" />
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage students, tutors, and monitor platform activity.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlassCard hover className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${s.color} mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold font-display">{s.value}{s.suffix}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['overview', 'students', 'tutors', 'sessions'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow' : 'glass'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Growth chart */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
              <GlassCard className="p-6">
                <h2 className="font-display font-semibold text-lg mb-4">Platform Growth</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={adminStats.monthlyGrowth}>
                    <defs>
                      <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3366ff" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#3366ff" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="tutGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                    <YAxis stroke={axisColor} fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="students" stroke="#3366ff" strokeWidth={2.5} fill="url(#studGrad)" />
                    <Area type="monotone" dataKey="tutors" stroke="#06b6d4" strokeWidth={2.5} fill="url(#tutGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>

            {/* Department distribution */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <GlassCard className="p-6">
                <h2 className="font-display font-semibold text-lg mb-4">Departments</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={adminStats.departmentDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {adminStats.departmentDistribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {adminStats.departmentDistribution.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} /> {d.name}</span>
                      <span className="font-semibold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Live activity */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <GlassCard className="p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-accent-500" /> Live Activity Feed</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {liveActivity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40">
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
      )}

      {tab === 'students' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6">
            <div className="relative mb-4 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-sm border border-transparent focus:border-primary-500/40 focus:outline-none"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-200/60 dark:border-slate-700/60">
                    <th className="py-3 px-2">Student</th>
                    <th className="py-3 px-2">Department</th>
                    <th className="py-3 px-2">Year</th>
                    <th className="py-3 px-2">Level</th>
                    <th className="py-3 px-2">XP</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <img src={s.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-500">{s.department}</td>
                      <td className="py-3 px-2 text-slate-500">{s.year}</td>
                      <td className="py-3 px-2"><span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300">Lvl {s.level}</span></td>
                      <td className="py-3 px-2 font-semibold">{s.xp.toLocaleString()}</td>
                      <td className="py-3 px-2"><MoreHorizontal className="w-4 h-4 text-slate-400" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {tab === 'tutors' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6">
            <div className="relative mb-4 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tutors..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-sm border border-transparent focus:border-primary-500/40 focus:outline-none"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTutors.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={t.avatar} alt="" className="w-12 h-12 rounded-xl bg-slate-200" />
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.department}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {t.subjects.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300">{s}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div><Star className="w-3.5 h-3.5 text-warning-500 mx-auto" /><p className="font-semibold mt-0.5">{t.rating.toFixed(1)}</p></div>
                    <div><TrendingUp className="w-3.5 h-3.5 text-success-500 mx-auto" /><p className="font-semibold mt-0.5">{t.successRate}%</p></div>
                    <div><Calendar className="w-3.5 h-3.5 text-accent-500 mx-auto" /><p className="font-semibold mt-0.5">{t.sessionsCompleted}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {tab === 'sessions' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Session Monitoring</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-200/60 dark:border-slate-700/60">
                    <th className="py-3 px-2">Student</th>
                    <th className="py-3 px-2">Tutor</th>
                    <th className="py-3 px-2">Subject</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Time</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-2 font-medium">{s.studentName}</td>
                      <td className="py-3 px-2 text-slate-500">{s.tutorName}</td>
                      <td className="py-3 px-2">{s.subject}</td>
                      <td className="py-3 px-2 text-slate-500">{s.date}</td>
                      <td className="py-3 px-2 text-slate-500">{s.startTime}</td>
                      <td className="py-3 px-2">
                        <span className={`text-[10px] px-2 py-1 rounded-full ${
                          s.status === 'scheduled' ? 'bg-success-500/15 text-success-600 dark:text-success-400'
                          : s.status === 'completed' ? 'bg-primary-500/15 text-primary-600 dark:text-primary-300'
                          : 'bg-error-500/15 text-error-600 dark:text-error-400'
                        }`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
