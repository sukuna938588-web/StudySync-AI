import type { Student, Tutor, MatchResult, PeerMatch } from '@/types';

const WEIGHTS = {
  expertise: 0.4,
  availability: 0.2,
  rating: 0.15,
  successRate: 0.15,
  compatibility: 0.1,
};

function availabilityOverlap(student: Student, tutor: Tutor): number {
  let overlap = 0;
  let total = 0;
  for (const s of student.availability) {
    total++;
    const match = tutor.availability.find((t) => t.day === s.day);
    if (match) {
      const sStart = parseInt(s.start.replace(':', ''));
      const sEnd = parseInt(s.end.replace(':', ''));
      const tStart = parseInt(match.start.replace(':', ''));
      const tEnd = parseInt(match.end.replace(':', ''));
      const start = Math.max(sStart, tStart);
      const end = Math.min(sEnd, tEnd);
      if (end > start) overlap++;
    }
  }
  return total === 0 ? 0 : overlap / total;
}

function expertiseMatch(student: Student, tutor: Tutor): number {
  const weak = student.weaknesses.length > 0 ? student.weaknesses : student.weakSubjects;
  if (weak.length === 0) return 0;
  let total = 0;
  for (const w of weak) {
    const exp = tutor.expertise.find((e) => e.subject === w);
    total += exp ? exp.rating / 100 : 0;
  }
  return total / weak.length;
}

function compatibilityScore(student: Student, tutor: Tutor): number {
  const sharedDept = student.department.toLowerCase().includes('computer') ===
    tutor.department.toLowerCase().includes('computer') ? 0.5 : 0;
  const prefMatch = student.learningPreferences.length > 0 ? 0.5 : 0;
  return sharedDept + prefMatch;
}

export function calculateMatch(student: Student, tutor: Tutor): MatchResult {
  const expertise = expertiseMatch(student, tutor);
  const availability = availabilityOverlap(student, tutor);
  const rating = (tutor.rating - 3.5) / 1.5;
  const success = tutor.successRate / 100;
  const compatibility = compatibilityScore(student, tutor);

  const score = Math.round(
    (expertise * WEIGHTS.expertise +
      availability * WEIGHTS.availability +
      rating * WEIGHTS.rating +
      success * WEIGHTS.successRate +
      compatibility * WEIGHTS.compatibility) * 100
  );

  const confidence = Math.min(100, Math.round((score + (tutor.reviewCount > 20 ? 8 : 0) + (tutor.sessionsCompleted > 150 ? 6 : 0))));

  const reasons: string[] = [];
  const weak = student.weaknesses.length > 0 ? student.weaknesses : student.weakSubjects;
  const matchedSubjects = weak.filter((w) =>
    tutor.expertise.some((e) => e.subject === w && e.rating >= 85)
  );
  if (matchedSubjects.length > 0) reasons.push(`Strong expertise in your weak subject: ${matchedSubjects.join(', ')}`);
  if (availability > 0.5) reasons.push('High schedule overlap with your availability');
  if (tutor.rating >= 4.7) reasons.push(`Top-rated tutor (${tutor.rating.toFixed(1)}★)`);
  if (tutor.successRate >= 92) reasons.push(`Excellent ${tutor.successRate}% success rate`);
  if (compatibility > 0.7) reasons.push('Learning style and department match');
  if (reasons.length === 0) reasons.push('General good fit based on overall profile');

  return {
    tutor,
    score: Math.max(40, Math.min(99, score)),
    confidence: Math.max(50, Math.min(99, confidence)),
    reasons,
    breakdown: [
      { label: 'Subject Expertise', weight: WEIGHTS.expertise, value: Math.round(expertise * 100) },
      { label: 'Availability', weight: WEIGHTS.availability, value: Math.round(availability * 100) },
      { label: 'Tutor Rating', weight: WEIGHTS.rating, value: Math.round(rating * 100) },
      { label: 'Success Rate', weight: WEIGHTS.successRate, value: Math.round(success * 100) },
      { label: 'Compatibility', weight: WEIGHTS.compatibility, value: Math.round(compatibility * 100) },
    ],
  };
}

export function rankMatches(student: Student, tutors: Tutor[]): MatchResult[] {
  return tutors.map((t) => calculateMatch(student, t)).sort((a, b) => b.score - a.score);
}

export function findGroupMatches(student: Student, allStudents: Student[]): {
  subject: string;
  peers: Student[];
}[] {
  const weak = student.weaknesses.length > 0 ? student.weaknesses : student.weakSubjects;
  return weak.map((subject) => ({
    subject,
    peers: allStudents.filter((s) => s.id !== student.id && (
      s.weaknesses.includes(subject) || s.weakSubjects.includes(subject)
    )).slice(0, 4),
  }));
}

/**
 * Peer matching: find students whose strengths overlap with the given student's weaknesses.
 * Example: Student A weakness = Java, Student B strength = Java → suggest Student B as tutor.
 */
export function findPeerMatches(student: Student, allStudents: Student[]): PeerMatch[] {
  const weak = student.weaknesses.length > 0 ? student.weaknesses : student.weakSubjects;
  if (weak.length === 0) return [];

  const peers: PeerMatch[] = [];
  for (const other of allStudents) {
    if (other.id === student.id) continue;
    const otherStrengths = other.strengths.length > 0 ? other.strengths : other.skills.map((s) => s.subject);
    const matched = weak.filter((w) => otherStrengths.some((s) => s.toLowerCase() === w.toLowerCase()));
    if (matched.length > 0) {
      const score = Math.round((matched.length / weak.length) * 100);
      peers.push({
        student: other,
        matchedSubjects: matched,
        score: Math.max(50, score),
        reason: `${other.name} is strong in ${matched.join(', ')} — which you need help with.`,
      });
    }
  }
  return peers.sort((a, b) => b.score - a.score);
}
