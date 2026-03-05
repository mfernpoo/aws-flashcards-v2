import { SRSData, Grade, Flashcard } from '../types';

const BOX_TO_DAYS: Record<number, number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 14,
};

export const nowDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const addDays = (epochMs: number, days: number) => {
  return epochMs + days * 24 * 60 * 60 * 1000;
};

export const ensureSRS = (card: Partial<Flashcard>): Flashcard => {
  const srs: SRSData = card.srs || {
    box: 1,
    nextDue: nowDay(),
    streak: 0,
    lastGrade: 0,
  };

  return {
    id: card.id || Math.random().toString(36).slice(2, 12),
    front: card.front || '',
    back: card.back || '',
    tags: card.tags || [],
    domain: card.domain || '',
    srs,
  };
};

export const calculateNextDue = (currentSRS: SRSData, grade: Grade): SRSData => {
  const today = nowDay();
  const nextSRS = { ...currentSRS };

  if (grade === 1) { // Hard
    nextSRS.box = 1;
    nextSRS.streak = 0;
    nextSRS.nextDue = today; // Review again today
  } else if (grade === 2) { // Good
    nextSRS.box = Math.min(5, nextSRS.box + 1);
    nextSRS.streak += 1;
    nextSRS.nextDue = addDays(today, BOX_TO_DAYS[nextSRS.box] ?? 1);
  } else { // Easy
    nextSRS.box = Math.min(5, nextSRS.box + 2);
    nextSRS.streak += 1;
    nextSRS.nextDue = addDays(today, BOX_TO_DAYS[nextSRS.box] ?? 3);
  }

  nextSRS.lastGrade = grade;
  return nextSRS;
};
