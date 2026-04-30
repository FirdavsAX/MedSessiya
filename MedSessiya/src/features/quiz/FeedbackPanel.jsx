import ConfidenceInput from './ConfidenceInput.jsx';

export default function FeedbackPanel({ score, confidence, onConfidence, onNext, isLast }) {
  const isCorrect = score === 100;
  const isPartial = score > 0 && score < 100;

  return (
    <div className={`rounded-xl border-2 p-4 mt-4 ${
      isCorrect ? 'border-green-400 bg-green-50'
      : isPartial ? 'border-yellow-400 bg-yellow-50'
      : 'border-red-400 bg-red-50'
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">
          {isCorrect ? '✅' : isPartial ? '⚠️' : '❌'}
        </span>
        <span className={`font-semibold text-sm ${
          isCorrect ? 'text-green-800' : isPartial ? 'text-yellow-800' : 'text-red-800'
        }`}>
          {isCorrect ? "To'g'ri!" : isPartial ? `Qisman to'g'ri (${score}%)` : "Noto'g'ri"}
        </span>
      </div>

      <ConfidenceInput value={confidence} onChange={onConfidence} />

      <button
        onClick={onNext}
        className="mt-3 w-full py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-all"
      >
        {isLast ? 'Yakunlash' : 'Keyingi →'}
      </button>
    </div>
  );
}
