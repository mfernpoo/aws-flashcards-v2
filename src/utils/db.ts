import { Flashcard, DeckMetadata } from '../types';

const DB_NAME = 'aws_flashcards_db_v2';
const DB_VERSION = 1;
const CARDS_STORE = 'cards';
const META_STORE = 'meta';

export class FlashcardsDB {
  private db: IDBDatabase | null = null;

  async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(CARDS_STORE)) {
          const store = db.createObjectStore(CARDS_STORE, { keyPath: 'id' });
          store.createIndex('nextDue', 'srs.nextDue');
          store.createIndex('domain', 'domain');
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async getAllCards(): Promise<Flashcard[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CARDS_STORE, 'readonly');
      const store = tx.objectStore(CARDS_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async putCard(card: Flashcard): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CARDS_STORE, 'readwrite');
      const store = tx.objectStore(CARDS_STORE);
      const request = store.put(card);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCard(id: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CARDS_STORE, 'readwrite');
      const store = tx.objectStore(CARDS_STORE);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAll(): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([CARDS_STORE, META_STORE], 'readwrite');
      tx.objectStore(CARDS_STORE).clear();
      tx.objectStore(META_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getMeta<T>(key: string): Promise<T | undefined> {
    const db = await this.open();
    return new Promise((resolve) => {
      const tx = db.transaction(META_STORE, 'readonly');
      const store = tx.objectStore(META_STORE);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => resolve(undefined);
    });
  }

  async setMeta<T>(key: string, value: T): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(META_STORE, 'readwrite');
      const store = tx.objectStore(META_STORE);
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbInstance = new FlashcardsDB();
