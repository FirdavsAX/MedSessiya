import { memo } from 'react';

// feedback: null | 'correct' | 'wrong' | 'missed'
const FEEDBACK_STYLES = {
  correct: 'border-green-500  bg-green-50  text-green-900',
  wrong:   'border-red-400    bg-red-50    text-red-900',
  missed:  'border-yellow-400 bg-yellow-50 text-yellow-900',
};

const AnswerOption = memo(function AnswerOption({
  index, text, isSelected, feedback = null, onToggle, disabled = false,
}) {
  const base = 'w-full text-left px-4 py-3 rounded-xl border-2 text-sm leading-snug transition-all';
  let style;

  if (feedback) {
    style = FEEDBACK_STYLES[feedback] ?? '';
  } else if (isSelected) {
    style = 'border-blue-500 bg-blue-50 text-blue-900';
  } else {
    style = disabled
      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50 cursor-pointer';
  }

  return (
    <button
      type="button"
      disabled={disabled && !feedback}
      onClick={() => !disabled && onToggle(index)}
      className={`${base} ${style}`}
    >
      <span className="inline-flex items-start gap-3">
        <span className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center text-xs font-bold ${
          isSelected || feedback
            ? 'border-current bg-current/10'
            : 'border-gray-300'
        }`}>
          {index + 1}
        </span>
        <span>{text}</span>
      </span>

      {feedback === 'correct' && <span className="ml-2 text-green-600 text-xs font-medium">✓ To'g'ri</span>}
      {feedback === 'wrong'   && <span className="ml-2 text-red-600   text-xs font-medium">✗ Noto'g'ri</span>}
      {feedback === 'missed'  && <span className="ml-2 text-yellow-600 text-xs font-medium">○ O'tkazib yuborildi</span>}
    </button>
  );
});

export default AnswerOption;
