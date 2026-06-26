import { useState, useMemo } from 'react';
import { Plus, Check, Pencil, Trash2, X, ChevronLeft, ChevronRight, Repeat2 } from 'lucide-react';
import { Card, PageHeader, Empty, Field, Badge, inputClass, btnPrimary, btnGhost, btnDanger, btnIcon } from '../components/ui';
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

type RecurrenceType = 'none' | 'weekly' | 'biweekly';

function blank(userId: string, date = todayLocal()): Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId, grammar_topic_id: null, module_id: null,
    title: '', description: '', category: 'class',
    event_date: date, planned_duration_minutes: 60,
    completed: false, linked_study_session_id: null,
  };
}

export function CalendarPage({ userId, events, topics, onCreate, onUpdate, onDelete, onFlash }: Props) {
  const today = todayLocal();
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [editing, setEditing] = useState<(Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'> & { id?: string }) | null>(null);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [repeatCount, setRepeatCount] = useState(8);
  const [saving, setSaving] = useState(false);

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

  const selectedEvents = byDate[selectedDate] ?? [];
  const selectedLabel = new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const openNew = (date: string) => {
    setSelectedDate(date);
    setEditing(blank(userId, date));
    setRecurrence('none');
    setRepeatCount(8);
  };

  const openEdit = (ev: CalendarEvent) => {
    setEditing({ ...ev });
    setRecurrence('none');
    setRepeatCount(8);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { onFlash('El título es obligatorio'); return; }
    setSaving(true);
    try {
      if (editing.id) {
        const { id, ...patch } = editing;
        await onUpdate(id, patch);
        onFlash('Evento actualizado');
      } else if (recurrence === 'none') {
        await onCreate(editing);
        onFlash('Evento creado');
      } else {
        const interval = recurrence === 'weekly' ? 7 : 14;
        for (let i = 0; i < repeatCount; i++) {
          await onCreate({ ...editing, event_date: addDays(editing.event_date, interval * i) });
        }
        onFlash(`${repeatCount} eventos creados`);
      }
      setEditing(null);
    } catch { onFlash('Error al guardar'); }
    finally { setSaving(false); }
  };

  const prevMonth = () => setCursor(c => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 });
  const nextMonth = () => setCursor(c => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 });
  const goToday = () => { const d = new Date(); setCursor({ y: d.getFullYear(), m: d.getMonth() }); setSelectedDate(today); };

  return (
    <div>
      <PageHeader title="Calendario" sub="Haz clic en un día para ver y agregar eventos. Usa la repetición para tus clases semanales." />

      {/* Stats */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))' }}>
        <Card className="!p-3.5">
          <div className="text-xs font-semibold text-[#5B6678]">Esta semana</div>
          <div className="text-xl font-extrabold">{formatMinutes(weekMin)}</div>
        </Card>
        <Card className="!p-3.5">
          <div className="text-xs font-semibold text-[#5B6678]">Días con eventos</div>
          <div className="text-xl font-extrabold">{cells.filter(d => d && (byDate[d] ?? []).length > 0).length}</div>
        </Card>
        <Card className="!p-3.5">
          <div className="text-xs font-semibold text-[#5B6678]">Hoy completados</div>
          <div className="text-xl font-extrabold">
            {(byDate[today] ?? []).filter(e => e.completed).length}
            <span className="text-sm text-[#5B6678]">/{(byDate[today] ?? []).length}</span>
          </div>
        </Card>
      </div>

      {/* Calendar grid */}
      <Card>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <button className={btnGhost + ' !p-2'} onClick={prevMonth}><ChevronLeft size={16} /></button>
            <button className={btnGhost + ' text-sm font-bold min-w-44 justify-center'} onClick={goToday}>
              <span className="capitalize">{monthName}</span>
            </button>
            <button className={btnGhost + ' !p-2'} onClick={nextMonth}><ChevronRight size={16} /></button>
          </div>
          <button className={btnPrimary} onClick={() => openNew(selectedDate)}>
            <Plus size={14} />
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
          </button>
        </div>

        {/* Day headers */}
        <div className="grid mb-1" style={{ gridTemplateColumns: 'repeat(7,1fr)' }}>
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
            <div key={d} className="text-center text-[11px] font-bold text-[#5B6678] pb-1">{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
          {cells.map((date, i) => {
            if (!date) return <div key={i} className="min-h-16" />;
            const list = byDate[date] ?? [];
            const isToday = date === today;
            const isSelected = date === selectedDate;
            return (
              <div
                key={date}
                onClick={() => setSelectedDate(date)}
                className="min-h-16 rounded-xl p-1.5 cursor-pointer transition-all select-none"
                style={{
                  border: `2px solid ${isSelected ? '#0E7C86' : isToday ? '#BFE3E6' : '#E3E8F2'}`,
                  background: isSelected ? 'rgba(14,124,134,.09)' : isToday ? 'rgba(14,124,134,.03)' : '#fff',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-extrabold w-5 h-5 flex items-center justify-center rounded-full"
                    style={{
                      background: isToday ? '#0E7C86' : 'transparent',
                      color: isToday ? '#fff' : isSelected ? '#0E7C86' : '#1C2230',
                    }}
                  >
                    {+date.slice(8)}
                  </span>
                  {list.length > 0 && list.every(e => e.completed) && (
                    <span className="text-[9px] text-green-600 font-bold">✓</span>
                  )}
                </div>
                <div className="flex flex-col gap-px">
                  {list.slice(0, 2).map(ev => (
                    <div
                      key={ev.id}
                      onClick={e => { e.stopPropagation(); openEdit(ev); }}
                      className="text-[9px] px-1 py-px rounded truncate text-white"
                      style={{ background: CATEGORY_CONFIG[ev.category]?.color + (ev.completed ? '' : 'aa') }}
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {list.length > 2 && (
                    <div className="text-[9px] text-[#5B6678] pl-0.5">+{list.length - 2} más</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Selected day panel */}
      <Card className="mt-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-[15px] font-extrabold capitalize">{selectedLabel}</h2>
            {selectedEvents.length > 0 && (
              <div className="text-xs text-[#5B6678] mt-0.5">
                {selectedEvents.filter(e => e.completed).length}/{selectedEvents.length} completados ·{' '}
                {formatMinutes(selectedEvents.reduce((a, e) => a + e.planned_duration_minutes, 0))} planificados
              </div>
            )}
          </div>
          <button className={btnPrimary} onClick={() => openNew(selectedDate)}>
            <Plus size={14} /> Agregar evento
          </button>
        </div>

        {selectedEvents.length === 0 ? (
          <Empty>Sin eventos para este día. Haz clic en "Agregar evento" para planificar una sesión.</Empty>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedEvents.map(ev => {
              const cat = CATEGORY_CONFIG[ev.category];
              return (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors"
                  style={{
                    borderColor: ev.completed ? '#16A34A' : '#E3E8F2',
                    background: ev.completed ? 'rgba(22,163,74,.05)' : '#fff',
                  }}
                >
                  <button
                    onClick={() => onUpdate(ev.id, { completed: !ev.completed })}
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      border: `2px solid ${ev.completed ? '#16A34A' : '#D1D5DB'}`,
                      background: ev.completed ? '#16A34A' : '#fff',
                    }}
                  >
                    {ev.completed && <Check size={12} color="#fff" />}
                  </button>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat?.color }} />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-bold truncate"
                      style={{ textDecoration: ev.completed ? 'line-through' : 'none', opacity: ev.completed ? 0.6 : 1 }}
                    >
                      {ev.title}
                    </div>
                    <div className="text-xs text-[#5B6678]">
                      {cat?.label} · {formatMinutes(ev.planned_duration_minutes)}
                      {ev.description && ` · ${ev.description.slice(0, 40)}`}
                    </div>
                  </div>
                  <button onClick={() => openEdit(ev)} className={btnIcon}><Pencil size={13} /></button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Upcoming events */}
      {(() => {
        const upcoming = events
          .filter(e => !e.completed && e.event_date > today)
          .sort((a, b) => a.event_date.localeCompare(b.event_date))
          .slice(0, 5);
        if (!upcoming.length) return null;
        return (
          <Card className="mt-4">
            <h2 className="text-[15px] font-extrabold mb-3">Próximos eventos</h2>
            <div className="flex flex-col gap-2">
              {upcoming.map(ev => {
                const cat = CATEGORY_CONFIG[ev.category];
                const label = new Date(ev.event_date + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
                return (
                  <div key={ev.id} className="flex items-center gap-3">
                    <span className="text-xs text-[#5B6678] w-20 shrink-0 font-semibold capitalize">{label}</span>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cat?.color }} />
                    <span className="text-sm flex-1 truncate">{ev.title}</span>
                    <Badge color={cat?.color ?? '#888'} bg={(cat?.color ?? '#888') + '22'}>
                      {cat?.label}
                    </Badge>
                    <button
                      onClick={() => { setSelectedDate(ev.event_date); const m = new Date(ev.event_date); setCursor({ y: m.getFullYear(), m: m.getMonth() }); }}
                      className={btnGhost + ' !py-1 !px-2 !text-xs'}
                    >
                      Ver
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })()}

      {/* Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(17,22,33,.5)' }}
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E8F2]">
              <div className="font-extrabold text-[17px]">{editing.id ? 'Editar evento' : 'Nuevo evento'}</div>
              <button onClick={() => setEditing(null)} className={btnIcon}><X size={18} /></button>
            </div>

            <div className="px-5 py-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              <Field label="Título">
                <input
                  value={editing.title}
                  onChange={e => setEditing(x => x && { ...x, title: e.target.value })}
                  className={inputClass}
                  placeholder="Ej. Clase Senior · Present Perfect"
                  autoFocus
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha">
                  <input
                    type="date"
                    value={editing.event_date}
                    onChange={e => setEditing(x => x && { ...x, event_date: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Duración (min)">
                  <input
                    type="number" min={5} step={5}
                    value={editing.planned_duration_minutes}
                    onChange={e => setEditing(x => x && { ...x, planned_duration_minutes: +e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Categoría">
                <select
                  value={editing.category}
                  onChange={e => setEditing(x => x && { ...x, category: e.target.value as Category })}
                  className={inputClass}
                >
                  {CATEGORIES.map(k => <option key={k} value={k}>{CATEGORY_CONFIG[k].label}</option>)}
                </select>
              </Field>

              <Field label="Tema gramatical (opcional)">
                <select
                  value={editing.grammar_topic_id ?? ''}
                  onChange={e => setEditing(x => x && { ...x, grammar_topic_id: e.target.value || null })}
                  className={inputClass}
                >
                  <option value="">— Sin tema —</option>
                  {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </Field>

              <Field label="Descripción (opcional)">
                <textarea
                  rows={2}
                  value={editing.description}
                  onChange={e => setEditing(x => x && { ...x, description: e.target.value })}
                  className={inputClass}
                  style={{ resize: 'vertical' }}
                  placeholder="Notas adicionales…"
                />
              </Field>

              {/* Recurrence (new events only) */}
              {!editing.id && (
                <div className="rounded-xl border border-[#E3E8F2] p-3 flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#5B6678] uppercase tracking-wide">
                    <Repeat2 size={12} /> Repetición
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { id: 'none', label: 'Sin repetir' },
                      { id: 'weekly', label: 'Cada semana' },
                      { id: 'biweekly', label: 'Cada 2 sem.' },
                    ] as { id: RecurrenceType; label: string }[]).map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRecurrence(opt.id)}
                        className="px-2 py-1.5 rounded-lg text-xs font-bold border transition-colors"
                        style={{
                          border: `1.5px solid ${recurrence === opt.id ? '#0E7C86' : '#E3E8F2'}`,
                          background: recurrence === opt.id ? '#0E7C86' : '#fff',
                          color: recurrence === opt.id ? '#fff' : '#5B6678',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {recurrence !== 'none' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#5B6678]">Repetir</span>
                      <input
                        type="number" min={2} max={52}
                        value={repeatCount}
                        onChange={e => setRepeatCount(Math.max(2, +e.target.value))}
                        className={inputClass + ' !w-16 text-center'}
                      />
                      <span className="text-xs text-[#5B6678]">
                        {recurrence === 'weekly' ? 'semanas' : 'veces (c/2 sem)'}
                      </span>
                      <span className="text-xs font-bold" style={{ color: '#0E7C86' }}>→ {repeatCount} eventos</span>
                    </div>
                  )}
                </div>
              )}

              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editing.completed}
                  onChange={e => setEditing(x => x && { ...x, completed: e.target.checked })}
                />
                Marcar como completado
              </label>
            </div>

            <div className="flex justify-between px-5 py-3 border-t border-[#E3E8F2]">
              {editing.id ? (
                <button
                  className={btnDanger}
                  onClick={async () => { await onDelete(editing.id!); setEditing(null); onFlash('Evento eliminado'); }}
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              ) : <div />}
              <div className="flex gap-2">
                <button className={btnGhost} onClick={() => setEditing(null)}>Cancelar</button>
                <button className={btnPrimary} onClick={handleSave} disabled={saving}>
                  <Check size={15} />
                  {saving ? 'Guardando…' : recurrence !== 'none' ? `Crear ${repeatCount} eventos` : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
