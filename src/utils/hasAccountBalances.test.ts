import { ChainId, NetworkToken } from '@avalabs/core-chains-sdk';
import { Account, AccountType } from '@src/background/services/accounts/models';
import {
  Balances,
  NetworkTokenWithBalance,
  TokenType,
} from '@src/background/services/balances/models';
import BN from 'bn.js';
import { hasAccountBalances } from './hasAccountBalances';

describe('utils/calculateTotalBalance', () => {
  const account1: Account = {
    id: 'account1 ID',
    name: 'account1 name',
    addressBTC: 'account1 BTC address',
    addressC: 'account1 C address',
    type: AccountType.PRIMARY,
    index: 0,
    walletId: 'wallet-id-1',
  };

  const account2: Account = {
    id: 'account1 ID',
    name: 'account1 name',
    addressBTC: 'account2 BTC address',
    addressC: 'account2 C address',
    type: AccountType.PRIMARY,
    index: 0,
    walletId: 'wallet-id-1',
  };
  const networkToken1: NetworkToken = {
    name: 'network token 1',
    symbol: 'NT1',
    description: 'network tokwn for network 1',
    decimals: 12,
    logoUri: 'network.token.one.com',
  };

  const network1TokenBalance: NetworkTokenWithBalance = {
    ...networkToken1,
    type: TokenType.NATIVE,
    balance: new BN(100),
    balanceUSD: 3,
  };

  const balances: Balances = {
    [ChainId.AVALANCHE_MAINNET_ID]: {
      [account1.addressC]: {
        [networkToken1.symbol]: {
          ...network1TokenBalance,
          balance: new BN(3),
        },
      },
    },
  };

  it('should return false when there is no balance for the account in the balances object', () => {
    const balance = hasAccountBalances(balances, account2, [
      ChainId.AVALANCHE_MAINNET_ID,
    ]);
    expect(balance).toBe(false);
  });

  it('should return true when we can get balances for the account from the balances object', () => {
    const balance = hasAccountBalances(balances, account1, [
      ChainId.AVALANCHE_MAINNET_ID,
    ]);
    expect(balance).toBe(true);
  });
});
