import AnswerOption from './AnswerOption';

export default function QuestionCard({
  index,
  question,
  answers,
  selected,
  onChange,
}) {
  return (
    <div className='border rounded p-4 space-y-2'>
      <h3 className='font-semibold'>
        {index + 1}. {question}
      </h3>

      {answers.map((a, i) => (
        <AnswerOption
          key={i}
          text={a.text}
          checked={selected.includes(i)}
          onChange={() => onChange(i)}
        />
      ))}
    </div>
  );
}
