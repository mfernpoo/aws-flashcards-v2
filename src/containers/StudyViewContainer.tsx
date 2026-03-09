import React, { useEffect, useMemo, useState } from 'react';
import { Flashcard, FlashcardFilters, Grade } from '../types';
import { nowDay } from '../utils/srs';
import { StudyView } from '../components/StudyView';
import { dbInstance } from '../utils/db';

interface StudyViewContainerProps {
  cards: Flashcard[];
  onGrade: (card: Flashcard, grade: Grade) => Promise<void>;
}

export const StudyViewContainer: React.FC<StudyViewContainerProps> = ({ cards, onGrade }) => {
  const [filters, setFilters] = useState<FlashcardFilters>({ domain: '', tag: '' });
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);

  const domains = useMemo(
    () => Array.from(new Set(cards.map((card) => card.domain).filter(Boolean))),
    [cards],
  );

  useEffect(() => {
    let isCancelled = false;

    const loadDueCards = async () => {
      const today = nowDay();
      const sourceCards = filters.domain
        ? await dbInstance.getCardsByDomain(filters.domain)
        : await dbInstance.getDueCards(today);

      const filteredDueCards = sourceCards.filter((card) => {
        const matchesDueDate = card.srs.nextDue <= today;
        const matchesTag = !filters.tag || card.tags.includes(filters.tag.toLowerCase().trim());
        return matchesDueDate && matchesTag;
      });

      if (!isCancelled) {
        setDueCards(filteredDueCards);
      }
    };

    void loadDueCards();

    return () => {
      isCancelled = true;
    };
  }, [cards, filters.domain, filters.tag]);

  const learnedCards = useMemo(
    () => cards.filter((card) => card.srs.box >= 4).length,
    [cards],
  );

  const totalStreak = useMemo(
    () => cards.reduce((total, card) => total + (card.srs.streak || 0), 0),
    [cards],
  );

  const currentCard = useMemo(() => {
    if (dueCards.length === 0) {
      return null;
    }

    const lowestBox = Math.min(...dueCards.map((card) => card.srs.box));
    const pool = dueCards.filter((card) => card.srs.box === lowestBox);
    return pool[Math.floor(Math.random() * pool.length)];
  }, [dueCards]);

  return (
    <StudyView
      currentCard={currentCard}
      dueCount={dueCards.length}
      totalCards={cards.length}
      learnedCards={learnedCards}
      totalStreak={totalStreak}
      filters={filters}
      domains={domains}
      onDomainChange={(domain) => setFilters((current) => ({ ...current, domain }))}
      onTagChange={(tag) => setFilters((current) => ({ ...current, tag }))}
      onClearFilters={() => setFilters({ domain: '', tag: '' })}
      onGrade={(grade) => (currentCard ? onGrade(currentCard, grade) : Promise.resolve())}
    />
  );
};
