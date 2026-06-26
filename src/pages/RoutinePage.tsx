import { Card, PageHeader, SectionTitle } from '../components/ui';
import { CATEGORY_CONFIG } from '../lib/constants';

const ROUTINE: { day: string; slots: { time: string; activity: string; cat: string; min: number }[] }[] = [
  {
    day: 'Lunes',
    slots: [
      { time: '07:00–07:30', activity: 'Lectura del libro', cat: 'reading', min: 30 },
      { time: '18:00–18:45', activity: 'Gramática · Lección nueva', cat: 'grammar', min: 45 },
      { time: '18:45–19:05', activity: 'Práctica escrita', cat: 'writing', min: 20 },
    ],
  },
  {
    day: 'Martes',
    slots: [
      { time: '07:00–07:30', activity: 'Lectura del libro', cat: 'reading', min: 30 },
      { time: '18:00–18:30', activity: 'Sesame · Hablar con el tema del lunes', cat: 'speaking', min: 30 },
      { time: '18:30–18:50', activity: 'Journal – reflexión de sesión', cat: 'writing', min: 20 },
    ],
  },
  {
    day: 'Miércoles',
    slots: [
      { time: '07:00–07:30', activity: 'Lectura del libro', cat: 'reading', min: 30 },
      { time: '18:00–18:45', activity: 'Gramática · Revisión o lección nueva', cat: 'grammar', min: 45 },
      { time: '18:45–19:00', activity: 'Flashcards / repaso rápido', cat: 'review', min: 15 },
    ],
  },
  {
    day: 'Jueves',
    slots: [
      { time: '07:00–07:30', activity: 'Lectura del libro', cat: 'reading', min: 30 },
      { time: '18:00–18:30', activity: 'Sesame · Conversación libre', cat: 'speaking', min: 30 },
      { time: '18:30–18:50', activity: 'Vocabulario en contexto', cat: 'vocabulary', min: 20 },
    ],
  },
  {
    day: 'Viernes',
    slots: [
      { time: '07:00–07:30', activity: 'Lectura del libro', cat: 'reading', min: 30 },
      { time: '18:00–18:30', activity: 'Gramática · Repaso semanal', cat: 'review', min: 30 },
      { time: '18:30–18:45', activity: 'Journal – resumen de semana', cat: 'writing', min: 15 },
    ],
  },
  {
    day: 'Sábado',
    slots: [
      { time: 'Mañana', activity: 'Lectura larga del libro (1 capítulo)', cat: 'reading', min: 60 },
      { time: 'Tarde', activity: 'Sesame · Sesión larga', cat: 'speaking', min: 45 },
    ],
  },
  {
    day: 'Domingo',
    slots: [
      { time: 'Mañana', activity: 'Repaso de la semana + plan del lunes', cat: 'review', min: 30 },
    ],
  },
];

const totalPerDay = (slots: { min: number }[]) => slots.reduce((a, s) => a + s.min, 0);
const weekTotal = ROUTINE.reduce((a, d) => a + totalPerDay(d.slots), 0);

export function RoutinePage() {
  return (
    <div>
      <PageHeader title="Rutina semanal" sub={`Plan base: ~${Math.round(weekTotal / 60)}h ${weekTotal % 60}min por semana de estudio estructurado.`} />

      <Card className="mb-4">
        <SectionTitle>Principios de la rutina</SectionTitle>
        <ul className="mt-2 text-sm leading-7 text-[#1C2230] list-disc pl-4">
          <li>Estudia la gramática y practica speaking dentro de las <strong>48 h</strong> para anclar la estructura.</li>
          <li>Lectura diaria: exposición natural al idioma, vocabulario en contexto, caza de estructuras.</li>
          <li>Journal tras cada sesión de Sesame: captura errores y correcciones en caliente.</li>
          <li>Sábado = sesión larga + práctica extendida.</li>
          <li>Domingo = revisión + planificación de la próxima semana.</li>
        </ul>
      </Card>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
        {ROUTINE.map(d => (
          <Card key={d.day}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-extrabold">{d.day}</div>
              <div className="text-xs text-[#5B6678]">{totalPerDay(d.slots)} min</div>
            </div>
            <div className="flex flex-col gap-2">
              {d.slots.map((s, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="w-1 rounded-full shrink-0" style={{ background: (CATEGORY_CONFIG as Record<string, { color: string }>)[s.cat]?.color ?? '#ccc' }} />
                  <div>
                    <div className="text-[11px] text-[#5B6678]">{s.time}</div>
                    <div className="text-sm font-semibold leading-tight">{s.activity}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
