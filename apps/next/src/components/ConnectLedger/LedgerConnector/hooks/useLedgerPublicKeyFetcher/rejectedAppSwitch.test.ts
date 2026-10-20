import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  LedgerAppType,
  useActiveLedgerAppInfo,
  useLedgerContext,
} from '@core/ui';
import { LEDGER_APP_SWITCH_FAILED_ERROR } from '@core/types';

import { UseLedgerPublicKeyFetcher } from '../../types';
import { useLedgerBasePublicKeyFetcher } from './useLedgerBasePublicKeyFetcher';
import { useLedgerSolanaPublicKeyFetcher } from './useLedgerSolanaPublicKeyFetcher';

jest.mock('@core/ui', () => ({
  LedgerAppType: {
    AVALANCHE: 'Avalanche',
    SOLANA: 'Solana',
    UNKNOWN: 'UNKNOWN',
    DASHBOARD: 'BOLOS',
  },
  REQUIRED_LEDGER_VERSION: '0.7.3',
  useLedgerContext: jest.fn(),
  useActiveLedgerAppInfo: jest.fn(),
  useDuplicatedWalletChecker: () => jest.fn(),
}));
jest.mock('@/hooks/useCheckAddressActivity', () => ({
  useCheckAddressActivity: () => jest.fn(),
}));
jest.mock('@/hooks/useCheckXPAddressBalance', () => ({
  useCheckXPAddressBalance: () => jest.fn(),
}));

const deferred = () => {
  let reject!: (reason: unknown) => void;
  const promise = new Promise<void>((_, rej) => {
    reject = rej;
  });
  return { promise, reject };
};

describe.each<[LedgerAppType, UseLedgerPublicKeyFetcher]>([
  [LedgerAppType.AVALANCHE, useLedgerBasePublicKeyFetcher],
  [LedgerAppType.SOLANA, useLedgerSolanaPublicKeyFetcher],
])(
  '%s public key fetcher when the app switch is rejected',
  (requiredApp, useFetcher) => {
    let appSwitch: ReturnType<typeof deferred>;
    let prepareTransportForOnboarding: jest.Mock;

    const mockAppType = (appType: LedgerAppType) =>
      jest
        .mocked(useActiveLedgerAppInfo)
        .mockReturnValue({ appType, appVersion: null } as any);

    beforeEach(() => {
      appSwitch = deferred();
      prepareTransportForOnboarding = jest
        .fn()
        .mockReturnValueOnce(appSwitch.promise)
        .mockReturnValue(new Promise(() => {}));
      jest.mocked(useLedgerContext).mockReturnValue({
        popDeviceSelection: jest.fn(),
        initLedgerTransport: jest.fn(),
        prepareTransportForOnboarding,
        getExtendedPublicKey: jest.fn(),
        getPublicKey: jest.fn(),
        hasLedgerTransport: true,
        hasMultipleDevices: false,
        isDeviceLocked: false,
        wasTransportAttempted: true,
      } as any);
      mockAppType(LedgerAppType.DASHBOARD);
    });

    it('reports the failure even if the hook re-rendered during the switch', async () => {
      const { result, rerender } = renderHook(() =>
        useFetcher(DerivationPath.BIP44, undefined),
      );
      await waitFor(() =>
        expect(prepareTransportForOnboarding).toHaveBeenCalledWith(requiredApp),
      );

      mockAppType(LedgerAppType.UNKNOWN);
      rerender();
      await act(async () => {
        appSwitch.reject(new Error(LEDGER_APP_SWITCH_FAILED_ERROR));
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('no-app');
    });

    it('requests another app switch on retry', async () => {
      const { result } = renderHook(() =>
        useFetcher(DerivationPath.BIP44, undefined),
      );
      await waitFor(() =>
        expect(prepareTransportForOnboarding).toHaveBeenCalledTimes(1),
      );
      await act(async () => {
        appSwitch.reject(new Error(LEDGER_APP_SWITCH_FAILED_ERROR));
      });
      expect(result.current.error).toBe('no-app');

      await act(() => result.current.onRetry());

      expect(prepareTransportForOnboarding).toHaveBeenCalledTimes(2);
      expect(prepareTransportForOnboarding).toHaveBeenLastCalledWith(
        requiredApp,
      );
      expect(result.current.status).toBe('waiting');
      expect(result.current.error).toBeUndefined();
    });
  },
);

describe('Avalanche public key fetcher after a page refresh on the dashboard', () => {
  it('reports a rejected app switch once the device probe completes', async () => {
    const appSwitch = deferred();
    const prepareTransportForOnboarding = jest.fn(() => appSwitch.promise);
    const mockLedgerContext = (hasLedgerTransport: boolean) =>
      jest.mocked(useLedgerContext).mockReturnValue({
        popDeviceSelection: jest.fn(),
        initLedgerTransport: jest.fn(),
        prepareTransportForOnboarding,
        getExtendedPublicKey: jest.fn(),
        hasLedgerTransport,
        hasMultipleDevices: false,
        isDeviceLocked: false,
        wasTransportAttempted: true,
      } as any);
    jest
      .mocked(useActiveLedgerAppInfo)
      .mockReturnValue({ appType: LedgerAppType.DASHBOARD } as any);

    mockLedgerContext(false);
    const { result, rerender } = renderHook(() =>
      useLedgerBasePublicKeyFetcher(DerivationPath.BIP44, undefined),
    );
    await waitFor(() =>
      expect(result.current.status).toBe('needs-user-gesture'),
    );

    mockLedgerContext(true);
    rerender();
    await waitFor(() =>
      expect(prepareTransportForOnboarding).toHaveBeenCalledWith(
        LedgerAppType.AVALANCHE,
      ),
    );
    await act(async () => {
      appSwitch.reject(new Error(LEDGER_APP_SWITCH_FAILED_ERROR));
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('no-app');
  });
});
