import { supabase } from '../lib/supabase';
import type { CalendarEvent } from '../types/database';

export async function fetchEvents(userId: string): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .order('event_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createEvent(
  event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>,
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('calendar_events')
    .insert(event)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEvent(id: string, patch: Partial<CalendarEvent>): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('calendar_events')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('calendar_events').delete().eq('id', id);
  if (error) throw error;
}
