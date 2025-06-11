import { useEffect, useState } from 'react';

export function useOnline() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const onConnectionChange: EventListener = (event) => {
      setIsOnline(event.type === 'online');
    };

    const abortController = new AbortController();
    window.addEventListener('online', onConnectionChange, {
      signal: abortController.signal,
    });
    window.addEventListener('offline', onConnectionChange, {
      signal: abortController.signal,
    });

    return () => abortController.abort();
  }, []);

  return { isOnline };
}
