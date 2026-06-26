import { useState } from 'react';
import { ChevronRight, Plus, MessageSquare } from 'lucide-react';
import { Card, Badge, ProgressBar, PageHeader, Field, inputClass, btnPrimary, btnGhost } from '../components/ui';
import { STATUS_CONFIG, PRIORITY_CONFIG, statusById } from '../lib/constants';
import { formatMinutes } from '../lib/date';
import type { GrammarTopic, GrammarPhase, StudySession, TopicStatus, PersonalPriority } from '../types/database';

interface Props {
  userId: string;
  topics: GrammarTopic[];
  phases: GrammarPhase[];
  sessions: StudySession[];
  grammarPct: number;
  phasePct: (phaseId: string) => number;
  onUpdateProgress: (topicId: string, patch: Record<string, unknown>) => void;
  onNewSession: (over?: Record<string, unknown>) => void;
  onFlash: (m: string) => void;
}

function topicMinutes(topicId: string, sessions: StudySession[]) {
  return sessions.filter(s => s.completed && s.grammar_topic_id === topicId).reduce((a, s) => a + s.duration_minutes, 0);
}
function topicLast(topicId: string, sessions: StudySession[]) {
  const ds = sessions.filter(s => s.completed && s.grammar_topic_id === topicId).map(s => s.session_date).sort();
  return ds.length ? ds[ds.length - 1] : null;
}

export function GrammarPage({ topics, phases, sessions, grammarPct, phasePct, onUpdateProgress, onNewSession, onFlash }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  const cycleStatus = (t: GrammarTopic) => {
    const cur = t.progress?.status ?? 'no_iniciado';
    const i = STATUS_CONFIG.findIndex(s => s.id === cur);
    const next = STATUS_CONFIG[(i + 1) % STATUS_CONFIG.length];
    onUpdateProgress(t.id, { status: next.id });
  };

  return (
    <div>
      <PageHeader title="Gramática" sub={`25 temas en 6 fases. Avance gramatical: ${grammarPct}%`} />

      <div className="flex flex-col gap-5">
        {phases.map(p => {
          const phaseTopics = topics.filter(t => t.phase_id === p.id);
          return (
            <div key={p.id}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-2xl flex items-center justify-center font-extrabold text-sm text-white shrink-0" style={{ background: '#0E7C86' }}>
                  {p.phase_number}
                </div>
                <div className="flex-1">
                  <div className="font-extrabold tracking-tight">{p.name}</div>
                  <div className="text-xs text-[#5B6678]">{p.description}</div>
                </div>
                <div className="w-28"><ProgressBar pct={phasePct(p.id)} /></div>
                <div className="text-xs font-bold w-9 text-right">{phasePct(p.id)}%</div>
              </div>

              <div className="flex flex-col gap-2">
                {phaseTopics.map(t => {
                  const pg = t.progress;
                  const st = statusById(pg?.status ?? 'no_iniciado');
                  const isOpen = open === t.id;
                  const mins = topicMinutes(t.id, sessions);
                  const last = topicLast(t.id, sessions);

                  return (
                    <Card key={t.id} className="p-0 overflow-hidden">
                      <div
                        className="flex items-center gap-3 px-3.5 py-3 cursor-pointer"
                        onClick={() => setOpen(isOpen ? null : t.id)}
                      >
                        <button
                          onClick={e => { e.stopPropagation(); cycleStatus(t); }}
                          title="Cambiar estado"
                          className="w-3.5 h-3.5 rounded shrink-0 border-0 cursor-pointer"
                          style={{ background: st.color }}
                        />
                        <div className="flex-1">
                          <div className="font-bold text-sm">{t.title}</div>
                          <div className="text-[11px] text-[#5B6678]">
                            Módulos {t.modules?.map(m => m.module_number).join(', ')} · {formatMinutes(mins)} dedicados
                            {last && <span> · Último: {last}</span>}
                          </div>
                        </div>
                        {pg?.personal_priority && pg.personal_priority !== 'none' && (
                          <Badge color="#fff" bg={PRIORITY_CONFIG[pg.personal_priority as PersonalPriority].color}>
                            {PRIORITY_CONFIG[pg.personal_priority as PersonalPriority].label}
                          </Badge>
                        )}
                        <Badge color={st.color} bg={st.color + '22'}>{st.label}</Badge>
                        <ChevronRight size={15} color="#5B6678" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
                      </div>

                      {isOpen && (
                        <div className="border-t border-[#E3E8F2] px-4 py-4 bg-[#FBFCFE]">
                          {t.short_description && (
                            <p className="text-sm leading-relaxed mb-2">{t.short_description}</p>
                          )}

                          <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
                            <Field label="Estado">
                              <select
                                value={pg?.status ?? 'no_iniciado'}
                                onChange={e => onUpdateProgress(t.id, { status: e.target.value as TopicStatus })}
                                className={inputClass}
                              >
                                {STATUS_CONFIG.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                              </select>
                            </Field>
                            <Field label="Prioridad">
                              <select
                                value={pg?.personal_priority ?? 'none'}
                                onChange={e => onUpdateProgress(t.id, { personal_priority: e.target.value as PersonalPriority })}
                                className={inputClass}
                              >
                                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                              </select>
                            </Field>
                            <Field label="Confianza (1-5)">
                              <select
                                value={pg?.confidence_level ?? 0}
                                onChange={e => onUpdateProgress(t.id, { confidence_level: +e.target.value })}
                                className={inputClass}
                              >
                                {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n === 0 ? '—' : n}</option>)}
                              </select>
                            </Field>
                            <Field label="Próximo repaso">
                              <input
                                type="date" value={pg?.next_review_at ?? ''}
                                onChange={e => onUpdateProgress(t.id, { next_review_at: e.target.value || null })}
                                className={inputClass}
                              />
                            </Field>
                          </div>

                          <Field label="Notas personales" className="mt-3">
                            <textarea
                              value={pg?.notes ?? ''}
                              onChange={e => onUpdateProgress(t.id, { notes: e.target.value })}
                              rows={2}
                              className={inputClass}
                              style={{ resize: 'vertical' }}
                              placeholder="Lo que te cuesta, ejemplos propios, dudas…"
                            />
                          </Field>

                          {t.lesson?.sesame_prompt && (
                            <div className="mt-3">
                              <div className="text-xs font-bold text-[#5B6678] mb-1">Prompt para Sesame</div>
                              <div className="text-sm bg-white border border-[#E3E8F2] rounded-xl px-3 py-2.5 leading-relaxed">{t.lesson.sesame_prompt}</div>
                            </div>
                          )}

                          <div className="flex gap-2 mt-3 flex-wrap">
                            <button
                              className={btnPrimary}
                              onClick={() => onNewSession({ category: 'grammar', grammar_topic_id: t.id, title: t.title })}
                            >
                              <Plus size={14} /> Registrar sesión
                            </button>
                            {t.lesson?.sesame_prompt && (
                              <button
                                className={btnGhost}
                                onClick={() => { navigator.clipboard?.writeText(t.lesson!.sesame_prompt!); onFlash('Prompt copiado'); }}
                              >
                                <MessageSquare size={14} /> Copiar prompt
                              </button>
                            )}
                          </div>

                          {last && <div className="text-[11px] text-[#5B6678] mt-2">Último estudio: {last}</div>}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
