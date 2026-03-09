import seedData from '../data/seed.json';
import { DeckSeedData, Flashcard } from '../types';
import { ensureSRS } from './srs';

export const getInitialDeck = (): DeckSeedData => {
  return seedData as DeckSeedData;
};

export const buildSeedCards = (): Flashcard[] => {
  const deckSeed = getInitialDeck();

  return deckSeed.cards.map((cardSeed) =>
    ensureSRS({
      ...cardSeed,
      tags: (cardSeed.tags || []).map((tag) => tag.toLowerCase()),
    }),
  );
};
