import { supabase } from '../lib/supabase';
import type { SesameSession } from '../types/database';

export async function fetchSesameSessions(userId: string): Promise<SesameSession[]> {
  const { data, error } = await supabase
    .from('sesame_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('session_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createSesameSession(
  session: Omit<SesameSession, 'id' | 'created_at' | 'updated_at'>,
): Promise<SesameSession> {
  const { data, error } = await supabase
    .from('sesame_sessions')
    .insert(session)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSesameSession(id: string, patch: Partial<SesameSession>): Promise<SesameSession> {
  const { data, error } = await supabase
    .from('sesame_sessions')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSesameSession(id: string): Promise<void> {
  const { error } = await supabase.from('sesame_sessions').delete().eq('id', id);
  if (error) throw error;
}
