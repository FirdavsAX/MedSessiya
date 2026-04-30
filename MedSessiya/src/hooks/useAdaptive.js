import { useAnalyticsStore } from '../store/analyticsStore.js';
import { getNextReviewDate } from '../services/adaptiveService.js';

export function useAdaptive(courseId) {
  const { courses } = useAnalyticsStore();
  const c = courses[courseId] || {};
  const mistakeCount    = c.mistakeCount    || {};
  const questionHistory = c.questionHistory || {};

  const getDifficulty = (questionId) => {
    const n = mistakeCount[questionId] || 0;
    if (n === 0) return 'easy';
    if (n <= 2)  return 'medium';
    return 'hard';
  };

  const isDue = (questionId) => {
    return getNextReviewDate(questionId, questionHistory) <= Date.now();
  };

  const getMostMissed = (count = 10) =>
    Object.entries(mistakeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([id, mistakes]) => ({ questionId: parseInt(id), mistakes }));

  return { mistakeCount, questionHistory, getDifficulty, isDue, getMostMissed };
}
