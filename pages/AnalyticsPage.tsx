import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { TrendingUp, Flame, Target, Award, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { weeklyPerformance, subjectProgress, masteryTrend, currentUser } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';

const radarData = currentUser.skills.map((s) => ({ subject: s.subject.split(' ')[0], value: s.rating }));

export function AnalyticsPage() {
  const { theme } = useTheme();
  const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8';
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(148,163,184,0.3)',
    borderRadius: '12px',
    fontSize: '12px',
  };

  const avgMastery = Math.round(currentUser.skills.reduce((a, s) => a + s.rating, 0) / currentUser.skills.length);
  const bestSubject = [...currentUser.skills].sort((a, b) => b.rating - a.rating)[0];
  const improvement = subjectProgress.reduce((a, s) => a + (s.after - s.before), 0) / subjectProgress.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl">Learning Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Track your progress, mastery, and performance over time.</p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Avg. Mastery', value: `${avgMastery}%`, color: 'text-primary-500' },
          { icon: TrendingUp, label: 'Avg. Improvement', value: `+${Math.round(improvement)}%`, color: 'text-success-500' },
          { icon: Flame, label: 'Current Streak', value: `${currentUser.streak} days`, color: 'text-warning-500' },
          { icon: Award, label: 'Best Subject', value: bestSubject.subject, color: 'text-accent-500' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlassCard hover className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${s.color} mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold font-display truncate">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Mastery trend */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Mastery Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={masteryTrend}>
              <defs>
                <linearGradient id="masteryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3366ff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3366ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="mastery" stroke="#3366ff" strokeWidth={2.5} fill="url(#masteryGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly performance */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-500" /> Weekly Performance</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="#3366ff" />
                <Bar dataKey="sessions" radius={[8, 8, 0, 0]} fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Skill radar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Subject Mastery Radar</h2>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="subject" stroke={axisColor} fontSize={11} />
                <PolarRadiusAxis stroke={axisColor} fontSize={10} angle={90} domain={[0, 100]} />
                <Radar dataKey="value" stroke="#3366ff" fill="#3366ff" fillOpacity={0.4} strokeWidth={2} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* Subject improvement */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <GlassCard className="p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Subject Improvement (Before vs After)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectProgress} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" stroke={axisColor} fontSize={12} domain={[0, 100]} />
              <YAxis type="category" dataKey="subject" stroke={axisColor} fontSize={11} width={100} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="before" fill="#94a3b8" radius={[0, 8, 8, 0]} name="Before" />
              <Bar dataKey="after" fill="#3366ff" radius={[0, 8, 8, 0]} name="After" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Streak + ring */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6 flex items-center gap-6">
            <ProgressRing value={Math.min(100, currentUser.streak * 3)} size={120} stroke={10} label={`${currentUser.streak}`} sublabel="day streak" />
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">Learning Streak</h3>
              <p className="text-sm text-slate-500">You've studied {currentUser.streak} days in a row. Keep it going to earn the Month Master badge!</p>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className={`w-3 h-8 rounded-sm ${i < currentUser.streak ? 'bg-gradient-to-t from-warning-500 to-warning-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold text-lg mb-4">Weekly Report</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
