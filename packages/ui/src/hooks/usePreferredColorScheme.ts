import { useEffect, useState } from 'react';
import { useSettingsContext } from '../contexts';

type ColorScheme = 'dark' | 'light' | 'testnet';

export const usePreferredColorScheme = () => {
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const lightQuery = window.matchMedia('(prefers-color-scheme: light)');

  // If settings are not available yet, set it according to the system preferences
  const { theme = darkQuery.matches ? 'DARK' : 'LIGHT' } = useSettingsContext();

  const [preferredColorScheme, setPreferredColorScheme] = useState<ColorScheme>(
    theme === 'DARK' ? 'dark' : 'light',
  );

  useEffect(() => {
    if (theme === 'DARK') {
      setPreferredColorScheme('dark');
      return;
    }

    if (theme === 'LIGHT') {
      setPreferredColorScheme('light');
      return;
    }

    // Handling 'SYSTEM'
    if (darkQuery.matches) {
      setPreferredColorScheme('dark');
    } else if (lightQuery.matches) {
      setPreferredColorScheme('light');
    } else {
      setPreferredColorScheme('light'); // Light by default
    }

    const controller = new AbortController();

    const getListener = (scheme: ColorScheme) => {
      return ({ matches }: MediaQueryListEvent) => {
        if (matches) setPreferredColorScheme(scheme);
      };
    };

    lightQuery.addEventListener('change', getListener('light'), {
      signal: controller.signal,
    });
    darkQuery.addEventListener('change', getListener('dark'), {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [theme, darkQuery, lightQuery]);

  return preferredColorScheme;
};
