import { useState } from 'react';
import { X, Trash2, Check } from 'lucide-react';
import { inputClass, btnPrimary, btnGhost, btnDanger, Field, RatingButtons } from './ui';
import { CATEGORY_CONFIG, CATEGORIES } from '../lib/constants';
import { todayLocal } from '../lib/date';
import type { StudySession, GrammarTopic, Category } from '../types/database';

export type SessionDraft = Omit<StudySession, 'id' | 'created_at' | 'updated_at'>;

interface Props {
  initial?: Partial<SessionDraft>;
  topics: GrammarTopic[];
  userId: string;
  onSave: (s: SessionDraft) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}

function blank(userId: string, over: Partial<SessionDraft> = {}): SessionDraft {
  return {
    user_id: userId,
    grammar_topic_id: null,
    module_id: null,
    session_date: todayLocal(),
    category: 'grammar',
    title: '',
    duration_minutes: 30,
    completed: true,
    source: 'manual',
    learned: '',
    struggled: '',
    new_phrases: '',
    errors: '',
    questions: '',
    next_step: '',
    confidence_level: 0,
    ...over,
  };
}

export function SessionModal({ initial, topics, userId, onSave, onDelete, onClose }: Props) {
  const [s, setS] = useState<SessionDraft>(() => blank(userId, initial));
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<SessionDraft>) => setS(x => ({ ...x, ...patch }));

  const isSpeaking = s.category === 'speaking';
  const isReading = s.category === 'reading';

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(s); onClose(); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setSaving(true);
    try { await onDelete(); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(17,22,33,.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg my-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E8F2]">
          <div className="text-[17px] font-extrabold">{s.title || 'Sesión de estudio'}</div>
          <button onClick={onClose} className="p-1 text-[#5B6678] hover:text-[#1C2230]"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 max-h-[70vh] overflow-y-auto flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Fecha">
              <input type="date" value={s.session_date} onChange={e => set({ session_date: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Categoría">
              <select value={s.category} onChange={e => set({ category: e.target.value as Category })} className={inputClass}>
                {CATEGORIES.map(k => <option key={k} value={k}>{CATEGORY_CONFIG[k].label}</option>)}
              </select>
            </Field>
            <Field label="Duración (min)">
              <input type="number" min={5} step={5} value={s.duration_minutes} onChange={e => set({ duration_minutes: +e.target.value })} className={inputClass} />
            </Field>
          </div>

          <Field label="Título / descripción">
            <input value={s.title} onChange={e => set({ title: e.target.value })} className={inputClass} placeholder="Ej. Pasado simple — verbos irregulares" />
          </Field>

          <Field label="Tema del curso (opcional)">
            <select value={s.grammar_topic_id ?? ''} onChange={e => set({ grammar_topic_id: e.target.value || null })} className={inputClass}>
              <option value="">— Sin tema —</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </Field>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={s.completed} onChange={e => set({ completed: e.target.checked })} className="rounded" />
            Completada (cuenta para horas y racha)
          </label>

          {/* Speaking extra */}
          {isSpeaking && (
            <div className="pt-3 border-t border-dashed border-[#E3E8F2] flex flex-col gap-3">
              <div className="text-xs font-extrabold text-[#0E7C86] uppercase tracking-widest">Sesame · Speaking</div>
              <Field label="Gramática objetivo">
                <input value={(s as Record<string, unknown>).grammar_target as string || ''} onChange={e => set({ ...(s as Record<string, unknown>), grammar_target: e.target.value } as Partial<SessionDraft>)} className={inputClass} />
              </Field>
              <Field label="Frases que usé bien">
                <textarea rows={2} className={inputClass} style={{ resize: 'vertical' }} value={(s as Record<string, unknown>).new_phrases as string || ''} onChange={e => set({ new_phrases: e.target.value })} />
              </Field>
              <Field label="Errores cometidos">
                <textarea rows={2} className={inputClass} style={{ resize: 'vertical' }} value={s.errors} onChange={e => set({ errors: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Confianza (1-5)"><RatingButtons value={s.confidence_level} onChange={v => set({ confidence_level: v })} /></Field>
              </div>
            </div>
          )}

          {/* Reading extra */}
          {isReading && (
            <div className="pt-3 border-t border-dashed border-[#E3E8F2] flex flex-col gap-3">
              <div className="text-xs font-extrabold text-[#0E7C86] uppercase tracking-widest">Lectura</div>
              <Field label="Gramática detectada en el texto">
                <textarea rows={2} className={inputClass} style={{ resize: 'vertical' }} value={s.learned} onChange={e => set({ learned: e.target.value })} />
              </Field>
              <Field label="Vocabulario nuevo / frases interesantes">
                <textarea rows={2} className={inputClass} style={{ resize: 'vertical' }} value={s.new_phrases} onChange={e => set({ new_phrases: e.target.value })} />
              </Field>
            </div>
          )}

          {/* Reflection */}
          <div className="pt-3 border-t border-dashed border-[#E3E8F2] flex flex-col gap-3">
            <div className="text-xs font-extrabold text-[#0E7C86] uppercase tracking-widest">Reflexión</div>
            <Field label="Qué entendí bien">
              <textarea rows={2} value={s.learned} onChange={e => set({ learned: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} />
            </Field>
            <Field label="Qué me costó">
              <textarea rows={2} value={s.struggled} onChange={e => set({ struggled: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} />
            </Field>
            <Field label="Frases nuevas aprendidas">
              <textarea rows={2} value={s.new_phrases} onChange={e => set({ new_phrases: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} />
            </Field>
            <Field label="Errores frecuentes">
              <input value={s.errors} onChange={e => set({ errors: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Dudas pendientes">
              <input value={s.questions} onChange={e => set({ questions: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Próximo paso">
              <input value={s.next_step} onChange={e => set({ next_step: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Confianza (1-5)">
              <RatingButtons value={s.confidence_level} onChange={v => set({ confidence_level: v })} />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E3E8F2]">
          {onDelete ? (
            <button onClick={handleDelete} disabled={saving} className={btnDanger}>
              <Trash2 size={14} /> Eliminar
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className={btnGhost}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} className={btnPrimary}>
              <Check size={15} /> Guardar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
