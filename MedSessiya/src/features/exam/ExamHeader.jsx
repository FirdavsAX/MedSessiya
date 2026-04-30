import Timer from '../../components/Timer.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';

export default function ExamHeader({
  courseTitle, currentIndex, total, answeredCount,
  timeLeft, timerEnabled, onFinish,
}) {
  const warning = timerEnabled && timeLeft <= 300;
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-sm">{courseTitle}</span>
          <div className="flex items-center gap-4">
            {timerEnabled && <Timer seconds={timeLeft} warning={warning} />}
            <button
              onClick={onFinish}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-medium transition-all"
            >
              Yakunlash
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>Savol {currentIndex + 1}/{total}</span>
          <span>·</span>
          <span>{answeredCount} ta javoblangan</span>
        </div>
        <ProgressBar value={answeredCount} max={total} />
      </div>
    </div>
  );
}
