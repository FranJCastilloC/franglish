import { useCallback, useEffect, useState } from 'react';
import * as svc from '../services/grammar.service';
import type { GrammarTopic, GrammarPhase, Module } from '../types/database';

export function useGrammar(userId: string | undefined) {
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [phases, setPhases] = useState<GrammarPhase[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const [t, p, m] = await Promise.all([
        svc.fetchTopicsWithProgress(userId),
        svc.fetchPhases(),
        svc.fetchModules(),
      ]);
      setTopics(t);
      setPhases(p);
      setModules(m);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateProgress = async (
    topicId: string,
    patch: Parameters<typeof svc.upsertTopicProgress>[2],
  ) => {
    if (!userId) return;
    const updated = await svc.upsertTopicProgress(userId, topicId, patch);
    setTopics(prev => prev.map(t =>
      t.id === topicId ? { ...t, progress: updated } : t,
    ));
    return updated;
  };

  return { topics, phases, modules, loading, error, refresh, updateProgress };
}
