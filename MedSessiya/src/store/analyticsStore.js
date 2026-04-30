import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MAX_SESSION_LOG, MAX_QUESTION_HISTORY } from '../constants/exam.js';

const empty = () => ({
  mistakeCount:    {},  // { [questionId]: number }
  questionHistory: {},  // { [questionId]: [{score, confidence, timeSpent, timestamp}] }
  sessionLog:      [],  // SessionRecord[]
  streak: { current: 0, longest: 0, lastDate: null },
});

export const useAnalyticsStore = create(
  persist(
    (set) => ({
      courses: {
        anatomiya:   empty(),
        gistalogiya: empty(),
      },

      recordSession(courseId, { details, percent, mode, totalTime }) {
        set(state => {
          const course = state.courses[courseId] ?? empty();
          const mistakeCount    = { ...course.mistakeCount };
          const questionHistory = { ...course.questionHistory };

          for (const d of details) {
            if (d.score < 100) {
              mistakeCount[d.questionId] = (mistakeCount[d.questionId] || 0) + 1;
            }
            const prev = questionHistory[d.questionId] || [];
            questionHistory[d.questionId] = [
              ...prev.slice(-(MAX_QUESTION_HISTORY - 1)),
              { score: d.score, confidence: d.confidence ?? null,
                timeSpent: d.timeSpent ?? 0, timestamp: Date.now() },
            ];
          }

          const sessionLog = [
            ...course.sessionLog.slice(-(MAX_SESSION_LOG - 1)),
            { mode, percent, totalTime, questionCount: details.length,
              completedAt: Date.now() },
          ];

          const today     = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86_400_000).toDateString();
          const streak = { ...course.streak };
          if (streak.lastDate !== today) {
            streak.current = streak.lastDate === yesterday ? streak.current + 1 : 1;
            streak.longest = Math.max(streak.longest, streak.current);
            streak.lastDate = today;
          }

          return {
            courses: {
              ...state.courses,
              [courseId]: { ...course, mistakeCount, questionHistory, sessionLog, streak },
            },
          };
        });
      },

      clearCourse(courseId) {
        set(state => ({
          courses: { ...state.courses, [courseId]: empty() },
        }));
      },
    }),
    {
      name: 'med_analytics_v1',
      partialize: s => ({ courses: s.courses }),
    }
  )
);
