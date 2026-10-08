import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { renderHook, waitFor } from '@testing-library/react';
import { LedgerAppType, useLedgerContext } from '@core/ui';

import { UseLedgerPublicKeyFetcher } from '../../types';
import { useLedgerBasePublicKeyFetcher } from './useLedgerBasePublicKeyFetcher';
import { useLedgerSolanaPublicKeyFetcher } from './useLedgerSolanaPublicKeyFetcher';

jest.mock('@core/ui', () => ({
  LedgerAppType: {
    AVALANCHE: 'Avalanche',
    SOLANA: 'Solana',
    UNKNOWN: 'UNKNOWN',
  },
  REQUIRED_LEDGER_VERSION: '0.7.3',
  useLedgerContext: jest.fn(),
  useActiveLedgerAppInfo: () => ({ appType: 'UNKNOWN', appVersion: null }),
  useDuplicatedWalletChecker: () => jest.fn(),
}));
jest.mock('@/hooks/useCheckAddressActivity', () => ({
  useCheckAddressActivity: () => jest.fn(),
}));
jest.mock('@/hooks/useCheckXPAddressBalance', () => ({
  useCheckXPAddressBalance: () => jest.fn(),
}));

describe.each<[LedgerAppType, UseLedgerPublicKeyFetcher]>([
  [LedgerAppType.AVALANCHE, useLedgerBasePublicKeyFetcher],
  [LedgerAppType.SOLANA, useLedgerSolanaPublicKeyFetcher],
])('%s public key fetcher with multiple Ledgers', (requiredApp, useFetcher) => {
  const ledgerContext = {
    popDeviceSelection: jest.fn(),
    initLedgerTransport: jest.fn(),
    prepareTransportForOnboarding: jest.fn().mockResolvedValue(undefined),
    getExtendedPublicKey: jest.fn(),
    getPublicKey: jest.fn(),
    hasLedgerTransport: false,
    hasMultipleDevices: true,
    isDeviceLocked: false,
    wasTransportAttempted: true,
  };

  const mockLedgerContext = (overrides = {}) =>
    jest
      .mocked(useLedgerContext)
      .mockReturnValue({ ...ledgerContext, ...overrides } as any);

  beforeEach(() => {
    mockLedgerContext();
  });

  it('reports a multiple-devices error', async () => {
    const { result } = renderHook(() =>
      useFetcher(DerivationPath.BIP44, undefined),
    );

    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('multiple-devices');
    });
  });

  it('recovers once a single Ledger remains', async () => {
    const { result, rerender } = renderHook(() =>
      useFetcher(DerivationPath.BIP44, undefined),
    );
    await waitFor(() => expect(result.current.error).toBe('multiple-devices'));

    mockLedgerContext({ hasMultipleDevices: false, hasLedgerTransport: true });
    rerender();

    await waitFor(() => {
      expect(result.current.error).not.toBe('multiple-devices');
      expect(result.current.status).not.toBe('error');
    });
    expect(ledgerContext.prepareTransportForOnboarding).toHaveBeenCalledWith(
      requiredApp,
    );
  });
});
