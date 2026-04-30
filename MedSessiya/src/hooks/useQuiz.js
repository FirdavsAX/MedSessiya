import { useCallback, useMemo } from 'react';
import { useSessionStore } from '../store/sessionStore.js';
import { scoreQuestion } from '../services/scoringService.js';

export function useQuiz() {
  const questions        = useSessionStore(s => s.questions);
  const currentIndex     = useSessionStore(s => s.currentIndex);
  const answers          = useSessionStore(s => s.answers);
  const userConfidence   = useSessionStore(s => s.userConfidence);
  const status           = useSessionStore(s => s.status);
  const toggleAnswer     = useSessionStore(s => s.toggleAnswer);
  const navigateTo       = useSessionStore(s => s.navigateTo);
  const setConfidence    = useSessionStore(s => s.setConfidence);

  const question  = questions[currentIndex];
  const selected  = useMemo(() => answers[currentIndex] || [], [answers, currentIndex]);
  const isFirst   = currentIndex === 0;
  const isLast    = currentIndex === questions.length - 1;
  const confidence = userConfidence[currentIndex] ?? null;

  const answeredCount = useMemo(
    () => Object.values(answers).filter(a => a?.length > 0).length,
    [answers]
  );

  const currentScore = useMemo(
    () => (question ? scoreQuestion(question, selected) : 0),
    [question, selected]
  );

  const goNext = useCallback(() => {
    if (!isLast) navigateTo(currentIndex + 1);
  }, [currentIndex, isLast, navigateTo]);

  const goPrev = useCallback(() => {
    if (!isFirst) navigateTo(currentIndex - 1);
  }, [currentIndex, isFirst, navigateTo]);

  const handleToggle = useCallback(
    (optionIndex) => toggleAnswer(currentIndex, optionIndex),
    [currentIndex, toggleAnswer]
  );

  const handleConfidence = useCallback(
    (level) => setConfidence(currentIndex, level),
    [currentIndex, setConfidence]
  );

  return {
    question,
    questions,
    selected,
    currentIndex,
    totalQuestions: questions.length,
    isFirst,
    isLast,
    confidence,
    status,
    answeredCount,
    currentScore,
    goNext,
    goPrev,
    handleToggle,
    handleConfidence,
    navigateTo,
  };
}
