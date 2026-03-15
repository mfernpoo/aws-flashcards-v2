import Dexie, { Table } from 'dexie';
import { FlashcardProgress } from '../types';

export interface MetaItem<T = unknown> {
  key: string;
  value: T;
}

export class AppDatabase extends Dexie {
  progress!: Table<FlashcardProgress>;
  meta!: Table<MetaItem>;

  constructor() {
    super('aws_flashcards_db_v2');
    // Version 2: Hybrid Architecture (Content in PB, Progress in Dexie)
    this.version(2).stores({
      progress: 'cardId, nextDue', // PK: cardId, Index: nextDue
      meta: 'key',
    });
  }

  async getAllProgress(): Promise<FlashcardProgress[]> {
    return this.progress.toArray();
  }

  async putProgress(item: FlashcardProgress): Promise<void> {
    await this.progress.put(item);
  }

  async putProgressBatch(items: FlashcardProgress[]): Promise<void> {
    await this.progress.bulkPut(items);
  }

  async getDueProgress(dayEpoch: number): Promise<FlashcardProgress[]> {
    return this.progress.where('nextDue').belowOrEqual(dayEpoch).toArray();
  }

  async deleteProgress(cardId: string): Promise<void> {
    await this.progress.delete(cardId);
  }

  async clearAll(): Promise<void> {
    await Promise.all([this.progress.clear(), this.meta.clear()]);
  }

  async getMeta<T>(key: string): Promise<T | undefined> {
    const item = await this.meta.get(key);
    return item?.value as T | undefined;
  }

  async setMeta<T>(key: string, value: T): Promise<void> {
    await this.meta.put({ key, value });
  }
}

export const dbInstance = new AppDatabase();
