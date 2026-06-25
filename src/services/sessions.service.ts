import { supabase } from '../lib/supabase';
import type { StudySession } from '../types/database';

export async function fetchSessions(userId: string): Promise<StudySession[]> {
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('session_date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createSession(
  session: Omit<StudySession, 'id' | 'created_at' | 'updated_at'>,
): Promise<StudySession> {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert(session)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSession(id: string, patch: Partial<StudySession>): Promise<StudySession> {
  const { data, error } = await supabase
    .from('study_sessions')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase.from('study_sessions').delete().eq('id', id);
  if (error) throw error;
}
