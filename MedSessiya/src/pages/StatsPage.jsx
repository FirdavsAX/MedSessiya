import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalyticsStore } from '../store/analyticsStore.js';
import { COURSES } from '../constants/exam.js';
import { formatDuration } from '../utils/formatTime.js';

export default function StatsPage() {
  const navigate = useNavigate();
  const courses  = useAnalyticsStore(s => s.courses);
  const clearCourse = useAnalyticsStore(s => s.clearCourse);
  const [tab, setTab] = useState(COURSES[0].id);

  const data     = courses[tab] || {};
  const sessions = data.sessionLog   || [];
  const mistakes = data.mistakeCount || {};
  const streak   = data.streak       || {};

  const avgPct  = sessions.length
    ? Math.round(sessions.reduce((s, r) => s + r.percent, 0) / sessions.length) : 0;
  const bestPct = sessions.length ? Math.max(...sessions.map(s => s.percent)) : 0;
  const totalMistakes = Object.values(mistakes).reduce((s, v) => s + v, 0);

  const topMistakes = Object.entries(mistakes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const recentSessions = [...sessions].reverse().slice(0, 10);

  const handleClear = () => {
    if (window.confirm(`${COURSES.find(c => c.id === tab)?.title} statistikasini tozalaysizmi?`)) {
      clearCourse(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">
            ← Ortga
          </button>
          <h1 className="font-semibold text-gray-900 text-sm">Statistika</h1>
          <button onClick={handleClear} className="text-xs text-red-500 hover:underline">
            Tozalash
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Kurs tanlash */}
        <div className="flex gap-2">
          {COURSES.map(c => (
            <button key={c.id} onClick={() => setTab(c.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === c.id ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {c.icon} {c.title}
            </button>
          ))}
        </div>

        {/* Umumiy ko'rsatkichlar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "O'rtacha",  value: `${avgPct}%`,     sub: 'ball' },
            { label: 'Eng yaxshi', value: `${bestPct}%`,   sub: 'ball' },
            { label: 'Sessiyalar', value: sessions.length, sub: 'ta' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Seria */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{streak.current || 0}</div>
            <div className="text-xs text-gray-500 mt-1">🔥 Joriy seria</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-700">{streak.longest || 0}</div>
            <div className="text-xs text-gray-500 mt-1">🏆 Eng uzun seria</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">{totalMistakes}</div>
            <div className="text-xs text-gray-500 mt-1">❌ Jami xatolar</div>
          </div>
        </div>

        {/* Ko'p xato qilingan savollar */}
        {topMistakes.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Eng ko'p xato qilingan savollar
            </h3>
            <div className="space-y-2">
              {topMistakes.map(([id, count]) => (
                <div key={id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-8 flex-shrink-0">#{id}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{ width: `${Math.min(100, count * 10)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-red-600 w-8 text-right">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Oxirgi sessiyalar */}
        {recentSessions.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Oxirgi sessiyalar</h3>
            <div className="space-y-2">
              {recentSessions.map((s, i) => {
                const date = new Date(s.completedAt).toLocaleDateString('uz-UZ');
                const passed = s.percent >= 70;
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className={`text-lg ${passed ? '✅' : '❌'}`}>{passed ? '✅' : '❌'}</span>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{s.percent}%</span>
                      <span className="text-gray-400 ml-2 text-xs">
                        {s.questionCount} savol · {formatDuration(s.totalTime || 0)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-3">📊</div>
            <p>Hali sessiyalar yo'q</p>
            <button onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              Boshlash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
