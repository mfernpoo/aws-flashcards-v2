import seedData from '../data/seed.json';
import { DeckSeedData, FlashcardContent } from '../types';
import { getCardsCollection } from '../lib/pocketbase';

export const getInitialDeck = (): DeckSeedData => {
  return seedData as unknown as DeckSeedData;
};

const normalizeTags = (tags: string[] | undefined) => {
  return [...(tags ?? [])].map((tag) => tag.trim().toLowerCase()).filter(Boolean).sort();
};

const hasCardChanges = (existing: FlashcardContent, seedCard: Partial<FlashcardContent>) => {
  return (
    existing.back !== seedCard.back ||
    existing.domain !== (seedCard.domain ?? '') ||
    JSON.stringify(normalizeTags(existing.tags)) !== JSON.stringify(normalizeTags(seedCard.tags))
  );
};

export const seedPocketBase = async (): Promise<boolean> => {
  const deck = getInitialDeck();
  const collection = getCardsCollection();
  const existingCards = await collection.getFullList<FlashcardContent>();
  const existingByFront = new Map(existingCards.map((card) => [card.front.trim(), card]));

  let createdCount = 0;
  let updatedCount = 0;

  for (const seedCard of deck.cards) {
    const front = seedCard.front?.trim();
    const back = seedCard.back?.trim();

    if (!front || !back) {
      continue;
    }

    const payload = {
      front,
      back,
      domain: seedCard.domain ?? '',
      tags: normalizeTags(seedCard.tags),
    };

    const existing = existingByFront.get(front);

    try {
      if (!existing) {
        const created = await collection.create(payload);
        existingByFront.set(front, created as FlashcardContent);
        createdCount++;
        continue;
      }

      if (hasCardChanges(existing, payload)) {
        const updated = await collection.update(existing.id, payload);
        existingByFront.set(front, updated as FlashcardContent);
        updatedCount++;
      }
    } catch (err) {
      console.error('Failed to reconcile seed card:', front, err);
    }
  }

  console.log(
    `Seed reconciliation finished. Created: ${createdCount}, updated: ${updatedCount}, total seed cards: ${deck.cards.length}.`,
  );

  return createdCount > 0 || updatedCount > 0;
};
