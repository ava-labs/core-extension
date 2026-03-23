jest.mock('../contexts', () => ({
  useFusionState: jest.fn(),
}));

jest.mock('../hooks/useAdditiveFeesAmount', () => ({
  useAdditiveFeesAmount: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      if (!opts) return key;
      return key.replace(/\{\{(\w+)\}\}/g, (_, k) => opts[k] ?? `{{${k}}}`);
    },
  }),
}));

import { render, screen } from '@shared/tests/test-utils';
import { useFusionState } from '../contexts';
import { useAdditiveFeesAmount } from '../hooks/useAdditiveFeesAmount';
import { SwapHelperText } from './SwapHelperText';

const mockUseFusionState = jest.mocked(useFusionState);
const mockUseAdditiveFeesAmount = jest.mocked(useAdditiveFeesAmount);

describe('SwapHelperText', () => {
  beforeEach(() => {
    mockUseFusionState.mockReturnValue({ formError: '' } as any);
    mockUseAdditiveFeesAmount.mockReturnValue({ sum: '', symbol: '' });
  });

  it('does not render the additive fees notice when both sum and symbol are empty', () => {
    render(<SwapHelperText />);

    expect(screen.queryByText(/for network and bridge fees/i)).toBeNull();
  });

  it('shows the additive fees notice when there is no form error', () => {
    mockUseAdditiveFeesAmount.mockReturnValue({
      sum: '0.01',
      symbol: 'AVAX',
    });

    render(<SwapHelperText />);

    // Text is rendered inside AdditiveFeesNotice
    expect(
      screen.getByText('+0.01 AVAX for network and bridge fees'),
    ).toBeTruthy();
  });

  it('shows the form error when set (takes priority over additive fees notice)', () => {
    const errorMessage = 'Maximum available after fees is 0.5 AVAX';
    mockUseFusionState.mockReturnValue({
      formError: errorMessage,
    } as any);
    mockUseAdditiveFeesAmount.mockReturnValue({
      sum: '0.01',
      symbol: 'AVAX',
    });

    render(<SwapHelperText />);

    // Error message is rendered
    expect(screen.getByText(errorMessage)).toBeTruthy();
  });

  it('does not show the additive fees notice when form error is present', () => {
    const errorMessage = 'Maximum available after fees is 0.5 AVAX';
    mockUseFusionState.mockReturnValue({
      formError: errorMessage,
    } as any);
    // Return empty sum/symbol to ensure AdditiveFeesNotice renders no visible text
    mockUseAdditiveFeesAmount.mockReturnValue({ sum: '', symbol: '' });

    render(<SwapHelperText />);

    expect(screen.queryByText(/for network and bridge fees/i)).toBeNull();
  });

  it('shows the fees-over-balance form error', () => {
    const errorMessage =
      'Fees are higher than balance. Required fee is 0.5 AVAX';
    mockUseFusionState.mockReturnValue({
      formError: errorMessage,
    } as any);

    render(<SwapHelperText />);

    expect(screen.getByText(errorMessage)).toBeTruthy();
  });
});
