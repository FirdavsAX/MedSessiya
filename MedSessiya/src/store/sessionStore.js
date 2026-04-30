import { create } from 'zustand';

export const useSessionStore = create((set) => ({
  mode:       null,   // 'exam' | 'practice' | 'adaptive' | 'review'
  courseId:   null,
  questions:  [],
  currentIndex: 0,
  answers:    {},     // { [questionIndex]: number[] }
  timeSpentPerQuestion: {},  // { [questionIndex]: seconds }
  userConfidence: {},        // { [questionIndex]: 'past'|'orta'|'yuqori' }
  results:    null,
  status:     'idle', // 'idle' | 'active' | 'finished'
  startedAt:  null,
  timerSeconds: 0,

  startSession(mode, courseId, questions, timerSeconds = 0) {
    set({
      mode, courseId, questions,
      currentIndex: 0,
      answers: {},
      timeSpentPerQuestion: {},
      userConfidence: {},
      results: null,
      status: 'active',
      startedAt: Date.now(),
      timerSeconds,
    });
  },

  toggleAnswer(questionIndex, optionIndex) {
    set(state => {
      const q = state.questions[questionIndex];
      if (!q) return {};
      const cur = state.answers[questionIndex] || [];

      const next = q.type === 'single'
        ? (cur[0] === optionIndex ? [] : [optionIndex])
        : cur.includes(optionIndex)
          ? cur.filter(i => i !== optionIndex)
          : [...cur, optionIndex];

      return { answers: { ...state.answers, [questionIndex]: next } };
    });
  },

  setAnswer(questionIndex, selectedIndexes) {
    set(state => ({ answers: { ...state.answers, [questionIndex]: selectedIndexes } }));
  },

  navigateTo(index) {
    set(state => ({
      currentIndex: Math.max(0, Math.min(index, state.questions.length - 1)),
    }));
  },

  setTimeSpent(questionIndex, seconds) {
    set(state => ({
      timeSpentPerQuestion: { ...state.timeSpentPerQuestion, [questionIndex]: seconds },
    }));
  },

  setConfidence(questionIndex, level) {
    set(state => ({
      userConfidence: { ...state.userConfidence, [questionIndex]: level },
    }));
  },

  finishSession(results) { set({ status: 'finished', results }); },

  resetSession() {
    set({
      mode: null, courseId: null, questions: [],
      currentIndex: 0, answers: {},
      timeSpentPerQuestion: {}, userConfidence: {},
      results: null, status: 'idle',
      startedAt: null, timerSeconds: 0,
    });
  },
}));
