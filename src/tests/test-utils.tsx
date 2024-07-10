import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import {
  JsonRpcRequestParams,
  JsonRpcRequestPayload,
} from '@src/background/connections/dAppConnection/models';
import { PartialBy } from '@src/background/models';

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

export const buildRpcCall = <M extends string>(
  payload: PartialBy<JsonRpcRequestPayload<M>, 'params'>,
  scope = 'eip155:43113'
): JsonRpcRequestParams<M, any> =>
  ({
    scope,
    sessionId: crypto.randomUUID(),
    request: payload,
  } as const);

export * from '@testing-library/react';
export { customRender as render };
