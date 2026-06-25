import { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronRight, Plus, MessageSquare, Check, BookOpen } from 'lucide-react';
import { Card, Badge, ProgressBar, SectionTitle, PageHeader, Empty, Field, inputClass, btnPrimary, btnGhost, StatCard } from '../components/ui';
import { STATUS_CONFIG, statusById } from '../lib/constants';
import { formatMinutes, todayLocal } from '../lib/date';
import type { GrammarTopic, GrammarPhase, StudySession, TopicStatus } from '../types/database';

interface Props {
  topics: GrammarTopic[];
  phases: GrammarPhase[];
  sessions: StudySession[];
  onUpdateProgress: (topicId: string, patch: Record<string, unknown>) => void;
  onNewSession: (over?: Record<string, unknown>) => void;
  onFlash: (m: string) => void;
}

function topicMinutes(topicId: string, sessions: StudySession[]) {
  return sessions.filter(s => s.completed && s.grammar_topic_id === topicId).reduce((a, s) => a + s.duration_minutes, 0);
}

export function LessonsPage({ topics, phases, sessions, onUpdateProgress, onNewSession, onFlash }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  if (selectedTopic) {
    const fresh = topics.find(t => t.id === selectedTopic.id) ?? selectedTopic;
    return (
      <LessonDetail
        topic={fresh}
        sessions={sessions}
        onBack={() => setSelectedTopic(null)}
        onUpdateProgress={onUpdateProgress}
        onNewSession={onNewSession}
        onFlash={onFlash}
      />
    );
  }

  const filtered = topics.filter(t => {
    if (filterPhase !== 'all' && !phases.find(p => p.id === t.phase_id && String(p.phase_number) === filterPhase)) return false;
    const status = t.progress?.status ?? 'no_iniciado';
    if (filterStatus === 'pending' && status !== 'no_iniciado' && status !== 'en_estudio') return false;
    if (filterStatus === 'estudiado' && status !== 'estudiado') return false;
    if (filterStatus === 'practicado' && status !== 'practicado') return false;
    if (filterStatus === 'dominado' && status !== 'dominado') return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const studiedCount = topics.filter(t => {
    const s = t.progress?.status;
    return s === 'estudiado' || s === 'practicado' || s === 'dominado';
  }).length;
  const masteredCount = topics.filter(t => t.progress?.status === 'dominado').length;
  const nextTopic = topics.find(t => (t.progress?.status ?? 'no_iniciado') !== 'dominado');

  const phasesByNumber = new Map(phases.map(p => [p.id, p]));

  return (
    <div>
      <PageHeader title="Lecciones de Gramática" sub="Estudia cada tema con explicación, ejemplos, errores comunes y práctica integrada." />

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
        <Card className="!p-3.5">
          <div className="text-xs font-semibold text-[#5B6678]">Estudiadas</div>
          <div className="text-2xl font-extrabold">{studiedCount}<span className="text-sm text-[#5B6678]">/{topics.length}</span></div>
        </Card>
        <Card className="!p-3.5">
          <div className="text-xs font-semibold text-[#5B6678]">Dominadas</div>
          <div className="text-2xl font-extrabold text-[#16A34A]">{masteredCount}<span className="text-sm text-[#5B6678]">/{topics.length}</span></div>
        </Card>
        {nextTopic && (
          <Card className="!p-3.5 border-[#0E7C86]">
            <div className="text-xs font-semibold text-[#5B6678]">Siguiente recomendada</div>
            <div className="text-sm font-bold mt-0.5 mb-2">{nextTopic.title}</div>
            <button className={btnPrimary + ' text-xs py-1.5'} onClick={() => setSelectedTopic(nextTopic)}>
              Estudiar ahora
            </button>
          </Card>
        )}
      </div>

      <Card className="mb-4">
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
          <Field label="Buscar"><input value={search} onChange={e => setSearch(e.target.value)} className={inputClass} placeholder="Nombre del tema…" /></Field>
          <Field label="Fase">
            <select value={filterPhase} onChange={e => setFilterPhase(e.target.value)} className={inputClass}>
              <option value="all">Todas las fases</option>
              {phases.map(p => <option key={p.id} value={String(p.phase_number)}>Fase {p.phase_number} · {p.name}</option>)}
            </select>
          </Field>
          <Field label="Estado">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={inputClass}>
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="estudiado">Estudiadas</option>
              <option value="practicado">Practicadas</option>
              <option value="dominado">Dominadas</option>
            </select>
          </Field>
        </div>
      </Card>

      <div className="flex flex-col gap-5">
        {phases
          .filter(p => filterPhase === 'all' || String(p.phase_number) === filterPhase)
          .map(p => {
            const phaseTopics = filtered.filter(t => t.phase_id === p.id);
            if (!phaseTopics.length) return null;
            return (
              <div key={p.id}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-2xl flex items-center justify-center font-extrabold text-sm text-white shrink-0" style={{ background: '#0E7C86' }}>
                    {p.phase_number}
                  </div>
                  <div>
                    <div className="font-extrabold tracking-tight">Fase {p.phase_number} · {p.name}</div>
                    <div className="text-xs text-[#5B6678]">{p.description}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {phaseTopics.map(t => {
                    const status = t.progress?.status ?? 'no_iniciado';
                    const st = statusById(status);
                    const hasLesson = !!t.lesson;
                    const mins = topicMinutes(t.id, sessions);
                    const borderColor = status === 'dominado' ? '#16A34A' : status === 'practicado' ? '#0E9F9F' : status === 'estudiado' ? '#3B82F6' : '#E3E8F2';
                    return (
                      <Card
                        key={t.id}
                        className="cursor-pointer hover:bg-[#FBFCFE] transition-colors"
                        style={{ borderLeftWidth: 4, borderLeftColor: borderColor, paddingLeft: 12 }}
                        onClick={() => setSelectedTopic(t)}
                      >
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex-1 min-w-40">
                            <div className="font-bold text-sm">{t.title}</div>
                            <div className="text-[11px] text-[#5B6678]">
                              Módulos {t.modules?.map(m => m.module_number).join(', ')} · {formatMinutes(mins)} dedicados
                              {t.progress?.next_review_at && (
                                <span className="text-amber-600"> · Repaso: {t.progress.next_review_at}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1.5 items-center flex-wrap">
                            <Badge color={st.color} bg={st.color + '22'}>{st.label}</Badge>
                            {hasLesson && <Badge color="#0E7C86" bg="rgba(14,124,134,.10)">Con contenido</Badge>}
                            <ChevronRight size={15} color="#5B6678" />
                          </div>
                        </div>
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

/* ── Lesson Detail ── */
function LessonDetail({
  topic: t,
  sessions,
  onBack,
  onUpdateProgress,
  onNewSession,
  onFlash,
}: {
  topic: GrammarTopic;
  sessions: StudySession[];
  onBack: () => void;
  onUpdateProgress: (id: string, patch: Record<string, unknown>) => void;
  onNewSession: (over?: Record<string, unknown>) => void;
  onFlash: (m: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'lesson' | 'practice' | 'notes'>('lesson');
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [ownPhrase, setOwnPhrase] = useState('');
  const [doubt, setDoubt] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTimer(x => x + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const fmtTimer = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pg = t.progress;
  const lesson = t.lesson;
  const mins = topicMinutes(t.id, sessions);

  const markStatus = (status: TopicStatus) => {
    onUpdateProgress(t.id, { status, last_studied_at: todayLocal() });
    onFlash(`Marcado como ${STATUS_CONFIG.find(s => s.id === status)?.label}`);
  };

  const saveTimer = () => {
    if (timer < 60) { onFlash('Mínimo 1 minuto para registrar'); return; }
    const m = Math.round(timer / 60);
    onNewSession({ category: 'grammar', grammar_topic_id: t.id, title: t.title, duration_minutes: m, completed: true });
    onUpdateProgress(t.id, { last_studied_at: todayLocal() });
    setTimer(0); setRunning(false);
    onFlash(`${m} minutos registrados`);
  };

  const addOwnPhrase = () => {
    if (!ownPhrase.trim()) return;
    const cur = pg?.own_sentences ?? '';
    onUpdateProgress(t.id, { own_sentences: cur ? cur + '\n' + ownPhrase : ownPhrase });
    setOwnPhrase('');
    onFlash('Frase guardada');
  };

  const addDoubt = () => {
    if (!doubt.trim()) return;
    const cur = pg?.doubts ?? '';
    onUpdateProgress(t.id, { doubts: cur ? cur + '\n' + doubt : doubt });
    setDoubt('');
    onFlash('Duda guardada');
  };

  const TABS = [['lesson', 'Lección'], ['practice', 'Práctica'], ['notes', 'Mis notas']] as const;

  return (
    <div>
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-[#5B6678] hover:text-[#1C2230] bg-none border-0 cursor-pointer p-0">
          ← Volver a lecciones
        </button>
      </div>
      <div className="mb-1 text-xs text-[#5B6678] font-semibold">
        Fase {t.phase?.phase_number} · Módulos {t.modules?.map(m => m.module_number).join(', ')}
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight mb-4">{t.title}</h1>

      {/* Status + timer card */}
      <Card className="mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          {(['estudiado', 'practicado', 'dominado'] as TopicStatus[]).map(s => {
            const cfg = STATUS_CONFIG.find(x => x.id === s)!;
            const active = (pg?.status ?? 'no_iniciado') === s ||
              (s === 'estudiado' && ['practicado', 'dominado'].includes(pg?.status ?? '')) ||
              (s === 'practicado' && pg?.status === 'dominado');
            return (
              <button
                key={s}
                onClick={() => markStatus(s)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border cursor-pointer transition-colors`}
                style={{
                  background: active ? cfg.color + '18' : '#fff',
                  borderColor: active ? cfg.color : '#E3E8F2',
                  color: active ? cfg.color : '#1C2230',
                }}
              >
                {active && <Check size={13} />} {cfg.label}
              </button>
            );
          })}
          <div className="flex gap-2 ml-auto flex-wrap">
            <button className={btnPrimary} onClick={() => onNewSession({ category: 'grammar', grammar_topic_id: t.id, title: t.title })}>
              <Plus size={14} /> Registrar sesión
            </button>
            {lesson?.sesame_prompt && (
              <button className={btnGhost} onClick={() => { navigator.clipboard?.writeText(lesson.sesame_prompt!); onFlash('Prompt copiado'); }}>
                <MessageSquare size={14} /> Copiar prompt
              </button>
            )}
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#E3E8F2] flex-wrap">
          <div className="text-2xl font-extrabold tabular-nums" style={{ color: running ? '#0E7C86' : '#1C2230' }}>
            {fmtTimer(timer)}
          </div>
          <button
            className={running ? 'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-red-600 text-sm font-bold border border-red-200 cursor-pointer' : btnGhost}
            onClick={() => setRunning(r => !r)}
          >
            {running ? '⏸ Pausar' : timer > 0 ? '▶ Continuar' : '▶ Iniciar temporizador'}
          </button>
          {timer > 0 && (
            <button className={btnPrimary} onClick={saveTimer}>Guardar {Math.round(timer / 60)} min</button>
          )}
          <span className="text-xs text-[#5B6678] ml-auto">{formatMinutes(mins)} totales dedicados</span>
        </div>

        <div className="mt-3">
          <Field label="Programar próximo repaso">
            <input
              type="date" value={pg?.next_review_at ?? ''}
              onChange={e => onUpdateProgress(t.id, { next_review_at: e.target.value || null })}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="px-4 py-2 rounded-xl font-bold text-sm border cursor-pointer transition-colors"
            style={{
              background: activeTab === id ? '#0E7C86' : '#fff',
              color: activeTab === id ? '#fff' : '#1C2230',
              borderColor: activeTab === id ? '#0E7C86' : '#E3E8F2',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'lesson' && (
        <div className="flex flex-col gap-4">
          {lesson ? (
            <>
              <Card>
                <SectionTitle>Para qué sirve</SectionTitle>
                <p className="text-sm leading-relaxed mt-2">{lesson.purpose}</p>
              </Card>
              <Card style={{ background: 'rgba(14,124,134,.05)', borderColor: '#0E7C86' }}>
                <SectionTitle>Fórmula / Estructura</SectionTitle>
                <div className="font-mono text-sm font-bold text-[#0E7C86] mt-2 leading-relaxed">
                  {lesson.structure_formula?.split(' | ').map((f, i) => <div key={i}>{f}</div>)}
                </div>
              </Card>
              <Card>
                <SectionTitle>Cuándo usarlo</SectionTitle>
                <ul className="list-disc list-inside mt-2 flex flex-col gap-1.5">
                  {(lesson.when_to_use ?? []).map((w, i) => <li key={i} className="text-sm leading-relaxed">{w}</li>)}
                </ul>
              </Card>
              <Card>
                <SectionTitle>Ejemplos del curso</SectionTitle>
                <div className="flex flex-col gap-2 mt-2">
                  {(lesson.course_examples ?? []).map((e, i) => (
                    <div key={i} className="italic text-sm text-[#0E7C86] bg-[#F8FFFE] border border-[rgba(14,124,134,.2)] rounded-xl px-3 py-2">"{e}"</div>
                  ))}
                </div>
              </Card>
              <Card>
                <SectionTitle>Ejemplos aplicados a tu vida profesional</SectionTitle>
                <div className="flex flex-col gap-2 mt-2">
                  {(lesson.professional_examples ?? []).map((e, i) => (
                    <div key={i} className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">"{e}"</div>
                  ))}
                </div>
              </Card>
              <Card style={{ borderColor: '#FCA5A5' }}>
                <SectionTitle>⚠ Errores que debes evitar</SectionTitle>
                <ul className="list-disc list-inside mt-2 flex flex-col gap-1.5">
                  {(lesson.common_mistakes ?? []).map((e, i) => <li key={i} className="text-sm text-red-600 leading-relaxed">{e}</li>)}
                </ul>
              </Card>
              <Card style={{ borderColor: '#E8833A' }}>
                <SectionTitle>Prompt para Sesame</SectionTitle>
                <p className="text-sm italic leading-relaxed mt-2">{lesson.sesame_prompt}</p>
                <div className="flex gap-2 mt-3">
                  <button className={btnPrimary} onClick={() => { navigator.clipboard?.writeText(lesson.sesame_prompt!); onFlash('Prompt copiado'); }}>
                    Copiar prompt
                  </button>
                  <button className={btnGhost} onClick={() => onNewSession({ category: 'speaking', grammar_topic_id: t.id, title: `Sesame · ${t.title}` })}>
                    Crear sesión Sesame
                  </button>
                </div>
              </Card>
              <Card>
                <SectionTitle>Conexión con tu libro</SectionTitle>
                <p className="text-sm leading-relaxed mt-2">{lesson.reading_activity}</p>
                <button className={btnGhost + ' mt-3'} onClick={() => onNewSession({ category: 'reading', grammar_topic_id: t.id, title: `Lectura · ${t.title}` })}>
                  <BookOpen size={14} /> Registrar sesión de lectura
                </button>
              </Card>
            </>
          ) : (
            <Card><Empty>Esta lección aún no tiene contenido detallado. Usa la sección de Gramática para ver la descripción base.</Empty></Card>
          )}
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="flex flex-col gap-4">
          <Card>
            <SectionTitle>Mini práctica escrita</SectionTitle>
            <p className="text-sm text-[#5B6678] mt-1.5 mb-4">Responde estos ejercicios. Luego practica en voz alta con Sesame.</p>
            <div className="flex flex-col gap-3">
              {(lesson?.written_practice ?? []).map((p, i) => (
                <div key={i} className="border border-[#E3E8F2] rounded-xl p-3">
                  <div className="text-xs font-bold text-[#5B6678] mb-1">Ejercicio {i + 1}</div>
                  <div className="text-sm mb-2">{p}</div>
                  <textarea rows={2} className={inputClass} style={{ resize: 'vertical' }} placeholder="Escribe tu respuesta…" />
                </div>
              ))}
              {!lesson?.written_practice?.length && <Empty>Sin ejercicios disponibles todavía.</Empty>}
            </div>
          </Card>
          {lesson?.sesame_prompt && (
            <Card style={{ borderColor: '#E8833A' }}>
              <SectionTitle>Siguiente paso recomendado</SectionTitle>
              <p className="text-sm leading-relaxed mt-2">
                Después de los ejercicios escritos, practica <strong>{t.title}</strong> con Sesame. Objetivo: usar la estructura correctamente 3 veces seguidas sin ayuda.
              </p>
              <button className={btnPrimary + ' mt-3'} onClick={() => { navigator.clipboard?.writeText(lesson.sesame_prompt!); onFlash('Prompt copiado'); }}>
                Copiar prompt de Sesame
              </button>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="flex flex-col gap-4">
          <Card>
            <SectionTitle>Mis frases propias</SectionTitle>
            <p className="text-xs text-[#5B6678] mt-1 mb-3">Frases que has construido tú usando {t.title}.</p>
            {pg?.own_sentences && (
              <div className="flex flex-col gap-1.5 mb-3">
                {pg.own_sentences.split('\n').filter(Boolean).map((s, i) => (
                  <div key={i} className="italic text-sm text-[#0E7C86] bg-[#F8FFFE] border border-[rgba(14,124,134,.2)] rounded-xl px-3 py-2">"{s}"</div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input value={ownPhrase} onChange={e => setOwnPhrase(e.target.value)} onKeyDown={e => e.key === 'Enter' && addOwnPhrase()} className={inputClass} placeholder="Escribe una frase propia…" />
              <button className={btnPrimary} onClick={addOwnPhrase}><Plus size={14} /></button>
            </div>
          </Card>
          <Card>
            <SectionTitle>Mis dudas</SectionTitle>
            <p className="text-xs text-[#5B6678] mt-1 mb-3">Anota lo que no entiendes del todo. Tráelo a clase o a Sesame.</p>
            {pg?.doubts && (
              <div className="flex flex-col gap-1.5 mb-3">
                {pg.doubts.split('\n').filter(Boolean).map((d, i) => (
                  <div key={i} className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{d}</div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input value={doubt} onChange={e => setDoubt(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDoubt()} className={inputClass} placeholder="¿Qué no te queda claro?" />
              <button className={btnGhost} onClick={addDoubt}><Plus size={14} /></button>
            </div>
          </Card>
          <Card>
            <SectionTitle>Notas generales</SectionTitle>
            <textarea
              rows={4}
              className={inputClass + ' mt-2'}
              style={{ resize: 'vertical' }}
              value={pg?.notes ?? ''}
              onChange={e => onUpdateProgress(t.id, { notes: e.target.value })}
              placeholder="Lo que aprendes, correcciones de Sesame, cosas del libro…"
            />
          </Card>
        </div>
      )}
    </div>
  );
}
