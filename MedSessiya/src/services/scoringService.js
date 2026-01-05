export function scoreQuestion(question, selectedIndexes) {
  let score = 0;

  selectedIndexes.forEach((element) => {
    score += question.answers[element].weight;
  });

  return Math.min(score, 100);
}

export function scoreAll(questions, userAnswers) {
  let total = 0;

  const details = questions.map((q, idx) => {
    const selected = userAnswers[idx] || [];
    const qScore = scoreQuestion(q, selected);
    total += qScore;

    return {
      question: q.question,
      selected,
      answers: q.answers,
      score: qScore,
      maxScore: 100,
    };
  });

  const maxTotal = questions.length * 100;
  const percent = Math.round((total / maxTotal) * 100);

  return { total, percent, details };
}
