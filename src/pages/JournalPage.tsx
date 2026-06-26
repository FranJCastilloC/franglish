import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { Card, PageHeader, Empty, Field, Badge, RatingButtons, inputClass, btnPrimary, btnGhost, btnDanger, btnIcon } from '../components/ui';
import { CATEGORY_CONFIG, CATEGORIES } from '../lib/constants';
import { todayLocal } from '../lib/date';
import type { JournalEntry, GrammarTopic, Category } from '../types/database';

interface Props {
  userId: string;
  entries: JournalEntry[];
  topics: GrammarTopic[];
  onCreate: (e: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, patch: Partial<JournalEntry>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onFlash: (m: string) => void;
}

function blank(userId: string): Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId, study_session_id: null, grammar_topic_id: null, module_id: null,
    entry_date: todayLocal(), category: 'grammar', title: '',
    what_went_well: '', what_was_difficult: '', new_phrases: '',
    common_errors: '', pending_questions: '', confidence_level: 0, next_step: '',
  };
}

const Note = ({ label, text, color }: { label: string; text: string; color: string }) => (
  <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>
    <div className="text-[11px] font-extrabold uppercase tracking-wide mb-0.5" style={{ color }}>{label}</div>
    <div className="text-sm leading-relaxed whitespace-pre-line">{text}</div>
  </div>
);

export function JournalPage({ userId, entries, topics, onCreate, onUpdate, onDelete, onFlash }: Props) {
  const [editing, setEditing] = useState<(Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'> & { id?: string }) | null>(null);
  const [filterCat, setFilterCat] = useState('all');
  const [filterConf, setFilterConf] = useState('all');

  const filtered = entries.filter(e =>
    (filterCat === 'all' || e.category === filterCat) &&
    (filterConf === 'all' || e.confidence_level === +filterConf),
  );

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        const { id, ...patch } = editing;
        await onUpdate(id, patch);
      } else {
        await onCreate(editing);
      }
      onFlash(editing.id ? 'Entrada actualizada' : 'Entrada guardada');
      setEditing(null);
    } catch { onFlash('Error al guardar'); }
  };

  const setE = (patch: Record<string, unknown>) => setEditing(x => x && { ...x, ...patch } as typeof x);

  return (
    <div>
      <PageHeader title="Journal de estudio" sub="Registra qué entendiste, qué te costó, frases nuevas y tu nivel de confianza." />

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className={inputClass + ' w-auto'}>
            <option value="all">Todas las categorías</option>
            {CATEGORIES.map(k => <option key={k} value={k}>{CATEGORY_CONFIG[k].label}</option>)}
          </select>
          <select value={filterConf} onChange={e => setFilterConf(e.target.value)} className={inputClass + ' w-auto'}>
            <option value="all">Toda confianza</option>
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Confianza {n}</option>)}
          </select>
        </div>
        <button className={btnPrimary} onClick={() => setEditing(blank(userId))}>
          <Plus size={14} /> Nueva entrada
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && <Card><Empty>Aún no hay entradas. Crea una nueva o añade reflexiones al registrar una sesión.</Empty></Card>}
        {filtered.map(e => (
          <Card key={e.id}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge color="#fff" bg={CATEGORY_CONFIG[e.category]?.color}>{CATEGORY_CONFIG[e.category]?.label}</Badge>
              <span className="text-xs text-[#5B6678]">{e.entry_date}</span>
              {e.title && <span className="font-bold text-sm">· {e.title}</span>}
              {e.confidence_level > 0 && (
                <span className="ml-auto text-xs text-[#5B6678]">
                  Confianza {'★'.repeat(e.confidence_level)}{'☆'.repeat(5 - e.confidence_level)}
                </span>
              )}
              <button onClick={() => setEditing({ ...e })} className={btnIcon}><Pencil size={13} /></button>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
              {e.what_went_well && <Note label="Entendí bien" text={e.what_went_well} color="#16A34A" />}
              {e.what_was_difficult && <Note label="Me costó" text={e.what_was_difficult} color="#DC2626" />}
              {e.new_phrases && <Note label="Frases nuevas" text={e.new_phrases} color="#0E7C86" />}
              {e.common_errors && <Note label="Errores frecuentes" text={e.common_errors} color="#E8833A" />}
              {e.pending_questions && <Note label="Dudas pendientes" text={e.pending_questions} color="#2563EB" />}
              {e.next_step && <Note label="Próximo paso" text={e.next_step} color="#1C2230" />}
            </div>
          </Card>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(17,22,33,.45)' }} onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg my-6" onClick={ev => ev.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E8F2]">
              <div className="font-extrabold text-[17px]">{editing.id ? 'Editar entrada' : 'Nueva entrada de journal'}</div>
              <button onClick={() => setEditing(null)} className={btnIcon}><X size={18} /></button>
            </div>
            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha"><input type="date" value={editing.entry_date} onChange={e => setE({ entry_date: e.target.value })} className={inputClass} /></Field>
                <Field label="Categoría">
                  <select value={editing.category} onChange={e => setE({ category: e.target.value as Category })} className={inputClass}>
                    {CATEGORIES.map(k => <option key={k} value={k}>{CATEGORY_CONFIG[k].label}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Título (opcional)"><input value={editing.title} onChange={e => setE({ title: e.target.value })} className={inputClass} placeholder="Ej. Present Perfect con Sesame" /></Field>
              <Field label="Tema gramatical (opcional)">
                <select value={editing.grammar_topic_id ?? ''} onChange={e => setE({ grammar_topic_id: e.target.value || null })} className={inputClass}>
                  <option value="">— Sin tema —</option>
                  {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </Field>
              <Field label="Qué entendí bien"><textarea rows={2} value={editing.what_went_well} onChange={e => setE({ what_went_well: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <Field label="Qué me costó"><textarea rows={2} value={editing.what_was_difficult} onChange={e => setE({ what_was_difficult: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <Field label="Frases nuevas aprendidas"><textarea rows={2} value={editing.new_phrases} onChange={e => setE({ new_phrases: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <Field label="Errores frecuentes"><input value={editing.common_errors} onChange={e => setE({ common_errors: e.target.value })} className={inputClass} /></Field>
              <Field label="Dudas pendientes"><input value={editing.pending_questions} onChange={e => setE({ pending_questions: e.target.value })} className={inputClass} /></Field>
              <Field label="Próximo paso"><input value={editing.next_step} onChange={e => setE({ next_step: e.target.value })} className={inputClass} /></Field>
              <Field label="Confianza (1-5)"><RatingButtons value={editing.confidence_level} onChange={v => setE({ confidence_level: v })} /></Field>
            </div>
            <div className="flex justify-between px-5 py-3 border-t border-[#E3E8F2]">
              {editing.id ? (
                <button className={btnDanger} onClick={async () => { await onDelete(editing.id!); setEditing(null); onFlash('Entrada eliminada'); }}>
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
