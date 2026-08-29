import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Trophy, Flame, Zap, Star, Crown, Medal } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useData } from '@/context/DataContext';
import { currentUser, badges, leaderboard } from '@/data/mockData';

const tierColors: Record<string, string> = {
  bronze: 'from-amber-700 to-amber-500',
  silver: 'from-slate-400 to-slate-300',
  gold: 'from-yellow-500 to-amber-400',
  platinum: 'from-cyan-400 to-primary-400',
};

export function GamificationPage() {
  const { xp } = useData();
  const level = Math.floor(xp / 500) + 1;
  const levelProgress = (xp % 500) / 500 * 100;
  const earnedBadgeIds = currentUser.badges;
  const myRank = leaderboard.find((e) => e.name === currentUser.name)?.rank ?? 8;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl">Gamification</h1>
        <p className="text-sm text-slate-500 mt-1">Earn XP, level up, unlock badges, and climb the leaderboard.</p>
      </div>

      {/* XP & Level hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-warning-500/15 blur-3xl animate-pulse-glow" />
          <div className="relative grid lg:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-5">
              <ProgressRing value={Math.round(levelProgress)} size={130} stroke={12} label={`${level}`} sublabel="Level" gradientId="xpGrad" />
              <div>
                <div className="flex items-center gap-2 text-warning-500">
                  <Zap className="w-5 h-5" />
                  <span className="font-display font-bold text-2xl">{xp.toLocaleString()} XP</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{Math.round(500 - (xp % 500))} XP to Level {level + 1}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Flame className="w-3 h-3 text-warning-500" /> {currentUser.streak}-day streak</p>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-3 gap-3">
              {[
                { icon: Trophy, label: 'Rank', value: `#${myRank}`, color: 'text-warning-500' },
                { icon: Flame, label: 'Streak', value: `${currentUser.streak}d`, color: 'text-error-500' },
                { icon: Star, label: 'Badges', value: `${earnedBadgeIds.length}/${badges.length}`, color: 'text-primary-500' },
              ].map((s, i) => (
                <div key={i} className="glass rounded-2xl p-4 text-center">
                  <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
                  <p className="text-xl font-bold font-display">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Badges */}
      <div>
        <h2 className="font-display font-bold text-xl mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((b, i) => {
            const earned = earnedBadgeIds.includes(b.name);
            const Icon = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[b.icon] ?? Icons.Award;
            return (
              <motion.div key={b.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <GlassCard hover className={`p-5 text-center ${!earned ? 'opacity-50 grayscale' : ''}`}>
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 bg-gradient-to-br ${tierColors[b.tier]} flex items-center justify-center shadow-glow`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold text-sm">{b.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{b.description}</p>
                  <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full capitalize ${earned ? 'bg-success-500/15 text-success-600 dark:text-success-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                    {earned ? 'Earned' : 'Locked'}
                  </span>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-warning-500" /> Leaderboard</h2>
        <GlassCard className="p-2">
          <div className="space-y-1">
            {leaderboard.slice(0, 10).map((entry) => {
              const isMe = entry.name === currentUser.name;
              return (
                <div
                  key={entry.name}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${isMe ? 'bg-primary-500/10 ring-1 ring-primary-500/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                >
                  <div className={`w-8 text-center font-bold ${entry.rank <= 3 ? 'text-warning-500' : 'text-slate-400'}`}>
                    {entry.rank <= 3 ? (
                      <Medal className="w-5 h-5 mx-auto" />
                    ) : (
                      entry.rank
                    )}
                  </div>
                  <img src={entry.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{entry.name} {isMe && <span className="text-xs text-primary-500">(You)</span>}</p>
                    <p className="text-xs text-slate-500">{entry.department} · Lvl {entry.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gradient">{entry.xp.toLocaleString()} XP</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 justify-end"><Flame className="w-3 h-3 text-warning-500" /> {entry.streak}d</p>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
