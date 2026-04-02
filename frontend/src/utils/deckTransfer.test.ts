import { describe, it, expect, vi } from 'vitest';
import { buildExportBlob, parseJsonImport, parseSpreadsheetImport } from './deckTransfer';

vi.mock('xlsx', () => ({
  read: vi.fn(() => ({
    SheetNames: ['Sheet1'],
    Sheets: { Sheet1: {} },
  })),
  utils: {
    sheet_to_json: vi.fn(() => [
      { front: 'Pregunta 1', back: 'Respuesta 1', domain: 'compute', tags: 'ec2' },
      { front: 'Pregunta 2', back: 'Respuesta 2' },
      { front: '', back: 'Sin frente' },
    ]),
  },
}));
import { Flashcard } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeCard = (overrides: Partial<Flashcard> = {}): Flashcard => ({
  id: 'abc123',
  front: '¿Qué es EC2?',
  back: 'Servicio de cómputo escalable',
  domain: 'compute',
  tags: ['ec2'],
  srs: { box: 1, nextDue: 0, streak: 0, lastGrade: 0 },
  ...overrides,
});

// ---------------------------------------------------------------------------
// buildExportBlob
// ---------------------------------------------------------------------------

describe('buildExportBlob', () => {
  it('retorna un Blob de tipo application/json', () => {
    const blob = buildExportBlob('MiMazo', [makeCard()]);
    expect(blob.type).toBe('application/json');
  });

  it('incluye version, deckName y las cartas en el JSON', async () => {
    const card = makeCard();
    const blob = buildExportBlob('MiMazo', [card]);
    const text = await blob.text();
    const parsed = JSON.parse(text) as { version: number; deckName: string; cards: Flashcard[] };

    expect(parsed.version).toBe(2);
    expect(parsed.deckName).toBe('MiMazo');
    expect(parsed.cards).toHaveLength(1);
    expect(parsed.cards[0].front).toBe(card.front);
  });
});

// ---------------------------------------------------------------------------
// parseJsonImport
// ---------------------------------------------------------------------------

describe('parseJsonImport', () => {
  it('parsea un array plano de cartas', () => {
    const input = JSON.stringify([{ front: 'P', back: 'R' }]);
    const result = parseJsonImport(input);
    expect(result).toHaveLength(1);
    expect(result[0].front).toBe('P');
    expect(result[0].back).toBe('R');
  });

  it('parsea el formato envelope { cards: [...] }', () => {
    const input = JSON.stringify({ version: 2, deckName: 'Test', cards: [{ front: 'P', back: 'R' }] });
    const result = parseJsonImport(input);
    expect(result).toHaveLength(1);
  });

  it('filtra cartas sin front o back', () => {
    const input = JSON.stringify([
      { front: 'P', back: 'R' },
      { front: '', back: 'R' },
      { front: 'P', back: '' },
      { back: 'R' },
    ]);
    const result = parseJsonImport(input);
    expect(result).toHaveLength(1);
  });

  it('acepta alias frente/reverso/respuesta', () => {
    const input = JSON.stringify([{ frente: 'Preg', reverso: 'Resp' }]);
    const result = parseJsonImport(input);
    expect(result[0].front).toBe('Preg');
    expect(result[0].back).toBe('Resp');
  });

  it('acepta alias back = respuesta', () => {
    const input = JSON.stringify([{ front: 'P', respuesta: 'R' }]);
    const result = parseJsonImport(input);
    expect(result[0].back).toBe('R');
  });

  it('acepta alias dominio para domain', () => {
    const input = JSON.stringify([{ front: 'P', back: 'R', dominio: 'storage' }]);
    const result = parseJsonImport(input);
    expect(result[0].domain).toBe('storage');
  });

  it('normaliza tags como array', () => {
    const input = JSON.stringify([{ front: 'P', back: 'R', tags: ['EC2', ' IAM '] }]);
    const result = parseJsonImport(input);
    expect(result[0].tags).toEqual(['ec2', 'iam']);
  });

  it('normaliza tags como string separado por comas', () => {
    const input = JSON.stringify([{ front: 'P', back: 'R', tags: 'EC2, IAM' }]);
    const result = parseJsonImport(input);
    expect(result[0].tags).toEqual(['ec2', 'iam']);
  });

  it('acepta alias tag para tags', () => {
    const input = JSON.stringify([{ front: 'P', back: 'R', tag: 's3' }]);
    const result = parseJsonImport(input);
    expect(result[0].tags).toEqual(['s3']);
  });

  it('preserva id si es string', () => {
    const input = JSON.stringify([{ id: 'xyz', front: 'P', back: 'R' }]);
    const result = parseJsonImport(input);
    expect(result[0].id).toBe('xyz');
  });

  it('preserva datos srs válidos', () => {
    const srs = { box: 3, nextDue: 100, streak: 5, lastGrade: 2 };
    const input = JSON.stringify([{ front: 'P', back: 'R', srs }]);
    const result = parseJsonImport(input);
    expect(result[0].srs).toEqual(srs);
  });

  it('descarta datos srs inválidos', () => {
    const input = JSON.stringify([{ front: 'P', back: 'R', srs: { box: 'mal' } }]);
    const result = parseJsonImport(input);
    expect(result[0].srs).toBeUndefined();
  });

  it('lanza error para JSON inválido', () => {
    expect(() => parseJsonImport('no es json')).toThrow();
  });

  it('retorna array vacío si el envelope no tiene cards', () => {
    const input = JSON.stringify({ version: 2, deckName: 'Test' });
    const result = parseJsonImport(input);
    expect(result).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// parseSpreadsheetImport
// ---------------------------------------------------------------------------

describe('parseSpreadsheetImport', () => {

  it('parsea filas del spreadsheet y filtra filas inválidas', async () => {
    const buffer = new ArrayBuffer(8);
    const result = await parseSpreadsheetImport(buffer);
    expect(result).toHaveLength(2);
    expect(result[0].front).toBe('Pregunta 1');
    expect(result[0].domain).toBe('compute');
    expect(result[0].tags).toEqual(['ec2']);
    expect(result[1].front).toBe('Pregunta 2');
  });
});
