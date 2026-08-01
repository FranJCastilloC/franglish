-- =====================================================================
-- FrangLish · Course classes (24 live classes, Senior Level 1)
-- Content extracted from the official class presentations.
-- Run AFTER schema.sql, policies.sql and seed.sql
-- =====================================================================

create table if not exists public.course_classes (
  id uuid primary key default uuid_generate_v4(),
  class_number integer not null unique,
  module_id uuid references public.modules(id) on delete set null,
  title text not null,
  goal text not null default '',
  grammar_focus jsonb default '[]',
  vocabulary jsonb default '[]',
  key_phrases jsonb default '[]',
  exercises jsonb default '[]',
  challenge jsonb default '{}',
  reading text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.course_class_topics (
  id uuid primary key default uuid_generate_v4(),
  course_class_id uuid references public.course_classes(id) on delete cascade,
  grammar_topic_id uuid references public.grammar_topics(id) on delete cascade,
  unique(course_class_id, grammar_topic_id)
);

create table if not exists public.user_class_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_class_id uuid references public.course_classes(id) on delete cascade not null,
  status text not null default 'no_iniciado' check (status in ('no_iniciado','en_estudio','estudiado','practicado','dominado')),
  challenge_done boolean not null default false,
  confidence_level integer default 0 check (confidence_level between 0 and 5),
  notes text default '',
  attended_on date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_class_id)
);

-- RLS
alter table public.course_classes      enable row level security;
alter table public.course_class_topics enable row level security;
alter table public.user_class_progress enable row level security;

drop policy if exists "classes readable" on public.course_classes;
create policy "classes readable" on public.course_classes
  for select to authenticated using (true);

drop policy if exists "class topics readable" on public.course_class_topics;
create policy "class topics readable" on public.course_class_topics
  for select to authenticated using (true);

drop policy if exists "own class progress" on public.user_class_progress;
create policy "own class progress" on public.user_class_progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

