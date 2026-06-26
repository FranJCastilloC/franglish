import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, BookOpen } from 'lucide-react';
import { Card, PageHeader, Empty, Field, Badge, RatingButtons, StatCard, inputClass, btnPrimary, btnGhost, btnDanger, btnIcon } from '../components/ui';
import { CATEGORY_CONFIG } from '../lib/constants';
import { todayLocal, formatMinutes } from '../lib/date';
import type { ReadingLog } from '../types/database';

interface Props {
  userId: string;
  logs: ReadingLog[];
  onCreate: (l: Omit<ReadingLog, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, patch: Partial<ReadingLog>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onFlash: (m: string) => void;
}

function blank(userId: string): Omit<ReadingLog, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId, reading_date: todayLocal(), book_title: '', chapter_or_pages: '',
    duration_minutes: 20, new_vocabulary: '', interesting_phrases: '',
    grammar_spotted: '', short_summary: '', comprehension_level: 0, completed: true,
  };
}

const Note = ({ label, text, color }: { label: string; text: string; color: string }) => (
  <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>
    <div className="text-[11px] font-extrabold uppercase tracking-wide mb-0.5" style={{ color }}>{label}</div>
    <div className="text-sm leading-relaxed whitespace-pre-line">{text}</div>
  </div>
);

export function ReadingPage({ userId, logs, onCreate, onUpdate, onDelete, onFlash }: Props) {
  const [editing, setEditing] = useState<(Omit<ReadingLog, 'id' | 'created_at' | 'updated_at'> & { id?: string }) | null>(null);

  const totalMin = logs.filter(l => l.completed).reduce((a, l) => a + l.duration_minutes, 0);

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

  const setL = (patch: Record<string, unknown>) => setEditing(x => x && { ...x, ...patch } as typeof x);

  return (
    <div>
      <PageHeader title="Lectura del libro" sub="Registra tu lectura para exposición natural, vocabulario en contexto y caza de estructuras." />

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
        <StatCard label="Sesiones de lectura" value={String(logs.length)} icon={<BookOpen size={18} color={CATEGORY_CONFIG.reading.color} />} bg="rgba(99,102,241,.12)" />
        <StatCard label="Tiempo total" value={formatMinutes(totalMin)} icon={<BookOpen size={18} color={CATEGORY_CONFIG.reading.color} />} bg="rgba(99,102,241,.12)" />
        <Card>
          <div className="text-xs font-semibold text-[#5B6678] mb-2">Caza de estructuras</div>
          <div className="text-xs leading-relaxed">Mientras lees, marca la estructura gramatical de la semana. ¿Estudias Present Perfect? Subraya cada <em>have/has + participio</em> que aparezca.</div>
        </Card>
      </div>

      <div className="flex justify-end mb-3">
        <button className={btnPrimary} onClick={() => setEditing(blank(userId))}><Plus size={14} /> Nueva sesión</button>
      </div>

      <div className="flex flex-col gap-3">
        {logs.length === 0 && <Card><Empty>Aún no registras sesiones de lectura.</Empty></Card>}
        {logs.map(l => (
          <Card key={l.id}>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge color="#fff" bg={CATEGORY_CONFIG.reading.color}>Lectura</Badge>
              <span className="font-bold text-sm">{l.book_title || 'Libro'}</span>
              <span className="text-xs text-[#5B6678]">· {l.reading_date} · {l.chapter_or_pages || ''} · {formatMinutes(l.duration_minutes)}</span>
              {l.comprehension_level > 0 && (
                <span className="ml-auto text-xs text-[#5B6678]">Comprensión {l.comprehension_level}/5</span>
              )}
              <button onClick={() => setEditing({ ...l })} className={btnIcon}><Pencil size={13} /></button>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
              {l.new_vocabulary && <Note label="Vocabulario nuevo" text={l.new_vocabulary} color="#16A34A" />}
              {l.interesting_phrases && <Note label="Frases interesantes" text={l.interesting_phrases} color="#0E7C86" />}
              {l.grammar_spotted && <Note label="Gramática detectada" text={l.grammar_spotted} color="#E8833A" />}
              {l.short_summary && <Note label="Resumen (inglés)" text={l.short_summary} color="#1C2230" />}
            </div>
          </Card>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(17,22,33,.45)' }} onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg my-6" onClick={ev => ev.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E8F2]">
              <div className="font-extrabold text-[17px]">{editing.id ? 'Editar sesión' : 'Nueva sesión de lectura'}</div>
              <button onClick={() => setEditing(null)} className={btnIcon}><X size={18} /></button>
            </div>
            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha"><input type="date" value={editing.reading_date} onChange={e => setL({ reading_date: e.target.value })} className={inputClass} /></Field>
                <Field label="Duración (min)"><input type="number" min={5} step={5} value={editing.duration_minutes} onChange={e => setL({ duration_minutes: +e.target.value })} className={inputClass} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Libro"><input value={editing.book_title} onChange={e => setL({ book_title: e.target.value })} className={inputClass} placeholder="Título del libro" /></Field>
                <Field label="Capítulo / páginas"><input value={editing.chapter_or_pages} onChange={e => setL({ chapter_or_pages: e.target.value })} className={inputClass} placeholder="Ej. Cap. 3 / p. 45-52" /></Field>
              </div>
              <Field label="Vocabulario nuevo"><textarea rows={2} value={editing.new_vocabulary} onChange={e => setL({ new_vocabulary: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <Field label="Frases interesantes"><textarea rows={2} value={editing.interesting_phrases} onChange={e => setL({ interesting_phrases: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <Field label="Gramática detectada en el texto"><textarea rows={2} value={editing.grammar_spotted} onChange={e => setL({ grammar_spotted: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <Field label="Resumen corto en inglés"><textarea rows={3} value={editing.short_summary} onChange={e => setL({ short_summary: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} /></Field>
              <Field label="Comprensión (1-5)"><RatingButtons value={editing.comprehension_level} onChange={v => setL({ comprehension_level: v })} /></Field>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.completed} onChange={e => setL({ completed: e.target.checked })} />
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
