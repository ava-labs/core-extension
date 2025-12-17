import { ChainId, NetworkToken } from '@avalabs/core-chains-sdk';
import { Account, AccountType, Balances, NetworkWithCaipId } from '@core/types';
import { calculateTotalBalance } from './calculateTotalBalance';
import {
  NetworkTokenWithBalance,
  NetworkVMType,
  TokenType,
  TokenWithBalanceBTC,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';

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
    const balance = calculateTotalBalance({
      account: account1,
      networks: [
        { chainId: ChainId.AVALANCHE_MAINNET_ID, vmName: NetworkVMType.EVM },
        { chainId: ChainId.DFK, vmName: NetworkVMType.EVM },
      ] as NetworkWithCaipId[],
      balances,
    });
    expect(balance).toEqual({
      priceChange: { percentage: [], value: 0 },
      sum: 6,
    });
  });

  it('should return null because of missing arguments', () => {
    const balance = calculateTotalBalance({});
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

    const balance = calculateTotalBalance({
      account,
      networks,
      balances: btcBalances,
    });

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

    const balance = calculateTotalBalance({
      account,
      networks,
      balances: evmBalances,
    });

    // Should use regular balanceInCurrency for non-AVAX tokens
    expect(balance.sum).toBe(150);
  });

  describe('price change calculations', () => {
    it('should correctly aggregate positive price change for single token', () => {
      const token: NetworkTokenWithBalance = {
        ...createBaseToken(),
        balanceInCurrency: 100,
        priceChanges: {
          percentage: 10,
          value: 10, // +$10 price change
        },
      };

      const account = createBaseAccount();
      const testBalances: Balances = {
        [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
          [account.addressC]: {
            AVAX: token,
          },
        },
      };

      const networks = [
        createBaseNetwork(ChainId.AVALANCHE_MAINNET_ID, NetworkVMType.EVM),
      ];

      const result = calculateTotalBalance({
        account,
        networks,
        balances: testBalances,
      });

      expect(result.sum).toBe(100);
      expect(result.priceChange.value).toBe(10);
      expect(result.priceChange.percentage).toEqual([10]);
    });

    it('should correctly aggregate negative price change for single token', () => {
      const token: NetworkTokenWithBalance = {
        ...createBaseToken(),
        balanceInCurrency: 100,
        priceChanges: {
          percentage: -15,
          value: -15, // -$15 price change
        },
      };

      const account = createBaseAccount();
      const testBalances: Balances = {
        [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
          [account.addressC]: {
            AVAX: token,
          },
        },
      };

      const networks = [
        createBaseNetwork(ChainId.AVALANCHE_MAINNET_ID, NetworkVMType.EVM),
      ];

      const result = calculateTotalBalance({
        account,
        networks,
        balances: testBalances,
      });

      expect(result.sum).toBe(100);
      expect(result.priceChange.value).toBe(-15);
      expect(result.priceChange.percentage).toEqual([-15]);
    });

    it('should aggregate price changes across multiple tokens on same chain', () => {
      const avaxToken: NetworkTokenWithBalance = {
        ...createBaseToken(),
        symbol: 'AVAX',
        balanceInCurrency: 100,
        priceChanges: {
          percentage: 5,
          value: 20, // +$20
        },
      };

      const usdcToken: NetworkTokenWithBalance = {
        ...createBaseToken(),
        symbol: 'USDC',
        balanceInCurrency: 50,
        priceChanges: {
          percentage: -2,
          value: -5, // -$5
        },
      };

      const account = createBaseAccount();
      const testBalances: Balances = {
        [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
          [account.addressC]: {
            AVAX: avaxToken,
            USDC: usdcToken,
          },
        },
      };

      const networks = [
        createBaseNetwork(ChainId.AVALANCHE_MAINNET_ID, NetworkVMType.EVM),
      ];

      const result = calculateTotalBalance({
        account,
        networks,
        balances: testBalances,
      });

      expect(result.sum).toBe(150); // 100 + 50
      expect(result.priceChange.value).toBe(15); // 20 + (-5) = 15
      expect(result.priceChange.percentage).toEqual([5, -2]); // AVAX, then USDC
    });

    it('should aggregate price changes across multiple chains', () => {
      const cChainToken: NetworkTokenWithBalance = {
        ...createBaseToken(),
        symbol: 'AVAX',
        balanceInCurrency: 100,
        priceChanges: {
          percentage: 10,
          value: 25, // +$25
        },
      };

      const dfkToken: NetworkTokenWithBalance = {
        ...createBaseToken(),
        symbol: 'JEWEL',
        balanceInCurrency: 75,
        priceChanges: {
          percentage: -5,
          value: -10, // -$10
        },
      };

      const account = createBaseAccount();
      const testBalances: Balances = {
        [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
          [account.addressC]: {
            AVAX: cChainToken,
          },
        },
        [ChainId.DFK.toString()]: {
          [account.addressC]: {
            JEWEL: dfkToken,
          },
        },
      };

      const networks = [
        createBaseNetwork(ChainId.AVALANCHE_MAINNET_ID, NetworkVMType.EVM),
        createBaseNetwork(ChainId.DFK, NetworkVMType.EVM),
      ];

      const result = calculateTotalBalance({
        account,
        networks,
        balances: testBalances,
      });

      expect(result.sum).toBe(175); // 100 + 75
      expect(result.priceChange.value).toBe(15); // 25 + (-10) = 15
      expect(result.priceChange.percentage).toEqual([-5, 10]);
    });

    it('should handle tokens without priceChanges field', () => {
      const tokenWithPriceChange: NetworkTokenWithBalance = {
        ...createBaseToken(),
        symbol: 'AVAX',
        balanceInCurrency: 100,
        priceChanges: {
          percentage: 10,
          value: 20,
        },
      };

      const tokenWithoutPriceChange: NetworkTokenWithBalance = {
        ...createBaseToken(),
        symbol: 'USDC',
        balanceInCurrency: 50,
        // No priceChanges field
      };

      const account = createBaseAccount();
      const testBalances: Balances = {
        [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
          [account.addressC]: {
            AVAX: tokenWithPriceChange,
            USDC: tokenWithoutPriceChange,
          },
        },
      };

      const networks = [
        createBaseNetwork(ChainId.AVALANCHE_MAINNET_ID, NetworkVMType.EVM),
      ];

      const result = calculateTotalBalance({
        account,
        networks,
        balances: testBalances,
      });

      expect(result.sum).toBe(150); // 100 + 50
      expect(result.priceChange.value).toBe(20); // Only AVAX contributes
      expect(result.priceChange.percentage).toEqual([10]);
    });

    it('should not double-count price changes', () => {
      // This is a regression test for the bug where priceChanges.value was added twice
      const token: NetworkTokenWithBalance = {
        ...createBaseToken(),
        balanceInCurrency: 100,
        priceChanges: {
          percentage: 10,
          value: 10,
        },
      };

      const account = createBaseAccount();
      const testBalances: Balances = {
        [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
          [account.addressC]: {
            AVAX: token,
          },
        },
      };

      const networks = [
        createBaseNetwork(ChainId.AVALANCHE_MAINNET_ID, NetworkVMType.EVM),
      ];

      const result = calculateTotalBalance({
        account,
        networks,
        balances: testBalances,
      });

      // Should be 10, not 20 (which would indicate double-counting)
      expect(result.priceChange.value).toBe(10);
    });

    it('Should leave out not visible tokens', () => {
      const cChainToken: NetworkTokenWithBalance = {
        ...createBaseToken(),
        symbol: 'AVAX',
        balanceInCurrency: 100,
        priceChanges: {
          percentage: 10,
          value: 25, // +$25
        },
      };

      const dfkToken: TokenWithBalanceERC20 = {
        ...createBaseToken(),
        type: TokenType.ERC20,
        symbol: 'JEWEL',
        balanceInCurrency: 75,
        address: '0x1',
        reputation: null,
        priceChanges: {
          percentage: -5,
          value: -10, // -$10
        },
      };

      const account = createBaseAccount();
      const testBalances: Balances = {
        [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
          [account.addressC]: {
            AVAX: cChainToken,
          },
        },
        [ChainId.DFK.toString()]: {
          [account.addressC]: {
            JEWEL: dfkToken,
          },
        },
      };

      const networks = [
        createBaseNetwork(ChainId.AVALANCHE_MAINNET_ID, NetworkVMType.EVM),
        createBaseNetwork(ChainId.DFK, NetworkVMType.EVM),
      ];

      const result = calculateTotalBalance({
        account,
        networks,
        balances: testBalances,
        tokenVisibility: {
          'eip155:43114': {
            [dfkToken.symbol]: false,
          },
        },
      });

      expect(result.sum).toBe(100); // 100 + 75
      expect(result.priceChange.value).toBe(25); // 25 + (-10) = 15
      expect(result.priceChange.percentage).toEqual([10]);
    });
  });
});
