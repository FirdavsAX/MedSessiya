import { CONFIDENCE_LEVELS } from '../../constants/exam.js';

const COLOR_MAP = {
  red:    'bg-red-100 text-red-700 border-red-300 hover:bg-red-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200',
  green:  'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
};

export default function ConfidenceInput({ value, onChange }) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs text-gray-500 mb-2">Ishonchingiz darajasi?</p>
      <div className="flex gap-2">
        {CONFIDENCE_LEVELS.map(level => (
          <button
            key={level.id}
            onClick={() => onChange(level.id)}
            className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              value === level.id
                ? `${COLOR_MAP[level.color]} ring-2 ring-offset-1 ring-current`
                : `${COLOR_MAP[level.color]} opacity-70`
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}
