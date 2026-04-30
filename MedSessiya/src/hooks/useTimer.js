import { useEffect, useState, useRef, useCallback } from 'react';

// Tuzatildi: bitta ref-based interval — har tikda yangi interval yaratilmaydi
export function useTimer(initialSeconds) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds || 0);
  const [running, setRunning]   = useState((initialSeconds || 0) > 0);
  const intervalRef = useRef(null);

  // running holatiga qarab interval boshqaruvi
  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const stop  = useCallback(() => { clearInterval(intervalRef.current); setRunning(false); }, []);
  const start = useCallback(() => setRunning(true), []);
  const reset = useCallback((s) => {
    clearInterval(intervalRef.current);
    setTimeLeft(s || 0);
    setRunning((s || 0) > 0);
  }, []);

  return { timeLeft, running, expired: timeLeft === 0 && !running, stop, start, reset };
}
