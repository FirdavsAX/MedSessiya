import Badge from '../../components/Badge.jsx';
import { formatDuration } from '../../utils/formatTime.js';
import { useSettingsStore } from '../../store/settingsStore.js';

export default function ResultSummary({ percent, totalTime, questionCount, courseTitle, mode }) {
  const { passingScore } = useSettingsStore();
  const passed = percent >= passingScore;

  const MODE_LABELS = {
    exam: 'Imtihon', practice: 'Mashq', adaptive: 'Moslashuvchan', review: "Xatolar ko'rib chiqish",
  };

  return (
    <div className={`rounded-2xl border-2 p-6 ${
      passed ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{passed ? '🏆' : '📚'}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {percent}% — {passed ? "O'tdingiz!" : "O'tmadingiz"}
          </h2>
          <p className="text-sm text-gray-500">{courseTitle} · {MODE_LABELS[mode] ?? mode}</p>
        </div>
        <Badge label={passed ? "O'tdi" : "O'tmadi"} color={passed ? 'green' : 'red'} className="ml-auto" />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-xl p-3">
          <div className="text-2xl font-bold text-gray-900">{percent}%</div>
          <div className="text-xs text-gray-500 mt-1">Natija</div>
        </div>
        <div className="bg-white rounded-xl p-3">
          <div className="text-2xl font-bold text-gray-900">{questionCount}</div>
          <div className="text-xs text-gray-500 mt-1">Savollar</div>
        </div>
        <div className="bg-white rounded-xl p-3">
          <div className="text-2xl font-bold text-gray-900">{formatDuration(totalTime)}</div>
          <div className="text-xs text-gray-500 mt-1">Vaqt</div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        O'tish bali: {passingScore}%
      </p>
    </div>
  );
}
