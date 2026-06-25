import { useState, useMemo, useCallback } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import type { TabId } from './components/layout/Sidebar';
import { SessionModal } from './components/SessionModal';
import type { SessionDraft } from './components/SessionModal';
import { Toast } from './components/ui';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { GrammarPage } from './pages/GrammarPage';
import { LessonsPage } from './pages/LessonsPage';
import { ContentPage } from './pages/ContentPage';
import { CalendarPage } from './pages/CalendarPage';
import { JournalPage } from './pages/JournalPage';
import { SesamePage } from './pages/SesamePage';
import { ReadingPage } from './pages/ReadingPage';
import { HoursPage } from './pages/HoursPage';
import { RoutinePage } from './pages/RoutinePage';
import { useAuth } from './hooks/useAuth';
import { isConfigured } from './lib/supabase';
import { useGrammar } from './hooks/useGrammar';
import { useSessions } from './hooks/useSessions';
import { useCalendar } from './hooks/useCalendar';
import { useJournal } from './hooks/useJournal';
import { useSesame } from './hooks/useSesame';
import { useReading } from './hooks/useReading';
import { calculateStudyStreak } from './lib/streak';

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const [tab, setTab] = useState<TabId>('dashboard');
  const [toast, setToast] = useState('');
  const [sessionModal, setSessionModal] = useState<{
    open: boolean;
    initial?: Partial<SessionDraft>;
    editId?: string;
  }>({ open: false });

  const uid = user?.id ?? '';
  const grammar = useGrammar(uid);
  const sessions = useSessions(uid);
  const calendar = useCalendar(uid);
  const journal = useJournal(uid);
  const sesame = useSesame(uid);
  const reading = useReading(uid);

  const flash = useCallback((m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 3000);
  }, []);

  const streak = useMemo(() => {
    const dates = [
      ...sessions.sessions.filter(s => s.completed).map(s => s.session_date),
      ...sesame.sessions.filter(s => s.completed).map(s => s.session_date),
      ...reading.logs.filter(l => l.completed).map(l => l.reading_date),
    ];
    return calculateStudyStreak(dates);
  }, [sessions.sessions, sesame.sessions, reading.logs]);

  const grammarPct = useMemo(() => {
    if (!grammar.topics.length) return 0;
    const studied = grammar.topics.filter(t =>
      t.progress?.status && t.progress.status !== 'no_iniciado',
    ).length;
    return Math.round((studied / grammar.topics.length) * 100);
  }, [grammar.topics]);

  const phasePct = useCallback((phaseId: string) => {
    const inPhase = grammar.topics.filter(t => t.phase_id === phaseId);
    if (!inPhase.length) return 0;
    const done = inPhase.filter(t => t.progress?.status && t.progress.status !== 'no_iniciado').length;
    return Math.round((done / inPhase.length) * 100);
  }, [grammar.topics]);

  const handleSessionSave = async (draft: SessionDraft) => {
    if (sessionModal.editId) {
      await sessions.update(sessionModal.editId, draft);
      flash('Sesión actualizada');
    } else {
      await sessions.create(draft);
      flash('Sesión registrada');
    }
    setSessionModal({ open: false });
  };

  const handleSessionDelete = async () => {
    if (sessionModal.editId) {
      await sessions.remove(sessionModal.editId);
      flash('Sesión eliminada');
    }
    setSessionModal({ open: false });
  };

  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6" style={{ background: '#F4F6FB' }}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-sm border border-[#E3E8F2]">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#0E7C86' }}>
            <span className="text-white text-xl">⚙️</span>
          </div>
          <h1 className="text-xl font-extrabold mb-2">Configuración pendiente</h1>
          <p className="text-sm text-[#5B6678] mb-5 leading-relaxed">
            La app necesita conectarse a Supabase. Sigue estos pasos:
          </p>
          <ol className="text-sm leading-8 text-[#1C2230] list-decimal pl-5 space-y-1 mb-6">
            <li>Crea un proyecto en <strong>supabase.com</strong></li>
            <li>Ve a <strong>Settings → API</strong> y copia la URL y la anon key</li>
            <li>Crea el archivo <code className="bg-[#F4F6FB] px-1.5 py-0.5 rounded text-xs">/Desktop/franglish/.env</code></li>
            <li>
              Añade las variables:
              <pre className="bg-[#F4F6FB] rounded-xl p-3 mt-1 text-xs leading-6 overflow-x-auto">{`VITE_SUPABASE_URL=https://xxx.supabase.co\nVITE_SUPABASE_ANON_KEY=tu-anon-key`}</pre>
            </li>
            <li>Ejecuta <code className="bg-[#F4F6FB] px-1.5 py-0.5 rounded text-xs">schema.sql</code>, <code className="bg-[#F4F6FB] px-1.5 py-0.5 rounded text-xs">policies.sql</code> y <code className="bg-[#F4F6FB] px-1.5 py-0.5 rounded text-xs">seed.sql</code> en el SQL Editor de Supabase</li>
            <li>Reinicia el servidor: <code className="bg-[#F4F6FB] px-1.5 py-0.5 rounded text-xs">npm run dev</code></li>
          </ol>
          <p className="text-xs text-[#5B6678]">El archivo README.md tiene instrucciones completas.</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#F4F6FB' }}>
        <div className="text-[#5B6678] text-sm">Cargando…</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage signIn={signIn} signUp={signUp} />;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row" style={{ background: '#F4F6FB' }}>
      <Sidebar tab={tab} onTabChange={setTab} streak={streak} onSignOut={signOut} />

      <main className="flex-1 md:ml-64 px-4 py-6 max-w-5xl mx-auto w-full">
        {tab === 'dashboard' && (
          <DashboardPage
            userId={uid}
            sessions={sessions.sessions}
            topics={grammar.topics}
            phases={grammar.phases}
            onNewSession={() => setSessionModal({ open: true })}
            onTabChange={(t) => setTab(t as TabId)}
          />
        )}
        {tab === 'grammar' && (
          <GrammarPage
            userId={uid}
            topics={grammar.topics}
            phases={grammar.phases}
            sessions={sessions.sessions}
            grammarPct={grammarPct}
            phasePct={phasePct}
            onUpdateProgress={(topicId, patch) => grammar.updateProgress(topicId, patch)}
            onNewSession={(over) => setSessionModal({ open: true, initial: over as Partial<SessionDraft> })}
            onFlash={flash}
          />
        )}
        {tab === 'lessons' && (
          <LessonsPage
            topics={grammar.topics}
            phases={grammar.phases}
            sessions={sessions.sessions}
            onUpdateProgress={(topicId, patch) => grammar.updateProgress(topicId, patch)}
            onNewSession={(over) => setSessionModal({ open: true, initial: over as Partial<SessionDraft> })}
            onFlash={flash}
          />
        )}
        {tab === 'content' && (
          <ContentPage
            topics={grammar.topics}
            onUpdateProgress={(topicId, patch) => grammar.updateProgress(topicId, patch)}
          />
        )}
        {tab === 'calendar' && (
          <CalendarPage
            userId={uid}
            events={calendar.events}
            topics={grammar.topics}
            onCreate={calendar.create}
            onUpdate={calendar.update}
            onDelete={calendar.remove}
            onFlash={flash}
          />
        )}
        {tab === 'journal' && (
          <JournalPage
            userId={uid}
            entries={journal.entries}
            topics={grammar.topics}
            onCreate={journal.create}
            onUpdate={journal.update}
            onDelete={journal.remove}
            onFlash={flash}
          />
        )}
        {tab === 'sesame' && (
          <SesamePage
            userId={uid}
            sessions={sesame.sessions}
            topics={grammar.topics}
            onCreate={sesame.create}
            onUpdate={sesame.update}
            onDelete={sesame.remove}
            onFlash={flash}
          />
        )}
        {tab === 'reading' && (
          <ReadingPage
            userId={uid}
            logs={reading.logs}
            onCreate={reading.create}
            onUpdate={reading.update}
            onDelete={reading.remove}
            onFlash={flash}
          />
        )}
        {tab === 'hours' && <HoursPage sessions={sessions.sessions} />}
        {tab === 'routine' && <RoutinePage />}
      </main>

      {sessionModal.open && (
        <SessionModal
          userId={uid}
          topics={grammar.topics}
          initial={sessionModal.initial}
          onSave={handleSessionSave}
          onDelete={sessionModal.editId ? handleSessionDelete : undefined}
          onClose={() => setSessionModal({ open: false })}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
