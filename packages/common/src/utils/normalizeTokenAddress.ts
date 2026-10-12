import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { NetworkWithCaipId } from '@core/types';

// VM dependent normalization of token addresses
export const normalizeTokenAddress = (
  address: string,
  network: Pick<NetworkWithCaipId, 'vmName'>,
): string =>
  network.vmName === NetworkVMType.SVM ? address : address.toLowerCase();
