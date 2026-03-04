import { base58, hex } from '@scure/base';
import { ComponentProps } from 'react';

import { DerivedAccountInfo, PublicKey } from './types';
import { BaseLedgerConnector } from './BaseLedgerConnector';
import { useLedgerSolanaPublicKeyFetcher } from './hooks/useLedgerPublicKeyFetcher';
import { SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';
import { LedgerAppType } from '@core/ui';

type SolanaLedgerConnectorProps = Omit<
  Extract<
    ComponentProps<typeof BaseLedgerConnector>,
    { derivationPathSpec?: never; setDerivationPathSpec?: never }
  >,
  | 'deriveAddresses'
  | 'useLedgerPublicKeyFetcher'
  | 'derivedAddressesChainCaipId'
  | 'requiredApp'
>;

const deriveAddresses = (keys: PublicKey[]): DerivedAccountInfo[] =>
  keys
    .filter(({ vm }) => vm === 'SVM')
    .map(({ key }) => ({
      address: base58.encode(hex.decode(key.key)),
    }));

export const SolanaLedgerConnector = (props: SolanaLedgerConnectorProps) => {
  return (
    <BaseLedgerConnector
      {...props}
      requiredApp={LedgerAppType.SOLANA}
      deriveAddresses={deriveAddresses}
      useLedgerPublicKeyFetcher={useLedgerSolanaPublicKeyFetcher}
      derivedAddressesChainCaipId={SolanaCaip2ChainId.MAINNET}
    />
  );
};
