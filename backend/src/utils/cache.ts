//A single stored cache entry.
interface CacheRecord<T = unknown> {
  value: T;
  expiresAt: number; // timestamp in ms
}

/**
 * Very small in-memory TTL cache.
 * - Generic get<T>() for typed returns.
 */
export class SimpleCache {
  private records = new Map<string, CacheRecord>();

  // Retrieve an entry if not expired.
  get<T>(key: string): T | undefined {
    const record = this.records.get(key);
    if (!record) return undefined;

    const isExpired = record.expiresAt <= Date.now();
    if (isExpired) {
      this.records.delete(key);
      return undefined;
    }

    return record.value as T;
  }

  // Store a value with a TTL (in milliseconds).
  set<T>(key: string, value: T, ttlMs: number): void {
    const expiresAt = Date.now() + Math.max(ttlMs, 0);

    const record: CacheRecord<T> = {
      value,
      expiresAt,
    };

    this.records.set(key, record);
  }
}

/** Shared instance used everywhere in the backend */
export const cache = new SimpleCache();
cache.set("demo", { a: 1 }, 5000);
