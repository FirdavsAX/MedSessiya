export default function QuestionNav({ total, answers, current, onSelect }) {
  return (
    <div className='flex flex-wrap gap-2 mt-4'>
      {Array.from({ length: total }).map((_, i) => {
        const answered = answers[i] && answers[i].length > 0;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-10 h-10 rounded-full text-white font-semibold ${
              i === current
                ? 'bg-blue-600'
                : answered
                ? 'bg-green-500'
                : 'bg-gray-400'
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
