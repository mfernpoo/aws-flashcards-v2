import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ensureSRS, calculateNextDue, nowDay, addDays } from './srs';
import { Grade, SRSData } from '../types';

describe('SRS Utils', () => {
  const MOCK_DATE = new Date('2024-03-20T12:00:00Z');
  const MOCK_TODAY = new Date(MOCK_DATE).setHours(0, 0, 0, 0);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('ensureSRS', () => {
    it('should generate a full flashcard with default SRS data if missing', () => {
      const partialCard = { front: 'Hello', back: 'World' };
      const card = ensureSRS(partialCard);

      expect(card.id).toBeDefined();
      expect(card.front).toBe('Hello');
      expect(card.srs.box).toBe(1);
      expect(card.srs.nextDue).toBe(nowDay());
    });

    it('should preserve existing valid SRS data', () => {
      const existingSRS: SRSData = {
        box: 3,
        nextDue: 123456789,
        streak: 5,
        lastGrade: 2
      };
      const card = ensureSRS({ srs: existingSRS });
      expect(card.srs).toEqual(existingSRS);
    });
  });

  describe('calculateNextDue', () => {
    const initialSRS: SRSData = {
      box: 1,
      nextDue: MOCK_TODAY,
      streak: 0,
      lastGrade: 0
    };

    it('should reset to box 1 and today if grade is 1 (Hard)', () => {
      const nextSRS = calculateNextDue({ ...initialSRS, box: 3, streak: 5 }, 1);
      expect(nextSRS.box).toBe(1);
      expect(nextSRS.streak).toBe(0);
      expect(nextSRS.nextDue).toBe(MOCK_TODAY);
      expect(nextSRS.lastGrade).toBe(1);
    });

    it('should increment box and streak if grade is 2 (Good)', () => {
      const nextSRS = calculateNextDue(initialSRS, 2);
      expect(nextSRS.box).toBe(2);
      expect(nextSRS.streak).toBe(1);
      // Box 2 = 1 day
      expect(nextSRS.nextDue).toBe(addDays(MOCK_TODAY, 1));
      expect(nextSRS.lastGrade).toBe(2);
    });

    it('should increment box by 2 if grade is 3 (Easy)', () => {
      const nextSRS = calculateNextDue(initialSRS, 3);
      expect(nextSRS.box).toBe(3);
      expect(nextSRS.streak).toBe(1);
      // Box 3 = 3 days
      expect(nextSRS.nextDue).toBe(addDays(MOCK_TODAY, 3));
      expect(nextSRS.lastGrade).toBe(3);
    });

    it('should not exceed box 5', () => {
      const nextSRS = calculateNextDue({ ...initialSRS, box: 5 }, 2);
      expect(nextSRS.box).toBe(5);
      expect(nextSRS.nextDue).toBe(addDays(MOCK_TODAY, 14));
    });
  });
});
