import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore.js';
import { useAnalyticsStore } from '../store/analyticsStore.js';
import { useQuiz } from '../hooks/useQuiz.js';
import { useTimer } from '../hooks/useTimer.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { scoreAll } from '../services/scoringService.js';
import { COURSES } from '../constants/exam.js';
import ExamHeader from '../features/exam/ExamHeader.jsx';
import ExamFooter from '../features/exam/ExamFooter.jsx';
import SubmitDialog from '../features/exam/SubmitDialog.jsx';
import QuestionCard from '../features/quiz/QuestionCard.jsx';
import QuestionNav from '../features/quiz/QuestionNav.jsx';

export default function ExamPage() {
  const navigate = useNavigate();
  const status      = useSessionStore(s => s.status);
  const courseId    = useSessionStore(s => s.courseId);
  const timerSecs   = useSessionStore(s => s.timerSeconds);
  const answers     = useSessionStore(s => s.answers);
  const confidence  = useSessionStore(s => s.userConfidence);
  const timeSpent   = useSessionStore(s => s.timeSpentPerQuestion);
  const finishSession = useSessionStore(s => s.finishSession);
  const mode          = useSessionStore(s => s.mode);
  const startedAt     = useSessionStore(s => s.startedAt);
  const recordSession = useAnalyticsStore(s => s.recordSession);

  const quiz = useQuiz();
  const { timeLeft, expired, stop } = useTimer(timerSecs);
  const [showDialog, setShowDialog] = useState(false);

  // Guard: session yo'q → bosh sahifa
  useEffect(() => {
    if (status === 'finished') {
      navigate('/exam/review', { replace: true });
    } else if (status !== 'active') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  const doFinish = useCallback(() => {
    stop();
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
  }, [quiz.questions, answers, confidence, timeSpent, startedAt,
      finishSession, recordSession, courseId, mode, navigate, stop]);

  // Vaqt tugasa avtomatik yakunlash
  useEffect(() => {
    if (expired && timerSecs > 0) doFinish();
  }, [expired, timerSecs, doFinish]);

  // Klaviatura
  useKeyboard({
    onOption: useCallback(i => quiz.handleToggle(i), [quiz]),
    onNext:   useCallback(() => quiz.isLast ? setShowDialog(true) : quiz.goNext(), [quiz]),
    onPrev:   useCallback(() => quiz.goPrev(), [quiz]),
  });

  if (status !== 'active') return null;

  const courseTitle  = COURSES.find(c => c.id === courseId)?.title ?? courseId;
  const unanswered   = quiz.totalQuestions - quiz.answeredCount;
  const timerEnabled = timerSecs > 0;
  const handleNext = () => {
    if (quiz.isLast) setShowDialog(true);
    else quiz.goNext();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ExamHeader
        courseTitle={courseTitle}
        currentIndex={quiz.currentIndex}
        total={quiz.totalQuestions}
        answeredCount={quiz.answeredCount}
        timeLeft={timeLeft}
        timerEnabled={timerEnabled}
        onFinish={() => setShowDialog(true)}
      />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-6">
        <QuestionCard
          question={quiz.question}
          selected={quiz.selected}
          onToggle={quiz.handleToggle}
        />

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-medium">Savollar</p>
          <QuestionNav
            total={quiz.totalQuestions}
            answers={answers}
            current={quiz.currentIndex}
            onSelect={quiz.navigateTo}
          />
        </div>
      </div>

      <ExamFooter
        onPrev={quiz.goPrev}
        onNext={handleNext}
        isFirst={quiz.isFirst}
        isLast={quiz.isLast}
      />

      {showDialog && (
        <SubmitDialog
          unanswered={unanswered}
          onConfirm={doFinish}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
