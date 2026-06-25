import { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Card, SectionTitle, PageHeader } from '../components/ui';
import { CATEGORY_CONFIG, CATEGORIES } from '../lib/constants';
import { formatMinutes, todayLocal, startOfWeek, addDays } from '../lib/date';
import type { StudySession } from '../types/database';

interface Props {
  sessions: StudySession[];
}

export function HoursPage({ sessions }: Props) {
  const today = todayLocal();
  const completed = useMemo(
    () => sessions.filter(s => s.completed && s.session_date <= today),
    [sessions, today],
  );
  const totalMin = completed.reduce((a, s) => a + s.duration_minutes, 0);

  const minutesByCat = useMemo(() => {
    const o: Record<string, number> = {};
    CATEGORIES.forEach(k => (o[k] = 0));
    completed.forEach(s => { o[s.category] = (o[s.category] ?? 0) + s.duration_minutes; });
    return o;
  }, [completed]);

  const barData = CATEGORIES
    .filter(k => minutesByCat[k] > 0)
    .map(k => ({ name: CATEGORY_CONFIG[k].label, min: Math.round(minutesByCat[k]), color: CATEGORY_CONFIG[k].color }));

  const weekData = useMemo(() => {
    const weeks = [];
    let start = startOfWeek(today);
    for (let i = 7; i >= 0; i--) {
      const ws = addDays(start, -7 * i);
      const we = addDays(ws, 6);
      const min = completed.filter(s => s.session_date >= ws && s.session_date <= we).reduce((a, s) => a + s.duration_minutes, 0);
      weeks.push({ name: ws.slice(5), min: Math.round(min) });
    }
    return weeks;
  }, [completed, today]);

  // Heatmap últimas 16 semanas
  const heat = useMemo(() => {
    const map: Record<string, number> = {};
    completed.forEach(s => { map[s.session_date] = (map[s.session_date] ?? 0) + s.duration_minutes; });
    const end = startOfWeek(today);
    const cols = [];
    for (let w = 15; w >= 0; w--) {
      const colStart = addDays(end, -7 * w);
      const col = [];
      for (let d = 0; d < 7; d++) {
        const date = addDays(colStart, d);
        col.push({ date, min: map[date] ?? 0 });
      }
      cols.push(col);
    }
    return cols;
  }, [completed, today]);

  const heatColor = (m: number) =>
    m === 0 ? '#EEF1F7' : m < 20 ? '#BFE3E6' : m < 45 ? '#6FC3C9' : m < 90 ? '#2C97A0' : '#0E7C86';

  return (
    <div>
      <PageHeader title="Tracker de horas" sub={`Tiempo total registrado: ${formatMinutes(totalMin)}. Solo sesiones completadas.`} />

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
        <Card>
          <SectionTitle>Horas por categoría</SectionTitle>
          {barData.length === 0 ? (
            <div className="text-sm text-[#5B6678] py-4">Sin datos todavía.</div>
          ) : (
            <div style={{ height: 240, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F7" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => formatMinutes(v)} />
                  <Bar dataKey="min" radius={[6, 6, 0, 0]}>
                    {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle>Distribución por actividad</SectionTitle>
          {barData.length === 0 ? (
            <div className="text-sm text-[#5B6678] py-4">Sin datos todavía.</div>
          ) : (
            <div style={{ height: 240, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={barData} dataKey="min" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={45}>
                    {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatMinutes(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-4">
        <SectionTitle>Progreso semanal (últimas 8 semanas)</SectionTitle>
        <div style={{ height: 220, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F7" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => formatMinutes(v)} />
              <Line type="monotone" dataKey="min" stroke="#0E7C86" strokeWidth={3} dot={{ r: 3, fill: '#0E7C86' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-4">
        <SectionTitle>Constancia (últimas 16 semanas)</SectionTitle>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
          {heat.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {col.map(cell => (
                <div
                  key={cell.date}
                  title={`${cell.date}: ${formatMinutes(cell.min)}`}
                  className="w-3 h-3 rounded-sm"
                  style={{ background: heatColor(cell.min) }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-[#5B6678]">
          Menos
          {['#EEF1F7', '#BFE3E6', '#6FC3C9', '#2C97A0', '#0E7C86'].map(c => (
            <span key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
          ))}
          Más
        </div>
      </Card>
    </div>
  );
}
