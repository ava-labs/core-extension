import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  // K2 ThemeProvider causes issues here.
  // https://ava-labs.atlassian.net/browse/CP-6954
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
