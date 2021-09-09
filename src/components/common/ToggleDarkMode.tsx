import React from 'react';
import {
  MoonIcon,
  SunshineIcon,
  TextButton,
  useThemeContext,
} from '@avalabs/react-components';

export function ToggleDarkMode() {
  const { toggleDarkTheme, darkMode } = useThemeContext();

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
