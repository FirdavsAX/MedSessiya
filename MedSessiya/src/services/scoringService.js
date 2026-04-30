/**
 * Yangi format: options[i].isCorrect (boolean)
 * Multi-answer: noto'g'ri tanlash uchun jarima bor
 */
export function scoreQuestion(question, selectedIndexes) {
  if (!question?.options?.length || !selectedIndexes?.length) return 0;

  const selected = [...new Set(selectedIndexes)]
    .filter(idx => Number.isInteger(idx) && idx >= 0 && idx < question.options.length);
  if (selected.length === 0) return 0;

  const correctIndexes = question.options
    .map((o, i) => (o.isCorrect ? i : -1))
    .filter(i => i !== -1);
  if (correctIndexes.length === 0) return 0;

  if (question.type === 'single') {
    return selected.length === 1 && selected[0] === correctIndexes[0] ? 100 : 0;
  }

  // Multi: qisman hisob + jarima
  let correctSelected = 0;
  let wrongSelected   = 0;
  for (const idx of selected) {
    if (question.options[idx]?.isCorrect) correctSelected++;
    else wrongSelected++;
  }

  const raw = (correctSelected - wrongSelected) / correctIndexes.length * 100;
  return Math.max(0, Math.round(raw));
}

export function scoreAll(questions, answers, userConfidence = {}, timeSpent = {}) {
  let total = 0;
  const details = questions.map((q, idx) => {
    const selected = answers[idx] || [];
    const score    = scoreQuestion(q, selected);
    total += score;
    return {
      questionId:  q.id,
      question:    q.question,
      options:     q.options,
      selected,
      score,
      confidence:  userConfidence[idx] ?? null,
      timeSpent:   timeSpent[idx]  ?? 0,
    };
  });

  const maxTotal = questions.length * 100;
  const percent  = questions.length ? Math.round((total / maxTotal) * 100) : 0;

  return { total, maxTotal, percent, details };
}
