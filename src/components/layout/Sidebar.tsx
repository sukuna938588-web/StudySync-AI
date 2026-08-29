import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Calendar, BarChart3, Trophy, Bot, Shield,
  Sparkles, ChevronRight, GraduationCap, BookOpen,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { currentUser } from '@/data/mockData';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/matching', label: 'Tutor Matching', icon: Users },
  { to: '/scheduler', label: 'Scheduler', icon: Calendar },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/gamification', label: 'Gamification', icon: Trophy },
  { to: '/assistant', label: 'AI Assistant', icon: Bot },
  { to: '/students', label: 'Students', icon: GraduationCap },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/admin', label: 'Admin', icon: Shield },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="glass-strong h-full flex flex-col p-5 border-r border-slate-200/60 dark:border-slate-700/60">
          <Link to="/" className="flex items-center gap-2.5 mb-8 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg">StudySync<span className="text-gradient">AI</span></span>
          </Link>

          <nav className="flex-1 space-y-1">
            {nav.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'text-primary-600 dark:text-primary-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-primary-500/10 border border-primary-500/20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 ml-auto relative z-10" />}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggle}
            className="mt-4 glass rounded-xl p-3 flex items-center justify-between text-sm"
          >
            <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
            </div>
          </button>

          <div className="mt-4 glass rounded-2xl p-4 flex items-center gap-3">
            <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">Level {currentUser.level} · {currentUser.xp} XP</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
