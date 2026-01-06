import { useState, useMemo } from 'react';

export default function RangeSelector({ total, onStart }) {
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(total);
  const [random, setRandom] = useState(false);

  const { valid, error } = useMemo(() => {
    if (random) return { valid: true, error: null };

    const s = Number(start);
    const e = Number(end);
    if (!Number.isInteger(s) || s < 1)
      return { valid: false, error: 'Start must be an integer >= 1' };
    if (!Number.isInteger(e) || e < 1)
      return { valid: false, error: 'End must be an integer >= 1' };
    if (s > e) return { valid: false, error: 'Start must be <= End' };
    if (e > total) return { valid: false, error: `End must be <= ${total}` };
    return { valid: true, error: null };
  }, [start, end, total, random]);

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded shadow space-y-4'>
      <h2 className='text-xl font-semibold'>Select Question Range</h2>

      <div className='flex gap-4'>
        <input
          type='number'
          min='1'
          max={total}
          value={start}
          onChange={(e) =>
            setStart(
              e.target.value === '' ? '' : Math.max(1, Number(e.target.value))
            )
          }
          className='border p-2 w-full'
          placeholder='Start'
        />
        <input
          type='number'
          min='1'
          max={total}
          value={end}
          onChange={(e) =>
            setEnd(
              e.target.value === ''
                ? ''
                : Math.min(total, Number(e.target.value))
            )
          }
          className='border p-2 w-full'
          placeholder='End'
        />
      </div>

      {error && <div className='text-sm text-red-500'>{error}</div>}

      <div className='flex gap-2'>
        <button
          onClick={() => onStart({ start: Number(start), end: Number(end) })}
          className={`flex-1 py-2 rounded ${
            valid
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600 cursor-not-allowed'
          }`}
          disabled={!valid}
        >
          Start Test
        </button>

        <button
          onClick={() => onStart({ random: true })}
          className='flex-1 py-2 rounded bg-yellow-500 text-white'
        >
          Start Random Test (25 questions / 25 minutes)
        </button>
      </div>
    </div>
  );
}
