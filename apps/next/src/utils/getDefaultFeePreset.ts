import { isAvalancheNetwork } from '@core/common';
import { NetworkWithCaipId, TransactionPriority } from '@core/types';

import { DEFAULT_FEE_PRESET, DEFAULT_FEE_PRESET_C_CHAIN } from '@/config';

export const getDefaultFeePreset = (
  network: NetworkWithCaipId,
): TransactionPriority =>
  isAvalancheNetwork(network) ? DEFAULT_FEE_PRESET_C_CHAIN : DEFAULT_FEE_PRESET;
