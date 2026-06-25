import { useCallback, useEffect, useState } from 'react';
import * as svc from '../services/calendar.service';
import type { CalendarEvent } from '../types/database';

export function useCalendar(userId: string | undefined) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try { setEvents(await svc.fetchEvents(userId)); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (e: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>) => {
    const created = await svc.createEvent(e);
    setEvents(prev => [created, ...prev]);
    return created;
  };

  const update = async (id: string, patch: Partial<CalendarEvent>) => {
    const updated = await svc.updateEvent(id, patch);
    setEvents(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  };

  const remove = async (id: string) => {
    await svc.deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return { events, loading, refresh, create, update, remove };
}
