import { useState, useEffect, useCallback, useMemo } from 'react';
import { Flashcard, Grade } from '../types';
import { dbInstance } from '../utils/db';
import { ensureSRS, calculateNextDue, nowDay } from '../utils/srs';
import seedData from '../data/seed.json';

export function useFlashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ domain: '', tag: '', search: '' });

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    const dbCards = await dbInstance.getAllCards();
    
    if (dbCards.length === 0) {
      const initialized = await dbInstance.getMeta<boolean>('initialized');
      if (!initialized) {
        // Load seed data
        const newCards: Flashcard[] = seedData.cards.map((c: any) => ensureSRS({
          ...c,
          tags: (c.tags || []).map((t: string) => t.toLowerCase())
        }));
        
        for (const card of newCards) {
          await dbInstance.putCard(card);
        }
        await dbInstance.setMeta('initialized', true);
        await dbInstance.setMeta('deckName', seedData.deckName);
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

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchDomain = !filters.domain || card.domain === filters.domain;
      const matchTag = !filters.tag || card.tags.includes(filters.tag.toLowerCase().trim());
      const matchSearch = !filters.search || 
        card.front.toLowerCase().includes(filters.search.toLowerCase()) ||
        card.back.toLowerCase().includes(filters.search.toLowerCase());
      return matchDomain && matchTag && matchSearch;
    });
  }, [cards, filters]);

  const dueCards = useMemo(() => {
    const today = nowDay();
    return filteredCards.filter(c => c.srs.nextDue <= today);
  }, [filteredCards]);

  const addCard = async (cardData: Partial<Flashcard>) => {
    const newCard = ensureSRS(cardData);
    await dbInstance.putCard(newCard);
    await loadCards();
    return newCard;
  };

  const updateCard = async (card: Flashcard) => {
    await dbInstance.putCard(card);
    await loadCards();
  };

  const deleteCard = async (id: string) => {
    await dbInstance.deleteCard(id);
    await loadCards();
  };

  const gradeCard = async (card: Flashcard, grade: Grade) => {
    const nextSRS = calculateNextDue(card.srs, grade);
    const updatedCard = { ...card, srs: nextSRS };
    await updateCard(updatedCard);
  };

  const factoryReset = async () => {
    await dbInstance.clearAll();
    await loadCards();
  };

  return {
    cards,
    filteredCards,
    dueCards,
    isLoading,
    filters,
    setFilters,
    addCard,
    updateCard,
    deleteCard,
    gradeCard,
    factoryReset,
    refresh: loadCards
  };
}
