-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- CATALOG TABLES (read-only for users)
-- =====================================================

create table if not exists public.modules (
  id uuid primary key default uuid_generate_v4(),
  module_number integer not null unique,
  title text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.grammar_phases (
  id uuid primary key default uuid_generate_v4(),
  phase_number integer not null unique,
  name text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.grammar_topics (
  id uuid primary key default uuid_generate_v4(),
  phase_id uuid references public.grammar_phases(id) on delete cascade,
  slug text not null unique,
  title text not null,
  short_description text,
  priority integer not null default 2 check (priority between 1 and 4),
  order_index integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.grammar_topic_modules (
  id uuid primary key default uuid_generate_v4(),
  grammar_topic_id uuid references public.grammar_topics(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  unique(grammar_topic_id, module_id)
);

create table if not exists public.grammar_lessons (
  id uuid primary key default uuid_generate_v4(),
  grammar_topic_id uuid references public.grammar_topics(id) on delete cascade unique,
  purpose text,
  structure_formula text,
  when_to_use jsonb default '[]',
  course_examples jsonb default '[]',
  professional_examples jsonb default '[]',
  common_mistakes jsonb default '[]',
  written_practice jsonb default '[]',
  sesame_prompt text,
  reading_activity text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- USER DATA TABLES
-- =====================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_topic_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  grammar_topic_id uuid references public.grammar_topics(id) on delete cascade not null,
  status text not null default 'no_iniciado' check (status in ('no_iniciado','en_estudio','estudiado','practicado','dominado')),
  confidence_level integer default 0 check (confidence_level between 0 and 5),
  personal_priority text default 'none' check (personal_priority in ('none','urgent','important','review')),
  notes text default '',
  own_sentences text default '',
  doubts text default '',
  last_studied_at date,
  next_review_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, grammar_topic_id)
);

create table if not exists public.study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  grammar_topic_id uuid references public.grammar_topics(id) on delete set null,
  module_id uuid references public.modules(id) on delete set null,
  session_date date not null,
  category text not null default 'grammar' check (category in ('grammar','speaking','reading','class','review','writing','listening','vocabulary','pronunciation')),
  title text default '',
  duration_minutes integer not null default 30 check (duration_minutes > 0),
  completed boolean not null default true,
  source text default 'manual' check (source in ('manual','calendar','lesson','sesame','reading','class')),
  learned text default '',
  struggled text default '',
  new_phrases text default '',
  errors text default '',
  questions text default '',
  next_step text default '',
  confidence_level integer default 0 check (confidence_level between 0 and 5),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.calendar_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  grammar_topic_id uuid references public.grammar_topics(id) on delete set null,
  module_id uuid references public.modules(id) on delete set null,
  title text not null,
  description text default '',
  category text not null default 'grammar' check (category in ('grammar','speaking','reading','class','review','writing','listening','vocabulary','pronunciation')),
  event_date date not null,
  planned_duration_minutes integer default 30,
  completed boolean not null default false,
  linked_study_session_id uuid references public.study_sessions(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  study_session_id uuid references public.study_sessions(id) on delete set null,
  grammar_topic_id uuid references public.grammar_topics(id) on delete set null,
  module_id uuid references public.modules(id) on delete set null,
  entry_date date not null,
  category text not null default 'grammar',
  title text default '',
  what_went_well text default '',
  what_was_difficult text default '',
  new_phrases text default '',
  common_errors text default '',
  pending_questions text default '',
  confidence_level integer default 0 check (confidence_level between 0 and 5),
  next_step text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.sesame_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  grammar_topic_id uuid references public.grammar_topics(id) on delete set null,
  session_date date not null,
  duration_minutes integer not null default 20,
  topic_practiced text default '',
  grammar_target text default '',
  vocabulary_target text default '',
  prompt_used text default '',
  good_phrases text default '',
  errors_made text default '',
  corrections text default '',
  fluency_level integer default 0 check (fluency_level between 0 and 5),
  confidence_level integer default 0 check (confidence_level between 0 and 5),
  completed boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.reading_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  reading_date date not null,
  book_title text default '',
  chapter_or_pages text default '',
  duration_minutes integer not null default 20,
  new_vocabulary text default '',
  interesting_phrases text default '',
  grammar_spotted text default '',
  short_summary text default '',
  comprehension_level integer default 0 check (comprehension_level between 0 and 5),
  completed boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  week_start_date date not null,
  week_end_date date not null,
  total_minutes integer default 0,
  grammar_minutes integer default 0,
  speaking_minutes integer default 0,
  reading_minutes integer default 0,
  class_minutes integer default 0,
  review_notes text default '',
  biggest_progress text default '',
  biggest_difficulty text default '',
  next_week_focus text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, week_start_date)
);

-- =====================================================
-- TRIGGER: auto-create profile on signup
-- =====================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
