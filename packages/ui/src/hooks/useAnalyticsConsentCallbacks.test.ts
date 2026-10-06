import { act, renderHook } from '@testing-library/react';
import {
  useAccountsContext,
  useAnalyticsContext,
  useSettingsContext,
} from '../contexts';
import { useAnalyticsConsentCallbacks } from './useAnalyticsConsentCallbacks';

jest.mock('../contexts', () => ({
  useAnalyticsContext: jest.fn(),
  useAccountsContext: jest.fn(),
  useSettingsContext: jest.fn(),
}));

describe('hooks/useAnalyticsConsentCallbacks', () => {
  const capture = jest.fn();
  const initAnalyticsIds = jest.fn();
  const stopDataCollection = jest.fn();
  const setAnalyticsConsent = jest.fn();

  const mockAnalyticsContext = (isInitialized: boolean) =>
    jest.mocked(useAnalyticsContext).mockReturnValue({
      capture,
      initAnalyticsIds,
      stopDataCollection,
      isInitialized,
    });

  beforeEach(() => {
    jest.resetAllMocks();
    mockAnalyticsContext(false);
    jest.mocked(useSettingsContext).mockReturnValue({
      setAnalyticsConsent,
    } as any);
    jest.mocked(useAccountsContext).mockReturnValue({
      allAccounts: [
        {
          addressC: '0xC',
          addressBTC: 'btc',
          addressAVM: 'X-avax',
          addressPVM: 'P-avax',
          addressCoreEth: 'C-avax',
        },
      ],
    } as any);
  });

  describe('onApproval', () => {
    it('enables consent, initializes ids and captures AnalyticsEnabled', async () => {
      const { result } = renderHook(() =>
        useAnalyticsConsentCallbacks('settings'),
      );

      await act(() => result.current.onApproval());

      expect(setAnalyticsConsent).toHaveBeenCalledWith(true);
      expect(initAnalyticsIds).toHaveBeenCalledWith(true);
      expect(capture).toHaveBeenCalledWith(
        'AnalyticsEnabled',
        {
          origin: 'settings',
          addresses: ['0xC', 'btc', 'X-avax', 'P-avax', 'C-avax'],
        },
        true,
      );
      expect(result.current.isApproving).toBe(false);
    });

    it('does not override existing analytics ids', async () => {
      mockAnalyticsContext(true);
      const { result } = renderHook(() =>
        useAnalyticsConsentCallbacks('re-opt-in-dialog'),
      );

      await act(() => result.current.onApproval());

      expect(initAnalyticsIds).not.toHaveBeenCalled();
      expect(capture).toHaveBeenCalledWith(
        'AnalyticsEnabled',
        expect.objectContaining({ origin: 're-opt-in-dialog' }),
        true,
      );
    });

    it('resets isApproving when enabling consent fails', async () => {
      setAnalyticsConsent.mockRejectedValueOnce(new Error('failed'));
      const { result } = renderHook(() =>
        useAnalyticsConsentCallbacks('settings'),
      );

      await act(() =>
        expect(result.current.onApproval()).rejects.toThrow('failed'),
      );

      expect(capture).not.toHaveBeenCalled();
      expect(result.current.isApproving).toBe(false);
    });
  });

  describe('onRejection', () => {
    it('captures AnalyticsDisabled before disabling consent and stopping collection', async () => {
      const { result } = renderHook(() =>
        useAnalyticsConsentCallbacks('settings'),
      );

      await act(() => result.current.onRejection());

      expect(capture).toHaveBeenCalledWith('AnalyticsDisabled', {
        origin: 'settings',
      });
      expect(setAnalyticsConsent).toHaveBeenCalledWith(false);
      expect(stopDataCollection).toHaveBeenCalled();
      expect(capture.mock.invocationCallOrder[0]).toBeLessThan(
        setAnalyticsConsent.mock.invocationCallOrder[0]!,
      );
      expect(result.current.isRejecting).toBe(false);
    });
  });
});
