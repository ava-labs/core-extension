jest.mock('./contexts', () => ({
  FusionStateContextProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useFusionState: jest.fn(),
}));

jest.mock('@core/ui', () => ({
  useLiveBalance: jest.fn(),
}));

jest.mock('@/components/Page', () => ({
  Page: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page">{children}</div>
  ),
}));

jest.mock('./SwapContent', () => ({
  SwapContent: () => <div data-testid="swap-content" />,
}));

jest.mock('./components/SwapProviderNotice', () => ({
  SwapProviderNotice: () => null,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

import React from 'react';
import { render, screen } from '@shared/tests/test-utils';
import { useFusionState } from './contexts';
import { Fusion } from './Fusion';

const mockUseFusionState = jest.mocked(useFusionState);

const baseState = {
  isConfirming: false,
  transfer: jest.fn(),
  status: 'ready-to-transfer' as const,
  priceImpactSeverity: 'low' as const,
  formError: '',
  selectedQuote: null,
};

describe('Fusion swap button', () => {
  it('is enabled when the form is valid and status is ready-to-transfer', () => {
    mockUseFusionState.mockReturnValue({ ...baseState } as any);

    render(<Fusion />);

    const button = screen.getByRole('button', { name: /swap/i });
    expect((button as HTMLButtonElement).disabled).toBe(false);
  });

  it('is disabled when formError is set (e.g., amount + additive fees exceeds balance)', () => {
    mockUseFusionState.mockReturnValue({
      ...baseState,
      formError: 'Maximum available after fees is 0.5 AVAX',
    } as any);

    render(<Fusion />);

    const button = screen.getByRole('button', { name: /swap/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('is disabled when fees-are-higher-than-balance error is present', () => {
    mockUseFusionState.mockReturnValue({
      ...baseState,
      formError: 'Fees are higher than balance. Required fee is 0.5 AVAX',
    } as any);

    render(<Fusion />);

    const button = screen.getByRole('button', { name: /swap/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('is disabled when status is not ready-to-transfer', () => {
    mockUseFusionState.mockReturnValue({
      ...baseState,
      status: 'initialized' as const,
    } as any);

    render(<Fusion />);

    const button = screen.getByRole('button', { name: /swap/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('is disabled when price impact is critical', () => {
    mockUseFusionState.mockReturnValue({
      ...baseState,
      priceImpactSeverity: 'critical' as const,
    } as any);

    render(<Fusion />);

    const button = screen.getByRole('button', { name: /swap/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('is disabled while a swap is being confirmed', () => {
    mockUseFusionState.mockReturnValue({
      ...baseState,
      isConfirming: true,
    } as any);

    render(<Fusion />);

    const button = screen.getByRole('button', { name: /swap/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });
});
