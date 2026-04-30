import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore.js';
import { COURSES } from '../constants/exam.js';
import ResultSummary from '../features/results/ResultSummary.jsx';
import ResultCard from '../features/results/ResultCard.jsx';

const FILTERS = [
  { id: 'all',     label: 'Hammasi' },
  { id: 'wrong',   label: "Noto'g'ri" },
  { id: 'correct', label: "To'g'ri" },
];

export default function ReviewPage() {
  const navigate = useNavigate();
  const results  = useSessionStore(s => s.results);
  const courseId = useSessionStore(s => s.courseId);
  const mode     = useSessionStore(s => s.mode);
  const reset    = useSessionStore(s => s.resetSession);
  const [filter, setFilter] = useState('all');

  const courseTitle = COURSES.find(c => c.id === courseId)?.title ?? courseId;
  const details = useMemo(() => results?.details ?? [], [results]);
  const totalTime = results?.totalTime ?? 0;

  const filtered = useMemo(() => {
    if (filter === 'correct') return details.filter(d => d.score === 100);
    if (filter === 'wrong')   return details.filter(d => d.score < 100);
    return details;
  }, [details, filter]);

  const wrongCount   = details.filter(d => d.score < 100).length;
  const correctCount = details.filter(d => d.score === 100).length;

  const handleReset = () => { reset(); navigate('/'); };

  if (!results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-500">Natijalar topilmadi</p>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
          Bosh sahifa
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-sm">Natija</span>
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:underline"
          >
            Qayta boshlash
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <ResultSummary
          percent={results.percent}
          totalTime={totalTime}
          questionCount={details.length}
          courseTitle={courseTitle}
          mode={mode}
        />

        {/* Filter */}
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {f.label}
              {f.id === 'wrong'   && <span className="ml-1 text-xs opacity-70">({wrongCount})</span>}
              {f.id === 'correct' && <span className="ml-1 text-xs opacity-70">({correctCount})</span>}
            </button>
          ))}
        </div>

        {/* Natijalar ro'yxati */}
        <div className="space-y-3">
          {filtered.map((detail, i) => (
            <ResultCard
              key={detail.questionId ?? i}
              index={details.indexOf(detail)}
              detail={detail}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8">Bu filtr bo'yicha natija yo'q</p>
          )}
        </div>
      </div>
    </div>
  );
}
