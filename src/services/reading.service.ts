import { supabase } from '../lib/supabase';
import type { ReadingLog } from '../types/database';

export async function fetchReadingLogs(userId: string): Promise<ReadingLog[]> {
  const { data, error } = await supabase
    .from('reading_logs')
    .select('*')
    .eq('user_id', userId)
    .order('reading_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createReadingLog(
  log: Omit<ReadingLog, 'id' | 'created_at' | 'updated_at'>,
): Promise<ReadingLog> {
  const { data, error } = await supabase
    .from('reading_logs')
    .insert(log)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateReadingLog(id: string, patch: Partial<ReadingLog>): Promise<ReadingLog> {
  const { data, error } = await supabase
    .from('reading_logs')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteReadingLog(id: string): Promise<void> {
  const { error } = await supabase.from('reading_logs').delete().eq('id', id);
  if (error) throw error;
}
