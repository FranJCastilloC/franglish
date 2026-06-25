export type Category =
  | 'grammar' | 'speaking' | 'reading' | 'class'
  | 'review' | 'writing' | 'listening' | 'vocabulary' | 'pronunciation';

export type TopicStatus = 'no_iniciado' | 'en_estudio' | 'estudiado' | 'practicado' | 'dominado';
export type PersonalPriority = 'none' | 'urgent' | 'important' | 'review';

export interface Module {
  id: string;
  module_number: number;
  title: string;
  description: string | null;
  created_at: string;
}

export interface GrammarPhase {
  id: string;
  phase_number: number;
  name: string;
  description: string | null;
  order_index: number;
}

export interface GrammarLesson {
  id: string;
  grammar_topic_id: string;
  purpose: string | null;
  structure_formula: string | null;
  when_to_use: string[];
  course_examples: string[];
  professional_examples: string[];
  common_mistakes: string[];
  written_practice: string[];
  sesame_prompt: string | null;
  reading_activity: string | null;
}

export interface UserTopicProgress {
  id: string;
  user_id: string;
  grammar_topic_id: string;
  status: TopicStatus;
  confidence_level: number;
  personal_priority: PersonalPriority;
  notes: string;
  own_sentences: string;
  doubts: string;
  last_studied_at: string | null;
  next_review_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GrammarTopic {
  id: string;
  phase_id: string;
  slug: string;
  title: string;
  short_description: string | null;
  priority: number;
  order_index: number;
  created_at: string;
  // joined
  phase?: GrammarPhase;
  modules?: Module[];
  lesson?: GrammarLesson | null;
  progress?: UserTopicProgress | null;
}

export interface StudySession {
  id: string;
  user_id: string;
  grammar_topic_id: string | null;
  module_id: string | null;
  session_date: string;
  category: Category;
  title: string;
  duration_minutes: number;
  completed: boolean;
  source: string;
  learned: string;
  struggled: string;
  new_phrases: string;
  errors: string;
  questions: string;
  next_step: string;
  confidence_level: number;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  grammar_topic_id: string | null;
  module_id: string | null;
  title: string;
  description: string;
  category: Category;
  event_date: string;
  planned_duration_minutes: number;
  completed: boolean;
  linked_study_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  study_session_id: string | null;
  grammar_topic_id: string | null;
  module_id: string | null;
  entry_date: string;
  category: Category;
  title: string;
  what_went_well: string;
  what_was_difficult: string;
  new_phrases: string;
  common_errors: string;
  pending_questions: string;
  confidence_level: number;
  next_step: string;
  created_at: string;
  updated_at: string;
}

export interface SesameSession {
  id: string;
  user_id: string;
  grammar_topic_id: string | null;
  session_date: string;
  duration_minutes: number;
  topic_practiced: string;
  grammar_target: string;
  vocabulary_target: string;
  prompt_used: string;
  good_phrases: string;
  errors_made: string;
  corrections: string;
  fluency_level: number;
  confidence_level: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReadingLog {
  id: string;
  user_id: string;
  reading_date: string;
  book_title: string;
  chapter_or_pages: string;
  duration_minutes: number;
  new_vocabulary: string;
  interesting_phrases: string;
  grammar_spotted: string;
  short_summary: string;
  comprehension_level: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
