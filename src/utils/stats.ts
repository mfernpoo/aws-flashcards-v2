import { Flashcard } from '../types';

export interface BoxStat {
  label: string;
  value: number;
  accentClass: string;
}

export interface DomainProgress {
  domain: string;
  learned: number;
  total: number;
  percent: number;
}

export interface DeckStats {
  boxStats: BoxStat[];
  progressByDomain: DomainProgress[];
}

export const buildDeckStats = (cards: Flashcard[]): DeckStats => {
  const boxStats: BoxStat[] = [
    {
      label: 'Caja 1 (Nuevo)',
      value: cards.filter((card) => card.srs.box === 1).length,
      accentClass: 'text-red-500',
    },
    {
      label: 'Caja 2',
      value: cards.filter((card) => card.srs.box === 2).length,
      accentClass: 'text-orange-500',
    },
    {
      label: 'Caja 3',
      value: cards.filter((card) => card.srs.box === 3).length,
      accentClass: 'text-blue-500',
    },
    {
      label: 'Caja 4/5 (Aprendido)',
      value: cards.filter((card) => card.srs.box >= 4).length,
      accentClass: 'text-green-500',
    },
  ];

  const progressByDomain = Array.from(new Set(cards.map((card) => card.domain).filter(Boolean))).map(
    (domain) => {
      const domainCards = cards.filter((card) => card.domain === domain);
      const learned = domainCards.filter((card) => card.srs.box >= 4).length;

      return {
        domain,
        learned,
        total: domainCards.length,
        percent: Math.round((learned / domainCards.length) * 100),
      };
    },
  );

  return { boxStats, progressByDomain };
};
