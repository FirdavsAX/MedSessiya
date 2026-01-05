export default function ResultCard({
  index,
  question,
  score,
  answers = [],
  selected = [],
}) {
  return (
    <div className='p-4 bg-white border rounded shadow'>
      <div className='flex justify-between items-start'>
        <div>
          <h3 className='font-semibold'>
            {index !== undefined ? `Q${index + 1}: ` : ''}
            {question}
          </h3>
          <p className='mt-1 text-sm text-gray-600'>Score: {score} / 100</p>
        </div>
      </div>

      <ul className='mt-3 space-y-2'>
        {answers.map((a, i) => {
          const isSelected = (selected || []).includes(i);
          const isCorrect = !!a.correct || (a.weight || 0) > 0;

          return (
            <li
              key={i}
              className={`p-2 rounded border ${
                isCorrect && isSelected
                  ? 'bg-green-50 border-green-200'
                  : isCorrect
                  ? 'bg-green-100 border-green-200'
                  : isSelected
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className='flex justify-between items-center'>
                <span className='text-sm'>{a.text}</span>
                <div className='ml-3 text-xs'>
                  {isCorrect && (
                    <span className='text-green-700 font-medium'>Correct</span>
                  )}
                  {!isCorrect && isSelected && (
                    <span className='text-red-700 font-medium'>
                      Selected (Wrong)
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
