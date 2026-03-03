import { hex } from '@scure/base';
import { ChainId } from '@avalabs/core-chains-sdk';
import { ComponentProps, useMemo } from 'react';
import { Avalanche, getEvmAddressFromPubKey } from '@avalabs/core-wallets-sdk';

import { DerivedAccountInfo, PublicKey } from './types';
import { BaseLedgerConnector } from './BaseLedgerConnector';
import { useLedgerBasePublicKeyFetcher } from './hooks/useLedgerPublicKeyFetcher';
import { LedgerAppType } from '@core/ui';

type AvalancheLedgerConnectorProps = Omit<
  Exclude<
    ComponentProps<typeof BaseLedgerConnector>,
    { derivationPathSpec?: never; setDerivationPathSpec?: never }
  >,
  | 'deriveAddresses'
  | 'useLedgerPublicKeyFetcher'
  | 'derivedAddressesChainCaipId'
  | 'requiredApp'
>;

const AVALANCHE_C_CHAIN_CAIP_ID = `eip155:${ChainId.AVALANCHE_MAINNET_ID}`;

function buildDerivedAccounts(
  keys: PublicKey[],
  provider: Avalanche.JsonRpcProvider,
): DerivedAccountInfo[] {
  const evmKeys = keys.filter(({ vm }) => vm === 'EVM');
  const avmKeysByIndex = new Map(
    keys.filter(({ vm }) => vm === 'AVM').map((k) => [k.index, k]),
  );

  return evmKeys.map((evmKey) => {
    const cAddress = getEvmAddressFromPubKey(
      Buffer.from(hex.decode(evmKey.key.key)),
    );

    const avmKey = avmKeysByIndex.get(evmKey.index);
    let xpAddress: string | undefined;

    if (avmKey) {
      xpAddress = provider.getAddress(
        Buffer.from(hex.decode(avmKey.key.key)),
        'X',
      );
    }

    return { address: cAddress, xpAddress };
  });
}

export const AvalancheLedgerConnector = (
  props: AvalancheLedgerConnectorProps,
) => {
  const provider = useMemo(
    () => Avalanche.JsonRpcProvider.getDefaultMainnetProvider(),
    [],
  );
  const deriveAddresses = (keys: PublicKey[]) =>
    buildDerivedAccounts(keys, provider);

  return (
    <BaseLedgerConnector
      {...props}
      requiredApp={LedgerAppType.AVALANCHE}
      deriveAddresses={deriveAddresses}
      useLedgerPublicKeyFetcher={useLedgerBasePublicKeyFetcher}
      derivedAddressesChainCaipId={AVALANCHE_C_CHAIN_CAIP_ID}
    />
  );
};
