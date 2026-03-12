import seedData from '../data/seed.json';
import { DeckSeedData } from '../types';
import { getCardsCollection } from '../lib/pocketbase';

export const getInitialDeck = (): DeckSeedData => {
  return seedData as unknown as DeckSeedData;
};

export const seedPocketBase = async (): Promise<boolean> => {
  const deck = getInitialDeck();
  console.log('Seeding PocketBase with', deck.cards.length, 'cards...');
  
  let createdCount = 0;
  
  // Serial execution to avoid overwhelming the server (or use Promise.all with chunks)
  // For ~100 cards, serial is safer and fine.
  for (const card of deck.cards) {
    try {
      await getCardsCollection().create({
        front: card.front,
        back: card.back,
        domain: card.domain,
        tags: card.tags,
      });
      createdCount++;
    } catch (err) {
      console.error('Failed to seed card:', card.front, err);
    }
  }

  return createdCount > 0;
};
