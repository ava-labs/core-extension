import { Network } from '@core/types';
import { SecretType } from '@core/types';

import { isHyperliquidChainId } from './isHyperliquidNetwork';

export function isDirectLedgerHyperEvmTransactionUnsupported(
  network: Pick<Network, 'chainId'> | undefined,
  secretType: SecretType | undefined,
) {
  return (
    secretType === SecretType.Ledger &&
    network !== undefined &&
    isHyperliquidChainId(network.chainId)
  );
}
