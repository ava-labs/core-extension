import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { LedgerAppType } from '@core/ui';

import { BaseLedgerConnector } from './BaseLedgerConnector';
import {
  DerivedKeys,
  KeyRetrievalAbortedError,
  UseLedgerPublicKeyFetcher,
} from './types';

jest.mock('@core/ui', () => ({
  LedgerAppType: { AVALANCHE: 'Avalanche' },
  useLedgerContext: () => ({ getDeviceInfo: jest.fn() }),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock('@/pages/Onboarding/components/DerivedAddresses', () => ({
  DerivedAddresses: () => null,
}));
jest.mock('../Styled', () => ({
  DerivationPathSelector: ({
    onSelect,
  }: {
    onSelect: (spec: DerivationPath) => void;
  }) => (
    <button onClick={() => onSelect(DerivationPath.LedgerLive)}>
      Ledger Live
    </button>
  ),
  DerivationPathSelectorSkeleton: () => null,
  ObtainedAddressesSkeleton: () => null,
  LedgerClickToConnectMessage: () => null,
  LedgerConnectionError: () => null,
  LedgerLiveButton: () => null,
}));

const LEDGER_LIVE_KEYS: DerivedKeys = {
  addressPublicKeys: [
    {
      index: 0,
      vm: 'EVM',
      key: {
        type: 'address-pubkey',
        curve: 'secp256k1',
        derivationPath: "m/44'/60'/0'/0/0",
        key: '02',
      },
    },
  ],
};

describe('BaseLedgerConnector', () => {
  it('restarts key retrieval when the derivation path changes mid-retrieval', async () => {
    let abortFirstRetrieval!: () => void;
    const retrieveKeys = jest
      .fn<Promise<DerivedKeys>, [number]>()
      .mockReturnValueOnce(
        new Promise((_, reject) => {
          abortFirstRetrieval = () => reject(new KeyRetrievalAbortedError());
        }),
      )
      .mockResolvedValue(LEDGER_LIVE_KEYS);
    const useFetcher: UseLedgerPublicKeyFetcher = () => ({
      status: 'ready',
      retrieveKeys,
      onRetry: jest.fn(),
    });
    const onSuccess = jest.fn();

    const Connector = () => {
      const [spec, setSpec] = useState(DerivationPath.BIP44);
      return (
        <BaseLedgerConnector
          derivationPathSpec={spec}
          setDerivationPathSpec={setSpec}
          onSuccess={onSuccess}
          onStatusChange={jest.fn()}
          minNumberOfKeys={1}
          onTroubleshoot={jest.fn()}
          deriveAddresses={() => []}
          derivedAddressesChainCaipId="eip155:43114"
          useLedgerPublicKeyFetcher={useFetcher}
          requiredApp={LedgerAppType.AVALANCHE}
        />
      );
    };

    render(<Connector />);
    expect(retrieveKeys).toHaveBeenCalledTimes(1);

    await act(async () => {
      fireEvent.click(screen.getByText('Ledger Live'));
    });
    await act(async () => abortFirstRetrieval());

    expect(retrieveKeys).toHaveBeenCalledTimes(2);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(LEDGER_LIVE_KEYS);
  });
});
