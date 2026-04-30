import { memo } from 'react';

const ResultCard = memo(function ResultCard({ index, detail }) {
  const { question, options, selected, score } = detail;

  return (
    <div className={`rounded-xl border p-4 ${
      score === 100 ? 'border-green-200 bg-green-50'
      : score > 0   ? 'border-yellow-200 bg-yellow-50'
      : 'border-red-200 bg-red-50'
    }`}>
      <div className="flex items-start gap-2 mb-3">
        <span className="text-xs font-bold text-gray-400 mt-0.5 flex-shrink-0">
          #{index + 1}
        </span>
        <p className="text-sm font-medium text-gray-900 leading-snug">{question}</p>
        <span className={`ml-auto flex-shrink-0 text-xs font-bold ${
          score === 100 ? 'text-green-600' : score > 0 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {score}%
        </span>
      </div>

      <div className="space-y-1.5">
        {options.map((opt, i) => {
          const wasSelected = selected.includes(i);
          let cls = 'border-gray-200 bg-white text-gray-600';
          if (opt.isCorrect && wasSelected) cls = 'border-green-400 bg-green-100 text-green-800';
          else if (opt.isCorrect)           cls = 'border-green-300 bg-green-50  text-green-700';
          else if (wasSelected)             cls = 'border-red-400   bg-red-100   text-red-800';

          return (
            <div key={i} className={`text-xs px-3 py-1.5 rounded-lg border ${cls}`}>
              {wasSelected && <span className="mr-1">{opt.isCorrect ? '✓' : '✗'}</span>}
              {!wasSelected && opt.isCorrect && <span className="mr-1">○</span>}
              {opt.text}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ResultCard;
