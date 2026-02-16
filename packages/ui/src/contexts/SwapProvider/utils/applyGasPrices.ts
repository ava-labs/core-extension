import { TransactionParams } from '@avalabs/evm-module';
import { FeeSetting, NetworkFee } from '@core/types';

/**
 * Applies gas prices to transactions that don't have them set.
 * Uses the specified fee tier or falls back to medium/low.
 */
export function applyGasPricesToTransactions(
  transactions: TransactionParams[],
  networkFee: NetworkFee,
  feeSetting: FeeSetting = 'medium',
): void {
  const selectedFee = networkFee[feeSetting];

  const maxFeePerGas =
    selectedFee?.maxFeePerGas ??
    networkFee.medium?.maxFeePerGas ??
    networkFee.low?.maxFeePerGas;

  const maxPriorityFeePerGas =
    selectedFee?.maxPriorityFeePerGas ??
    networkFee.medium?.maxPriorityFeePerGas ??
    networkFee.low?.maxPriorityFeePerGas;

  if (!maxFeePerGas || !maxPriorityFeePerGas) {
    console.warn(
      '[applyGasPrices] Could not determine gas prices from network fee',
    );
    return;
  }

  const asHex = (value: bigint) => `0x${value.toString(16)}`;

  transactions.forEach((tx) => {
    if (!tx.maxFeePerGas || !tx.maxPriorityFeePerGas) {
      tx.maxFeePerGas = asHex(maxFeePerGas);
      tx.maxPriorityFeePerGas = asHex(maxPriorityFeePerGas);
    }
  });
}
