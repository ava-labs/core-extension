import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '@src/styles/theme';

const ThemeContext = createContext<{
  darkMode?: boolean;
  toggleDarkTheme(): void;
}>({} as any);

export function ThemeContextProvider({ children }: { children: any }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  return (
    <ThemeContext.Provider
      value={{
        darkMode: isDarkTheme,
        toggleDarkTheme() {
          setIsDarkTheme(!isDarkTheme);
        },
      }}
    >
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useExtensionTheme() {
  return useContext(ThemeContext);
}
