import { ChainId, NetworkToken } from '@avalabs/core-chains-sdk';
import { Account, AccountType, Balances } from '@core/types';
import { calculateTotalBalance } from './calculateTotalBalance';
import {
  NetworkTokenWithBalance,
  NetworkVMType,
  TokenType,
} from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';

describe('utils/calculateTotalBalance', () => {
  const account1: Account = {
    id: 'account1 ID',
    name: 'account1 name',
    addressBTC: 'account1 BTC address',
    addressC: 'account1 C address',
    type: AccountType.PRIMARY,
    index: 0,
    walletId: 'walletId',
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
    balance: 100n,
    balanceDisplayValue: '0.00001',
    coingeckoId: '',
    balanceInCurrency: 3,
  };

  const balances: Balances = {
    [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
      [account1.addressC]: {
        [networkToken1.symbol]: {
          ...network1TokenBalance,
          balance: 3n,
        },
      },
    },
    [ChainId.DFK.toString()]: {
      [account1.addressC]: {
        [networkToken1.symbol]: {
          ...network1TokenBalance,
          balance: 3n,
        },
      },
    },
  };

  it('it should calculate the balance', () => {
    const balance = calculateTotalBalance(
      account1,
      [
        { chainId: ChainId.AVALANCHE_MAINNET_ID, vmName: NetworkVMType.EVM },
        { chainId: ChainId.DFK, vmName: NetworkVMType.EVM },
      ] as NetworkWithCaipId[],
      balances,
    );
    expect(balance).toEqual({
      priceChange: { percentage: [], value: 0 },
      sum: 6,
    });
  });

  it('should return null because of missing arguments', () => {
    const balance = calculateTotalBalance();
    expect(balance).toEqual({
      priceChange: { percentage: [], value: 0 },
      sum: null,
    });
  });
});
