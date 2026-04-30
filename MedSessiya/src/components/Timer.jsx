import { memo } from 'react';
import { formatTime } from '../utils/formatTime.js';

const Timer = memo(function Timer({ seconds, warning = false }) {
  return (
    <span className={`font-mono text-sm font-semibold tabular-nums ${
      warning ? 'text-red-500' : 'text-gray-700'
    }`}>
      {formatTime(seconds)}
    </span>
  );
});

export default Timer;
