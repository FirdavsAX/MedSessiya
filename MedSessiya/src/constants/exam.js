export const EXAM_DURATION_MINUTES = 60;
export const PRACTICE_DURATION_MINUTES = 0;
export const RANDOM_COUNT = 25;
export const PASSING_SCORE = 70;
export const MAX_SESSION_LOG = 50;
export const MAX_QUESTION_HISTORY = 20;

export const COURSES = [
  { id: 'anatomiya', title: 'Anatomiya', icon: '🫀', color: 'blue' },
  { id: 'gistalogiya', title: 'Gistologiya', icon: '🔬', color: 'violet', badge: 'Yangilangan' },
];

export const MODES = [
  { id: 'exam',     label: 'Imtihon',             icon: '📝', desc: 'Oxirida natija, vaqt bor' },
  { id: 'practice', label: 'Mashq',                icon: '💡', desc: 'Har savolda darhol natija' },
  { id: 'adaptive', label: 'Moslashuvchan',        icon: '🧠', desc: "Ko'p xato → tez-tez chiqadi" },
  { id: 'review',   label: "Xatolarni ko'rish",    icon: '🔄', desc: "Faqat noto'g'ri javoblar" },
];

export const CONFIDENCE_LEVELS = [
  { id: 'past',   label: 'Past',   color: 'red'    },
  { id: 'orta',   label: "O'rta",  color: 'yellow' },
  { id: 'yuqori', label: 'Yuqori', color: 'green'  },
];

export const SPACED_REPETITION_DAYS = {
  wrong:        1,
  correct_orta: 3,
  correct_high: 7,
};
