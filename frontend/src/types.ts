import { RecordModel } from 'pocketbase';

export interface SRSData {
  box: number;
  nextDue: number;
  streak: number;
  lastGrade: number;
}

// Data from PocketBase (Content)
export interface FlashcardContent extends RecordModel {
  front: string;
  back: string;
  domain: string;
  tags: string[];
}

// Data from Dexie (Progress)
export interface FlashcardProgress {
  cardId: string; // Foreign Key to PocketBase ID
  box: number;
  nextDue: number;
  streak: number;
  lastGrade: number;
}

// Unified Type for UI (Hydrated)
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
  cards: Partial<FlashcardContent>[];
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
