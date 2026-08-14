import { NetworkVMType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';

import { getNativeAssetType } from './getNativeAssetType';

const mockNetwork = (vmName: NetworkVMType): NetworkWithCaipId =>
  ({ vmName }) as NetworkWithCaipId;

describe('getNativeAssetType', () => {
  it('maps EVM native tokens correctly', () => {
    expect(getNativeAssetType(mockNetwork(NetworkVMType.EVM))).toBe(
      'evm_native',
    );
  });

  it('maps Solana native tokens correctly', () => {
    expect(getNativeAssetType(mockNetwork(NetworkVMType.SVM))).toBe(
      'svm_native',
    );
  });

  it('maps Avalanche P-Chain native tokens correctly', () => {
    expect(getNativeAssetType(mockNetwork(NetworkVMType.PVM))).toBe(
      'pvm_native',
    );
  });

  it('maps Avalanche X-Chain native tokens correctly', () => {
    expect(getNativeAssetType(mockNetwork(NetworkVMType.AVM))).toBe(
      'avm_native',
    );
  });

  it('maps Bitcoin native tokens correctly', () => {
    expect(getNativeAssetType(mockNetwork(NetworkVMType.BITCOIN))).toBe(
      'btc_native',
    );
  });

  it('returns unknown for unsupported VMs', () => {
    expect(getNativeAssetType(mockNetwork(NetworkVMType.CoreEth))).toBe(
      'unknown',
    );
  });
});
