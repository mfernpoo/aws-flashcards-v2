import React, { useMemo } from 'react';
import { Flashcard } from '../types';
import { StatsView } from '../components/StatsView';
import { buildDeckStats } from '../utils/stats';

interface StatsViewContainerProps {
  cards: Flashcard[];
}

export const StatsViewContainer: React.FC<StatsViewContainerProps> = ({ cards }) => {
  const stats = useMemo(() => buildDeckStats(cards), [cards]);
  return <StatsView boxStats={stats.boxStats} progressByDomain={stats.progressByDomain} totalCards={cards.length} />;
};
