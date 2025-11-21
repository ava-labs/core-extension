import { renderHook } from '@testing-library/react';
import { TokenType } from '@avalabs/vm-module-types';
import { ChainId } from '@avalabs/core-chains-sdk';
import { Account, AccountType } from '@core/types';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
} from '@core/ui';
import { useNetworksWithBalance } from './useNetworksWithBalance';

jest.mock('@core/ui', () => ({
  useAccountsContext: jest.fn(),
  useBalancesContext: jest.fn(),
  useNetworkContext: jest.fn(),
}));

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  getAllAddressesForAccount: jest.fn((account: Account) => {
    const addresses: string[] = [];
    if (account.addressC) addresses.push(account.addressC);
    if (account.addressBTC) addresses.push(account.addressBTC);
    if (account.addressAVM) addresses.push(account.addressAVM);
    if (account.addressPVM) addresses.push(account.addressPVM);
    if (account.addressCoreEth) addresses.push(account.addressCoreEth);
    return addresses;
  }),
}));

const mockAccount1: Account = {
  index: 0,
  id: 'account-1',
  name: 'Account 1',
  addressBTC: 'bc1qy76a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed',
  addressC: '0xAddress1',
  addressAVM: 'X-avax1address1',
  addressPVM: 'P-avax1address1',
  addressCoreEth: '',
  type: AccountType.PRIMARY,
  walletId: 'wallet-1',
};

const mockAccount2: Account = {
  index: 1,
  id: 'account-2',
  name: 'Account 2',
  addressBTC: 'bc1qz86a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed',
  addressC: '0xAddress2',
  addressAVM: 'X-avax1address2',
  addressPVM: 'P-avax1address2',
  addressCoreEth: '',
  type: AccountType.PRIMARY,
  walletId: 'wallet-1',
};

const mockCChainNetwork = {
  chainId: ChainId.AVALANCHE_MAINNET_ID,
  chainName: 'Avalanche C-Chain',
  vmName: 'EVM' as const,
  caipId: 'eip155:43114',
  logoUri: 'avax-logo.png',
};

const mockPChainNetwork = {
  chainId: ChainId.AVALANCHE_P,
  chainName: 'Avalanche P-Chain',
  vmName: 'PVM' as const,
  caipId: 'avax:43114-p',
  logoUri: 'p-logo.png',
};

const mockBitcoinNetwork = {
  chainId: ChainId.BITCOIN,
  chainName: 'Bitcoin',
  vmName: 'BITCOIN' as const,
  caipId: 'bip122:000000000019d6689c085ae165831e93',
  logoUri: 'btc-logo.png',
};

const mockEthereumNetwork = {
  chainId: ChainId.ETHEREUM_HOMESTEAD,
  chainName: 'Ethereum',
  vmName: 'EVM' as const,
  caipId: 'eip155:1',
  logoUri: 'eth-logo.png',
};

