import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Clock, TrendingUp, Sparkles, X, Check, Users,
  GitCompareArrows, Brain, Target, GraduationCap, ArrowRight,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useToast } from '@/context/ToastContext';
import { useData } from '@/context/DataContext';
import { currentUser, tutors } from '@/data/mockData';
import { rankMatches, findGroupMatches, findPeerMatches } from '@/lib/matching';
import type { MatchResult, PeerMatch } from '@/types';

export function MatchingPage() {
  const { notify } = useToast();
  const { students } = useData();
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<MatchResult | null>(null);
  const [selectedPeer, setSelectedPeer] = useState<PeerMatch | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const matches = useMemo(() => rankMatches(currentUser, tutors), []);
  const allSubjects = Array.from(new Set(tutors.flatMap((t) => t.subjects)));

  const filtered = matches.filter((m) => {
    const q = query.toLowerCase();
    const matchesQuery = !q || m.tutor.name.toLowerCase().includes(q) || m.tutor.subjects.some((s) => s.toLowerCase().includes(q));
    const matchesSubject = !subjectFilter || m.tutor.subjects.includes(subjectFilter);
    return matchesQuery && matchesSubject;
  });

  const groupMatches = useMemo(() => findGroupMatches(currentUser, students), [students]);
  const peerMatches = useMemo(() => findPeerMatches(currentUser, students), [students]);
  const compareList = matches.filter((m) => compareIds.includes(m.tutor.id));

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : (notify('Compare up to 3 tutors', 'info'), prev)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl">AI Tutor Matching</h1>
        <p className="text-sm text-slate-500 mt-1">Our engine ranks tutors by expertise, availability, ratings, success rate, and compatibility.</p>
      </div>

      {/* Search + filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by tutor name or subject..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-sm border border-transparent focus:border-primary-500/40 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSubjectFilter(null)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${!subjectFilter ? 'bg-primary-500 text-white' : 'glass'}`}
            >
              All
            </button>
            {allSubjects.map((s) => (
              <button
                key={s}
                onClick={() => setSubjectFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${subjectFilter === s ? 'bg-primary-500 text-white' : 'glass'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Match explanation banner */}
      <GlassCard className="p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-sm">How match scores are calculated</p>
          <p className="text-xs text-slate-500 mt-1">Subject expertise (40%) · Availability overlap (20%) · Tutor rating (15%) · Success rate (15%) · Compatibility (10%)</p>
        </div>
      </GlassCard>

      {/* Peer Matching Section */}
      <div>
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-success-500" /> Peer Tutor Recommendations
        </h2>
        <p className="text-sm text-slate-500 mb-4">Students whose strengths match your weaknesses — suggested as peer tutors from your entered data.</p>
        {peerMatches.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No peer matches yet. Add students with strengths and weaknesses to see matches.</p>
            <Link to="/students" className="inline-flex items-center gap-1 mt-3 text-sm text-primary-500 hover:underline">
              Manage Students <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {peerMatches.map((pm, i) => (
              <motion.div key={pm.student.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard hover className="p-5 h-full flex flex-col">
                  <div className="flex items-start gap-3 mb-4">
                    <img src={pm.student.avatar} alt="" className="w-14 h-14 rounded-2xl bg-slate-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{pm.student.name}</p>
                      <p className="text-xs text-slate-500">{pm.student.department} · Year {pm.student.year}</p>
                      <p className="text-xs text-slate-400 font-mono">{pm.student.rollNumber}</p>
                    </div>
                    <div className="text-center shrink-0">
                      <ProgressRing value={pm.score} size={64} stroke={6} label={`${pm.score}%`} gradientId={`p-${pm.student.id}`} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Strengths:</span>
                    {pm.student.strengths.map((s) => (
                      <span key={s} className={`text-[10px] px-2 py-0.5 rounded-full ${pm.matchedSubjects.includes(s) ? 'bg-success-500/15 text-success-600 dark:text-success-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1.5 mb-4 flex-1">
                    <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-success-500 mt-0.5 shrink-0" />
                      <span>{pm.reason}</span>
                    </div>
                  </div>

                  <button onClick={() => setSelectedPeer(pm)} className="w-full py-2 rounded-xl bg-gradient-to-r from-success-500 to-accent-500 text-white text-sm font-semibold hover:shadow-glow transition-shadow">
                    View Match
                  </button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Professional Tutor Cards */}
      <div>
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-warning-500" /> Professional Tutors
        </h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((m, i) => (
            <motion.div key={m.tutor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard hover className="p-5 h-full flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <img src={m.tutor.avatar} alt="" className="w-14 h-14 rounded-2xl bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{m.tutor.name}</p>
                    <p className="text-xs text-slate-500">{m.tutor.department}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-warning-400 text-warning-400" />
                      <span className="text-xs font-semibold">{m.tutor.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({m.tutor.reviewCount})</span>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <ProgressRing value={m.score} size={64} stroke={6} label={`${m.score}%`} gradientId={`g-${m.tutor.id}`} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {m.tutor.subjects.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300">{s}</span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <TrendingUp className="w-4 h-4 text-success-500 mx-auto" />
                    <p className="text-xs font-semibold mt-1">{m.tutor.successRate}%</p>
                    <p className="text-[9px] text-slate-400">Success</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <Clock className="w-4 h-4 text-accent-500 mx-auto" />
                    <p className="text-xs font-semibold mt-1">{m.tutor.sessionsCompleted}</p>
                    <p className="text-[9px] text-slate-400">Sessions</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <Sparkles className="w-4 h-4 text-warning-500 mx-auto" />
                    <p className="text-xs font-semibold mt-1">{m.confidence}%</p>
                    <p className="text-[9px] text-slate-400">Confidence</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4 flex-1">
                  {m.reasons.slice(0, 2).map((r, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-success-500 mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setSelected(m)} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold hover:shadow-glow transition-shadow">
                    View Match
                  </button>
                  <button
                    onClick={() => toggleCompare(m.tutor.id)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${compareIds.includes(m.tutor.id) ? 'bg-primary-500/10 border-primary-500/40 text-primary-500' : 'glass border-transparent'}`}
                    title="Add to compare"
                  >
                    <GitCompareArrows className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Group session optimizer */}
      <div>
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary-500" /> Group Session Optimizer</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groupMatches.map((g, i) => (
            <GlassCard key={i} className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-accent-500" />
                <span className="font-semibold text-sm">{g.subject}</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">{g.peers.length} peer(s) share this weak subject</p>
              <div className="space-y-2">
                {g.peers.length === 0 && <p className="text-xs text-slate-400">No peers found.</p>}
                {g.peers.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <img src={p.avatar} alt="" className="w-7 h-7 rounded-full bg-slate-200" />
                    <span className="text-xs font-medium">{p.name}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">Lvl {p.level}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => notify(`Group session for ${g.subject} recommended`, 'success')}
                className="mt-3 w-full py-2 rounded-xl glass text-sm font-medium hover:shadow-glass transition-shadow"
              >
                Create Group Session
              </button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Compare modal */}
      <AnimatePresence>
        {compareList.length >= 2 && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCompareIds([])}
          >
            <motion.div
              initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: 0.95 }}
              className="glass-strong rounded-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">Tutor Comparison</h3>
                <button onClick={() => setCompareIds([])}><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {compareList.map((m) => (
                  <div key={m.tutor.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <img src={m.tutor.avatar} alt="" className="w-12 h-12 rounded-xl bg-slate-200 mb-2" />
                    <p className="font-semibold text-sm">{m.tutor.name}</p>
                    <p className="text-xs text-slate-500 mb-3">{m.tutor.department}</p>
                    {[
                      ['Match Score', `${m.score}%`],
                      ['Rating', `${m.tutor.rating.toFixed(1)}★`],
                      ['Success Rate', `${m.tutor.successRate}%`],
                      ['Sessions', `${m.tutor.sessionsCompleted}`],
                      ['Hourly Rate', `$${m.tutor.hourlyRate}`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500">{k}</span>
                        <span className="font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: 0.95 }}
              className="glass-strong rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">Match Breakdown</h3>
                <button onClick={() => setSelected(null)}><X className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <img src={selected.tutor.avatar} alt="" className="w-16 h-16 rounded-2xl bg-slate-200" />
                <div>
                  <p className="font-semibold">{selected.tutor.name}</p>
                  <p className="text-sm text-slate-500">{selected.tutor.department}</p>
                  <p className="text-xs text-slate-500">{selected.tutor.bio}</p>
                </div>
              </div>
              <div className="flex justify-center mb-5">
                <ProgressRing value={selected.score} size={120} stroke={10} sublabel="Match Score" />
              </div>
              <div className="space-y-3 mb-5">
                {selected.breakdown.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">{b.label} ({Math.round(b.weight * 100)}%)</span>
                      <span className="font-semibold">{b.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-primary-500 to-accent-500" initial={{ width: 0 }} animate={{ width: `${b.value}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2">Why this tutor fits you</p>
                <div className="space-y-2">
                  {selected.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/scheduler" className="block text-center py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-glow transition-shadow">
                Book a Session
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Peer match detail modal */}
      <AnimatePresence>
        {selectedPeer && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedPeer(null)}
          >
            <motion.div
              initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: 0.95 }}
              className="glass-strong rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">Peer Match Details</h3>
                <button onClick={() => setSelectedPeer(null)}><X className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <img src={selectedPeer.student.avatar} alt="" className="w-16 h-16 rounded-2xl bg-slate-200" />
                <div>
                  <p className="font-semibold">{selectedPeer.student.name}</p>
                  <p className="text-sm text-slate-500">{selectedPeer.student.department} · Year {selectedPeer.student.year}</p>
                  <p className="text-xs text-slate-400 font-mono">{selectedPeer.student.rollNumber}</p>
                </div>
              </div>
              <div className="flex justify-center mb-5">
                <ProgressRing value={selectedPeer.score} size={120} stroke={10} sublabel="Peer Match" />
              </div>
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2">Why this peer can help you</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                    <span>{selectedPeer.reason}</span>
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2">Matched Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPeer.matchedSubjects.map((s) => (
                    <span key={s} className="text-xs px-3 py-1 rounded-full bg-success-500/15 text-success-600 dark:text-success-400">{s}</span>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2">All Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPeer.student.strengths.map((s) => (
                    <span key={s} className={`text-xs px-3 py-1 rounded-full ${selectedPeer.matchedSubjects.includes(s) ? 'bg-success-500/15 text-success-600 dark:text-success-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>{s}</span>
                  ))}
                </div>
              </div>
              <Link to="/scheduler" className="block text-center py-3 rounded-xl bg-gradient-to-r from-success-500 to-accent-500 text-white font-semibold hover:shadow-glow transition-shadow">
                Book a Peer Session
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
