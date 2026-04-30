import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore.js';
import { useAnalyticsStore } from '../store/analyticsStore.js';
import { useQuiz } from '../hooks/useQuiz.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { scoreAll, scoreQuestion } from '../services/scoringService.js';
import { COURSES } from '../constants/exam.js';
import QuestionCard from '../features/quiz/QuestionCard.jsx';
import FeedbackPanel from '../features/quiz/FeedbackPanel.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function PracticePage() {
  const navigate = useNavigate();
  const status      = useSessionStore(s => s.status);
  const courseId    = useSessionStore(s => s.courseId);
  const answers     = useSessionStore(s => s.answers);
  const mode        = useSessionStore(s => s.mode);
  const confidence  = useSessionStore(s => s.userConfidence);
  const timeSpent   = useSessionStore(s => s.timeSpentPerQuestion);
  const startedAt   = useSessionStore(s => s.startedAt);
  const finishSession = useSessionStore(s => s.finishSession);
  const recordSession = useAnalyticsStore(s => s.recordSession);

  const quiz = useQuiz();
  const [revealedIndex, setRevealedIndex] = useState(null);
  const revealed = revealedIndex === quiz.currentIndex;

  useEffect(() => {
    if (status === 'finished') {
      navigate('/exam/review', { replace: true });
    } else if (status !== 'active') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  const handleSubmitAnswer = useCallback(() => {
    if (quiz.selected.length > 0) setRevealedIndex(quiz.currentIndex);
  }, [quiz.currentIndex, quiz.selected]);

  const handleNext = useCallback(() => {
    if (quiz.isLast) {
      const totalTime = startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0;
      const result = {
        ...scoreAll(quiz.questions, answers, confidence, timeSpent),
        mode,
        totalTime,
        startedAt,
        finishedAt: Date.now(),
      };
      finishSession(result);
      recordSession(courseId, result);
      navigate('/exam/review', { replace: true });
    } else {
      quiz.goNext();
    }
  }, [quiz, answers, confidence, timeSpent, startedAt,
      finishSession, recordSession, courseId, mode, navigate]);

  useKeyboard({
    onOption: useCallback(i => !revealed && quiz.handleToggle(i), [quiz, revealed]),
    onNext:   useCallback(() => revealed ? handleNext() : handleSubmitAnswer(), [revealed, handleNext, handleSubmitAnswer]),
  });

  const courseTitle = COURSES.find(c => c.id === courseId)?.title ?? courseId;
  const score = quiz.question ? scoreQuestion(quiz.question, quiz.selected) : 0;

  // feedbacks — revealed bo'lgandan keyin ko'rsatiladi
  const feedbacks = useMemo(() => (
    revealed && quiz.question
      ? Object.fromEntries(
        quiz.question.options.map((opt, i) => {
          const sel = quiz.selected.includes(i);
          if (opt.isCorrect && sel)   return [i, 'correct'];
          if (!opt.isCorrect && sel)  return [i, 'wrong'];
          if (opt.isCorrect && !sel)  return [i, 'missed'];
          return [i, null];
        }).filter(([, v]) => v)
      )
      : null
  ), [quiz.question, quiz.selected, revealed]);

  if (status !== 'active') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 text-sm">{courseTitle} · Mashq</span>
            <span className="text-xs text-gray-500">
              {quiz.currentIndex + 1} / {quiz.totalQuestions}
            </span>
          </div>
          <ProgressBar value={quiz.currentIndex + (revealed ? 1 : 0)} max={quiz.totalQuestions} />
        </div>
      </div>

      {/* Asosiy kontent */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <QuestionCard
          question={quiz.question}
          selected={quiz.selected}
          onToggle={quiz.handleToggle}
          feedbacks={feedbacks}
          disabled={revealed}
        />

        {!revealed ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={quiz.selected.length === 0}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-40"
          >
            Tekshirish
          </button>
        ) : (
          <FeedbackPanel
            score={score}
            confidence={quiz.confidence}
            onConfidence={quiz.handleConfidence}
            onNext={handleNext}
            isLast={quiz.isLast}
          />
        )}
      </div>
    </div>
  );
}
