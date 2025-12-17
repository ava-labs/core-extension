import { hex } from '@scure/base';
import { ChainId } from '@avalabs/core-chains-sdk';
import { ComponentProps } from 'react';
import { getEvmAddressFromPubKey } from '@avalabs/core-wallets-sdk';

import { PublicKey } from './types';
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

const deriveAddresses = (keys: PublicKey[]) =>
  keys
    .filter(({ vm }) => vm === 'EVM')
    .map(({ key }) => key.key)
    .map((publicKeyHex) =>
      getEvmAddressFromPubKey(Buffer.from(hex.decode(publicKeyHex))),
    );

export const AvalancheLedgerConnector = (
  props: AvalancheLedgerConnectorProps,
) => {
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
