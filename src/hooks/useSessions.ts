import { useCallback, useEffect, useState } from 'react';
import * as svc from '../services/sessions.service';
import type { StudySession } from '../types/database';

export function useSessions(userId: string | undefined) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      setSessions(await svc.fetchSessions(userId));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (s: Omit<StudySession, 'id' | 'created_at' | 'updated_at'>) => {
    const created = await svc.createSession(s);
    setSessions(prev => [created, ...prev]);
    return created;
  };

  const update = async (id: string, patch: Partial<StudySession>) => {
    const updated = await svc.updateSession(id, patch);
    setSessions(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  };

  const remove = async (id: string) => {
    await svc.deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return { sessions, loading, error, refresh, create, update, remove };
}
