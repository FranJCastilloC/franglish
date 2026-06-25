import { useState, useMemo } from 'react';
import { Plus, Check, Pencil, Trash2, X } from 'lucide-react';
import { Card, SectionTitle, PageHeader, Empty, Field, Badge, inputClass, btnPrimary, btnGhost, btnDanger, btnIcon } from '../components/ui';
import { CATEGORY_CONFIG, CATEGORIES } from '../lib/constants';
import { todayLocal, addDays, startOfWeek, formatMinutes } from '../lib/date';
import type { CalendarEvent, GrammarTopic, Category } from '../types/database';

interface Props {
  userId: string;
  events: CalendarEvent[];
  topics: GrammarTopic[];
  onCreate: (e: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, patch: Partial<CalendarEvent>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onFlash: (m: string) => void;
}

function blank(userId: string, date = todayLocal()): Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    grammar_topic_id: null,
    module_id: null,
    title: '',
    description: '',
    category: 'grammar',
    event_date: date,
    planned_duration_minutes: 30,
    completed: false,
    linked_study_session_id: null,
  };
}

export function CalendarPage({ userId, events, topics, onCreate, onUpdate, onDelete, onFlash }: Props) {
  const today = todayLocal();
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [editing, setEditing] = useState<Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'> & { id?: string } | null>(null);

  const first = new Date(cursor.y, cursor.m, 1);
  const startDow = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const monthName = first.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

  const byDate = useMemo(() => {
    const o: Record<string, CalendarEvent[]> = {};
    events.forEach(e => { (o[e.event_date] = o[e.event_date] ?? []).push(e); });
    return o;
  }, [events]);

  const weekMin = useMemo(() => {
    const start = startOfWeek(today);
    return events
      .filter(e => e.completed && e.event_date >= start && e.event_date <= addDays(start, 6))
      .reduce((a, e) => a + e.planned_duration_minutes, 0);
  }, [events, today]);

  const cells: (string | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title) { onFlash('El título es obligatorio'); return; }
    try {
      if (editing.id) {
        const { id, ...patch } = editing;
        await onUpdate(id, patch);
      } else {
        await onCreate(editing);
      }
      onFlash(editing.id ? 'Evento actualizado' : 'Evento creado');
      setEditing(null);
    } catch { onFlash('Error al guardar'); }
  };

  return (
    <div>
      <PageHeader title="Calendario" sub="Planifica sesiones, asígnales categoría y marca las completadas." />

      <Card>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button className={btnGhost + ' px-2.5 py-1.5'} onClick={() => setCursor(c => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 })}>‹</button>
            <div className="font-extrabold capitalize min-w-36 text-center">{monthName}</div>
            <button className={btnGhost + ' px-2.5 py-1.5'} onClick={() => setCursor(c => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 })}>›</button>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="#0E7C86" bg="rgba(14,124,134,.12)">Esta semana: {formatMinutes(weekMin)}</Badge>
            <button className={btnPrimary} onClick={() => setEditing(blank(userId))}><Plus size={14} /> Nuevo evento</button>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
            <div key={d} className="text-center text-[11px] font-bold text-[#5B6678] pb-1">{d}</div>
          ))}
          {cells.map((date, i) => {
            if (!date) return <div key={i} />;
            const list = byDate[date] ?? [];
            const isToday = date === today;
            const dayMin = list.filter(e => e.completed).reduce((a, e) => a + e.planned_duration_minutes, 0);
            return (
              <div
                key={date}
                className="min-h-20 rounded-xl p-1.5 border"
                style={{
                  border: `1px solid ${isToday ? '#0E7C86' : '#E3E8F2'}`,
                  background: isToday ? 'rgba(14,124,134,.05)' : '#fff',
                }}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setEditing(blank(userId, date))}
                    className="text-xs font-bold cursor-pointer border-0 bg-none p-0"
                    style={{ color: isToday ? '#0E7C86' : '#1C2230' }}
                  >
                    {+date.slice(8)}
                  </button>
                  {dayMin > 0 && <span className="text-[9px] text-[#5B6678]">{formatMinutes(dayMin)}</span>}
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  {list.slice(0, 3).map(ev => (
                    <div
                      key={ev.id}
                      onClick={() => setEditing({ ...ev })}
                      className="text-[10px] px-1 py-0.5 rounded cursor-pointer truncate text-white"
                      style={{ background: CATEGORY_CONFIG[ev.category]?.color, opacity: ev.completed ? 1 : 0.6 }}
                      title={ev.title}
                    >
                      {ev.completed ? '✓ ' : '○ '}{ev.title}
                    </div>
                  ))}
                  {list.length > 3 && <div className="text-[9px] text-[#5B6678]">+{list.length - 3} más</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Today's events */}
      <Card className="mt-4">
        <SectionTitle>Sesiones de hoy ({today})</SectionTitle>
        <div className="flex flex-col gap-2 mt-3">
          {(byDate[today] ?? []).length === 0 && <Empty>Sin eventos hoy. Haz clic en el número del día para añadir uno.</Empty>}
          {(byDate[today] ?? []).map(ev => (
            <div key={ev.id} className="flex items-center gap-3 px-2.5 py-2 border border-[#E3E8F2] rounded-xl">
              <button
                onClick={() => onUpdate(ev.id, { completed: !ev.completed })}
                className="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer"
                style={{ border: `1px solid ${ev.completed ? '#16A34A' : '#E3E8F2'}`, background: ev.completed ? '#16A34A' : '#fff' }}
              >
                {ev.completed && <Check size={14} color="#fff" />}
              </button>
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: CATEGORY_CONFIG[ev.category]?.color }} />
              <div className="flex-1 text-sm font-semibold">{ev.title}</div>
              <div className="text-xs text-[#5B6678]">{formatMinutes(ev.planned_duration_minutes)}</div>
              <button onClick={() => setEditing({ ...ev })} className={btnIcon}><Pencil size={13} /></button>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(17,22,33,.45)' }} onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md my-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E8F2]">
              <div className="font-extrabold text-[17px]">{editing.id ? 'Editar evento' : 'Nuevo evento'}</div>
              <button onClick={() => setEditing(null)} className={btnIcon}><X size={18} /></button>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              <Field label="Título">
                <input value={editing.title} onChange={e => setEditing(x => x && { ...x, title: e.target.value })} className={inputClass} placeholder="Ej. Gramática · Present Perfect" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha">
                  <input type="date" value={editing.event_date} onChange={e => setEditing(x => x && { ...x, event_date: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Duración (min)">
                  <input type="number" min={5} step={5} value={editing.planned_duration_minutes} onChange={e => setEditing(x => x && { ...x, planned_duration_minutes: +e.target.value })} className={inputClass} />
                </Field>
              </div>
              <Field label="Categoría">
                <select value={editing.category} onChange={e => setEditing(x => x && { ...x, category: e.target.value as Category })} className={inputClass}>
                  {CATEGORIES.map(k => <option key={k} value={k}>{CATEGORY_CONFIG[k].label}</option>)}
                </select>
              </Field>
              <Field label="Tema gramatical (opcional)">
                <select value={editing.grammar_topic_id ?? ''} onChange={e => setEditing(x => x && { ...x, grammar_topic_id: e.target.value || null })} className={inputClass}>
                  <option value="">— Sin tema —</option>
                  {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </Field>
              <Field label="Descripción (opcional)">
                <textarea rows={2} value={editing.description} onChange={e => setEditing(x => x && { ...x, description: e.target.value })} className={inputClass} style={{ resize: 'vertical' }} />
              </Field>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.completed} onChange={e => setEditing(x => x && { ...x, completed: e.target.checked })} />
                Completado
              </label>
            </div>
            <div className="flex justify-between px-5 py-3 border-t border-[#E3E8F2]">
              {editing.id ? (
                <button className={btnDanger} onClick={async () => { await onDelete(editing.id!); setEditing(null); onFlash('Evento eliminado'); }}>
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
