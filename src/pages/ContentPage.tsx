import { useState, useMemo } from 'react';
import { Card, PageHeader, Empty, Field, inputClass } from '../components/ui';
import { STATUS_CONFIG, statusById } from '../lib/constants';
import type { GrammarTopic, TopicStatus } from '../types/database';

interface Props {
  topics: GrammarTopic[];
  onUpdateProgress: (topicId: string, patch: Record<string, unknown>) => void;
}

export function ContentPage({ topics, onUpdateProgress }: Props) {
  const [fMod, setFMod] = useState('all');
  const [fStatus, setFStatus] = useState('all');

  const filtered = useMemo(() =>
    topics.filter(t => {
      if (fMod !== 'all' && !t.modules?.find(m => String(m.module_number) === fMod)) return false;
      if (fStatus !== 'all' && (t.progress?.status ?? 'no_iniciado') !== fStatus) return false;
      return true;
    }),
    [topics, fMod, fStatus],
  );

  return (
    <div>
      <PageHeader title="Mapa de contenidos" sub="Todos los temas gramaticales del curso ordenados por módulo y estado." />

      <Card className="mb-4">
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))' }}>
          <Field label="Módulo">
            <select value={fMod} onChange={e => setFMod(e.target.value)} className={inputClass}>
              <option value="all">Todos</option>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Módulo {n}</option>)}
            </select>
          </Field>
          <Field label="Estado">
            <select value={fStatus} onChange={e => setFStatus(e.target.value)} className={inputClass}>
              <option value="all">Todos</option>
              {STATUS_CONFIG.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && <Card><Empty>No hay temas que coincidan con los filtros.</Empty></Card>}
        {filtered.map(t => {
          const st = statusById(t.progress?.status ?? 'no_iniciado');
          return (
            <Card key={t.id} style={{ paddingLeft: 14, borderLeft: `4px solid #0E7C86` }}>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-40">
                  <div className="font-bold text-sm">{t.title}</div>
                  <div className="text-[11px] text-[#5B6678]">
                    Módulos {t.modules?.map(m => m.module_number).join(', ')} · Prioridad {t.priority}
                  </div>
                </div>
                <select
                  value={t.progress?.status ?? 'no_iniciado'}
                  onChange={e => onUpdateProgress(t.id, { status: e.target.value as TopicStatus })}
                  className="border rounded-xl px-3 py-1.5 text-sm font-bold cursor-pointer"
                  style={{ borderColor: st.color, color: st.color, background: '#fff' }}
                >
                  {STATUS_CONFIG.map(s => <option key={s.id} value={s.id} style={{ color: '#1C2230' }}>{s.label}</option>)}
                </select>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
