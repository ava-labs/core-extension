import { AtomicBalances } from '@core/types';
import { ChainId } from '@avalabs/core-chains-sdk';
import { calculateTotalAtomicFundsForAccounts } from './calculateTotalAtomicFundsForAccounts';
import { AVALANCHE_BLOCKCHAIN_IDS } from './constants';

describe('calculateTotalAtomicFundsForAccounts', () => {
  const accounts = ['0x1', '0x2', '0x3'];

  it('Should return an "empty" TokenUnit if none of the balances are from X/P or CoreEth', () => {
    const atomicBalances = {
      randomChainId: {
        '0x1': {
          atomicMemoryLocked: {
            a: '10000',
          },
        },
      },
      anotherChainId: {
        '0x2': {
          atomicMemoryLocked: {
            b: '20000',
          },
        },
      },
      letsHaveAThird: {
        '0x3': {
          atomicMemoryLocked: {
            c: '20000',
          },
        },
      },
    } as unknown as AtomicBalances;

    const result = calculateTotalAtomicFundsForAccounts(
      atomicBalances,
      accounts,
    );

    expect(result.toDisplay({ asNumber: true })).toEqual(0);
  });

  it('Should correctly sum up the atomic balances from X/P and CoreEth', () => {
    const atomicBalances: AtomicBalances = {
      [AVALANCHE_BLOCKCHAIN_IDS.MAINNET_C]: {
        ['0x1']: {
          atomicMemoryUnlocked: {
            [AVALANCHE_BLOCKCHAIN_IDS.MAINNET_C]: [
              {
                balance: '10',
                decimals: 2,
                symbol: 'TT1',
                type: 'native',
                name: 'Test token 1',
                assetId: 'test_token_1',
              },
              {
                balance: '20',
                decimals: 2,
                symbol: 'TT2',
                type: 'native',
                name: 'Test token 2',
                assetId: 'test_token_2',
              },
            ],
          },
        },
        ['0x2']: {
          atomicMemoryUnlocked: {
            [AVALANCHE_BLOCKCHAIN_IDS.MAINNET_C]: [
              {
                balance: '10',
                decimals: 2,
                symbol: 'TT1',
                type: 'native',
                name: 'Test token 1',
                assetId: 'test_token_1',
              },
            ],
          },
        },
      },
      [ChainId.AVALANCHE_X]: {
        ['0x2']: {
          atomicMemoryUnlocked: {
            [ChainId.AVALANCHE_X]: [
              {
                balance: '50',
                decimals: 2,
                symbol: 'TT3',
                type: 'native',
                name: 'Test token 3',
                assetId: 'test_token_3',
              },
              {
                balance: '50',
                decimals: 2,
                symbol: 'TT4',
                type: 'native',
                name: 'Test token 4',
                assetId: 'test_token_4',
              },
            ],
          },
        },
        ['0x3']: {
          atomicMemoryUnlocked: {
            [ChainId.AVALANCHE_X]: [
              {
                balance: '10',
                decimals: 2,
                symbol: 'TT4',
                type: 'native',
                name: 'Test token 4',
                assetId: 'test_token_4',
              },
            ],
          },
        },
      },
      [ChainId.AVALANCHE_P]: {
        ['0x1']: {
          nativeTokenBalance: {
            decimals: 2,
          },
          atomicMemoryUnlocked: {
            [ChainId.AVALANCHE_P]: '20',
          },
        },
        ['0x2']: {
          nativeTokenBalance: {
            decimals: 2,
          },
          atomicMemoryUnlocked: {
            [ChainId.AVALANCHE_P]: '30',
          },
        },
      },
    } as unknown as AtomicBalances;

    const result = calculateTotalAtomicFundsForAccounts(
      atomicBalances,
      accounts,
    );
    expect(result.toDisplay({ asNumber: true })).toEqual(2);
  });
});
