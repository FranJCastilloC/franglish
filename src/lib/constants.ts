import type { Category, TopicStatus, PersonalPriority } from '../types/database';

export const COLORS = {
  ink: '#1C2230',
  mist: '#F4F6FB',
  line: '#E3E8F2',
  sub: '#5B6678',
  teal: '#0E7C86',
  amber: '#E8833A',
  green: '#16A34A',
} as const;

export const CATEGORY_CONFIG: Record<Category, { label: string; color: string }> = {
  grammar:       { label: 'Gramática',     color: '#0E7C86' },
  speaking:      { label: 'Speaking',      color: '#E8833A' },
  reading:       { label: 'Lectura',       color: '#6366F1' },
  class:         { label: 'Clase',         color: '#64748B' },
  review:        { label: 'Repaso',        color: '#F59E0B' },
  writing:       { label: 'Writing',       color: '#8B5CF6' },
  listening:     { label: 'Listening',     color: '#0EA5E9' },
  vocabulary:    { label: 'Vocabulario',   color: '#14B8A6' },
  pronunciation: { label: 'Pronunciación', color: '#EC4899' },
};

export const CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];

export const STATUS_CONFIG: { id: TopicStatus; label: string; color: string; weight: number }[] = [
  { id: 'no_iniciado', label: 'No iniciado', color: '#94A3B8', weight: 0 },
  { id: 'en_estudio',  label: 'En estudio',  color: '#F59E0B', weight: 0.25 },
  { id: 'estudiado',   label: 'Estudiado',   color: '#3B82F6', weight: 0.5 },
  { id: 'practicado',  label: 'Practicado',  color: '#0E9F9F', weight: 0.75 },
  { id: 'dominado',    label: 'Dominado',    color: '#16A34A', weight: 1 },
];

export const PRIORITY_CONFIG: Record<PersonalPriority, { label: string; color: string }> = {
  none:      { label: '—',          color: '#CBD5E1' },
  urgent:    { label: 'Urgente',    color: '#DC2626' },
  important: { label: 'Importante', color: '#D97706' },
  review:    { label: 'Repaso',     color: '#2563EB' },
};

export const statusById = (id: TopicStatus) =>
  STATUS_CONFIG.find(s => s.id === id) ?? STATUS_CONFIG[0];
