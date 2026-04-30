import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore.js';
import { useSettingsStore } from '../store/settingsStore.js';
import { useAnalyticsStore } from '../store/analyticsStore.js';
import { selectQuestions } from '../services/questionService.js';
import { getAdaptiveQuestions } from '../services/adaptiveService.js';

export function useSession() {
  const navigate      = useNavigate();
  const startSession  = useSessionStore(s => s.startSession);
  const resetSession  = useSessionStore(s => s.resetSession);
  const status        = useSessionStore(s => s.status);
  const mode          = useSessionStore(s => s.mode);
  const courseId      = useSessionStore(s => s.courseId);

  const { shuffleAnswers, examDurationMinutes, randomCount } = useSettingsStore();
  const courses = useAnalyticsStore(s => s.courses);

  const beginSession = useCallback(async (sessionMode, cId, opts = {}) => {
    const mistakeCount = courses[cId]?.mistakeCount || {};

    let questions;

    if (sessionMode === 'adaptive') {
      const all = await selectQuestions(cId, { shuffleAnswers });
      questions = getAdaptiveQuestions(all, mistakeCount, opts.count || randomCount);
    } else if (sessionMode === 'review') {
      const all = await selectQuestions(cId, { shuffleAnswers });
      const mistakeIds = new Set(
        Object.entries(mistakeCount).filter(([, v]) => v > 0).map(([id]) => parseInt(id))
      );
      questions = all.filter(q => mistakeIds.has(q.id));
    } else {
      questions = await selectQuestions(cId, { ...opts, shuffleAnswers });
    }

    if (!questions.length) {
      throw new Error(
        sessionMode === 'review'
          ? "Hali xato qilingan savollar yo'q. Avval imtihon yoki mashq o'ting."
          : 'Savollar topilmadi.'
      );
    }

    const timerSeconds = sessionMode === 'exam'
      ? (opts.timerMinutes ?? examDurationMinutes) * 60
      : 0;

    startSession(sessionMode, cId, questions, timerSeconds);
    navigate(sessionMode === 'practice' ? '/practice' : '/exam');
  }, [startSession, shuffleAnswers, examDurationMinutes, randomCount, courses, navigate]);

  return { beginSession, resetSession, status, mode, courseId };
}
