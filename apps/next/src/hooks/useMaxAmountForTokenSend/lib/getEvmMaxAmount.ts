import {
  FungibleTokenBalance,
  isEvmNativeToken,
  NetworkFee,
} from '@core/types';

const EVM_NATIVE_SEND_TX_GAS = 21_000n;

export const getEvmMaxAmount = (
  fee: NetworkFee,
  token: FungibleTokenBalance,
) => {
  const estimatedFee = fee.low.maxFeePerGas * EVM_NATIVE_SEND_TX_GAS;

  return {
    maxAmount: token.balance - (isEvmNativeToken(token) ? estimatedFee : 0n),
    estimatedFee,
  };
};
