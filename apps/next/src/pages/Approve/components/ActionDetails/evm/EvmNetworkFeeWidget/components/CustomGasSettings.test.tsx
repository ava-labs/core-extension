import { ThemeProvider } from '@avalabs/k2-alpine';
import { FeeRate, NativeTokenBalance } from '@core/types';
import { useKeyboardShortcuts, useSettingsContext } from '@core/ui';
import { render, screen, within } from '@shared/tests/test-utils';
import { ReactNode } from 'react';

import { CustomGasSettings } from './CustomGasSettings';

jest.mock('@core/ui', () => ({
  useKeyboardShortcuts: jest.fn(),
  useSettingsContext: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/components/Page', () => ({
  Page: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const nativeToken = {
  symbol: 'ETH',
  decimals: 18,
  priceInCurrency: 2000,
} as NativeTokenBalance;

// 1.234567891 gwei, giving a fee with more than 5 decimals at 21000 gas
const customPreset = {
  maxFeePerGas: 1_234_567_891n,
  maxPriorityFeePerGas: 1_000_000_000n,
} as FeeRate;

describe('CustomGasSettings', () => {
  beforeEach(() => {
    jest.mocked(useKeyboardShortcuts).mockReturnValue({ onKeyDown: jest.fn() });
    jest.mocked(useSettingsContext).mockReturnValue({
      currencyFormatter: (value: number) => `$${value}`,
    } as ReturnType<typeof useSettingsContext>);
  });

  it('shows the total network fee without an approximation sign and keeps the exact amount in the tooltip', () => {
    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <CustomGasSettings
          onBack={jest.fn()}
          onSave={jest.fn()}
          customPreset={customPreset}
          nativeToken={nativeToken}
          gasLimit={21000}
          feeDecimals={9}
        />
      </ThemeProvider>,
    );

    const label = screen.getByText('Total network fee');
    const row = label.closest('div[class]')?.parentElement as HTMLElement;
    const total = within(row).getByText(/ETH$/);

    expect(total.textContent).not.toContain('~');
    expect(total.textContent).toMatch(/^\d/);
    expect(total.getAttribute('aria-label')).toBe('0.000025925925711');
  });
});
