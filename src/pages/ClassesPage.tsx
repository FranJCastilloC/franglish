import { useState, useMemo } from 'react';
import {
  ChevronRight, ArrowLeft, Target, BookText, MessageSquareQuote,
  Dumbbell, Trophy, Check, Plus, Search, GraduationCap, BookOpen,
} from 'lucide-react';
import {
  Card, Badge, ProgressBar, PageHeader, Empty, Field,
  inputClass, btnPrimary, btnGhost, RatingButtons,
} from '../components/ui';
import { STATUS_CONFIG, statusById } from '../lib/constants';
import { todayLocal } from '../lib/date';
import type { CourseClass, TopicStatus } from '../types/database';

interface Props {
  classes: CourseClass[];
  onUpdateProgress: (classId: string, patch: Record<string, unknown>) => void;
  onNewSession: (over?: Record<string, unknown>) => void;
  onFlash: (m: string) => void;
}

const MODULE_OF = (n: number) =>
  n <= 5 ? 1 : n <= 10 ? 2 : n <= 15 ? 3 : n <= 20 ? 4 : 5;

const MODULE_COLOR: Record<number, string> = {
  1: '#0E7C86', 2: '#6366F1', 3: '#E8833A', 4: '#8B5CF6', 5: '#16A34A',
};

/* ────────────────────────────────────────────────────────── */

