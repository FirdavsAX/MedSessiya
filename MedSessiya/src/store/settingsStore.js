import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EXAM_DURATION_MINUTES, RANDOM_COUNT, PASSING_SCORE } from '../constants/exam.js';

export const useSettingsStore = create(
  persist(
    (set) => ({
      passingScore:         PASSING_SCORE,
      randomCount:          RANDOM_COUNT,
      examDurationMinutes:  EXAM_DURATION_MINUTES,
      shuffleAnswers:       true,
      shuffleQuestions:     false,

      update: (partial) => set(s => ({ ...s, ...partial })),
      reset:  () => set({
        passingScore: PASSING_SCORE,
        randomCount: RANDOM_COUNT,
        examDurationMinutes: EXAM_DURATION_MINUTES,
        shuffleAnswers: true,
        shuffleQuestions: false,
      }),
    }),
    { name: 'med_settings_v1' }
  )
);
