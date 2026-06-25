import { supabase } from '../lib/supabase';
import type { GrammarTopic, GrammarPhase, Module, UserTopicProgress, TopicStatus, PersonalPriority } from '../types/database';

export async function fetchPhases(): Promise<GrammarPhase[]> {
  const { data, error } = await supabase
    .from('grammar_phases')
    .select('*')
    .order('order_index');
  if (error) throw error;
  return data ?? [];
}

export async function fetchModules(): Promise<Module[]> {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('module_number');
  if (error) throw error;
  return data ?? [];
}

export async function fetchTopicsWithProgress(userId: string): Promise<GrammarTopic[]> {
  // Fetch topics with phase
  const { data: topics, error: tErr } = await supabase
    .from('grammar_topics')
    .select(`*, phase:grammar_phases(*), lesson:grammar_lessons(*)`)
    .order('order_index');
  if (tErr) throw tErr;

  // Fetch topic-module relationships
  const { data: topicModules, error: tmErr } = await supabase
    .from('grammar_topic_modules')
    .select('grammar_topic_id, module:modules(*)');
  if (tmErr) throw tmErr;

  // Fetch user progress
  const { data: progress, error: pErr } = await supabase
    .from('user_topic_progress')
    .select('*')
    .eq('user_id', userId);
  if (pErr) throw pErr;

  const progressMap = new Map((progress ?? []).map(p => [p.grammar_topic_id, p]));
  const modulesByTopic = new Map<string, Module[]>();
  for (const tm of topicModules ?? []) {
    const list = modulesByTopic.get(tm.grammar_topic_id) ?? [];
    if (tm.module) list.push(tm.module as Module);
    modulesByTopic.set(tm.grammar_topic_id, list);
  }

  return (topics ?? []).map(t => ({
    ...t,
    modules: modulesByTopic.get(t.id) ?? [],
    progress: progressMap.get(t.id) ?? null,
  }));
}

export async function upsertTopicProgress(
  userId: string,
  grammarTopicId: string,
  patch: {
    status?: TopicStatus;
    confidence_level?: number;
    personal_priority?: PersonalPriority;
    notes?: string;
    own_sentences?: string;
    doubts?: string;
    last_studied_at?: string;
    next_review_at?: string;
  },
): Promise<UserTopicProgress> {
  const { data, error } = await supabase
    .from('user_topic_progress')
    .upsert(
      {
        user_id: userId,
        grammar_topic_id: grammarTopicId,
        ...patch,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,grammar_topic_id' },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
