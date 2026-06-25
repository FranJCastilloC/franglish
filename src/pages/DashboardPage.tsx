import { useMemo } from 'react';
import { Clock, Flame, Check, ChevronRight, Plus } from 'lucide-react';
import {
  Card, Ring, ProgressBar, StatCard, SectionTitle, Badge, PageHeader, Empty, btnPrimary, btnGhost
} from '../components/ui';
import { CATEGORY_CONFIG, CATEGORIES, STATUS_CONFIG, statusById } from '../lib/constants';
import { calculateStudyStreak } from '../lib/streak';
import { formatMinutes, todayLocal } from '../lib/date';
import type { StudySession, GrammarTopic, GrammarPhase } from '../types/database';

interface Props {
  userId: string;
  sessions: StudySession[];
  topics: GrammarTopic[];
  phases: GrammarPhase[];
  onNewSession: () => void;
  onTabChange: (t: string) => void;
}

export function DashboardPage({ sessions, topics, phases, onNewSession, onTabChange }: Props) {
  const today = todayLocal();
  const completed = useMemo(() => sessions.filter(s => s.completed && s.session_date <= today), [sessions, today]);

  const streak = useMemo(
    () => calculateStudyStreak(completed.map(s => s.session_date)),
    [completed],
  );

  const totalMin = useMemo(() => completed.reduce((a, s) => a + s.duration_minutes, 0), [completed]);

  const minutesByCat = useMemo(() => {
    const o: Record<string, number> = {};
    CATEGORIES.forEach(k => (o[k] = 0));
    completed.forEach(s => { o[s.category] = (o[s.category] ?? 0) + s.duration_minutes; });
    return o;
  }, [completed]);

  const grammarPct = useMemo(() => {
    if (!topics.length) return 0;
    const total = topics.reduce((a, t) => a + (statusById(t.progress?.status ?? 'no_iniciado').weight), 0);
    return Math.round((total / topics.length) * 100);
  }, [topics]);

  const overallPct = grammarPct;

  const phasePct = (phaseId: string) => {
    const ts = topics.filter(t => t.phase_id === phaseId);
    if (!ts.length) return 0;
    return Math.round((ts.reduce((a, t) => a + statusById(t.progress?.status ?? 'no_iniciado').weight, 0) / ts.length) * 100);
  };

  const upcoming = useMemo(
    () => sessions.filter(s => !s.completed && s.session_date >= today)
      .sort((a, b) => a.session_date.localeCompare(b.session_date))
      .slice(0, 5),
    [sessions, today],
  );

  const nextTopics = useMemo(() =>
    topics
      .filter(t => (t.progress?.status ?? 'no_iniciado') !== 'dominado')
      .sort((a, b) => a.priority - b.priority || (
        statusById(a.progress?.status ?? 'no_iniciado').weight -
        statusById(b.progress?.status ?? 'no_iniciado').weight
      ))
      .slice(0, 5),
    [topics],
  );

  const catKeys = CATEGORIES.filter(k => minutesByCat[k] > 0).sort((a, b) => minutesByCat[b] - minutesByCat[a]);
  const maxCat = Math.max(...catKeys.map(k => minutesByCat[k]), 1);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Hola, Francisco 👋" sub="Tu panel de estudio del curso Senior. Sin saturarte." />

      {/* Top stats */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))' }}>
        <Card>
          <div className="flex items-center gap-4">
            <Ring pct={overallPct} />
            <div>
              <div className="text-xs font-semibold text-[#5B6678]">Avance general</div>
              <div className="text-3xl font-extrabold tracking-tight leading-none">{overallPct}%</div>
              <div className="text-xs font-bold text-[#0E7C86] mt-1">Gramática {grammarPct}%</div>
            </div>
          </div>
        </Card>
        <StatCard label="Horas estudiadas" value={formatMinutes(totalMin)} icon={<Clock size={18} color="#0E7C86" />} bg="rgba(14,124,134,.10)" />
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,131,58,.12)' }}>
              <Flame size={18} color="#E8833A" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#5B6678]">Racha actual</div>
              <div className="text-2xl font-extrabold leading-tight">{streak} días</div>
              <div className="text-[11px] text-[#5B6678] mt-0.5">Días consecutivos con ≥1 sesión completada</div>
            </div>
          </div>
        </Card>
        <StatCard label="Sesiones completadas" value={String(completed.length)} icon={<Check size={18} color="#16A34A" />} bg="rgba(22,163,74,.10)" />
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
        {/* Hours by category */}
        <Card>
          <SectionTitle>Horas por categoría</SectionTitle>
          <div className="flex flex-col gap-2 mt-3">
            {catKeys.length === 0 && <Empty>Registra tu primera sesión para ver el desglose.</Empty>}
            {catKeys.map(k => (
              <div key={k} className="flex items-center gap-2">
                <div className="w-24 text-xs text-[#5B6678] shrink-0">{CATEGORY_CONFIG[k].label}</div>
                <div className="flex-1">
                  <ProgressBar pct={(minutesByCat[k] / maxCat) * 100} color={CATEGORY_CONFIG[k].color} />
                </div>
                <div className="w-14 text-right text-xs font-bold">{formatMinutes(minutesByCat[k])}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Next to study */}
        <Card>
          <div className="flex items-center justify-between">
            <SectionTitle>Qué estudiar primero</SectionTitle>
            <button onClick={() => onTabChange('grammar')} className={btnGhost + ' text-xs py-1.5'}>
              Ver gramática <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {nextTopics.map(t => {
              const st = statusById(t.progress?.status ?? 'no_iniciado');
              return (
                <div key={t.id} className="flex items-center gap-2 px-2.5 py-2 border border-[#E3E8F2] rounded-xl">
                  <Badge color="#fff" bg={t.priority === 1 ? '#DC2626' : t.priority === 2 ? '#D97706' : '#2563EB'}>P{t.priority}</Badge>
                  <div className="flex-1 text-sm font-semibold">{t.title}</div>
                  <Badge color={st.color} bg={st.color + '22'}>{st.label}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Phase progress */}
      <Card>
        <SectionTitle>Avance por fase gramatical</SectionTitle>
        <div className="flex flex-col gap-3 mt-3">
          {phases.map(p => (
            <div key={p.id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold">Fase {p.phase_number} · {p.name}</span>
                <span className="text-[#5B6678]">{phasePct(p.id)}%</span>
              </div>
              <ProgressBar pct={phasePct(p.id)} />
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming sessions */}
      <Card>
        <div className="flex items-center justify-between">
          <SectionTitle>Próximas sesiones planificadas</SectionTitle>
          <button onClick={onNewSession} className={btnPrimary + ' text-xs py-1.5'}>
            <Plus size={14} /> Registrar sesión
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          {upcoming.length === 0 && <Empty>No tienes sesiones futuras. Planifica algunas en el calendario.</Empty>}
          {upcoming.map(s => (
            <div key={s.id} className="flex items-center gap-3 px-2.5 py-2 border border-[#E3E8F2] rounded-xl">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: CATEGORY_CONFIG[s.category]?.color }} />
              <div className="flex-1 text-sm font-semibold">{s.title || CATEGORY_CONFIG[s.category]?.label}</div>
              <div className="text-xs text-[#5B6678]">{s.session_date} · {formatMinutes(s.duration_minutes)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
