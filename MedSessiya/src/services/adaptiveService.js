import { SPACED_REPETITION_DAYS } from '../constants/exam.js';

/**
 * Xato ko'p bo'lgan savollarni ko'proq tanlash uchun og'irlik hisoblash.
 */
export function getAdaptiveQuestions(questions, mistakeCount, count = 25) {
  if (!questions.length) return [];

  const weighted = questions.map(q => ({
    q,
    weight: 1 + (mistakeCount[q.id] || 0) * 2,
  }));

  const result = [];
  const pool   = [...weighted];

  while (result.length < Math.min(count, pool.length)) {
    const total = pool.reduce((s, w) => s + w.weight, 0);
    let r = Math.random() * total;

    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].weight;
      if (r <= 0) {
        result.push(pool[i].q);
        pool.splice(i, 1);
        break;
      }
    }
  }

  return result;
}

/**
 * Keyingi takrorlash sanasini hisoblaydi (spaced repetition).
 */
export function getNextReviewDate(questionId, questionHistory) {
  const history = questionHistory?.[questionId];
  if (!history?.length) return Date.now();

  const last = history[history.length - 1];
  let days = SPACED_REPETITION_DAYS.wrong;

  if (last.score >= 100) {
    days = last.confidence === 'yuqori'
      ? SPACED_REPETITION_DAYS.correct_high
      : SPACED_REPETITION_DAYS.correct_orta;
  }

  return last.timestamp + days * 86_400_000;
}

export function getDueQuestionIds(questions, questionHistory) {
  const now = Date.now();
  return questions
    .filter(q => getNextReviewDate(q.id, questionHistory) <= now)
    .map(q => q.id);
}
