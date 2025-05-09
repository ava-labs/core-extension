import { useEffect, useState } from 'react';

/**
 * Simple way to have trigger something based on a time interval.
 * @param intervalDurationMs duration of interval in milliseconds
 * @returns the most recent time the interval was triggered.
 */
export function useInterval(intervalDurationMs: number) {
  const [intervalTime, setIntervalTime] = useState<number>(Date.now());

  useEffect(() => {
    let mounted = true;
    const intervalId = setInterval(() => {
      if (mounted) setIntervalTime(Date.now());
    }, intervalDurationMs);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [intervalDurationMs]);

  return intervalTime;
}
