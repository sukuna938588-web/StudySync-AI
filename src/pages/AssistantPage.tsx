import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, User, BookOpen, Target, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useToast } from '@/context/ToastContext';
import { currentUser, tutors } from '@/data/mockData';
import { rankMatches } from '@/lib/matching';
import type { ChatMessage } from '@/types';

const suggestedPrompts = [
  'Recommend a tutor for Machine Learning',
  'Which subjects should I focus on?',
  'How do I improve my learning streak?',
  'Suggest a study plan for this week',
];

function generateReply(prompt: string): string {
  const p = prompt.toLowerCase();
  const matches = rankMatches(currentUser, tutors);

  if (p.includes('tutor') || p.includes('recommend')) {
    const top = matches[0];
    return `Based on your weak subjects (${currentUser.weakSubjects.join(', ')}), I recommend **${top.tutor.name}** with a ${top.score}% match score. They specialize in ${top.tutor.subjects.join(' and ')}, with a ${top.tutor.rating.toFixed(1)}★ rating and ${top.tutor.successRate}% success rate. ${top.reasons[0]}. You can book a session from the Tutor Matching page.`;
  }
  if (p.includes('subject') || p.includes('focus')) {
    return `Looking at your skill profile, your strongest area is **${[...currentUser.skills].sort((a,b)=>b.rating-a.rating)[0].subject}** (${[...currentUser.skills].sort((a,b)=>b.rating-a.rating)[0].rating}%). I'd recommend focusing on **${currentUser.weakSubjects[0]}** and **${currentUser.weakSubjects[1]}** — these have the most room for growth and will unlock new badges.`;
  }
  if (p.includes('streak')) {
    return `You're on a ${currentUser.streak}-day streak — great work! To keep it going: book at least one session every day, even a short 30-min review counts, and enable session reminders from the notifications panel. A 30-day streak unlocks the Month Master badge.`;
  }
  if (p.includes('plan') || p.includes('week') || p.includes('study')) {
    return `Here's a suggested plan for this week:\n\n• **Mon–Tue**: ML session with ${matches[0].tutor.name}\n• **Wed**: Review Data Structures notes\n• **Thu**: OS session with ${matches[1].tutor.name}\n• **Fri**: Group study on Databases\n• **Sat**: Practice problems + quiz\n• **Sun**: Light review + rest\n\nThis balances your weak subjects and keeps your streak active.`;
  }
  return `I can help with tutor recommendations, subject suggestions, study plans, and session guidance. Try asking "Recommend a tutor for Machine Learning" or "Which subjects should I focus on?"`;
}

export function AssistantPage() {
  const { notify } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'assistant', content: `Hi ${currentUser.name.split(' ')[0]}! I'm your StudySync AI assistant. I can recommend tutors, suggest subjects to focus on, and help plan your study week. What would you like to know?`, time: 'now' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text, time: 'now' };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply: ChatMessage = { id: `a-${Date.now()}`, role: 'assistant', content: generateReply(text), time: 'now' };
      setMessages((m) => [...m, reply]);
      setTyping(false);
    }, 900);
  };

  const topMatches = rankMatches(currentUser, tutors).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl">AI Assistant</h1>
        <p className="text-sm text-slate-500 mt-1">Your personal study guide — get tutor recommendations, subject suggestions, and study plans.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <GlassCard className="p-0 overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">StudySync Assistant</p>
                <p className="text-xs text-success-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success-500" /> Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-gradient-to-br from-primary-500 to-accent-500'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${m.role === 'user' ? 'bg-primary-500 text-white rounded-tr-sm' : 'glass rounded-tl-sm'}`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              <AnimatePresence>
                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="w-2 h-2 rounded-full bg-slate-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Suggested prompts */}
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {suggestedPrompts.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full glass hover:shadow-glass transition-shadow flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary-500" /> {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-sm border border-transparent focus:border-primary-500/40 focus:outline-none"
              />
              <button onClick={() => send(input)} className="p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-glow transition-shadow">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Side panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <GlassCard className="p-5">
            <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-primary-500" /> Top Tutor Recommendations</h3>
            <div className="space-y-3">
              {topMatches.map((m) => (
                <div key={m.tutor.id} className="flex items-center gap-3">
                  <img src={m.tutor.avatar} alt="" className="w-9 h-9 rounded-lg bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.tutor.name}</p>
                    <p className="text-xs text-slate-500">{m.tutor.subjects[0]}</p>
                  </div>
                  <span className="text-sm font-bold text-primary-500">{m.score}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-accent-500" /> Subject Suggestions</h3>
            <div className="space-y-2">
              {currentUser.weakSubjects.map((s) => (
                <div key={s} className="flex items-center justify-between text-sm">
                  <span>{s}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-warning-500/15 text-warning-600 dark:text-warning-400">Focus</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-success-500" /> Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={() => { send('Recommend a tutor for Machine Learning'); }} className="w-full text-left text-sm py-2 px-3 rounded-xl glass hover:shadow-glass transition-shadow">Find a tutor</button>
              <button onClick={() => notify('Opening scheduler...', 'info')} className="w-full text-left text-sm py-2 px-3 rounded-xl glass hover:shadow-glass transition-shadow">Book a session</button>
              <button onClick={() => send('Suggest a study plan for this week')} className="w-full text-left text-sm py-2 px-3 rounded-xl glass hover:shadow-glass transition-shadow">Create study plan</button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
