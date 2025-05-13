import { useEffect, useState } from 'react';
import { useSettingsContext } from '../contexts';

export const usePreferredColorScheme = () => {
  const { nextGenTheme: theme } = useSettingsContext();

  const [preferredColorScheme, setPreferredColorScheme] = useState<
    'dark' | 'light' | 'testnet'
  >();

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const isDark = window.matchMedia('(prefers-color-scheme: dark)');
    const isLight = window.matchMedia('(prefers-color-scheme: light)');

    if (isDark.matches) {
      setPreferredColorScheme('dark');
    } else if (isLight.matches) {
      setPreferredColorScheme('light');
    } else {
      setPreferredColorScheme('light'); // Light by default
    }

    const { signal, abort } = new AbortController();

    const getListener = (scheme: 'dark' | 'light') => {
      return ({ matches }: MediaQueryListEvent) => {
        if (matches) setPreferredColorScheme(scheme);
      };
    };

    isLight.addEventListener('change', getListener('light'), {
      signal,
    });
    isDark.addEventListener('change', getListener('dark'), {
      signal,
    });

    return abort;
  }, [theme]);

  return preferredColorScheme;
};