export function ClassesPage({ classes, onUpdateProgress, onNewSession, onFlash }: Props) {
  const [selected, setSelected] = useState<CourseClass | null>(null);
  const [fModule, setFModule] = useState('all');
  const [fStatus, setFStatus] = useState('all');
  const [search, setSearch] = useState('');

  if (selected) {
    const fresh = classes.find(c => c.id === selected.id) ?? selected;
    return (
      <ClassDetail
        cls={fresh}
        onBack={() => setSelected(null)}
        onUpdateProgress={onUpdateProgress}
        onNewSession={onNewSession}
        onFlash={onFlash}
      />
    );
  }

  const filtered = classes.filter(c => {
    if (fModule !== 'all' && String(MODULE_OF(c.class_number)) !== fModule) return false;
    const st = c.progress?.status ?? 'no_iniciado';
    if (fStatus !== 'all' && st !== fStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      const hit = c.title.toLowerCase().includes(q)
        || c.goal.toLowerCase().includes(q)
        || (c.grammar_focus ?? []).some(g => g.toLowerCase().includes(q))
        || (c.vocabulary ?? []).some(v => v.term.toLowerCase().includes(q));
      if (!hit) return false;
    }
    return true;
  });

  const done = classes.filter(c => {
    const s = c.progress?.status;
    return s === 'estudiado' || s === 'practicado' || s === 'dominado';
  }).length;
  const challenges = classes.filter(c => c.progress?.challenge_done).length;
  const pct = classes.length ? Math.round((done / classes.length) * 100) : 0;
  const next = classes.find(c => (c.progress?.status ?? 'no_iniciado') === 'no_iniciado');

  return (
    <div>
      <PageHeader
        title="Clases del curso"
        sub="Las 24 clases en vivo del nivel Senior, con su objetivo, gramática, vocabulario, ejercicios y reto."
      />

      {/* Stats */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))' }}>
        <Card className="!p-3.5">
          <div className="text-xs font-semibold text-[#5B6678]">Clases estudiadas</div>
          <div className="text-2xl font-extrabold">
            {done}<span className="text-sm text-[#5B6678]">/{classes.length}</span>
          </div>
          <div className="mt-2"><ProgressBar pct={pct} /></div>
        </Card>
        <Card className="!p-3.5">
          <div className="text-xs font-semibold text-[#5B6678]">Retos completados</div>
          <div className="text-2xl font-extrabold">
            {challenges}<span className="text-sm text-[#5B6678]">/{classes.length}</span>
          </div>
        </Card>
        <Card className="!p-3.5">
          <div className="text-xs font-semibold text-[#5B6678]">Siguiente clase</div>
          <div className="text-sm font-bold mt-1 leading-tight">
            {next ? `${next.class_number}. ${next.title}` : '¡Todas empezadas!'}
          </div>
          {next && (
            <button className={btnGhost + ' mt-2 !py-1 !px-2 !text-xs'} onClick={() => setSelected(next)}>
              Abrir <ChevronRight size={12} />
            </button>
          )}
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))' }}>
          <Field label="Buscar">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tema, gramática, vocabulario…"
                className={inputClass + ' !pl-8'}
              />
            </div>
          </Field>
          <Field label="Módulo">
            <select value={fModule} onChange={e => setFModule(e.target.value)} className={inputClass}>
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

      {/* List */}
      {filtered.length === 0 ? (
        <Card><Empty>No hay clases que coincidan con los filtros.</Empty></Card>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(c => {
            const mod = MODULE_OF(c.class_number);
            const st = statusById(c.progress?.status ?? 'no_iniciado');
            return (
              <Card
                key={c.id}
                onClick={() => setSelected(c)}
                className="hover:shadow-sm transition-shadow"
                style={{ borderLeft: `4px solid ${MODULE_COLOR[mod]}` }}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm text-white"
                    style={{ background: MODULE_COLOR[mod] }}
                  >
                    {c.class_number}
                  </div>
                  <div className="flex-1 min-w-40">
                    <div className="font-bold text-sm flex items-center gap-2 flex-wrap">
                      {c.title}
                      {c.progress?.challenge_done && (
                        <span title="Reto completado"><Trophy size={13} color="#E8833A" /></span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#5B6678] mt-0.5 line-clamp-1">{c.goal}</div>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {(c.grammar_focus ?? []).slice(0, 2).map((g, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F4F6FB] text-[#5B6678]">
                          {g.split(':')[0].slice(0, 34)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Badge color={st.color} bg={st.color + '1F'}>{st.label}</Badge>
                  <ChevronRight size={16} className="text-[#94A3B8]" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function Section({
  icon, title, children, accent,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="mb-3">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: (accent ?? '#0E7C86') + '1A', color: accent ?? '#0E7C86' }}
        >
          {icon}
        </div>
        <h2 className="text-[15px] font-extrabold tracking-tight">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function ClassDetail({
  cls, onBack, onUpdateProgress, onNewSession, onFlash,
}: {
  cls: CourseClass;
  onBack: () => void;
  onUpdateProgress: (classId: string, patch: Record<string, unknown>) => void;
  onNewSession: (over?: Record<string, unknown>) => void;
  onFlash: (m: string) => void;
}) {
  const [notes, setNotes] = useState(cls.progress?.notes ?? '');
  const mod = MODULE_OF(cls.class_number);
  const color = MODULE_COLOR[mod];
  const st = statusById(cls.progress?.status ?? 'no_iniciado');

  const saveNotes = () => {
    onUpdateProgress(cls.id, { notes });
    onFlash('Notas guardadas');
  };

  const vocab = useMemo(() => cls.vocabulary ?? [], [cls.vocabulary]);

  return (
    <div>
      <button className={btnGhost + ' mb-3'} onClick={onBack}>
        <ArrowLeft size={14} /> Volver a las clases
      </button>

      {/* Header */}
      <Card className="mb-3" style={{ borderLeft: `5px solid ${color}` }}>
        <div className="flex items-start gap-3 flex-wrap">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-white text-lg"
            style={{ background: color }}
          >
            {cls.class_number}
          </div>
          <div className="flex-1 min-w-48">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold tracking-tight">{cls.title}</h1>
              <Badge color={color} bg={color + '1F'}>Módulo {mod}</Badge>
            </div>
            <p className="text-sm text-[#5B6678] mt-1.5 leading-relaxed">{cls.goal}</p>
          </div>
        </div>

        {/* Status + actions */}
        <div className="flex items-center gap-2 mt-4 flex-wrap pt-3 border-t border-[#E3E8F2]">
          <select
            value={cls.progress?.status ?? 'no_iniciado'}
            onChange={e => onUpdateProgress(cls.id, {
              status: e.target.value as TopicStatus,
              attended_on: todayLocal(),
            })}
            className="border rounded-xl px-3 py-1.5 text-sm font-bold cursor-pointer"
            style={{ borderColor: st.color, color: st.color, background: '#fff' }}
          >
            {STATUS_CONFIG.map(s => (
              <option key={s.id} value={s.id} style={{ color: '#1C2230' }}>{s.label}</option>
            ))}
          </select>

          <button
            onClick={() => onUpdateProgress(cls.id, { challenge_done: !cls.progress?.challenge_done })}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors"
            style={{
              border: `1.5px solid ${cls.progress?.challenge_done ? '#E8833A' : '#E3E8F2'}`,
              background: cls.progress?.challenge_done ? '#E8833A' : '#fff',
              color: cls.progress?.challenge_done ? '#fff' : '#5B6678',
            }}
          >
            <Trophy size={14} />
            {cls.progress?.challenge_done ? 'Reto hecho' : 'Marcar reto'}
          </button>

          <button
            className={btnPrimary}
            onClick={() => onNewSession({
              category: 'class',
              title: `Clase ${cls.class_number} · ${cls.title}`,
              duration_minutes: 60,
            })}
          >
            <Plus size={14} /> Registrar sesión
          </button>
        </div>

        {/* Confidence */}
        <div className="mt-3">
          <div className="text-xs font-semibold text-[#5B6678] mb-1.5">
            ¿Qué tan seguro te sientes con esta clase?
          </div>
          <RatingButtons
            value={cls.progress?.confidence_level ?? 0}
            onChange={v => onUpdateProgress(cls.id, { confidence_level: v })}
          />
        </div>
      </Card>

      {/* Grammar focus */}
      {(cls.grammar_focus ?? []).length > 0 && (
        <Section icon={<GraduationCap size={15} />} title="Gramática de la clase" accent="#0E7C86">
          <ul className="flex flex-col gap-2">
            {cls.grammar_focus.map((g, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: '#0E7C86' }} />
                <span>{g}</span>
              </li>
            ))}
          </ul>
          {(cls.topics ?? []).length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-3 pt-3 border-t border-[#E3E8F2]">
              <span className="text-[11px] text-[#5B6678] font-semibold mr-1">Temas vinculados:</span>
              {cls.topics!.map(t => (
                <span key={t.id} className="text-[11px] px-2 py-0.5 rounded-full bg-[#F4F6FB] text-[#1C2230] font-semibold">
                  {t.title}
                </span>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Vocabulary */}
      {vocab.length > 0 && (
        <Section icon={<BookText size={15} />} title={`Vocabulario (${vocab.length})`} accent="#14B8A6">
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))' }}>
            {vocab.map((v, i) => (
              <div key={i} className="rounded-xl px-3 py-2" style={{ background: '#F4F6FB' }}>
                <div className="font-bold text-sm">{v.term}</div>
                <div className="text-xs text-[#5B6678] leading-snug mt-0.5">{v.definition}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Key phrases */}
      {(cls.key_phrases ?? []).length > 0 && (
        <Section icon={<MessageSquareQuote size={15} />} title="Frases clave" accent="#8B5CF6">
          <div className="flex flex-col gap-1.5">
            {cls.key_phrases.map((p, i) => (
              <div
                key={i}
                className="text-sm px-3 py-2 rounded-xl leading-relaxed"
                style={{ background: 'rgba(139,92,246,.07)', borderLeft: '3px solid #8B5CF6' }}
              >
                {p}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Exercises */}
      {(cls.exercises ?? []).length > 0 && (
        <Section icon={<Dumbbell size={15} />} title={`Ejercicios (${cls.exercises.length})`} accent="#E8833A">
          <div className="flex flex-col gap-3">
            {cls.exercises.map((ex, i) => (
              <div key={i} className="rounded-xl border border-[#E3E8F2] p-3">
                <div className="font-bold text-sm mb-1">{i + 1}. {ex.title}</div>
                <div className="text-xs text-[#5B6678] mb-2 leading-relaxed">{ex.instructions}</div>
                <ul className="flex flex-col gap-1.5">
                  {(ex.items ?? []).map((item, j) => (
                    <li key={j} className="flex gap-2 text-sm leading-relaxed">
                      <span className="text-[#E8833A] font-bold shrink-0">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Challenge */}
      {cls.challenge?.title && (
        <Card
          className="mb-3"
          style={{ background: 'rgba(232,131,58,.06)', borderColor: '#E8833A' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: '#E8833A', color: '#fff' }}
            >
              <Trophy size={15} />
            </div>
            <h2 className="text-[15px] font-extrabold tracking-tight">Reto: {cls.challenge.title}</h2>
          </div>

          {cls.challenge.scenario && (
            <p className="text-sm leading-relaxed mb-3">{cls.challenge.scenario}</p>
          )}

          {(cls.challenge.remember ?? []).length > 0 && (
            <>
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#E8833A] mb-1.5">
                Recuerda
              </div>
              <ul className="flex flex-col gap-1.5 mb-3">
                {cls.challenge.remember!.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed">
                    <Check size={14} className="mt-0.5 shrink-0" color="#E8833A" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {cls.challenge.example && (
            <div className="rounded-xl bg-white p-3 text-sm leading-relaxed border border-[#E3E8F2]">
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#5B6678] mb-1">
                Ejemplo
              </div>
              <div className="italic">{cls.challenge.example}</div>
            </div>
          )}

          <button
            onClick={() => {
              onUpdateProgress(cls.id, { challenge_done: !cls.progress?.challenge_done });
              onFlash(cls.progress?.challenge_done ? 'Reto desmarcado' : '¡Reto completado!');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold cursor-pointer mt-3 transition-colors"
            style={{
              border: `1.5px solid #E8833A`,
              background: cls.progress?.challenge_done ? '#E8833A' : '#fff',
              color: cls.progress?.challenge_done ? '#fff' : '#E8833A',
            }}
          >
            <Check size={14} />
            {cls.progress?.challenge_done ? 'Reto completado' : 'Marcar reto como hecho'}
          </button>
        </Card>
      )}

      {/* Reading */}
      {cls.reading && (
        <Section icon={<BookOpen size={15} />} title="Lectura de la clase" accent="#6366F1">
          <div className="text-sm leading-relaxed whitespace-pre-line">{cls.reading}</div>
        </Section>
      )}

      {/* Notes */}
      <Section icon={<Target size={15} />} title="Mis notas de esta clase" accent="#5B6678">
        <textarea
          rows={4}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className={inputClass}
          style={{ resize: 'vertical' }}
          placeholder="Qué me costó, frases que quiero recordar, dudas para el profesor…"
        />
        <button className={btnPrimary + ' mt-2'} onClick={saveNotes}>
          <Check size={14} /> Guardar notas
        </button>
      </Section>
    </div>
  );
}
