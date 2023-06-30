import {
  ChainId,
  Network,
  NetworkToken,
  NetworkVMType,
} from '@avalabs/chains-sdk';
import { Account, AccountType } from '@src/background/services/accounts/models';
import {
  Balances,
  NetworkTokenWithBalance,
  TokenType,
} from '@src/background/services/balances/models';
import BN from 'bn.js';
import { calculateTotalBalance } from './calculateTotalBalance';

describe('utils/calculateTotalBalance', () => {
  const account1: Account = {
    id: 'account1 ID',
    name: 'account1 name',
    addressBTC: 'account1 BTC address',
    addressC: 'account1 C address',
    type: AccountType.PRIMARY,
    index: 0,
  };
  const networkToken1: NetworkToken = {
    name: 'network token 1',
    symbol: 'NT1',
    description: 'network tokwn for network 1',
    decimals: 12,
    logoUri: 'network.token.one.com',
  };

  const network1: Network = {
    chainName: 'test network 1',
    chainId: ChainId.AVALANCHE_MAINNET_ID,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'test.one.com/rpc',
    networkToken: networkToken1,
    logoUri: 'test.one.com/logo',
    primaryColor: 'pink',
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
    [ChainId.DFK]: {
      [account1.addressC]: {
        [networkToken1.symbol]: {
          ...network1TokenBalance,
          balance: new BN(3),
        },
      },
    },
  };

  it('it should calculate the balance', () => {
    const balance = calculateTotalBalance(
      network1,
      account1,
      [ChainId.AVALANCHE_MAINNET_ID, ChainId.DFK],
      balances
    );
    expect(balance).toBe(6);
  });

  it('should return null because of missing arguments', () => {
    const balance = calculateTotalBalance();
    expect(balance).toBe(null);
  });
});
