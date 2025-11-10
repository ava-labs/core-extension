import { EvmTxSigningData } from '../types';

export const getInitialGasLimit = (
  data?: EvmTxSigningData,
): number | undefined => {
  if (!data) {
    return undefined;
  }

  return data.data.gasLimit ? Number(data.data.gasLimit) : undefined;
};
