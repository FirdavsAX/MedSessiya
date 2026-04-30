import { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import { useTimer } from './hooks/useTimer';
import { scoreAll } from './services/scoringService';
import QuestionCard from './components/QuestionCard';
import Timer from './components/Timer';
import RangeSelector from './components/RangeSelector';
import QuestionNav from './components/QuestionNav';
import ResultCard from './components/ResultCard';
import { shuffle } from './utils/shuffle';

const TEST_TIME = 60 * 60; // 1 hour
const RANDOM_TIME = 25 * 60; // 25 minutes
const RANDOM_COUNT = 25;

export default function App() {
  const [range, setRange] = useState(null); // start with null so RangeSelector shows
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);

  const [testTimeSeconds, setTestTimeSeconds] = useState(0);
  const timer = useTimer(testTimeSeconds);

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [preparing, setPreparing] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  // When range is selected, slice and shuffle answers
  useEffect(() => {
    if (!range) return;
    setPreparing(true);

    // small timeout to show loading state for a better UX on large sets
    setTimeout(() => {
      const selected = range.random
        ? shuffle([...questionsData]).slice(0, RANDOM_COUNT)
        : questionsData.slice(range.start - 1, range.end);

      const shuffled = selected.map((q) => ({
        ...q,
        answers: Array.isArray(q.answers)
          ? shuffle(q.answers)
          : q.answers || [],
      }));

      setShuffledQuestions(shuffled);
      setCurrent(0);
      setPreparing(false);
    }, 100);
  }, [range]);

  // Show range selector first
  if (!range) {
    return (
      <RangeSelector
        total={questionsData.length}
        onStart={(opts) => {
          if (opts && opts.random) {
            setRange({ random: true });
            setTestTimeSeconds(RANDOM_TIME);
          } else {
            setRange({ start: opts.start, end: opts.end });
            setTestTimeSeconds(TEST_TIME);
          }
        }}
      />
    );
  }

  // Preparing/loading state
  if (preparing) {
    return (
      <div className='p-6 max-w-4xl mx-auto space-y-6'>
        <div className='text-center p-6 bg-white rounded shadow'>
          <p className='text-lg font-medium'>Preparing questions…</p>
          <p className='text-sm text-gray-500 mt-2'>Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Guard against empty questions after preparing
  if (shuffledQuestions.length === 0) {
    return (
      <div className='p-6 max-w-4xl mx-auto space-y-6'>
        <div className='text-center text-red-600'>
          No questions available in this range.
        </div>
      </div>
    );
  }

  const question = shuffledQuestions[current];
  const selected = answers[current] || [];

  const toggleAnswer = (index) => {
    setAnswers((prev) => {
      const arr = prev[current] || [];
      return {
        ...prev,
        [current]: arr.includes(index)
          ? arr.filter((i) => i !== index)
          : [...arr, index],
      };
    });
  };

  const finishTest = () => {
    timer.stop();
    const res = scoreAll(shuffledQuestions, answers);
    setResult(res);
    setFinished(true);
  };

  if (finished) {
    const detail = result.details[reviewIndex] || {};

    return (
      <div className='p-6 max-w-4xl mx-auto space-y-6'>
        <h1 className='text-2xl font-bold'>Test Results: {result.percent}%</h1>

        <div className='flex items-center gap-4'>
          <div className='grid grid-cols-6 gap-2 flex-1'>
            {result.details.map((r, i) => (
              <button
                key={i}
                onClick={() => setReviewIndex(i)}
                className={`px-2 py-1 text-sm rounded text-white ${
                  i === reviewIndex
                    ? 'bg-blue-600'
                    : r.score > 0
                    ? 'bg-green-600'
                    : 'bg-red-500'
                }`}
              >
                Q{i + 1}
              </button>
            ))}
          </div>

          <div className='ml-auto'>
            <button
              onClick={() => {
                setFinished(false);
                setResult(null);
                setShuffledQuestions([]);
                setRange(null);
                setTestTimeSeconds(0);
              }}
              className='bg-gray-200 px-3 py-1 rounded'
            >
              Restart
            </button>
          </div>
        </div>

        <div className='bg-white p-4 rounded shadow'>
          <ResultCard
            key={reviewIndex}
            index={reviewIndex}
            question={detail.question}
            score={detail.score}
            answers={detail.answers}
            selected={detail.selected}
          />

          <div className='flex justify-between mt-4'>
            <button
              onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
              disabled={reviewIndex === 0}
              className='bg-gray-200 px-4 py-2 rounded disabled:opacity-50'
            >
              Previous
            </button>

            <div className='flex gap-2'>
              <button
                onClick={() =>
                  setReviewIndex((i) =>
                    Math.min(result.details.length - 1, i + 1)
                  )
                }
                disabled={reviewIndex >= result.details.length - 1}
                className='bg-gray-200 px-4 py-2 rounded disabled:opacity-50'
              >
                Next
              </button>

              <button
                onClick={() => {
                  // show all collapsed list below
                  setReviewIndex(0);
                }}
                className='bg-blue-600 text-white px-4 py-2 rounded'
              >
                Show All
              </button>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          {result.details.map((r, i) => (
            <ResultCard
              key={`all-${i}`}
              question={r.question}
              score={r.score}
              answers={r.answers}
              selected={r.selected}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Timer seconds={timer.timeLeft} />
          {range && range.random && (
            <span className='text-sm bg-yellow-100 px-2 py-1 rounded'>
              Random Mode — 25 questions
            </span>
          )}
        </div>

        <span>
          Question {current + 1} / {shuffledQuestions.length}
        </span>
      </div>

      {question && (
        <QuestionCard
          index={current}
          question={question.question}
          answers={question.answers}
          selected={selected}
          onChange={toggleAnswer}
        />
      )}

      <QuestionNav
        total={shuffledQuestions.length}
        answers={answers}
        current={current}
        onSelect={setCurrent}
      />

      <div className='flex gap-4 mt-4'>
        <button
          onClick={finishTest}
          className='bg-red-600 text-white px-6 py-2 rounded'
        >
          Finish
        </button>

        {current < shuffledQuestions.length - 1 && (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className='bg-blue-600 text-white px-6 py-2 rounded'
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
