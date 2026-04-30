const COURSE_TITLES = {
  anatomiya:   'Anatomiya',
  gistalogiya: 'Gistologiya',
};

/**
 * Raw questions [{question, options:[{text,isCorrect}]}] dan
 * to'liq Course ob'ektini yaratadi.
 */
export function normalize(rawQuestions, courseId) {
  const questions = [];
  let id = 1;
  let skipped = 0;

  for (const raw of rawQuestions) {
    if (!raw.question?.trim()) { skipped++; continue; }

    const correctCount = raw.options.filter(o => o.isCorrect).length;
    if (correctCount === 0) {
      console.warn(`WARN: "${raw.question.slice(0, 40)}..." — to'g'ri javob yo'q, o'tkazildi`);
      skipped++;
      continue;
    }

    questions.push({
      id: id++,
      question: raw.question,
      type: correctCount === 1 ? 'single' : 'multi',
      difficulty: 1,
      options: raw.options,
    });
  }

  console.log(`✅ ${courseId}: ${questions.length} savol qabul qilindi, ${skipped} ta o'tkazildi`);

  return {
    courseId,
    title: COURSE_TITLES[courseId] ?? courseId,
    questions,
  };
}
