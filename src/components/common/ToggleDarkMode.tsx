import React, { useEffect } from 'react';
import { MoonIcon, SunshineIcon, TextButton } from '@avalabs/react-components';
import { themeService } from '@src/background/services';
import { useState } from 'react';

export function ToggleDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const listener = (config) => {
      setIsDarkMode(config.isDarkMode);
    };
    const subscription = themeService.themeConfig.subscribe(listener);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <TextButton
      onClick={() => {
        themeService.toggleDarkMode();
      }}
    >
      {isDarkMode ? <MoonIcon /> : <SunshineIcon />}
    </TextButton>
  );
}