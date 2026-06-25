import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { Card, SectionTitle, PageHeader, Empty, Field, Badge, RatingButtons, inputClass, btnPrimary, btnGhost, btnDanger, btnIcon } from '../components/ui';
import { todayLocal, formatMinutes } from '../lib/date';
import { CATEGORY_CONFIG } from '../lib/constants';
import type { SesameSession, GrammarTopic } from '../types/database';

interface Props {
  userId: string;
  sessions: SesameSession[];
  topics: GrammarTopic[];
  onCreate: (s: Omit<SesameSession, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, patch: Partial<SesameSession>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onFlash: (m: string) => void;
}

function blank(userId: string): Omit<SesameSession, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId, grammar_topic_id: null, session_date: todayLocal(),
    duration_minutes: 20, topic_practiced: '', grammar_target: '',
    vocabulary_target: '', prompt_used: '', good_phrases: '', errors_made: '',
    corrections: '', fluency_level: 0, confidence_level: 0, completed: true,
  };
}

const Note = ({ label, text, color }: { label: string; text: string; color: string }) => (
  <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>
    <div className="text-[11px] font-extrabold uppercase tracking-wide mb-0.5" style={{ color }}>{label}</div>
    <div className="text-sm leading-relaxed whitespace-pre-line">{text}</div>
  </div>
);

