import {
  FungibleTokenBalance,
  isEvmNativeToken,
  NetworkFee,
  TransactionPriority,
} from '@core/types';

const EVM_NATIVE_SEND_TX_GAS = 21_000n;

export const getEvmMaxAmount = (
  fee: NetworkFee,
  token: FungibleTokenBalance,
  feePreset: TransactionPriority,
) => {
  const estimatedFee = fee[feePreset].maxFeePerGas * EVM_NATIVE_SEND_TX_GAS;

  return {
    maxAmount: token.balance - (isEvmNativeToken(token) ? estimatedFee : 0n),
    estimatedFee,
  };
};
