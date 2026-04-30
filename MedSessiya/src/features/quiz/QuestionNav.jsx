import { memo } from 'react';

const QuestionNav = memo(function QuestionNav({ total, answers, current, onSelect }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const answered = (answers[i] || []).length > 0;
        const active   = i === current;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
              active
                ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                : answered
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
});

export default QuestionNav;
