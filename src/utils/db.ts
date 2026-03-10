import Dexie, { Table } from 'dexie';
import { Flashcard } from '../types';

export interface MetaItem<T = unknown> {
  key: string;
  value: T;
}

export class AppDatabase extends Dexie {
  cards!: Table<Flashcard>;
  meta!: Table<MetaItem>;

  constructor() {
    super('aws_flashcards_db_v2');
    this.version(1).stores({
      cards: 'id, domain, srs.nextDue', // Indices: id (PK), domain, nextDue
      meta: 'key',
    });
  }

  async getAllCards(): Promise<Flashcard[]> {
    return this.cards.toArray();
  }

  async putCard(card: Flashcard): Promise<void> {
    await this.cards.put(card);
  }

  async putCards(cards: Flashcard[]): Promise<void> {
    await this.cards.bulkPut(cards);
  }

  async getCardsByDomain(domain: string): Promise<Flashcard[]> {
    return this.cards.where('domain').equals(domain).toArray();
  }

  async getDueCards(dayEpoch: number): Promise<Flashcard[]> {
    return this.cards.where('srs.nextDue').belowOrEqual(dayEpoch).toArray();
  }

  async deleteCard(id: string): Promise<void> {
    await this.cards.delete(id);
  }

  async clearAll(): Promise<void> {
    await Promise.all([this.cards.clear(), this.meta.clear()]);
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
