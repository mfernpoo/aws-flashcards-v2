import { ChangeEvent, useRef } from 'react';
import { Flashcard, ImportCardsResult, UiNotification } from '../types';
import { dbInstance } from '../utils/db';
import { buildExportBlob, parseJsonImport, parseSpreadsheetImport } from '../utils/deckTransfer';

interface UseDeckTransferOptions {
  cards: Flashcard[];
  importCards: (cards: Partial<Flashcard>[]) => Promise<ImportCardsResult>;
  onNotify: (notification: UiNotification) => void;
}

const buildImportMessage = (result: ImportCardsResult) => {
  const parts = [`${result.total} importadas`, `${result.created} nuevas`];

  if (result.updated > 0) {
    parts.push(`${result.updated} actualizadas`);
  }

  if (result.conflicts > 0) {
    parts.push(`${result.conflicts} conflictos resueltos`);
  }

  return `Importación completada: ${parts.join(', ')}.`;
};

export function useDeckTransfer({ cards, importCards, onNotify }: UseDeckTransferOptions) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportDeck = async () => {
    try {
      const deckName = (await dbInstance.getMeta<string>('deckName')) || 'AWS Flashcards';
      const blob = buildExportBlob(deckName, cards);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'aws-flashcards-v2-export.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      onNotify({ type: 'error', message: 'No se pudo exportar el mazo.' });
    }
  };

  const requestImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const importedCards = file.name.endsWith('.json')
        ? parseJsonImport(await file.text())
        : await parseSpreadsheetImport(await file.arrayBuffer());

      if (importedCards.length === 0) {
        throw new Error('No se encontraron cartas validas para importar.');
      }

      const importResult = await importCards(importedCards);
      onNotify({ type: 'success', message: buildImportMessage(importResult) });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo importar el archivo.';
      onNotify({ type: 'error', message });
    } finally {
      event.target.value = '';
    }
  };

  return {
    fileInputRef,
    requestImport,
    handleFileChange,
    exportDeck,
  };
}
