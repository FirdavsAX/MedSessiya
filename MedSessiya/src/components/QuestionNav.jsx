export default function QuestionNav({ total, answers, current, onSelect }) {
  return (
    <div className='flex flex-wrap gap-2 mt-4'>
      {Array.from({ length: total }).map((_, i) => {
        const answered = answers[i] && answers[i].length > 0;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
              i === current
                ? 'text-blue-600 underline'
                : answered
                ? 'text-green-600'
                : 'text-gray-500'
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
