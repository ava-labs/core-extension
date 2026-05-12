import { BitcoinCaip2ChainId } from '@avalabs/core-chains-sdk';
import { AccountType } from '@core/types';

import { reconstructAccountFromError } from './helpers';

describe('reconstructAccountFromError', () => {
  it('puts an EVM address under `addressC` for unmapped EVM chains', () => {
    // Regression: previously only specific eip155 chainIds were mapped, so any
    // unmapped EVM chain (e.g. a custom network like Monad / eip155:143) ended
    // up with `addressC: undefined`, which made the balance-service fallback
    // refetch return an empty result.
    const account = reconstructAccountFromError({
      caip2Id: 'eip155:143',
      networkType: 'evm',
      id: '0xd0684d4027998dc9076EF015A91680d6425eA74d',
      balances: null,
      error: '[getEvmBalances] unsupported chain id: 143',
    } as any);

    expect(account.addressC).toBe('0xd0684d4027998dc9076EF015A91680d6425eA74d');
    expect(account.type).toBe(AccountType.PRIMARY);
  });

  it('still maps known specific chainIds via Caip2IdAccountTypeMap', () => {
    // Use a non-EVM CAIP-2 ID so the assertion only passes via the specific
    // map (not the eip155 namespace fallback).
    const account = reconstructAccountFromError({
      caip2Id: BitcoinCaip2ChainId.MAINNET,
      networkType: 'bitcoin',
      id: 'bc1qexampleaddress',
      balances: null,
      error: 'boom',
    } as any);

    expect(account.addressBTC).toBe('bc1qexampleaddress');
  });

  it('does not pollute the account with an empty-string key when nothing maps', () => {
    const account = reconstructAccountFromError({
      caip2Id: 'unknown-namespace:42',
      networkType: 'evm',
      id: 'whatever',
      balances: null,
      error: 'boom',
    } as any);

    expect(Object.keys(account)).not.toContain('');
    expect((account as any)['']).toBeUndefined();
  });
});