describe('useNetworksWithBalance', () => {
  const mockGetAccountsByWalletId = jest.fn();
  const mockGetAccountById = jest.fn();
  const mockGetNetwork = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAccountsContext as jest.Mock).mockReturnValue({
      getAccountsByWalletId: mockGetAccountsByWalletId,
      getAccountById: mockGetAccountById,
    });

    (useNetworkContext as jest.Mock).mockReturnValue({
      getNetwork: mockGetNetwork,
    });

    (useBalancesContext as jest.Mock).mockReturnValue({
      balances: { tokens: {} },
    });
  });

  it('returns empty object when no accounts exist for wallet', () => {
    mockGetAccountsByWalletId.mockReturnValue([]);

    const { result } = renderHook(() =>
      useNetworksWithBalance({ walletId: 'wallet-1' }),
    );

    expect(result.current).toEqual({});
  });

  it('returns empty arrays for accounts with no balances', () => {
    mockGetAccountsByWalletId.mockReturnValue([mockAccount1, mockAccount2]);

    const { result } = renderHook(() =>
      useNetworksWithBalance({ walletId: 'wallet-1' }),
    );

    expect(result.current).toEqual({
      'account-1': [],
      'account-2': [],
    });
  });

  it('returns networks with balances for a single account', () => {
    mockGetAccountsByWalletId.mockReturnValue([mockAccount1]);
    mockGetNetwork.mockImplementation((chainId: number) => {
      if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
      if (chainId === ChainId.BITCOIN) return mockBitcoinNetwork;
      return null;
    });

    (useBalancesContext as jest.Mock).mockReturnValue({
      balances: {
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            '0xAddress1': {
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 1000n,
                decimals: 18,
              },
            },
          },
          [ChainId.BITCOIN]: {
            bc1qy76a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed: {
              BTC: {
                type: TokenType.NATIVE,
                name: 'Bitcoin',
                symbol: 'BTC',
                balance: 5000n,
                decimals: 8,
              },
            },
          },
        },
      },
    });

    const { result } = renderHook(() =>
      useNetworksWithBalance({ walletId: 'wallet	1' }),
    );

    expect(result.current).toEqual({
      'account-1': [mockCChainNetwork, mockBitcoinNetwork],
    });
  });

  it('returns networks with balances for multiple accounts', () => {
    mockGetAccountsByWalletId.mockReturnValue([mockAccount1, mockAccount2]);
    mockGetNetwork.mockImplementation((chainId: number) => {
      if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
      if (chainId === ChainId.BITCOIN) return mockBitcoinNetwork;
      if (chainId === ChainId.ETHEREUM_HOMESTEAD) return mockEthereumNetwork;
      return null;
    });

    (useBalancesContext as jest.Mock).mockReturnValue({
      balances: {
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            '0xAddress1': {
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 1000n,
                decimals: 18,
              },
            },
            '0xAddress2': {
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 2000n,
                decimals: 18,
              },
            },
          },
          [ChainId.BITCOIN]: {
            bc1qy76a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed: {
              BTC: {
                type: TokenType.NATIVE,
                name: 'Bitcoin',
                symbol: 'BTC',
                balance: 5000n,
                decimals: 8,
              },
            },
          },
          [ChainId.ETHEREUM_HOMESTEAD]: {
            '0xAddress2': {
              ETH: {
                type: TokenType.NATIVE,
                name: 'Ethereum',
                symbol: 'ETH',
                balance: 3000n,
                decimals: 18,
              },
            },
          },
        },
      },
    });

    const { result } = renderHook(() =>
      useNetworksWithBalance({ walletId: 'wallet-1' }),
    );

    expect(result.current).toEqual({
      'account-1': [mockCChainNetwork, mockBitcoinNetwork],
      'account-2': [mockCChainNetwork, mockEthereumNetwork],
    });
  });

  it('filters out networks where balance is zero', () => {
    mockGetAccountsByWalletId.mockReturnValue([mockAccount1]);
    mockGetNetwork.mockImplementation((chainId: number) => {
      if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
      return null;
    });

    (useBalancesContext as jest.Mock).mockReturnValue({
      balances: {
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            '0xAddress1': {
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 0n,
                decimals: 18,
              },
            },
          },
        },
      },
    });

    const { result } = renderHook(() =>
      useNetworksWithBalance({ walletId: 'wallet-1' }),
    );

    expect(result.current).toEqual({
      'account-1': [],
    });
  });

  it('sorts networks by priority (C-chain, P-chain, X-chain, Bitcoin, Ethereum)', () => {
    mockGetAccountsByWalletId.mockReturnValue([mockAccount1]);
    mockGetNetwork.mockImplementation((chainId: number) => {
      if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
      if (chainId === ChainId.AVALANCHE_P) return mockPChainNetwork;
      if (chainId === ChainId.BITCOIN) return mockBitcoinNetwork;
      if (chainId === ChainId.ETHEREUM_HOMESTEAD) return mockEthereumNetwork;
      return null;
    });

    // Add balances in reverse order to test sorting
    (useBalancesContext as jest.Mock).mockReturnValue({
      balances: {
        tokens: {
          [ChainId.ETHEREUM_HOMESTEAD]: {
            '0xAddress1': {
              ETH: {
                type: TokenType.NATIVE,
                name: 'Ethereum',
                symbol: 'ETH',
                balance: 1000n,
                decimals: 18,
              },
            },
          },
          [ChainId.BITCOIN]: {
            bc1qy76a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed: {
              BTC: {
                type: TokenType.NATIVE,
                name: 'Bitcoin',
                symbol: 'BTC',
                balance: 2000n,
                decimals: 8,
              },
            },
          },
          [ChainId.AVALANCHE_P]: {
            'P-avax1address1': {
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 3000n,
                decimals: 9,
              },
            },
          },
          [ChainId.AVALANCHE_MAINNET_ID]: {
            '0xAddress1': {
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 4000n,
                decimals: 18,
              },
            },
          },
        },
      },
    });

    const { result } = renderHook(() =>
      useNetworksWithBalance({ walletId: 'wallet-1' }),
    );

    expect(result.current['account-1']).toEqual([
      mockCChainNetwork, // C-chain first
      mockPChainNetwork, // P-chain second
      mockBitcoinNetwork, // Bitcoin third
      mockEthereumNetwork, // Ethereum fourth
    ]);
  });

  it('skips unknown networks', () => {
    mockGetAccountsByWalletId.mockReturnValue([mockAccount1]);
    mockGetNetwork.mockImplementation((chainId: number) => {
      if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
      return null; // Unknown network
    });

    (useBalancesContext as jest.Mock).mockReturnValue({
      balances: {
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            '0xAddress1': {
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 1000n,
                decimals: 18,
              },
            },
          },
          99999: {
            // Unknown chain ID
            '0xAddress1': {
              UNKNOWN: {
                type: TokenType.NATIVE,
                name: 'Unknown',
                symbol: 'UNK',
                balance: 2000n,
                decimals: 18,
              },
            },
          },
        },
      },
    });

    const { result } = renderHook(() =>
      useNetworksWithBalance({ walletId: 'wallet-1' }),
    );

    expect(result.current).toEqual({
      'account-1': [mockCChainNetwork], // Only known network
    });
  });

  it('handles multiple addresses for same account on same network', () => {
    const accountWithMultipleAddresses: Account = {
      ...mockAccount1,
      addressC: '0xAddress1',
    };

    mockGetAccountsByWalletId.mockReturnValue([accountWithMultipleAddresses]);
    mockGetNetwork.mockImplementation((chainId: number) => {
      if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
      return null;
    });

    (useBalancesContext as jest.Mock).mockReturnValue({
      balances: {
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            '0xAddress1': {
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 1000n,
                decimals: 18,
              },
            },
            '0xAddress1Duplicate': {
              // Different address for same account
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 2000n,
                decimals: 18,
              },
            },
          },
        },
      },
    });

    const { result } = renderHook(() =>
      useNetworksWithBalance({ walletId: 'wallet-1' }),
    );

    // Should only include the network once even with multiple addresses
    expect(result.current['account-1']).toEqual([mockCChainNetwork]);
  });

  it('updates when tokensByChain changes', () => {
    mockGetAccountsByWalletId.mockReturnValue([mockAccount1]);
    mockGetNetwork.mockImplementation((chainId: number) => {
      if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
      if (chainId === ChainId.BITCOIN) return mockBitcoinNetwork;
      return null;
    });

    const { result, rerender } = renderHook(() =>
      useNetworksWithBalance({ walletId: 'wallet-1' }),
    );

    // Initial state: only C-chain
    (useBalancesContext as jest.Mock).mockReturnValue({
      balances: {
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            '0xAddress1': {
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 1000n,
                decimals: 18,
              },
            },
          },
        },
      },
    });

    rerender();

    expect(result.current['account-1']).toEqual([mockCChainNetwork]);

    // Updated state: add Bitcoin
    (useBalancesContext as jest.Mock).mockReturnValue({
      balances: {
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            '0xAddress1': {
              AVAX: {
                type: TokenType.NATIVE,
                name: 'Avalanche',
                symbol: 'AVAX',
                balance: 1000n,
                decimals: 18,
              },
            },
          },
          [ChainId.BITCOIN]: {
            bc1qy76a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed: {
              BTC: {
                type: TokenType.NATIVE,
                name: 'Bitcoin',
                symbol: 'BTC',
                balance: 5000n,
                decimals: 8,
              },
            },
          },
        },
      },
    });

    rerender();

    expect(result.current['account-1']).toEqual([
      mockCChainNetwork,
      mockBitcoinNetwork,
    ]);
  });

  describe('when using accountId parameter', () => {
    it('returns empty object when account does not exist', () => {
      mockGetAccountById.mockReturnValue(undefined);

      const { result } = renderHook(() =>
        useNetworksWithBalance({ accountId: 'account-1' }),
      );

      expect(result.current).toEqual({});
    });

    it('returns empty array when account has no balances', () => {
      mockGetAccountById.mockReturnValue(mockAccount1);

      const { result } = renderHook(() =>
        useNetworksWithBalance({ accountId: 'account-1' }),
      );

      expect(result.current).toEqual({
        'account-1': [],
      });
    });

    it('returns networks with balance for single account', () => {
      mockGetAccountById.mockReturnValue(mockAccount1);
      mockGetNetwork.mockImplementation((chainId: number) => {
        if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
        if (chainId === ChainId.BITCOIN) return mockBitcoinNetwork;
        return null;
      });

      (useBalancesContext as jest.Mock).mockReturnValue({
        balances: {
          tokens: {
            [ChainId.AVALANCHE_MAINNET_ID]: {
              [mockAccount1.addressC]: {
                AVAX: {
                  type: TokenType.NATIVE,
                  name: 'Avalanche',
                  symbol: 'AVAX',
                  balance: 1000n,
                  decimals: 18,
                },
              },
            },
            [ChainId.BITCOIN]: {
              [mockAccount1.addressBTC]: {
                BTC: {
                  type: TokenType.NATIVE,
                  name: 'Bitcoin',
                  symbol: 'BTC',
                  balance: 5000n,
                  decimals: 8,
                },
              },
            },
          },
        },
      });

      const { result } = renderHook(() =>
        useNetworksWithBalance({ accountId: 'account-1' }),
      );

      expect(result.current).toEqual({
        'account-1': [mockCChainNetwork, mockBitcoinNetwork],
      });
    });

    it('returns sorted networks by priority for account', () => {
      mockGetAccountById.mockReturnValue(mockAccount1);
      mockGetNetwork.mockImplementation((chainId: number) => {
        if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
        if (chainId === ChainId.AVALANCHE_P) return mockPChainNetwork;
        if (chainId === ChainId.BITCOIN) return mockBitcoinNetwork;
        if (chainId === ChainId.ETHEREUM_HOMESTEAD) return mockEthereumNetwork;
        return null;
      });

      (useBalancesContext as jest.Mock).mockReturnValue({
        balances: {
          tokens: {
            [ChainId.ETHEREUM_HOMESTEAD]: {
              '0xAddress1': {
                ETH: {
                  type: TokenType.NATIVE,
                  name: 'Ethereum',
                  symbol: 'ETH',
                  balance: 500n,
                  decimals: 18,
                },
              },
            },
            [ChainId.BITCOIN]: {
              bc1qy76a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed: {
                BTC: {
                  type: TokenType.NATIVE,
                  name: 'Bitcoin',
                  symbol: 'BTC',
                  balance: 5000n,
                  decimals: 8,
                },
              },
            },
            [ChainId.AVALANCHE_P]: {
              'P-avax1address1': {
                AVAX: {
                  type: TokenType.NATIVE,
                  name: 'Avalanche',
                  symbol: 'AVAX',
                  balance: 1000n,
                  decimals: 9,
                },
              },
            },
            [ChainId.AVALANCHE_MAINNET_ID]: {
              '0xAddress1': {
                AVAX: {
                  type: TokenType.NATIVE,
                  name: 'Avalanche',
                  symbol: 'AVAX',
                  balance: 1000n,
                  decimals: 18,
                },
              },
            },
          },
        },
      });

      const { result } = renderHook(() =>
        useNetworksWithBalance({ accountId: 'account-1' }),
      );

      // Should be sorted: C-Chain, P-Chain, Bitcoin, Ethereum
      expect(result.current['account-1']).toEqual([
        mockCChainNetwork,
        mockPChainNetwork,
        mockBitcoinNetwork,
        mockEthereumNetwork,
      ]);
    });

    it('excludes networks with zero balances', () => {
      mockGetAccountById.mockReturnValue(mockAccount1);
      mockGetNetwork.mockImplementation((chainId: number) => {
        if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
        if (chainId === ChainId.BITCOIN) return mockBitcoinNetwork;
        return null;
      });

      (useBalancesContext as jest.Mock).mockReturnValue({
        balances: {
          tokens: {
            [ChainId.AVALANCHE_MAINNET_ID]: {
              [mockAccount1.addressC]: {
                AVAX: {
                  type: TokenType.NATIVE,
                  name: 'Avalanche',
                  symbol: 'AVAX',
                  balance: 1000n,
                  decimals: 18,
                },
              },
            },
            [ChainId.BITCOIN]: {
              [mockAccount1.addressBTC]: {
                BTC: {
                  type: TokenType.NATIVE,
                  name: 'Bitcoin',
                  symbol: 'BTC',
                  balance: 0n,
                  decimals: 8,
                },
              },
            },
          },
        },
      });

      const { result } = renderHook(() =>
        useNetworksWithBalance({ accountId: 'account-1' }),
      );

      // Should only include C-Chain, not Bitcoin with 0 balance
      expect(result.current['account-1']).toEqual([mockCChainNetwork]);
    });

    it('handles account with multiple addresses on same network', () => {
      const accountWithMultipleAddresses: Account = {
        ...mockAccount1,
        addressC: '0xAddress1',
        addressCoreEth: '0xAddress1CoreEth',
      };

      mockGetAccountById.mockReturnValue(accountWithMultipleAddresses);
      mockGetNetwork.mockImplementation((chainId: number) => {
        if (chainId === ChainId.AVALANCHE_MAINNET_ID) return mockCChainNetwork;
        return null;
      });

      (useBalancesContext as jest.Mock).mockReturnValue({
        balances: {
          tokens: {
            [ChainId.AVALANCHE_MAINNET_ID]: {
              '0xAddress1': {
                AVAX: {
                  type: TokenType.NATIVE,
                  name: 'Avalanche',
                  symbol: 'AVAX',
                  balance: 1000n,
                  decimals: 18,
                },
              },
              '0xAddress1CoreEth': {
                USDC: {
                  type: TokenType.ERC20,
                  name: 'USD Coin',
                  symbol: 'USDC',
                  balance: 500n,
                  decimals: 6,
                },
              },
            },
          },
        },
      });

      const { result } = renderHook(() =>
        useNetworksWithBalance({ accountId: 'account-1' }),
      );

      // Should only include the network once even with multiple addresses
      expect(result.current['account-1']).toEqual([mockCChainNetwork]);
    });
  });
});
