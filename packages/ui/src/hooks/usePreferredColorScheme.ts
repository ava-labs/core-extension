import { useEffect, useState } from 'react';
import { useSettingsContext } from '../contexts';

type ColorScheme = 'dark' | 'light' | 'testnet';

// The document's body has a "system-bg" class that is set according to the system preferences.
// This avoids the flash of white when the page loads (in dark mode).
// As soon as we determine the preferred color scheme as set in the settings,
// we remove the "system-bg" class from the body.
const removeSystemBg = () => {
  document.body.classList.remove('system-bg');
};

export const usePreferredColorScheme = () => {
  const { theme } = useSettingsContext();

  const [preferredColorScheme, setPreferredColorScheme] = useState<ColorScheme>(
    theme === 'DARK' ? 'dark' : 'light',
  );

  useEffect(() => {
    if (theme === 'DARK') {
      setPreferredColorScheme('dark');
      removeSystemBg();
      return;
    }

    if (theme === 'LIGHT') {
      setPreferredColorScheme('light');
      removeSystemBg();
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
