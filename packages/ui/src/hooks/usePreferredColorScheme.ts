import { useEffect, useState } from 'react';
import { useSettingsContext } from '../contexts';

type ColorScheme = 'dark' | 'light' | 'testnet';

export const usePreferredColorScheme = () => {
  const { theme } = useSettingsContext();

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
    const isDark = window.matchMedia('(prefers-color-scheme: dark)');
    const isLight = window.matchMedia('(prefers-color-scheme: light)');

    if (isDark.matches) {
      setPreferredColorScheme('dark');
    } else if (isLight.matches) {
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

    isLight.addEventListener('change', getListener('light'), {
      signal: controller.signal,
    });
    isDark.addEventListener('change', getListener('dark'), {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [theme]);

  return preferredColorScheme;
};
