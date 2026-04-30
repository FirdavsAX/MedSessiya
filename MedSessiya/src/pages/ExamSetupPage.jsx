import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSession } from '../hooks/useSession.js';
import { loadCourse } from '../services/questionService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { COURSES, MODES } from '../constants/exam.js';

export default function ExamSetupPage() {
  const { courseId }    = useParams();
  const [params]        = useSearchParams();
  const mode            = params.get('mode') || 'exam';
  const navigate        = useNavigate();
  const { beginSession } = useSession();

  const [totalQ,   setTotalQ]   = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [starting, setStarting] = useState(false);
  const [error,    setError]    = useState(null);

  // Form
  const [selMode,       setSelMode]       = useState('random');
  const [start,         setStart]         = useState(1);
  const [end,           setEnd]           = useState(50);
  const [count,         setCount]         = useState(25);
  const [timerMinutes,  setTimerMinutes]  = useState(60);

  useEffect(() => {
    loadCourse(courseId)
      .then(c => {
        setTotalQ(c.questions.length);
        setEnd(Math.min(50, c.questions.length));
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [courseId]);

  const courseTitle = COURSES.find(c => c.id === courseId)?.title ?? courseId;
  const modeLabel   = MODES.find(m => m.id === mode)?.label ?? mode;
  const needsSetup  = mode === 'exam' || mode === 'practice';

  const handleStart = async () => {
    setError(null);
    setStarting(true);
    try {
      const opts =
        !needsSetup             ? {} :
        selMode === 'range'     ? { start, end, timerMinutes } :
        selMode === 'random'    ? { random: true, count, timerMinutes } :
        { timerMinutes };
      await beginSession(mode, courseId, opts);
    } catch (e) {
      setError(e.message);
      setStarting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline mb-6 block">
          ← Ortga
        </button>

        <h1 className="text-2xl font-bold text-gray-900">{courseTitle}</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">
          {modeLabel} · Jami {totalQ} ta savol
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5 text-sm">
            {error}
          </div>
        )}

        {!needsSetup ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 text-sm text-gray-600">
            {mode === 'adaptive'
              ? "Ko'p xato qilingan savollar og'irroq holda tanlanadi."
              : "Faqat noto'g'ri javob berilgan savollar ko'rsatiladi."}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 space-y-5">

            {/* Tanlash usuli */}
            <div className="flex gap-2">
              {[
                { id: 'random', label: 'Tasodifiy' },
                { id: 'range',  label: 'Diapazon'  },
                { id: 'all',    label: 'Hammasi'   },
              ].map(o => (
                <button key={o.id} onClick={() => setSelMode(o.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    selMode === o.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {o.label}
                </button>
              ))}
            </div>

            {selMode === 'random' && (
              <label className="block">
                <span className="text-xs text-gray-500 block mb-1">Savol soni</span>
                <input type="number" value={count} min={1} max={totalQ}
                  onChange={e => setCount(Math.max(1, Math.min(totalQ, +e.target.value || 1)))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </label>
            )}

            {selMode === 'range' && (
              <div className="flex gap-3">
                {[
                  { label: 'Boshlanish', val: start, set: v => setStart(Math.max(1, Math.min(end, v))),  max: end },
                  { label: 'Tugash',     val: end,   set: v => setEnd(Math.max(start, Math.min(totalQ, v))), max: totalQ },
                ].map(f => (
                  <label key={f.label} className="flex-1 block">
                    <span className="text-xs text-gray-500 block mb-1">{f.label}</span>
                    <input type="number" value={f.val} min={1} max={f.max}
                      onChange={e => f.set(+e.target.value || 1)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                  </label>
                ))}
              </div>
            )}

            {mode === 'exam' && (
              <label className="block">
                <span className="text-xs text-gray-500 block mb-1">Vaqt chegarasi (daqiqa)</span>
                <input type="number" value={timerMinutes} min={1} max={180}
                  onChange={e => setTimerMinutes(Math.max(1, +e.target.value || 60))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </label>
            )}
          </div>
        )}

        <button onClick={handleStart} disabled={starting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50">
          {starting ? 'Yuklanmoqda...' : 'Boshlash'}
        </button>
      </div>
    </div>
  );
}
