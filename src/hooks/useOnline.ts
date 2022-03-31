import { useEffect, useState } from 'react';

export function useOnline() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const onConnectionChange = (event) => {
      if (event.type === 'online') {
        setIsOnline(true);
        return;
      }
      setIsOnline(false);
    };

    window.addEventListener('online', onConnectionChange);

    window.addEventListener('offline', onConnectionChange);
    return () => {
      window.removeEventListener('online', () => onConnectionChange);
      window.removeEventListener('offline', () => onConnectionChange);
    };
  }, []);

  return { isOnline };
}
