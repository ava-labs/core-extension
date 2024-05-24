import { PrimaryNetworkAssetType } from '@avalabs/glacier-sdk';
import { calculateTotalBalance } from './calculateTotalBalance';
import BN from 'bn.js';

describe('src/background/services/balances/utils/calculateTotalBalance.ts', () => {
  it('should return the total balance based on PChainBalance', () => {
    const utxoWithAmount1 = {
      assetId: '1',
      name: 'testToken',
      symbol: 'AVAX',
      denomination: 9,
      type: PrimaryNetworkAssetType.SECP256K1,
      amount: '1',
      utxoCount: 1,
    };
    const utxos = {
      unlockedUnstaked: [utxoWithAmount1],
      unlockedStaked: [utxoWithAmount1],
      lockedPlatform: [utxoWithAmount1],
      lockedStakeable: [utxoWithAmount1],
      lockedStaked: [utxoWithAmount1],
      pendingStaked: [utxoWithAmount1],

      atomicMemoryUnlocked: [
        {
          ...utxoWithAmount1,
          sharedWithChainId: '',
          status: 'testing',
        },
      ],

      atomicMemoryLocked: [
        {
          ...utxoWithAmount1,
          sharedWithChainId: '',
          status: 'testing',
        },
      ],
    };

    const result = calculateTotalBalance(utxos);
    expect(result).toEqual(new BN(8));
  });
  it('should return the total balance based on XChainBalance', () => {
    const utxoWithAmount1 = {
      assetId: '1',
      name: 'testToken',
      symbol: 'AVAX',
      denomination: 9,
      type: PrimaryNetworkAssetType.SECP256K1,
      amount: '1',
      utxoCount: 1,
    };
    const utxos = {
      locked: [utxoWithAmount1],

      unlocked: [utxoWithAmount1],
      atomicMemoryUnlocked: [
        {
          ...utxoWithAmount1,
          sharedWithChainId: '',
        },
      ],
      atomicMemoryLocked: [
        {
          ...utxoWithAmount1,
          sharedWithChainId: '',
        },
      ],
    };
    const result = calculateTotalBalance(utxos);
    expect(result).toEqual(new BN(4));
  });
});
