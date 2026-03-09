import { useState, useEffect, useCallback } from 'react';
import { Flashcard, Grade, ImportCardsResult } from '../types';
import { dbInstance } from '../utils/db';
import { ensureSRS, calculateNextDue, generateCardId } from '../utils/srs';
import { buildSeedCards, getInitialDeck } from '../utils/seed';

const mergeCards = (currentCards: Flashcard[], incomingCards: Flashcard[]) => {
  const cardsById = new Map(currentCards.map((card) => [card.id, card]));

  for (const card of incomingCards) {
    cardsById.set(card.id, card);
  }

  return Array.from(cardsById.values());
};

const sameCardContent = (left: Flashcard, right: Flashcard) => {
  return (
    left.front === right.front &&
    left.back === right.back &&
    left.domain === right.domain &&
    left.tags.join('|') === right.tags.join('|')
  );
};

export function useFlashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    const dbCards = await dbInstance.getAllCards();
    
    if (dbCards.length === 0) {
      const initialized = await dbInstance.getMeta<boolean>('initialized');
      if (!initialized) {
        const deckSeed = getInitialDeck();
        const newCards = buildSeedCards();

        await dbInstance.putCards(newCards);
        await dbInstance.setMeta('initialized', true);
        await dbInstance.setMeta('deckName', deckSeed.deckName);
        setCards(newCards);
        setIsLoading(false);
        return;
      }
    }
    
    setCards(dbCards);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const addCard = async (cardData: Partial<Flashcard>) => {
    const newCard = ensureSRS(cardData);
    await dbInstance.putCard(newCard);
    setCards((currentCards) => mergeCards(currentCards, [newCard]));
    return newCard;
  };

  const updateCard = async (card: Flashcard) => {
    await dbInstance.putCard(card);
    setCards((currentCards) => mergeCards(currentCards, [card]));
  };

  const deleteCard = async (id: string) => {
    await dbInstance.deleteCard(id);
    setCards((currentCards) => currentCards.filter((card) => card.id !== id));
  };

  const gradeCard = async (card: Flashcard, grade: Grade) => {
    const nextSRS = calculateNextDue(card.srs, grade);
    const updatedCard = { ...card, srs: nextSRS };
    await updateCard(updatedCard);
  };

  const importCards = async (cardsToImport: Partial<Flashcard>[]): Promise<ImportCardsResult> => {
    const existingCardsById = new Map(cards.map((card) => [card.id, card]));
    const plannedCardsById = new Map<string, Flashcard>();
    const normalizedCards: Flashcard[] = [];
    let created = 0;
    let updated = 0;
    let conflicts = 0;

    for (const card of cardsToImport) {
      let normalizedCard = ensureSRS(card);
      const existingCard = existingCardsById.get(normalizedCard.id) || plannedCardsById.get(normalizedCard.id);

      if (existingCard) {
        if (sameCardContent(existingCard, normalizedCard)) {
          updated += 1;
        } else {
          normalizedCard = { ...normalizedCard, id: generateCardId() };
          conflicts += 1;
          created += 1;
        }
      } else {
        created += 1;
      }

      plannedCardsById.set(normalizedCard.id, normalizedCard);
      normalizedCards.push(normalizedCard);
    }

    await dbInstance.putCards(normalizedCards);
    setCards((currentCards) => mergeCards(currentCards, normalizedCards));

    return {
      total: normalizedCards.length,
      created,
      updated,
      conflicts,
    };
  };

  const factoryReset = async () => {
    await dbInstance.clearAll();
    await loadCards();
  };

  return {
    cards,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    gradeCard,
    importCards,
    factoryReset,
  };
}
