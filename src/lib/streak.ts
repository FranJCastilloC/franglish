import { addDays, todayLocal } from './date';

/**
 * Calculates the current study streak from completed session dates.
 *
 * Rules:
 * - Only completed sessions count (pass only completed dates)
 * - Multiple sessions on the same day count as 1 day
 * - Future dates are ignored
 * - If studied today → count from today backwards
 * - If not studied today but studied yesterday → count from yesterday backwards
 * - If not studied today or yesterday → streak = 0
 */
export function calculateStudyStreak(
  completedDates: string[],
  today: string = todayLocal(),
): number {
  const uniqueDays = new Set(completedDates.filter(d => d <= today));
  let n = 0;
  let day = today;
  if (!uniqueDays.has(day)) day = addDays(day, -1);
  while (uniqueDays.has(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

// Validation cases (for reference/testing)
// calculateStudyStreak(['2026-06-18','2026-06-19','2026-06-20'], '2026-06-20') === 3
// calculateStudyStreak(['2026-06-18','2026-06-19','2026-06-20'], '2026-06-21') === 3
// calculateStudyStreak(['2026-06-18','2026-06-19'], '2026-06-21') === 0
// calculateStudyStreak(['2026-06-20','2026-06-20'], '2026-06-20') === 1
// calculateStudyStreak(['2026-06-19','2026-06-20'], '2026-06-20') === 2
