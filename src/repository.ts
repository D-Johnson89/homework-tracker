// A generic repository over anything with an `id`. This is the pattern
// worth pointing to in an interview: it's not tied to Assignment at all,
// and it isn't leaning on a framework's data layer to do the work.

export interface Identifiable {
  id: string;
}

export class Repository<T extends Identifiable> {
  constructor(private readonly storageKey: string) {}

  private load(): T[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  private save(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getAll(): T[] {
    return this.load();
  }

  getById(id: string): T | undefined {
    return this.load().find((item) => item.id === id);
  }

  add(item: T): T {
    const items = this.load();
    items.push(item);
    this.save(items);
    return item;
  }

  update(id: string, patch: Partial<T>): T | undefined {
    const items = this.load();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    const updated = { ...items[index], ...patch };
    items[index] = updated;
    this.save(items);
    return updated;
  }

  remove(id: string): void {
    const items = this.load().filter((item) => item.id !== id);
    this.save(items);
  }
}
