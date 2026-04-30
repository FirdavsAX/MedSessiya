import { useAnalyticsStore } from '../store/analyticsStore.js';

export function recordSession(courseId, sessionData) {
  useAnalyticsStore.getState().recordSession(courseId, sessionData);
}

export function getMistakeLeaders(courseId, count = 10) {
  const { courses } = useAnalyticsStore.getState();
  const { mistakeCount = {} } = courses[courseId] || {};

  return Object.entries(mistakeCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([id, mistakes]) => ({ questionId: parseInt(id), mistakes }));
}

export function getCourseStats(courseId) {
  const { courses } = useAnalyticsStore.getState();
  const c = courses[courseId] || {};
  const sessions = c.sessionLog || [];
  const streak   = c.streak || {};
  const mistakes = c.mistakeCount || {};

  const avgPercent = sessions.length
    ? Math.round(sessions.reduce((s, r) => s + r.percent, 0) / sessions.length)
    : 0;

  const bestPercent = sessions.length
    ? Math.max(...sessions.map(s => s.percent))
    : 0;

  return {
    totalSessions: sessions.length,
    avgPercent,
    bestPercent,
    streak: streak.current || 0,
    longestStreak: streak.longest || 0,
    totalMistakes: Object.values(mistakes).reduce((s, v) => s + v, 0),
  };
}
