import { Network, SecretType } from '@core/types';

import {
  HYPEREVM_CHAIN_NAME,
  isHyperliquidChainId,
} from './isHyperliquidNetwork';

export function isDirectLedgerHyperEvmTransactionUnsupported(
  network: Pick<Network, 'chainId' | 'chainName'> | undefined,
  secretType: SecretType | undefined,
) {
  return (
    secretType === SecretType.Ledger &&
    network !== undefined &&
    (isHyperliquidChainId(network.chainId) ||
      network.chainName === HYPEREVM_CHAIN_NAME)
  );
}
