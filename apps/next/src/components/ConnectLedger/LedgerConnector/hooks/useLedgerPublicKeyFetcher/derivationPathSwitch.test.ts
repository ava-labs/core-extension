import {
  DerivationPath,
  getAddressDerivationPath,
} from '@avalabs/core-wallets-sdk';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useLedgerContext } from '@core/ui';

import { KeyRetrievalAbortedError, PublicKey } from '../../types';
import { useLedgerBasePublicKeyFetcher } from './useLedgerBasePublicKeyFetcher';

jest.mock('@avalabs/core-wallets-sdk', () => {
  const actual = jest.requireActual('@avalabs/core-wallets-sdk');
  return {
    ...actual,
    getAddressPublicKeyFromXPub: jest.fn(async () =>
      Buffer.from(`02${'11'.repeat(32)}`, 'hex'),
    ),
    Avalanche: {
      ...actual.Avalanche,
      JsonRpcProvider: {
        getDefaultMainnetProvider: () => ({ getAddress: () => 'X-avax1test' }),
      },
    },
  };
});
jest.mock('@core/ui', () => ({
  LedgerAppType: {
    AVALANCHE: 'Avalanche',
    SOLANA: 'Solana',
    UNKNOWN: 'UNKNOWN',
  },
  REQUIRED_LEDGER_VERSION: '0.7.3',
  useLedgerContext: jest.fn(),
  useActiveLedgerAppInfo: () => ({ appType: 'Avalanche', appVersion: '1.0.0' }),
  useDuplicatedWalletChecker: () => async () => ({ isKnown: false }),
}));
jest.mock('@/hooks/useCheckAddressActivity', () => ({
  useCheckAddressActivity: () => async () => false,
}));
jest.mock('@/hooks/useCheckXPAddressBalance', () => ({
  useCheckXPAddressBalance: () => async () => false,
}));

const evmPath = (index: number, pathSpec: DerivationPath) =>
  getAddressDerivationPath(index, 'EVM', { pathSpec });

describe('Avalanche public key fetcher when the derivation path changes mid-retrieval', () => {
  let resolveFirstXpub: (xpub: string) => void;
  let getExtendedPublicKey: jest.Mock;
  let popDeviceSelection: jest.Mock;

  beforeEach(() => {
    getExtendedPublicKey = jest
      .fn()
      .mockReturnValueOnce(
        new Promise<string>((resolve) => {
          resolveFirstXpub = resolve;
        }),
      )
      .mockResolvedValue('xpub');
    popDeviceSelection = jest.fn();
    jest.mocked(useLedgerContext).mockReturnValue({
      popDeviceSelection,
      initLedgerTransport: jest.fn(),
      prepareTransportForOnboarding: jest.fn(),
      getExtendedPublicKey,
      hasLedgerTransport: true,
      hasMultipleDevices: false,
      isDeviceLocked: false,
      wasTransportAttempted: true,
    } as any);
  });

  it('abandons the superseded retrieval before deriving with the new path', async () => {
    const onActivePublicKeysDiscovered = jest.fn<void, [PublicKey[]]>();
    const { result, rerender } = renderHook(
      ({ pathSpec }) =>
        useLedgerBasePublicKeyFetcher(pathSpec, onActivePublicKeysDiscovered),
      { initialProps: { pathSpec: DerivationPath.BIP44 } },
    );
    await waitFor(() => expect(result.current.status).toBe('ready'));

    const bip44Retrieval = result.current.retrieveKeys(2);
    bip44Retrieval.catch(() => {});
    await waitFor(() => expect(getExtendedPublicKey).toHaveBeenCalledTimes(1));

    rerender({ pathSpec: DerivationPath.LedgerLive });
    const ledgerLiveRetrieval = result.current.retrieveKeys(2);
    await act(async () => {});

    expect(getExtendedPublicKey).toHaveBeenCalledTimes(1);

    await act(async () => resolveFirstXpub('xpub'));

    await expect(bip44Retrieval).rejects.toBeInstanceOf(
      KeyRetrievalAbortedError,
    );
    const { addressPublicKeys } = await ledgerLiveRetrieval;

    expect(
      addressPublicKeys
        .filter(({ vm }) => vm === 'EVM')
        .map(({ key }) => key.derivationPath),
    ).toEqual([
      evmPath(0, DerivationPath.LedgerLive),
      evmPath(1, DerivationPath.LedgerLive),
    ]);
    const reportedPaths = onActivePublicKeysDiscovered.mock.calls.flatMap(
      ([keys]) => keys.map(({ key }) => key.derivationPath),
    );
    expect(reportedPaths).not.toContain(evmPath(1, DerivationPath.BIP44));
    expect(result.current.status).toBe('ready');
    expect(result.current.error).toBeUndefined();
    expect(popDeviceSelection).not.toHaveBeenCalled();
  });
});
