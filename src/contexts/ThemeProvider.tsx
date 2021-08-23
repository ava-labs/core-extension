import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '@src/styles/theme';
// import { GlobalStyle } from '@src/styles/styles';

const ThemeContext = createContext<{
  darkMode?: boolean;
  toggleDarkTheme(): void;
}>({} as any);

export function ThemeContextProvider({ children }: { children: any }) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const theme = isDarkTheme ? darkTheme : lightTheme;
  const { globalStyles: GlobalStyle } = theme;
  return (
    <ThemeContext.Provider
      value={{
        darkMode: isDarkTheme,
        toggleDarkTheme() {
          setIsDarkTheme(!isDarkTheme);
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <>
          {children}
          {GlobalStyle ? <GlobalStyle /> : ''}
        </>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useExtensionTheme() {
  return useContext(ThemeContext);
}
