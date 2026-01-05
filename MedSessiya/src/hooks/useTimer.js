import { useEffect, useState } from 'react';

export function useTimer(seconds) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft, running]);

  return {
    timeLeft,
    stop: () => setRunning(false),
  };
}
