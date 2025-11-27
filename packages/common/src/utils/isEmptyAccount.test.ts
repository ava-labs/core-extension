import { ChainId } from '@avalabs/core-chains-sdk';
import {
  Network,
  NetworkTokenWithBalance,
  TokenType,
} from '@avalabs/vm-module-types';
import { Account, AccountType, Balances } from '@core/types';
import { isEmptyAccount } from './isEmptyAccount';

describe('utils/isEmptyAccount', () => {
  const getAccount = (id: string) => ({
    id: `${id} ID`,
    name: `${id} name`,
    addressBTC: `${id} BTC address`,
    addressC: `${id} C address`,
    type: AccountType.PRIMARY,
    index: 0,
    walletId: 'wallet-id-1',
  });

  const networks: Pick<Network, 'chainId'>[] = [
    {
      chainId: ChainId.AVALANCHE_MAINNET_ID,
    },
  ];

  const nonEmptyAccount: Account = getAccount('account1');
  const emptyAccount: Account = getAccount('account2');

  const network1TokenBalance: NetworkTokenWithBalance = {
    name: 'network token 1',
    symbol: 'NT1',
    description: 'network token for network 1',
    decimals: 12,
    logoUri: 'network.token.one.com',
    type: TokenType.NATIVE,
    balance: 100n,
    balanceDisplayValue: '0.0001',
    coingeckoId: '',
    balanceInCurrency: 3,
  };

  const balances: Balances = {
    [ChainId.AVALANCHE_MAINNET_ID]: {
      [nonEmptyAccount.addressC]: {
        [network1TokenBalance.symbol]: {
          ...network1TokenBalance,
          balance: 3n,
        },
      },
      [emptyAccount.addressC]: {
        [network1TokenBalance.symbol]: {
          ...network1TokenBalance,
          balance: 0n,
        },
      },
    },
  };

  it('should return true when there is no balance for the account', () => {
    const isEmpty = isEmptyAccount(balances, emptyAccount, networks);
    expect(isEmpty).toBe(true);
  });

  it('should return false when there is any balance for the account', () => {
    const isEmpty = isEmptyAccount(balances, nonEmptyAccount, networks);
    expect(isEmpty).toBe(false);
  });

  it('should return true when the balances object is empty', () => {
    const isEmpty = isEmptyAccount({}, nonEmptyAccount, networks);
    expect(isEmpty).toBe(true);
  });

  it('should return true when the balances object has no entries for the account', () => {
    const isEmpty = isEmptyAccount({}, getAccount('unknown_account'), networks);
    expect(isEmpty).toBe(true);
  });
});
