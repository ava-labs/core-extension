import React from 'react';
import { MoonIcon, SunshineIcon, TextButton } from '@avalabs/react-components';
import { useExtensionTheme } from '@src/contexts/ThemeProvider';

export function ToggleDarkMode() {
  const { toggleDarkTheme, darkMode } = useExtensionTheme();

  return (
    <TextButton
      onClick={() => {
        toggleDarkTheme();
      }}
    >
      {darkMode ? <MoonIcon /> : <SunshineIcon />}
    </TextButton>
  );
}
