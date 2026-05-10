import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSession } from '../hooks/useSession.js';
import { loadCourse } from '../services/questionService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { COURSES, MODES } from '../constants/exam.js';

export default function ExamSetupPage() {
  const { courseId } = useParams();
  const [params] = useSearchParams();
  const mode = params.get('mode') || 'exam';
  const navigate = useNavigate();
  const { beginSession } = useSession();

  const [totalQ, setTotalQ] = useState(0);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  // Form
  const [selMode, setSelMode] = useState('random');
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(50);
  const [count, setCount] = useState(25);
  const [timerMinutes, setTimerMinutes] = useState(60);

  const [startInput, setStartInput] = useState('1');
  const [endInput, setEndInput] = useState('50');
  const [countInput, setCountInput] = useState('25');
  const [timerInput, setTimerInput] = useState('60');

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const parseNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : NaN;
  };

  useEffect(() => {
    loadCourse(courseId)
      .then((c) => {
        const total = c.questions.length;
        setTotalQ(total);
        const nextEnd = Math.min(50, total);
        setEnd(nextEnd);
        setEndInput(String(nextEnd));
        setStart(1);
        setStartInput('1');
        setCount(Math.min(25, total));
        setCountInput(String(Math.min(25, total)));
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [courseId]);

  const course = COURSES.find((c) => c.id === courseId);
  const courseTitle = course?.title ?? courseId;
  const modeLabel = MODES.find((m) => m.id === mode)?.label ?? mode;
  const needsSetup = mode === 'exam' || mode === 'practice';

  const normalizeCount = (value) => clamp(parseNumber(value), 1, totalQ);
  const normalizeStart = (value) => clamp(parseNumber(value), 1, end);
  const normalizeEnd = (value) => clamp(parseNumber(value), start, totalQ);
  const normalizeTimer = (value) => clamp(parseNumber(value), 1, 180);

  const handleStart = async () => {
    setError(null);
    setStarting(true);

    const nextCount = normalizeCount(countInput);
    const nextStart = normalizeStart(startInput);
    const nextEnd = normalizeEnd(endInput);
    const nextTimer = normalizeTimer(timerInput);

    setCount(nextCount);
    setCountInput(String(nextCount));
    setStart(nextStart);
    setStartInput(String(nextStart));
    setEnd(nextEnd);
    setEndInput(String(nextEnd));
    setTimerMinutes(nextTimer);
    setTimerInput(String(nextTimer));

    try {
      const opts = !needsSetup
        ? {}
        : selMode === 'range'
          ? { start: nextStart, end: nextEnd, timerMinutes: nextTimer }
          : selMode === 'random'
            ? { random: true, count: nextCount, timerMinutes: nextTimer }
            : { timerMinutes: nextTimer };
      await beginSession(mode, courseId, opts);
    } catch (e) {
      setError(e.message);
      setStarting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-lg mx-auto px-4 py-8'>
        <button
          onClick={() => navigate('/')}
          className='text-sm text-blue-600 hover:underline mb-6 block'
        >
          ← Ortga
        </button>

        <div className='flex items-center gap-2 flex-wrap'>
          <h1 className='text-2xl font-bold text-gray-900'>{courseTitle}</h1>
          {course?.badge && (
            <span className='px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 text-xs font-medium'>
              {course.badge}
            </span>
          )}
        </div>
        <p className='text-gray-500 text-sm mt-1 mb-6'>
          {modeLabel} · Jami {totalQ} ta savol
        </p>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5 text-sm'>
            {error}
          </div>
        )}

        {!needsSetup ? (
          <div className='bg-white rounded-2xl border border-gray-200 p-5 mb-6 text-sm text-gray-600'>
            {mode === 'adaptive'
              ? "Ko'p xato qilingan savollar og'irroq holda tanlanadi."
              : "Faqat noto'g'ri javob berilgan savollar ko'rsatiladi."}
          </div>
        ) : (
          <div className='bg-white rounded-2xl border border-gray-200 p-5 mb-6 space-y-5'>
            {/* Tanlash usuli */}
            <div className='flex gap-2'>
              {[
                { id: 'random', label: 'Tasodifiy' },
                { id: 'range', label: 'Diapazon' },
                { id: 'all', label: 'Hammasi' },
              ].map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelMode(o.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    selMode === o.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {selMode === 'random' && (
              <label className='block'>
                <span className='text-xs text-gray-500 block mb-1'>
                  Savol soni
                </span>
                <input
                  type='number'
                  value={countInput}
                  min={1}
                  max={totalQ}
                  onChange={(e) => setCountInput(e.target.value)}
                  onBlur={() => {
                    const next = normalizeCount(countInput);
                    setCount(next);
                    setCountInput(String(next));
                  }}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400'
                />
              </label>
            )}

            {selMode === 'range' && (
              <div className='flex gap-3'>
                {[
                  {
                    label: 'Boshlanish',
                    value: startInput,
                    setValue: setStartInput,
                    normalize: normalizeStart,
                    max: end,
                  },
                  {
                    label: 'Tugash',
                    value: endInput,
                    setValue: setEndInput,
                    normalize: normalizeEnd,
                    max: totalQ,
                  },
                ].map((f) => (
                  <label key={f.label} className='flex-1 block'>
                    <span className='text-xs text-gray-500 block mb-1'>
                      {f.label}
                    </span>
                    <input
                      type='number'
                      value={f.value}
                      min={1}
                      max={f.max}
                      onChange={(e) => f.setValue(e.target.value)}
                      onBlur={() => {
                        const next = f.normalize(f.value);
                        if (f.label === 'Boshlanish') {
                          setStart(next);
                          setStartInput(String(next));
                        } else {
                          setEnd(next);
                          setEndInput(String(next));
                        }
                      }}
                      className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400'
                    />
                  </label>
                ))}
              </div>
            )}

            {mode === 'exam' && (
              <label className='block'>
                <span className='text-xs text-gray-500 block mb-1'>
                  Vaqt chegarasi (daqiqa)
                </span>
                <input
                  type='number'
                  value={timerInput}
                  min={1}
                  max={180}
                  onChange={(e) => setTimerInput(e.target.value)}
                  onBlur={() => {
                    const next = normalizeTimer(timerInput);
                    setTimerMinutes(next);
                    setTimerInput(String(next));
                  }}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400'
                />
              </label>
            )}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={starting}
          className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50'
        >
          {starting ? 'Yuklanmoqda...' : 'Boshlash'}
        </button>
      </div>
    </div>
  );
}
