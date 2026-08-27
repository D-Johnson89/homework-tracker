// A generic repository over anything with an `id`. This is the pattern
// worth pointing to in an interview: it's not tied to Assignment at all,
// and it isn't leaning on a framework's data layer to do the work.
export class Repository {
    storageKey;
    constructor(storageKey) {
        this.storageKey = storageKey;
    }
    load() {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw)
            return [];
        try {
            return JSON.parse(raw);
        }
        catch {
            return [];
        }
    }
    save(items) {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
    getAll() {
        return this.load();
    }
    getById(id) {
        return this.load().find((item) => item.id === id);
    }
    add(item) {
        const items = this.load();
        items.push(item);
        this.save(items);
        return item;
    }
    update(id, patch) {
        const items = this.load();
        const index = items.findIndex((item) => item.id === id);
        if (index === -1)
            return undefined;
        const updated = { ...items[index], ...patch };
        items[index] = updated;
        this.save(items);
        return updated;
    }
    remove(id) {
        const items = this.load().filter((item) => item.id !== id);
        this.save(items);
    }
}
//# sourceMappingURL=repository.js.map