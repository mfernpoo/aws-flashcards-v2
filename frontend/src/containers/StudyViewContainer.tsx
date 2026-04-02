import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flashcard, FlashcardFilters, Grade } from '../types';
import { nowDay } from '../utils/srs';
import { StudyView } from '../components/StudyView';

interface StudyViewContainerProps {
  cards: Flashcard[];
  onGrade: (card: Flashcard, grade: Grade) => Promise<void>;
}

export const StudyViewContainer: React.FC<StudyViewContainerProps> = ({ cards, onGrade }) => {
  const [filters, setFilters] = useState<FlashcardFilters>({ domain: '', tag: '' });
  const [skipSeed, setSkipSeed] = useState(0);
  const lastShownCardIdRef = useRef<string | null>(null);

  const domains = useMemo(
    () => Array.from(new Set(cards.map((card) => card.domain).filter(Boolean))),
    [cards],
  );

  const dueCards = useMemo(() => {
    const today = nowDay();
    return cards.filter((card) => {
      const isDue = card.srs.nextDue <= today;
      const matchesDomain = !filters.domain || card.domain === filters.domain;
      const matchesTag = !filters.tag || card.tags.includes(filters.tag.toLowerCase().trim());
      return isDue && matchesDomain && matchesTag;
    });
  }, [cards, filters]);

  const learnedCards = useMemo(
    () => cards.filter((card) => card.srs.box >= 4).length,
    [cards],
  );

  const totalStreak = useMemo(
    () => cards.reduce((total, card) => total + (card.srs.streak || 0), 0),
    [cards],
  );

  const currentCard = useMemo(() => {
    if (dueCards.length === 0) return null;
    const lowestBox = Math.min(...dueCards.map((card) => card.srs.box));
    const pool = dueCards.filter((card) => card.srs.box === lowestBox);
    // Si hay más de una carta, excluir la última mostrada para garantizar cambio
    const candidates =
      pool.length > 1 && lastShownCardIdRef.current
        ? pool.filter((card) => card.id !== lastShownCardIdRef.current)
        : pool;
    return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
  }, [dueCards, skipSeed]); // skipSeed fuerza recompute al hacer skip

  // Mantener ref sincronizada con la carta actual para el próximo skip
  useEffect(() => {
    lastShownCardIdRef.current = currentCard?.id ?? null;
  }, [currentCard]);

  const handleSkipCard = useCallback(() => {
    setSkipSeed((s) => s + 1);
  }, []);

  return (
    <StudyView
      currentCard={currentCard}
      dueCount={dueCards.length}
      totalCards={cards.length}
      learnedCards={learnedCards}
      totalStreak={totalStreak}
      filters={filters}
      domains={domains}
      canSkip={dueCards.length > 1}
      onDomainChange={(domain) => setFilters((current) => ({ ...current, domain }))}
      onTagChange={(tag) => setFilters((current) => ({ ...current, tag }))}
      onClearFilters={() => setFilters({ domain: '', tag: '' })}
      onSkipCard={handleSkipCard}
      onGrade={(grade) => (currentCard ? onGrade(currentCard, grade) : Promise.resolve())}
    />
  );
};
