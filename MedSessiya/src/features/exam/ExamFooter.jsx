export default function ExamFooter({ onPrev, onNext, isFirst, isLast }) {
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0">
      <div className="max-w-3xl mx-auto flex gap-3">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {'<- Oldingi'}
        </button>
        <button
          onClick={onNext}
          className={`flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-all ${
            isLast ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLast ? 'Yakunlash' : 'Keyingi ->'}
        </button>
      </div>
    </div>
  );
}
