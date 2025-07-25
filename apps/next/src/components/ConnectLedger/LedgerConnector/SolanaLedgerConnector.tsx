import { base58, hex } from '@scure/base';
import { ComponentProps } from 'react';

import { PublicKey } from './types';
import { BaseLedgerConnector } from './BaseLedgerConnector';
import { useLedgerSolanaPublicKeyFetcher } from './hooks/useLedgerPublicKeyFetcher';
import { SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';

type SolanaLedgerConnectorProps = Omit<
  Extract<
    ComponentProps<typeof BaseLedgerConnector>,
    { derivationPathSpec?: never; setDerivationPathSpec?: never }
  >,
  | 'deriveAddresses'
  | 'useLedgerPublicKeyFetcher'
  | 'derivedAddressesChainCaipId'
>;

const deriveAddresses = (keys: PublicKey[]) =>
  keys
    .filter(({ vm }) => vm === 'SVM')
    .map(({ key }) => key.key)
    .map((publicKeyHex) => base58.encode(hex.decode(publicKeyHex)));

export const SolanaLedgerConnector = (props: SolanaLedgerConnectorProps) => {
  return (
    <BaseLedgerConnector
      {...props}
      deriveAddresses={deriveAddresses}
      useLedgerPublicKeyFetcher={useLedgerSolanaPublicKeyFetcher}
      derivedAddressesChainCaipId={SolanaCaip2ChainId.MAINNET}
    />
  );
};
