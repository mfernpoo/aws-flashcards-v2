import { useState, useEffect, useCallback, useRef } from 'react';
import { Flashcard, FlashcardContent, FlashcardProgress, Grade, ImportCardsResult } from '../types';
import { dbInstance } from '../utils/db';
import { calculateNextDue, isValidSRSData, nowDay } from '../utils/srs';
import { getCardsCollection } from '../lib/pocketbase';
import { seedPocketBase } from '../utils/seed';

const normalizeTags = (tags: string[] | undefined) => {
  return [...new Set((tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean))].sort();
};

const normalizeCardPayload = (card: Partial<Flashcard>) => {
  return {
    front: card.front?.trim() ?? '',
    back: card.back?.trim() ?? '',
    domain: card.domain?.trim() ?? '',
    tags: normalizeTags(card.tags),
  };
};

export function useFlashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasReconciledSeed = useRef(false);

  // Merge logic: Content (PB) + Progress (Dexie)
  const mergeData = useCallback((content: FlashcardContent[], progress: FlashcardProgress[]): Flashcard[] => {
    const progressMap = new Map(progress.map((p) => [p.cardId, p]));

    return content.map((item) => {
      const prog = progressMap.get(item.id);
      const srs = prog
        ? { box: prog.box, nextDue: prog.nextDue, streak: prog.streak, lastGrade: prog.lastGrade }
        : { box: 1, nextDue: nowDay(), streak: 0, lastGrade: 0 }; // Default new card state

      return {
        id: item.id,
        front: item.front,
        back: item.back,
        domain: item.domain,
        tags: item.tags,
        srs,
      };
    });
  }, []);

  const loadCards = useCallback(async (options?: { reconcileSeed?: boolean }) => {
    try {
      if (options?.reconcileSeed) {
        await seedPocketBase();
      }

      // 1. Fetch Content from PocketBase
      const content = await getCardsCollection().getFullList<FlashcardContent>();

      // 2. Fetch Progress from Dexie
      const progress = await dbInstance.getAllProgress();

      // 3. Merge & Set State
      const merged = mergeData(content, progress);
      setCards(merged);
    } catch (error) {
      console.error('Error loading cards:', error);
      // Fallback: Show local progress with placeholder content? Or just error state.
      // For now, let's just log.
    } finally {
      setIsLoading(false);
    }
  }, [mergeData]);

  // Initial Load & Realtime Subscription
  useEffect(() => {
    const shouldReconcileSeed = !hasReconciledSeed.current;
    hasReconciledSeed.current = true;
    void loadCards({ reconcileSeed: shouldReconcileSeed });

    // Subscribe to changes in PB (Content)
    getCardsCollection().subscribe('*', (e) => {
      console.log('Realtime update:', e.action, e.record);
      // Optimally, we'd update state locally. For simplicity, reload content.
      void loadCards();
    });

    return () => {
      getCardsCollection().unsubscribe('*');
    };
  }, [loadCards]);

  const addCard = async (cardData: Partial<Flashcard>) => {
    // Create in PocketBase (Content only)
    await getCardsCollection().create({
      front: cardData.front,
      back: cardData.back,
      domain: cardData.domain,
      tags: cardData.tags,
    });
    // No need to manually update state, the subscription will catch it.
  };

  const updateCard = async (card: Flashcard) => {
    // We only update Content in PB here. Progress updates via gradeCard.
    await getCardsCollection().update(card.id, {
      front: card.front,
      back: card.back,
      domain: card.domain,
      tags: card.tags,
    });
  };

  const deleteCard = async (id: string) => {
    await Promise.all([
      getCardsCollection().delete(id), // Delete content
      dbInstance.deleteProgress(id),   // Delete local progress
    ]);
  };

  const gradeCard = async (card: Flashcard, grade: Grade) => {
    // Calculate new SRS
    const nextSRS = calculateNextDue(card.srs, grade);
    
    // Save to Dexie (Local Progress)
    const progressItem: FlashcardProgress = {
      cardId: card.id,
      box: nextSRS.box,
      nextDue: nextSRS.nextDue,
      streak: nextSRS.streak,
      lastGrade: nextSRS.lastGrade,
    };

    await dbInstance.putProgress(progressItem);

    // Optimistic UI Update
    setCards((current) =>
      current.map((c) => (c.id === card.id ? { ...c, srs: nextSRS } : c))
    );
  };

  // Hybrid import: sync content to PocketBase and optional SRS progress to Dexie.
  const importCards = async (cardsToImport: Partial<Flashcard>[]): Promise<ImportCardsResult> => {
    const collection = getCardsCollection();
    const existingCards = await collection.getFullList<FlashcardContent>();
    const existingById = new Map(existingCards.map((card) => [card.id, card]));
    const existingByFront = new Map(
      existingCards.map((card) => [card.front.trim().toLowerCase(), card]),
    );

    const progressBatch: FlashcardProgress[] = [];
    let created = 0;
    let updated = 0;
    let conflicts = 0;

    for (const importedCard of cardsToImport) {
      const payload = normalizeCardPayload(importedCard);

      if (!payload.front || !payload.back) {
        continue;
      }

      const normalizedFront = payload.front.toLowerCase();
      const matchedById =
        typeof importedCard.id === 'string' ? existingById.get(importedCard.id) : undefined;
      const matchedByFront = existingByFront.get(normalizedFront);

      let target = matchedById;

      if (!target && matchedByFront) {
        target = matchedByFront;
        conflicts++;
      } else if (target && matchedByFront && matchedByFront.id !== target.id) {
        target = matchedByFront;
        conflicts++;
      }

      if (target) {
        const previousFront = target.front.trim().toLowerCase();
        const updatedCard = (await collection.update(target.id, payload)) as FlashcardContent;
        existingById.set(updatedCard.id, updatedCard);
        if (previousFront !== normalizedFront) {
          existingByFront.delete(previousFront);
        }
        existingByFront.set(normalizedFront, updatedCard);
        updated++;

        if (isValidSRSData(importedCard.srs)) {
          progressBatch.push({
            cardId: updatedCard.id,
            box: importedCard.srs.box,
            nextDue: importedCard.srs.nextDue,
            streak: importedCard.srs.streak,
            lastGrade: importedCard.srs.lastGrade,
          });
        }

        continue;
      }

      const createdCard = (await collection.create(payload)) as FlashcardContent;
      existingById.set(createdCard.id, createdCard);
      existingByFront.set(normalizedFront, createdCard);
      created++;

      if (isValidSRSData(importedCard.srs)) {
        progressBatch.push({
          cardId: createdCard.id,
          box: importedCard.srs.box,
          nextDue: importedCard.srs.nextDue,
          streak: importedCard.srs.streak,
          lastGrade: importedCard.srs.lastGrade,
        });
      }
    }

    if (progressBatch.length > 0) {
      await dbInstance.putProgressBatch(progressBatch);
    }

    await loadCards();

    return { total: cardsToImport.length, created, updated, conflicts };
  };

  const factoryReset = async () => {
    // Only clear LOCAL progress. We don't want to wipe the shared DB.
    await dbInstance.clearAll();
    await loadCards(); // Reloads content (fresh start)
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