export function SesamePage({ userId, sessions, topics, onCreate, onUpdate, onDelete, onFlash }: Props) {
  const [editing, setEditing] = useState<(Omit<SesameSession, 'id' | 'created_at' | 'updated_at'> & { id?: string }) | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        const { id, ...patch } = editing;
        await onUpdate(id, patch);
      } else {
        await onCreate(editing);
      }
      onFlash(editing.id ? 'Sesión actualizada' : 'Sesión guardada');
      setEditing(null);
    } catch { onFlash('Error al guardar'); }
  };

  const setS = (patch: Record<string, unknown>) => setEditing(x => x && { ...x, ...patch } as typeof x);

  // Prompt library from topics with lessons
  const promptTopics = topics.filter(t => t.lesson?.sesame_prompt).slice(0, 12);

  return (
    <div>
      <PageHeader title="Práctica con Sesame" sub="Planifica y registra tus sesiones de conversación. Cada tema tiene un prompt listo." />

      {/* Prompt library */}
      <Card className="mb-4">
        <SectionTitle>Prompts por tema gramatical</SectionTitle>
        <p className="text-sm text-[#5B6678] mt-1.5 mb-3">Elige un tema, copia el prompt y úsalo en Sesame. Practica la estructura dentro de las 48h de haberla estudiado.</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
          {promptTopics.map(t => (
            <div key={t.id} className="border border-[#E3E8F2] rounded-xl p-3">
              <div className="font-bold text-sm mb-1">{t.title}</div>
              <div className="text-xs text-[#5B6678] leading-relaxed mb-2.5">{t.lesson!.sesame_prompt!.slice(0, 120)}…</div>
              <div className="flex gap-1.5 flex-wrap">
                <button className={btnGhost + ' text-xs py-1.5'} onClick={() => { navigator.clipboard?.writeText(t.lesson!.sesame_prompt!); onFlash('Prompt copiado'); }}>Copiar</button>
                <button className={btnPrimary + ' text-xs py-1.5'} onClick={() => setEditing({ ...blank(userId), grammar_topic_id: t.id, topic_practiced: t.title, prompt_used: t.lesson!.sesame_prompt! })}>Registrar</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sessions list */}
      <div className="flex items-center justify-between mb-3">
        <SectionTitle>Mis sesiones de speaking</SectionTitle>
        <button className={btnPrimary} onClick={() => setEditing(blank(userId))}><Plus size={14} /> Nueva sesión</button>
      </div>
      <div className="flex flex-col gap-3">
        {sessions.length === 0 && <Card><Empty>Aún no registras sesiones de Sesame.</Empty></Card>}
        {sessions.map(s => (
          <Card key={s.id}>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge color="#fff" bg={CATEGORY_CONFIG.speaking.color}>Speaking</Badge>
              <span className="font-bold text-sm">{s.topic_practiced || 'Sesame'}</span>
              <span className="text-xs text-[#5B6678]">· {s.session_date} · {formatMinutes(s.duration_minutes)}</span>
              <span className="ml-auto text-xs text-[#5B6678]">
                Fluidez {s.fluency_level || '–'}/5 · Confianza {s.confidence_level || '–'}/5
              </span>
              <button onClick={() => setEditing({ ...s })} className={btnIcon}><Pencil size={13} /></button>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
              {s.grammar_target && <Note label="Gramática objetivo" text={s.grammar_target} color="#0E7C86" />}
              {s.good_phrases && <Note label="Frases que usé bien" text={s.good_phrases} color="#16A34A" />}
              {s.errors_made && <Note label="Errores" text={s.errors_made} color="#DC2626" />}
              {s.corrections && <Note label="Correcciones" text={s.corrections} color="#E8833A" />}
            </div>
          </Card>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(17,22,33,.45)' }} onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg my-6" onClick={ev => ev.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E8F2]">
              <div className="font-extrabold text-[17px]">{editing.id ? 'Editar sesión Sesame' : 'Nueva sesión Sesame'}</div>
              <button onClick={() => setEditing(null)} className={btnIcon}><X size={18} /></button>
            </div>
            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha"><input type="date" value={editing.session_date} onChange={e => setS({ session_date: e.target.value })} className={inputClass} /></Field>
                <Field label="Duración (min)"><input type="number" min={5} step={5} value={editing.duration_minutes} onChange={e => setS({ duration_minutes: +e.target.value })} className={inputClass} /></Field>
              </div>
              <Field label="Tema practicado"><input value={editing.topic_practiced} onChange={e => setS({ topic_practiced: e.target.value })} className={inputClass} placeholder="Ej. Present Perfect" /></Field>
              <Field label="Tema gramatical (opcional)">
                <select value={editing.grammar_topic_id ?? ''} onChange={e => setS({ grammar_topic_id: e.target.value || null })} className={inputClass}>
                  <option value="">— Sin tema —</option>
                  {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </Field>
              <Field label="Gramática objetivo"><input value={editing.grammar_target} onChange={e => setS({ grammar_target: e.target.value })} className={inputClass} /></Field>
              <Field label="Prompt usado"><textarea rows={2} value={editing.prompt_used} onChange={e => setS({ prompt_used: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <Field label="Frases que usé bien"><textarea rows={2} value={editing.good_phrases} onChange={e => setS({ good_phrases: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <Field label="Errores cometidos"><textarea rows={2} value={editing.errors_made} onChange={e => setS({ errors_made: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <Field label="Correcciones"><textarea rows={2} value={editing.corrections} onChange={e => setS({ corrections: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fluidez (1-5)"><RatingButtons value={editing.fluency_level} onChange={v => setS({ fluency_level: v })} /></Field>
                <Field label="Confianza (1-5)"><RatingButtons value={editing.confidence_level} onChange={v => setS({ confidence_level: v })} /></Field>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.completed} onChange={e => setS({ completed: e.target.checked })} />
                Completada (cuenta para la racha)
              </label>
            </div>
            <div className="flex justify-between px-5 py-3 border-t border-[#E3E8F2]">
              {editing.id ? (
                <button className={btnDanger} onClick={async () => { await onDelete(editing.id!); setEditing(null); onFlash('Sesión eliminada'); }}>
                  <Trash2 size={14} /> Eliminar
                </button>
              ) : <div />}
              <div className="flex gap-2">
                <button className={btnGhost} onClick={() => setEditing(null)}>Cancelar</button>
                <button className={btnPrimary} onClick={handleSave}><Check size={15} /> Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
