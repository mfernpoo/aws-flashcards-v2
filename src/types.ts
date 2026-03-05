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

export interface DeckMetadata {
  initialized: boolean;
  deckName: string;
}
