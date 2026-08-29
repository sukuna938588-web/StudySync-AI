import type {
  Student, Tutor, Session, Notification, Badge, LeaderboardEntry, Review, Subject,
} from '@/types';

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear&backgroundColor=3366ff,06b6d4`;

export const currentUser: Student = {
  id: 'stu-001',
  name: 'Aarav Sharma',
  rollNumber: 'CS21B001',
  email: 'aarav.sharma@university.edu',
  avatar: avatar('Aarav Sharma'),
  department: 'Computer Science & Engineering',
  year: 3,
  strengths: ['Data Structures', 'Algorithms', 'Web Development'],
  weaknesses: ['Machine Learning', 'Operating Systems', 'Databases'],
  skills: [
    { subject: 'Data Structures', rating: 78 },
    { subject: 'Algorithms', rating: 72 },
    { subject: 'Web Development', rating: 85 },
    { subject: 'Databases', rating: 64 },
    { subject: 'Machine Learning', rating: 48 },
    { subject: 'Operating Systems', rating: 55 },
  ],
  weakSubjects: ['Machine Learning', 'Operating Systems', 'Databases'],
  learningPreferences: ['Visual learning', 'Hands-on projects', 'Small groups'],
  availability: [
    { day: 'Mon', start: '16:00', end: '19:00' },
    { day: 'Tue', start: '15:00', end: '18:00' },
    { day: 'Wed', start: '16:00', end: '19:00' },
    { day: 'Thu', start: '15:00', end: '18:00' },
    { day: 'Fri', start: '14:00', end: '17:00' },
  ],
  xp: 4820,
  level: 12,
  streak: 14,
  badges: ['First Session', 'Week Warrior', 'Quick Learner', 'Team Player'],
  bio: 'CS junior passionate about full-stack development. Looking to strengthen my fundamentals in ML and systems.',
};

// Sample subjects for demonstration
export const sampleSubjects: Subject[] = [
  { id: 'sub-001', name: 'Data Structures', code: 'CS201', difficulty: 'Beginner' },
  { id: 'sub-002', name: 'Algorithms', code: 'CS202', difficulty: 'Intermediate' },
  { id: 'sub-003', name: 'Operating Systems', code: 'CS301', difficulty: 'Intermediate' },
  { id: 'sub-004', name: 'Databases', code: 'CS302', difficulty: 'Intermediate' },
  { id: 'sub-005', name: 'Machine Learning', code: 'CS401', difficulty: 'Advanced' },
  { id: 'sub-006', name: 'Web Development', code: 'CS205', difficulty: 'Beginner' },
  { id: 'sub-007', name: 'Computer Networks', code: 'CS303', difficulty: 'Intermediate' },
  { id: 'sub-008', name: 'Discrete Math', code: 'MA201', difficulty: 'Intermediate' },
  { id: 'sub-009', name: 'Java Programming', code: 'CS102', difficulty: 'Beginner' },
  { id: 'sub-010', name: 'Python Programming', code: 'CS103', difficulty: 'Beginner' },
];

// Sample students for demonstration
const sampleStudentData = [
  { name: 'Diya Patel', roll: 'CS21B002', dept: 'Computer Science', year: 3, str: ['Data Structures', 'Algorithms'], weak: ['Machine Learning', 'Operating Systems'] },
  { name: 'Yash Kumar', roll: 'CS21B003', dept: 'Computer Science', year: 3, str: ['Machine Learning', 'Python Programming'], weak: ['Databases', 'Discrete Math'] },
  { name: 'Riya Nair', roll: 'CS22B004', dept: 'Computer Science', year: 2, str: ['Web Development', 'Java Programming'], weak: ['Algorithms', 'Operating Systems'] },
  { name: 'Sai Krishna', roll: 'CS21B005', dept: 'Computer Science', year: 3, str: ['Operating Systems', 'Computer Networks'], weak: ['Machine Learning', 'Web Development'] },
  { name: 'Ananya Rao', roll: 'CS22B006', dept: 'Computer Science', year: 2, str: ['Databases', 'Java Programming'], weak: ['Algorithms', 'Discrete Math'] },
  { name: 'Karan Joshi', roll: 'CS20B007', dept: 'Computer Science', year: 4, str: ['Machine Learning', 'Algorithms', 'Python Programming'], weak: ['Web Development'] },
  { name: 'Nisha Reddy', roll: 'CS22B008', dept: 'Computer Science', year: 2, str: ['Discrete Math', 'Data Structures'], weak: ['Operating Systems', 'Computer Networks'] },
  { name: 'Aditya Menon', roll: 'CS21B009', dept: 'Computer Science', year: 3, str: ['Java Programming', 'Databases'], weak: ['Machine Learning', 'Python Programming'] },
];

export const sampleStudents: Student[] = sampleStudentData.map((d, i) => ({
  id: `stu-${String(i + 2).padStart(3, '0')}`,
  name: d.name,
  rollNumber: d.roll,
  email: d.name.toLowerCase().replace(/[^a-z]+/g, '.') + '@university.edu',
  avatar: avatar(d.name),
  department: d.dept,
  year: d.year,
  strengths: d.str,
  weaknesses: d.weak,
  skills: d.str.map((s) => ({ subject: s, rating: 75 + Math.floor(Math.random() * 20) })),
  weakSubjects: d.weak,
  learningPreferences: ['Visual learning', 'Hands-on projects'],
  availability: [],
  xp: 1000 + i * 350,
  level: 5 + (i % 8),
  streak: i % 20,
  badges: ['First Session', 'Week Warrior'].slice(0, (i % 3) + 1),
  bio: 'Student passionate about learning and growth.',
}));

const tutorNames = [
  'Dr. Priya Nair', 'Prof. Rohan Mehta', 'Ananya Iyer', 'Kabir Singh',
  'Dr. Sara Khan', 'Vikram Reddy', 'Ishita Gupta', 'Arjun Verma',
];
const subjects = [
  'Machine Learning', 'Operating Systems', 'Databases', 'Data Structures',
  'Algorithms', 'Web Development', 'Computer Networks', 'Discrete Math',
];

function genExpertise(subjectsList: string[]): { subject: string; rating: number }[] {
  return subjectsList.map((s) => ({
    subject: s,
    rating: 82 + Math.floor(Math.random() * 16),
  }));
}

function genAvailability() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const slots = [];
  for (const day of days) {
    if (Math.random() > 0.3) {
      const start = 9 + Math.floor(Math.random() * 8);
      slots.push({ day, start: `${String(start).padStart(2, '0')}:00`, end: `${String(start + 2).padStart(2, '0')}:00` });
    }
  }
  return slots;
}

const reviewComments = [
  'Excellent at breaking down complex topics. Very patient.',
  'Sessions were well structured and I improved significantly.',
  'Great mentor — gave me real-world project ideas.',
  'Explains concepts with clear examples. Highly recommend.',
  'Helped me ace my exam in just 3 sessions!',
  'Very knowledgeable and approachable.',
];

export const tutors: Tutor[] = tutorNames.map((name, i) => {
  const tutorSubjects = [subjects[i % subjects.length], subjects[(i + 3) % subjects.length], subjects[(i + 5) % subjects.length]];
  const reviews: Review[] = Array.from({ length: 3 + (i % 3) }, (_, j) => ({
    id: `rev-${i}-${j}`,
    tutorId: `tut-${String(i + 1).padStart(3, '0')}`,
    studentName: ['Meera J.', 'Karthik R.', 'Sneha P.', 'Dev A.', 'Tara M.'][j % 5],
    rating: 4 + (j % 2),
    comment: reviewComments[(i + j) % reviewComments.length],
    date: `2026-0${1 + (j % 7)}-1${j % 9}`,
  }));
  const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  return {
    id: `tut-${String(i + 1).padStart(3, '0')}`,
    name,
    email: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@university.edu',
    avatar: avatar(name),
    department: ['Computer Science', 'Electrical Engineering', 'Mathematics', 'Data Science'][i % 4],
    subjects: tutorSubjects,
    expertise: genExpertise(tutorSubjects),
    rating: Number((4.5 + (avgRating - 4) / 2).toFixed(1)),
    reviewCount: reviews.length + 8 + i * 4,
    successRate: 88 + Math.floor(Math.random() * 11),
    sessionsCompleted: 120 + i * 35 + Math.floor(Math.random() * 50),
    availability: genAvailability(),
    hourlyRate: 25 + i * 5,
    bio: `Specialist in ${tutorSubjects[0]} with ${3 + i} years of teaching experience. Focuses on conceptual clarity and practical application.`,
    badges: ['Top Rated', 'Quick Responder', 'Subject Expert'].slice(0, (i % 3) + 1),
    reviews,
  };
});

export const sessions: Session[] = [
  {
    id: 'ses-001', studentId: 'stu-001', studentName: 'Aarav Sharma',
    tutorId: 'tut-001', tutorName: 'Dr. Priya Nair', subject: 'Machine Learning',
    date: '2026-09-02', startTime: '16:00', endTime: '17:30', status: 'scheduled',
    mode: 'online', topic: 'Supervised Learning Algorithms',
  },
  {
    id: 'ses-002', studentId: 'stu-001', studentName: 'Aarav Sharma',
    tutorId: 'tut-003', tutorName: 'Ananya Iyer', subject: 'Operating Systems',
    date: '2026-09-04', startTime: '15:00', endTime: '16:30', status: 'scheduled',
    mode: 'online', topic: 'Process Scheduling & Deadlocks',
  },
  {
    id: 'ses-003', studentId: 'stu-001', studentName: 'Aarav Sharma',
    tutorId: 'tut-002', tutorName: 'Prof. Rohan Mehta', subject: 'Databases',
    date: '2026-08-26', startTime: '17:00', endTime: '18:30', status: 'completed',
    mode: 'in-person', topic: 'Normalization & Indexing',
  },
  {
    id: 'ses-004', studentId: 'stu-001', studentName: 'Aarav Sharma',
    tutorId: 'tut-004', tutorName: 'Kabir Singh', subject: 'Data Structures',
    date: '2026-08-22', startTime: '16:00', endTime: '17:00', status: 'completed',
    mode: 'online', topic: 'Graph Algorithms',
  },
  {
    id: 'ses-005', studentId: 'stu-002', studentName: 'Diya Patel',
    tutorId: 'tut-001', tutorName: 'Dr. Priya Nair', subject: 'Machine Learning',
    date: '2026-09-03', startTime: '14:00', endTime: '15:30', status: 'scheduled',
    mode: 'online', topic: 'Neural Networks Intro',
  },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'reminder', title: 'Session in 2 hours', message: 'Machine Learning with Dr. Priya Nair starts at 16:00.', time: '1h ago', read: false },
  { id: 'n2', type: 'booking', title: 'Booking confirmed', message: 'Your OS session on Sep 4 is confirmed.', time: '3h ago', read: false },
  { id: 'n3', type: 'achievement', title: 'Badge earned!', message: 'You unlocked the "Week Warrior" badge.', time: '1d ago', read: false },
  { id: 'n4', type: 'system', title: 'New tutor available', message: 'Dr. Sara Khan joined for Machine Learning.', time: '2d ago', read: true },
  { id: 'n5', type: 'reminder', title: 'Streak milestone', message: 'You hit a 14-day learning streak!', time: '3d ago', read: true },
];

export const badges: Badge[] = [
  { id: 'b1', name: 'First Session', description: 'Completed your first tutoring session', icon: 'Sparkles', tier: 'bronze' },
  { id: 'b2', name: 'Week Warrior', description: 'Maintained a 7-day learning streak', icon: 'Flame', tier: 'silver' },
  { id: 'b3', name: 'Quick Learner', description: 'Completed 5 sessions in one week', icon: 'Zap', tier: 'silver' },
  { id: 'b4', name: 'Team Player', description: 'Joined a group study session', icon: 'Users', tier: 'bronze' },
  { id: 'b5', name: 'Subject Master', description: 'Reached 90% mastery in a subject', icon: 'Trophy', tier: 'gold' },
  { id: 'b6', name: 'Night Owl', description: 'Studied past midnight 5 times', icon: 'Moon', tier: 'silver' },
  { id: 'b7', name: 'Top Performer', description: 'Reached top 10 on the leaderboard', icon: 'Crown', tier: 'platinum' },
  { id: 'b8', name: 'Mentor', description: 'Helped 3 peers in group sessions', icon: 'GraduationCap', tier: 'gold' },
];

export const leaderboard: LeaderboardEntry[] = [
  { name: 'Aarav Sharma', avatar: avatar('Aarav Sharma'), xp: 4820, level: 12, streak: 14, department: 'CS' },
  { name: 'Diya Patel', avatar: avatar('Diya Patel'), xp: 4200, level: 10, streak: 8, department: 'CS' },
  { name: 'Yash Kumar', avatar: avatar('Yash Kumar'), xp: 3900, level: 9, streak: 12, department: 'CS' },
  { name: 'Riya Nair', avatar: avatar('Riya Nair'), xp: 3500, level: 8, streak: 5, department: 'CS' },
  { name: 'Sai Krishna', avatar: avatar('Sai Krishna'), xp: 3200, level: 8, streak: 20, department: 'CS' },
  { name: 'Ananya Rao', avatar: avatar('Ananya Rao'), xp: 2800, level: 7, streak: 3, department: 'CS' },
  { name: 'Karan Joshi', avatar: avatar('Karan Joshi'), xp: 2500, level: 6, streak: 15, department: 'CS' },
  { name: 'Nisha Reddy', avatar: avatar('Nisha Reddy'), xp: 2200, level: 6, streak: 7, department: 'CS' },
  { name: 'Aditya Menon', avatar: avatar('Aditya Menon'), xp: 1900, level: 5, streak: 2, department: 'CS' },
].sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }));

// Analytics series
export const weeklyPerformance = [
  { day: 'Mon', score: 62, sessions: 1 },
  { day: 'Tue', score: 70, sessions: 2 },
  { day: 'Wed', score: 65, sessions: 1 },
  { day: 'Thu', score: 78, sessions: 2 },
  { day: 'Fri', score: 82, sessions: 1 },
  { day: 'Sat', score: 88, sessions: 3 },
  { day: 'Sun', score: 74, sessions: 1 },
];

export const subjectProgress = [
  { subject: 'Data Structures', before: 55, after: 78 },
  { subject: 'Algorithms', before: 48, after: 72 },
  { subject: 'Web Dev', before: 60, after: 85 },
  { subject: 'Databases', before: 40, after: 64 },
  { subject: 'ML', before: 20, after: 48 },
  { subject: 'OS', before: 30, after: 55 },
];

export const masteryTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  mastery: 40 + Math.round(i * 4 + Math.random() * 8),
  sessions: 2 + Math.round(Math.random() * 6),
}));

export const adminStats = {
  totalStudents: 1248,
  activeTutors: 86,
  sessionsScheduled: 3420,
  successRate: 94,
  monthlyGrowth: [
    { month: 'Mar', students: 820, tutors: 54 },
    { month: 'Apr', students: 910, tutors: 61 },
    { month: 'May', students: 1020, tutors: 70 },
    { month: 'Jun', students: 1080, tutors: 74 },
    { month: 'Jul', students: 1150, tutors: 80 },
    { month: 'Aug', students: 1248, tutors: 86 },
  ],
  departmentDistribution: [
    { name: 'CS', value: 520 },
    { name: 'EE', value: 310 },
    { name: 'Math', value: 180 },
    { name: 'Data Science', value: 238 },
  ],
};

export const liveActivity = [
  { id: 'a1', text: 'Diya Patel booked a ML session', time: '2m ago' },
  { id: 'a2', text: 'Karan Joshi earned the Quick Learner badge', time: '5m ago' },
  { id: 'a3', text: 'Dr. Priya Nair completed 3 sessions today', time: '12m ago' },
  { id: 'a4', text: 'Riya Nair joined a group OS study session', time: '20m ago' },
  { id: 'a5', text: 'New tutor Ananya Iyer received 5-star review', time: '34m ago' },
];
