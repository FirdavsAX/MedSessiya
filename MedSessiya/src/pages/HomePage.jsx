import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalyticsStore } from '../store/analyticsStore.js';
import { COURSES, MODES } from '../constants/exam.js';

export default function HomePage() {
  const navigate = useNavigate();
  const courses  = useAnalyticsStore(s => s.courses);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleMode = (modeId) => {
    navigate(`/exam/setup/${selectedCourse}?mode=${modeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Sarlavha */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Imtihon Tayyorgarlik Tizimi
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Kursni tanlang va mashq boshlang</p>
        </div>

        {/* Kurslar */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {COURSES.map(c => {
            const stats      = courses[c.id] || {};
            const sessions   = stats.sessionLog?.length || 0;
            const lastPct    = stats.sessionLog?.at(-1)?.percent;
            const streak     = stats.streak?.current || 0;
            const isSelected = selectedCourse === c.id;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCourse(isSelected ? null : c.id)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-3">{c.icon}</div>
                <h2 className="font-semibold text-gray-900 text-base">{c.title}</h2>
                <div className="mt-2 space-y-0.5 text-xs text-gray-500">
                  {sessions > 0 ? (
                    <>
                      <div>{sessions} sessiya o'tildi</div>
                      {lastPct != null && <div>Oxirgi: {lastPct}%</div>}
                      {streak > 0 && <div>🔥 {streak} kunlik seria</div>}
                    </>
                  ) : (
                    <div>Hali boshlanmagan</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Rejimlar */}
        {selectedCourse && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
              Rejim tanlang
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleMode(m.id)}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-left transition-all"
                >
                  <div className="text-2xl mb-2">{m.icon}</div>
                  <div className="font-medium text-gray-900 text-sm">{m.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-snug">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Statistika havolasi */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/stats')}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            📊 Statistikani ko'rish
          </button>
        </div>
      </div>
    </div>
  );
}
