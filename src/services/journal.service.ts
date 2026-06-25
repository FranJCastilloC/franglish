import { supabase } from '../lib/supabase';
import type { JournalEntry } from '../types/database';

export async function fetchEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createEntry(
  entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>,
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert(entry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEntry(id: string, patch: Partial<JournalEntry>): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id);
  if (error) throw error;
}
