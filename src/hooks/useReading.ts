import { useCallback, useEffect, useState } from 'react';
import * as svc from '../services/reading.service';
import type { ReadingLog } from '../types/database';

export function useReading(userId: string | undefined) {
  const [logs, setLogs] = useState<ReadingLog[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try { setLogs(await svc.fetchReadingLogs(userId)); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (l: Omit<ReadingLog, 'id' | 'created_at' | 'updated_at'>) => {
    const created = await svc.createReadingLog(l);
    setLogs(prev => [created, ...prev]);
    return created;
  };

  const update = async (id: string, patch: Partial<ReadingLog>) => {
    const updated = await svc.updateReadingLog(id, patch);
    setLogs(prev => prev.map(l => l.id === id ? updated : l));
    return updated;
  };

  const remove = async (id: string) => {
    await svc.deleteReadingLog(id);
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  return { logs, loading, refresh, create, update, remove };
}
