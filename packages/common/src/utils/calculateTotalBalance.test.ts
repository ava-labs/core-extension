import { ChainId, NetworkToken } from '@avalabs/core-chains-sdk';
import { Account, AccountType, Balances } from '@core/types';
import { calculateTotalBalance } from './calculateTotalBalance';
import {
  NetworkTokenWithBalance,
  NetworkVMType,
  TokenType,
  TokenWithBalanceBTC,
} from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';

describe('utils/calculateTotalBalance', () => {
  // Helper functions and shared data
  const createBaseAccount = (): Account => ({
    id: 'account1',
    name: 'test account',
    addressBTC: 'btc-address',
    addressC: 'c-address',
    type: AccountType.PRIMARY,
    index: 0,
    walletId: 'walletId',
  });

  const createBaseNetwork = (
    chainId: ChainId,
    vmName: NetworkVMType,
  ): NetworkWithCaipId => ({
    chainId,
    vmName,
    caipId: 'eip155:43114',
    chainName: 'Avalanche',
    rpcUrl: 'https://api.avax.network',
    networkToken: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 9,
      description: 'AVAX',
      logoUri: '',
    },
    logoUri: '',
    explorerUrl: 'https://snowtrace.io',
  });

  const createBaseToken = () => ({
    type: TokenType.NATIVE as const,
    name: 'Avalanche',
    symbol: 'AVAX',
    balance: 100n,
    balanceDisplayValue: '0.0000001',
    coingeckoId: 'avax',
    decimals: 9,
    description: 'Avalanche native token',
    logoUri: 'avax-logo',
    balanceInCurrency: 5,
    priceInCurrency: 5,
    priceChanges: {
      currentPrice: 5,
      percentage: 0,
      value: 0,
    },
  });

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

  it('should add unconfirmed balance to the total balance', () => {
    const btcToken: TokenWithBalanceBTC = {
      ...createBaseToken(),
      utxos: [],
      balanceInCurrency: 5,
      priceInCurrency: 5,
      priceChanges: {
        value: 0,
        percentage: 0,
      },
      unconfirmedBalance: 10n,
      unconfirmedBalanceInCurrency: 10,
    };

    const account = {
      ...createBaseAccount(),
      addressBTC: 'BTC-test123',
    };

    const btcBalances: Balances = {
      [ChainId.BITCOIN.toString()]: {
        [account.addressBTC]: {
          BTC: btcToken,
        },
      },
    };

    const networks = [
      createBaseNetwork(ChainId.BITCOIN, NetworkVMType.BITCOIN),
    ];

    const balance = calculateTotalBalance(account, networks, btcBalances);

    expect(balance.sum).toBe(15);
  });

  it('should use regular balanceInCurrency', () => {
    const evmToken: NetworkTokenWithBalance = {
      type: TokenType.NATIVE,
      name: 'Ethereum',
      symbol: 'ETH',
      balance: 100n,
      balanceDisplayValue: '0.0000001',
      coingeckoId: 'ethereum',
      decimals: 18,
      description: 'Ethereum native token',
      logoUri: 'eth-logo',
      balanceInCurrency: 150,
    };

    const account = {
      ...createBaseAccount(),
      addressC: '0x123',
    };

    const evmBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressC!]: {
          ETH: evmToken,
        },
      },
    };

    const networks = [
      createBaseNetwork(ChainId.AVALANCHE_MAINNET_ID, NetworkVMType.EVM),
    ];

    const balance = calculateTotalBalance(account, networks, evmBalances);

    // Should use regular balanceInCurrency for non-AVAX tokens
    expect(balance.sum).toBe(150);
  });
});
