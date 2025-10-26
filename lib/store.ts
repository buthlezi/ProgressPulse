// Simple in-memory store for this session
export type Entry = { id: string; text: string; createdAt: number };

let entries: Entry[] = [];
let seq = 1;

export function addEntry(text: string): Entry {
  const entry = { id: String(seq++), text, createdAt: Date.now() };
  entries = [entry, ...entries];
  return entry;
}

export function getEntry(id: string): Entry | undefined {
  return entries.find(entry => entry.id === id);
}

export function getAll(): Entry[] {
  return entries;
}

export function removeEntry(id: string) {
  entries = entries.filter(entry => entry.id !== id);
}

export function updateEntry(id: string, text: string) {
  entries = entries.map(entry => (entry.id === id ? { ...entry, text } : entry));
}
