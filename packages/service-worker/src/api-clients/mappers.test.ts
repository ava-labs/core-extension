import {
  AvmGetBalancesResponse,
  PvmGetBalancesResponse,
} from '~/api-clients/balance-api';
import { mapAvmTokenBalance, mapPvmTokenBalance } from './mappers';

const nativeTokenBalance = {
  name: 'Avalanche',
  symbol: 'AVAX',
  type: 'native',
  decimals: 9,
  assetId: 'avax',
  // The service's total spans every category, spendable or not.
  balance: '100',
};

const pvmResponse = (
  categories: Partial<PvmGetBalancesResponse['balances']['categories']> = {},
): PvmGetBalancesResponse =>
  ({
    caip2Id: 'avax:pchain',
    networkType: 'pvm',
    id: 'p-chain',
    currency: 'usd',
    error: null,
    balances: {
      nativeTokenBalance,
      categories: {
        unlockedStaked: '0',
        unlockedUnstaked: '0',
        unlockedUnstakedMultiSig: '0',
        lockedStaked: '0',
        lockedPlatform: '0',
        lockedStakeable: '0',
        atomicMemoryLocked: {},
        atomicMemoryUnlocked: {},
        ...categories,
      },
    },
  }) as unknown as PvmGetBalancesResponse;

const avmAsset = (balance: string) => ({
  assetId: 'avax',
  name: 'Avalanche',
  symbol: 'AVAX',
  decimals: 9,
  balance,
  type: 'native' as const,
});

const avmResponse = (
  categories: Partial<AvmGetBalancesResponse['balances']['categories']> = {},
): AvmGetBalancesResponse =>
  ({
    caip2Id: 'avax:xchain',
    networkType: 'avm',
    id: 'x-chain',
    currency: 'usd',
    error: null,
    balances: {
      nativeTokenBalance,
      categories: {
        unlocked: [],
        locked: [],
        atomicMemoryLocked: {},
        atomicMemoryUnlocked: {},
        ...categories,
      },
    },
  }) as unknown as AvmGetBalancesResponse;

describe('mapPvmTokenBalance', () => {
  it('reports only unlockedUnstaked as available', () => {
    const token = mapPvmTokenBalance(
      pvmResponse({ unlockedUnstaked: '40', lockedStaked: '60' }),
    );

    expect(token.available).toBe(40n);
    // `balance` still carries the service total, which is why it must not be used for sending.
    expect(token.balance).toBe(100n);
  });

  it('includes the multisig bucket, as the balancePerType roll-up does', () => {
    const token = mapPvmTokenBalance(
      pvmResponse({ unlockedUnstaked: '40', unlockedUnstakedMultiSig: '5' }),
    );

    expect(token.available).toBe(45n);
  });

  it('reports zero available when every utxo is locked or staked', () => {
    const token = mapPvmTokenBalance(
      pvmResponse({
        lockedStaked: '30',
        lockedPlatform: '30',
        lockedStakeable: '40',
      }),
    );

    expect(token.available).toBe(0n);
  });

  it('does not count staked, locked, pending or atomic funds as available', () => {
    const token = mapPvmTokenBalance(
      pvmResponse({
        unlockedUnstaked: '10',
        unlockedStaked: '20',
        lockedStaked: '30',
        lockedPlatform: '40',
        lockedStakeable: '50',
        atomicMemoryUnlocked: { 'avax:cchain': '60' },
        atomicMemoryLocked: { 'avax:cchain': '70' },
      }),
    );

    expect(token.available).toBe(10n);
  });
});

describe('mapAvmTokenBalance', () => {
  it('reports only unlocked as available', () => {
    const token = mapAvmTokenBalance(
      avmResponse({ unlocked: [avmAsset('25')], locked: [avmAsset('75')] }),
    );

    expect(token.available).toBe(25n);
    expect(token.balance).toBe(100n);
  });

  it('reports zero available when everything is locked', () => {
    const token = mapAvmTokenBalance(
      avmResponse({ locked: [avmAsset('100')] }),
    );

    expect(token.available).toBe(0n);
  });

  it('sums multiple unlocked assets', () => {
    const token = mapAvmTokenBalance(
      avmResponse({ unlocked: [avmAsset('10'), avmAsset('15')] }),
    );

    expect(token.available).toBe(25n);
  });
});
