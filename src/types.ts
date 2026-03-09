export interface SRSData {
  box: number;
  nextDue: number;
  streak: number;
  lastGrade: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags: string[];
  domain: string;
  srs: SRSData;
}

export type Grade = 1 | 2 | 3; // 1: Hard, 2: Good, 3: Easy

export interface FlashcardFilters {
  domain: string;
  tag: string;
}

export type ActiveView = 'study' | 'manage' | 'stats';

export interface DeckSeedData {
  deckName: string;
  cards: Partial<Flashcard>[];
}

export interface ImportCardsResult {
  total: number;
  created: number;
  updated: number;
  conflicts: number;
}

export interface UiNotification {
  type: 'success' | 'error' | 'info';
  message: string;
}
