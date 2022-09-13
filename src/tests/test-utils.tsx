import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import {
  ThemeContextProvider,
  walletThemeDark,
} from '@avalabs/react-components';

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContextProvider lightTheme={walletThemeDark}>
      {children}
    </ThemeContextProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
