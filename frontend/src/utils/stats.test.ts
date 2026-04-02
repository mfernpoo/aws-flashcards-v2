import { describe, it, expect } from 'vitest';
import { buildDeckStats } from './stats';
import { Flashcard } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeCard = (id: string, box: number, domain = ''): Flashcard => ({
  id,
  front: `Frente ${id}`,
  back: `Reverso ${id}`,
  domain,
  tags: [],
  srs: { box, nextDue: 0, streak: 0, lastGrade: 0 },
});

// ---------------------------------------------------------------------------
// buildDeckStats
// ---------------------------------------------------------------------------

describe('buildDeckStats', () => {
  it('retorna boxStats y progressByDomain vacíos para array vacío', () => {
    const result = buildDeckStats([]);
    expect(result.boxStats[0].value).toBe(0); // caja 1
    expect(result.boxStats[1].value).toBe(0); // caja 2
    expect(result.boxStats[2].value).toBe(0); // caja 3
    expect(result.boxStats[3].value).toBe(0); // caja 4/5
    expect(result.progressByDomain).toHaveLength(0);
  });

  it('cuenta correctamente las cartas por caja', () => {
    const cards = [
      makeCard('1', 1),
      makeCard('2', 1),
      makeCard('3', 2),
      makeCard('4', 3),
      makeCard('5', 4),
      makeCard('6', 5),
    ];
    const { boxStats } = buildDeckStats(cards);
    expect(boxStats[0].value).toBe(2); // caja 1
    expect(boxStats[1].value).toBe(1); // caja 2
    expect(boxStats[2].value).toBe(1); // caja 3
    expect(boxStats[3].value).toBe(2); // caja 4/5
  });

  it('trata cajas 4 y 5 como "Aprendido"', () => {
    const cards = [makeCard('a', 4), makeCard('b', 5)];
    const { boxStats } = buildDeckStats(cards);
    expect(boxStats[3].value).toBe(2);
  });

  it('excluye cartas sin dominio de progressByDomain', () => {
    const cards = [makeCard('1', 1, ''), makeCard('2', 4, '')];
    const { progressByDomain } = buildDeckStats(cards);
    expect(progressByDomain).toHaveLength(0);
  });

  it('agrupa cartas por dominio correctamente', () => {
    const cards = [
      makeCard('1', 1, 'compute'),
      makeCard('2', 4, 'compute'),
      makeCard('3', 2, 'storage'),
    ];
    const { progressByDomain } = buildDeckStats(cards);
    expect(progressByDomain).toHaveLength(2);

    const compute = progressByDomain.find((d) => d.domain === 'compute')!;
    expect(compute.total).toBe(2);
    expect(compute.learned).toBe(1);
    expect(compute.percent).toBe(50);

    const storage = progressByDomain.find((d) => d.domain === 'storage')!;
    expect(storage.total).toBe(1);
    expect(storage.learned).toBe(0);
    expect(storage.percent).toBe(0);
  });

  it('retorna percent 100 cuando todas las cartas del dominio están aprendidas', () => {
    const cards = [makeCard('1', 4, 'security'), makeCard('2', 5, 'security')];
    const { progressByDomain } = buildDeckStats(cards);
    expect(progressByDomain[0].percent).toBe(100);
  });

  it('redondea el porcentaje al entero más cercano', () => {
    // 1 de 3 = 33.33... → 33
    const cards = [makeCard('1', 4, 'network'), makeCard('2', 1, 'network'), makeCard('3', 2, 'network')];
    const { progressByDomain } = buildDeckStats(cards);
    expect(progressByDomain[0].percent).toBe(33);
  });

  it('los accentClass de boxStats son estables', () => {
    const { boxStats } = buildDeckStats([]);
    expect(boxStats[0].accentClass).toBe('text-red-500');
    expect(boxStats[1].accentClass).toBe('text-orange-500');
    expect(boxStats[2].accentClass).toBe('text-blue-500');
    expect(boxStats[3].accentClass).toBe('text-green-500');
  });

  it('maneja correctamente una única carta con dominio', () => {
    const cards = [makeCard('solo', 5, 'database')];
    const { progressByDomain } = buildDeckStats(cards);
    expect(progressByDomain[0].domain).toBe('database');
    expect(progressByDomain[0].learned).toBe(1);
    expect(progressByDomain[0].total).toBe(1);
    expect(progressByDomain[0].percent).toBe(100);
  });
});
