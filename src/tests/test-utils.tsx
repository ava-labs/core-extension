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

export const waitForIntervalRuns = async (numberOfRuns, intervalMs) => {
  for (let i = 0; i < numberOfRuns; i++) {
    jest.advanceTimersByTime(intervalMs + 1);
    // Call the scheduled timer.
    await jest.runAllTimers();
    // .runAllTicks as well, as they may be other async methods called inside the interval.
    // This should resolve the pending promises.
    await jest.runAllTicks();
  }
};

export * from '@testing-library/react';
export { customRender as render };
