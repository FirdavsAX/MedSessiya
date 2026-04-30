import { shuffle } from '../utils/shuffle.js';

const cache = {};

export async function loadCourse(courseId) {
  if (cache[courseId]) return cache[courseId];

  try {
    // Vite dynamic import — har kurs alohida chunk
    const mod = await import(`../data/${courseId}.json`);
    cache[courseId] = mod.default;
    return cache[courseId];
  } catch {
    throw new Error(
      `${courseId}.json topilmadi. Avval "npm run parse" buyrug'ini ishlatib JSON fayllarini yarating.`
    );
  }
}

/**
 * @param {string} courseId
 * @param {object} opts
 *   opts.random        — tasodifiy N ta savol
 *   opts.count         — tasodifiy savol soni
 *   opts.start/end     — diapazon (1-based)
 *   opts.shuffleAnswers — javoblarni aralashtir
 *   opts.questionIds   — faqat shu ID'lar (review/adaptive uchun)
 */
export async function selectQuestions(courseId, opts = {}) {
  const course = await loadCourse(courseId);
  let pool = [...course.questions];

  if (opts.questionIds) {
    const ids = new Set(opts.questionIds);
    pool = pool.filter(q => ids.has(q.id));
  } else if (opts.random) {
    pool = shuffle(pool).slice(0, opts.count || 25);
  } else if (opts.start != null && opts.end != null) {
    pool = pool.slice(opts.start - 1, opts.end);
  }

  if (opts.shuffleAnswers) {
    pool = pool.map(q => ({ ...q, options: shuffle([...q.options]) }));
  }

  return pool;
}
