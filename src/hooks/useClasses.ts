import { useCallback, useEffect, useState } from 'react';
import * as svc from '../services/classes.service';
import type { CourseClass } from '../types/database';

export function useClasses(userId: string | undefined) {
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      setClasses(await svc.fetchClassesWithProgress(userId));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateProgress = async (
    classId: string,
    patch: Parameters<typeof svc.upsertClassProgress>[2],
  ) => {
    if (!userId) return;
    const updated = await svc.upsertClassProgress(userId, classId, patch);
    setClasses(prev => prev.map(c =>
      c.id === classId ? { ...c, progress: updated } : c,
    ));
    return updated;
  };

  return { classes, loading, error, refresh, updateProgress };
}
