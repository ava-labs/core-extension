import { ThemeProvider } from '@avalabs/k2-alpine';
import { useSettingsContext } from '@core/ui';
import { render, screen } from '@shared/tests/test-utils';

import { TotalFeeAmount } from './TotalFeeAmount';

jest.mock('@core/ui', () => ({
  useSettingsContext: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('TotalFeeAmount', () => {
  beforeEach(() => {
    jest.mocked(useSettingsContext).mockReturnValue({
      currencyFormatter: (value: number) => `$${value}`,
    } as ReturnType<typeof useSettingsContext>);
  });

  const renderFee = (fee: string) =>
    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <TotalFeeAmount fee={fee} symbol="ETH" currencyValue={1.5} />
      </ThemeProvider>,
    );

  it('does not prefix a truncated fee with an approximation sign', () => {
    renderFee('0.000123456789');

    const row = screen.getByTestId('tx-detail-total-network-fee');

    expect(row.textContent).toContain('0.00012');
    expect(row.textContent).not.toContain('~');
  });
});
