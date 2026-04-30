import { memo } from 'react';
import AnswerOption from './AnswerOption.jsx';
import Badge from '../../components/Badge.jsx';

// feedbacks: { [optionIndex]: 'correct'|'wrong'|'missed' } yoki null
const QuestionCard = memo(function QuestionCard({
  question, selected, onToggle, feedbacks = null, disabled = false,
}) {
  if (!question) return null;

  const correctCount = question.options.filter(o => o.isCorrect).length;
  const typeLabel = question.type === 'single'
    ? '1 ta to\'g\'ri javob'
    : `${correctCount} ta to'g'ri javob`;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 flex-wrap">
        <Badge
          label={typeLabel}
          color={question.type === 'single' ? 'blue' : 'yellow'}
        />
      </div>

      <p className="text-base font-medium text-gray-900 leading-relaxed">
        {question.question}
      </p>

      <div className="space-y-2">
        {question.options.map((opt, i) => (
          <AnswerOption
            key={i}
            index={i}
            text={opt.text}
            isSelected={selected.includes(i)}
            feedback={feedbacks ? feedbacks[i] : null}
            onToggle={onToggle}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
});

export default QuestionCard;
