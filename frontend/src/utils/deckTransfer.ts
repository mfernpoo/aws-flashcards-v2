import { Flashcard } from '../types';
import { isValidSRSData } from './srs';
import { parseTagsInput } from './tagUtils';

interface JsonImportPayload {
  cards?: unknown;
}

const asRecord = (value: unknown): Record<string, unknown> => {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, unknown>;
  }

  return {};
};

const normalizeImportCard = (value: unknown): Partial<Flashcard> | null => {
  const record = asRecord(value);
  const front = String(record.front ?? record.frente ?? '').trim();
  const back = String(record.back ?? record.reverso ?? record.respuesta ?? '').trim();

  if (!front || !back) {
    return null;
  }

  return {
    id: typeof record.id === 'string' ? record.id : undefined,
    front,
    back,
    domain: String(record.domain ?? record.dominio ?? '').trim(),
    tags: parseTagsInput(record.tags ?? record.tag),
    srs: isValidSRSData(record.srs) ? record.srs : undefined,
  };
};

export const buildExportBlob = (deckName: string, cards: Flashcard[]) => {
  const payload = { version: 2, deckName, cards };
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
};

export const parseJsonImport = (contents: string): Partial<Flashcard>[] => {
  let parsed: JsonImportPayload | unknown[];

  try {
    parsed = JSON.parse(contents) as JsonImportPayload | unknown[];
  } catch {
    throw new Error('El archivo JSON no tiene un formato valido.');
  }

  const source = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as JsonImportPayload).cards)
      ? ((parsed as JsonImportPayload).cards as unknown[])
      : [];

  return source
    .map(normalizeImportCard)
    .filter((card): card is Partial<Flashcard> => card !== null);
};

export const parseSpreadsheetImport = async (contents: ArrayBuffer): Promise<Partial<Flashcard>[]> => {
  const XLSX = await import('xlsx');
  const workbook = XLSX.read(contents, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(firstSheet) as unknown[];

  return rows
    .map(normalizeImportCard)
    .filter((card): card is Partial<Flashcard> => card !== null);
};
