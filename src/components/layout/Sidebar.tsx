import {
  LayoutDashboard, GraduationCap, CalendarDays, NotebookPen, Clock,
  MessageSquare, BookOpen, ListChecks, Flame, Sparkles, Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type TabId =
  | 'dashboard' | 'grammar' | 'lessons' | 'content'
  | 'calendar' | 'journal' | 'sesame' | 'reading' | 'hours' | 'routine';

const NAV: [TabId, string, LucideIcon][] = [
  ['dashboard', 'Inicio',      LayoutDashboard],
  ['grammar',   'Gramática',   GraduationCap],
  ['lessons',   'Lecciones',   BookOpen],
  ['content',   'Contenidos',  ListChecks],
  ['calendar',  'Calendario',  CalendarDays],
  ['journal',   'Journal',     NotebookPen],
  ['sesame',    'Sesame',      MessageSquare],
  ['reading',   'Lectura',     BookOpen],
  ['hours',     'Horas',       Clock],
  ['routine',   'Rutina',      Target],
];

interface Props {
  tab: TabId;
  onTabChange: (t: TabId) => void;
  streak: number;
  onSignOut: () => void;
}

export function Sidebar({ tab, onTabChange, streak, onSignOut }: Props) {
  return (
    <aside className="md:w-64 md:min-h-screen md:fixed md:left-0 md:top-0 flex flex-col" style={{ background: '#1C2230', color: '#fff' }}>
      {/* Brand */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0E7C86' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div className="font-extrabold tracking-tight leading-none">FrangLish</div>
            <div className="text-[11px] opacity-60">Senior · Módulos 1–5</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-2 py-2 gap-1 flex-1">
        {NAV.map(([id, label, Icon]) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-colors text-left min-w-max md:w-full"
              style={{
                color: active ? '#fff' : 'rgba(255,255,255,.65)',
                background: active ? 'rgba(255,255,255,.10)' : 'transparent',
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Icon size={17} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Streak + sign out */}
      <div className="hidden md:block px-4 pb-4 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(232,131,58,.15)' }}>
          <Flame size={18} color="#E8833A" />
          <div>
            <div className="font-extrabold text-lg leading-none">{streak}</div>
            <div className="text-[11px] opacity-70">días de racha</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full text-left px-3 py-1.5 rounded-lg text-[12px] opacity-50 hover:opacity-80 transition-opacity"
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
