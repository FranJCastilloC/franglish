import { useCallback, useEffect, useState } from 'react';
import * as svc from '../services/journal.service';
import type { JournalEntry } from '../types/database';

export function useJournal(userId: string | undefined) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try { setEntries(await svc.fetchEntries(userId)); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (e: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) => {
    const created = await svc.createEntry(e);
    setEntries(prev => [created, ...prev]);
    return created;
  };

  const update = async (id: string, patch: Partial<JournalEntry>) => {
    const updated = await svc.updateEntry(id, patch);
    setEntries(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  };

  const remove = async (id: string) => {
    await svc.deleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return { entries, loading, refresh, create, update, remove };
}
