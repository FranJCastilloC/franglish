-- Enable RLS on all user tables
alter table public.profiles enable row level security;
alter table public.user_topic_progress enable row level security;
alter table public.study_sessions enable row level security;
alter table public.calendar_events enable row level security;
alter table public.journal_entries enable row level security;
alter table public.sesame_sessions enable row level security;
alter table public.reading_logs enable row level security;
alter table public.weekly_reviews enable row level security;

-- Catalog tables: readable by all authenticated users
alter table public.modules enable row level security;
alter table public.grammar_phases enable row level security;
alter table public.grammar_topics enable row level security;
alter table public.grammar_topic_modules enable row level security;
alter table public.grammar_lessons enable row level security;

create policy "Catalog readable by authenticated" on public.modules for select to authenticated using (true);
create policy "Catalog readable by authenticated" on public.grammar_phases for select to authenticated using (true);
create policy "Catalog readable by authenticated" on public.grammar_topics for select to authenticated using (true);
create policy "Catalog readable by authenticated" on public.grammar_topic_modules for select to authenticated using (true);
create policy "Catalog readable by authenticated" on public.grammar_lessons for select to authenticated using (true);

-- Profiles: users manage their own
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);

-- User data: own rows only
create policy "Own data" on public.user_topic_progress for all using (auth.uid() = user_id);
create policy "Own data" on public.study_sessions for all using (auth.uid() = user_id);
create policy "Own data" on public.calendar_events for all using (auth.uid() = user_id);
create policy "Own data" on public.journal_entries for all using (auth.uid() = user_id);
create policy "Own data" on public.sesame_sessions for all using (auth.uid() = user_id);
create policy "Own data" on public.reading_logs for all using (auth.uid() = user_id);
create policy "Own data" on public.weekly_reviews for all using (auth.uid() = user_id);
