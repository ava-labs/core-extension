import React from 'react';
import {
  MoonIcon,
  SunshineIcon,
  TextButton,
  useThemeContext,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';

export function ThemeSelector() {
  const theme = useTheme();
  const { darkMode, toggleDarkTheme } = useThemeContext();

  return (
    <TextButton onClick={() => toggleDarkTheme()}>
      {darkMode ? (
        <SunshineIcon color={theme.colors.text} />
      ) : (
        <MoonIcon color={theme.colors.text} />
      )}
    </TextButton>
  );
}
