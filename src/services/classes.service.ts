import { supabase } from '../lib/supabase';
import type { CourseClass, UserClassProgress, TopicStatus, GrammarTopic } from '../types/database';

export async function fetchClassesWithProgress(userId: string): Promise<CourseClass[]> {
  const { data: classes, error: cErr } = await supabase
    .from('course_classes')
    .select('*, module:modules(*)')
    .order('class_number');
  if (cErr) throw cErr;

  const { data: classTopics, error: ctErr } = await supabase
    .from('course_class_topics')
    .select('course_class_id, topic:grammar_topics(*)');
  if (ctErr) throw ctErr;

  const { data: progress, error: pErr } = await supabase
    .from('user_class_progress')
    .select('*')
    .eq('user_id', userId);
  if (pErr) throw pErr;

  const progressMap = new Map((progress ?? []).map(p => [p.course_class_id, p]));
  const topicsByClass = new Map<string, GrammarTopic[]>();
  for (const ct of classTopics ?? []) {
    const list = topicsByClass.get(ct.course_class_id) ?? [];
    if (ct.topic) list.push(ct.topic as unknown as GrammarTopic);
    topicsByClass.set(ct.course_class_id, list);
  }

  return (classes ?? []).map(c => ({
    ...c,
    topics: topicsByClass.get(c.id) ?? [],
    progress: progressMap.get(c.id) ?? null,
  }));
}

export async function upsertClassProgress(
  userId: string,
  courseClassId: string,
  patch: {
    status?: TopicStatus;
    challenge_done?: boolean;
    confidence_level?: number;
    notes?: string;
    attended_on?: string | null;
  },
): Promise<UserClassProgress> {
  const { data, error } = await supabase
    .from('user_class_progress')
    .upsert(
      {
        user_id: userId,
        course_class_id: courseClassId,
        ...patch,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,course_class_id' },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
