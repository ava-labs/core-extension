import { renderHook } from '@testing-library/react';
import { useAnalyticsContext } from '../contexts';
import { useSendAnalyticsData } from './useSendAnalyticsData';

jest.mock('../contexts', () => ({
  useAnalyticsContext: jest.fn(),
}));

describe('hooks/useSendAnalyticsData', () => {
  const capture = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(useAnalyticsContext).mockReturnValue({ capture } as any);
  });

  it('captures the token selected event for the given functionality', () => {
    const { result } = renderHook(() => useSendAnalyticsData());

    result.current.sendTokenSelectedAnalytics('Send');

    expect(capture).toHaveBeenCalledWith('Send_TokenSelected');
  });

  it('captures the amount entered event for the given functionality', () => {
    const { result } = renderHook(() => useSendAnalyticsData());

    result.current.sendAmountEnteredAnalytics('Swap');

    expect(capture).toHaveBeenCalledWith('Swap_AmountEntered');
  });
});
