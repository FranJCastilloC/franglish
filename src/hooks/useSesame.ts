import { useCallback, useEffect, useState } from 'react';
import * as svc from '../services/sesame.service';
import type { SesameSession } from '../types/database';

export function useSesame(userId: string | undefined) {
  const [sessions, setSessions] = useState<SesameSession[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try { setSessions(await svc.fetchSesameSessions(userId)); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (s: Omit<SesameSession, 'id' | 'created_at' | 'updated_at'>) => {
    const created = await svc.createSesameSession(s);
    setSessions(prev => [created, ...prev]);
    return created;
  };

  const update = async (id: string, patch: Partial<SesameSession>) => {
    const updated = await svc.updateSesameSession(id, patch);
    setSessions(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  };

  const remove = async (id: string) => {
    await svc.deleteSesameSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return { sessions, loading, refresh, create, update, remove };
}
