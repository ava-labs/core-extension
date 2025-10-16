import { ChainId, NetworkToken } from '@avalabs/core-chains-sdk';
import {
  Account,
  AccountType,
  Balances,
  TokensPriceShortData,
} from '@core/types';
import { calculateTotalBalance } from './calculateTotalBalance';
import {
  NetworkTokenWithBalance,
  NetworkVMType,
  TokenType,
  TokenWithBalanceAVM,
  TokenWithBalancePVM,
} from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';
import { PrimaryNetworkAssetType } from '@avalabs/glacier-sdk';

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

  const createBaseNetwork = (vmName: NetworkVMType): NetworkWithCaipId => ({
    chainId: ChainId.AVALANCHE_MAINNET_ID,
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

  const createUtxoEntry = (amount: string) => ({
    assetId: 'AVAX',
    name: 'Avalanche',
    symbol: 'AVAX',
    denomination: 9,
    type: PrimaryNetworkAssetType.SECP256K1,
    amount,
    utxoCount: 1,
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

  it('should calculate UTXO balance for AVM token when isUsedForWalletBalance is true', () => {
    const avmToken: TokenWithBalanceAVM = {
      ...createBaseToken(),
      utxos: {
        unlocked: [
          createUtxoEntry('1000000000'),
          createUtxoEntry('2000000000'),
        ],
        locked: [createUtxoEntry('500000000')],
        atomicMemoryUnlocked: [],
        atomicMemoryLocked: [],
      },
      balancePerType: {
        locked: 500000000n,
        unlocked: 3000000000n,
        atomicMemoryUnlocked: 0n,
        atomicMemoryLocked: 0n,
      },
    };

    const account = {
      ...createBaseAccount(),
      addressAVM: 'X-test123',
    };

    const avmBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressAVM!]: {
          AVAX: avmToken,
        },
      },
    };

    const networks = [createBaseNetwork(NetworkVMType.AVM)];

    const balance = calculateTotalBalance(account, networks, avmBalances, true);

    // Should calculate from UTXO amounts (excluding pendingStaked)
    // unlocked: 1000000000 + 2000000000 = 3000000000 nAVAX
    // locked: 500000000 nAVAX
    // Total UTXO: 3500000000 nAVAX = 3.5 AVAX
    // 3.5 AVAX * priceInCurrency (5) = 17.5
    expect(balance.sum).toBe(17.5);
  });

  it('should calculate UTXO balance for PVM token when isUsedForWalletBalance is true', () => {
    const pvmToken: TokenWithBalancePVM = {
      ...createBaseToken(),
      utxos: {
        unlockedUnstaked: [createUtxoEntry('1000000000')],
        unlockedStaked: [createUtxoEntry('2000000000')],
        lockedStaked: [createUtxoEntry('500000000')],
        pendingStaked: [createUtxoEntry('1000000000')],
        lockedPlatform: [],
        lockedStakeable: [],
        atomicMemoryUnlocked: [],
        atomicMemoryLocked: [],
      },
      balancePerType: {
        lockedStaked: 500000000n,
        lockedStakeable: 0n,
        lockedPlatform: 0n,
        atomicMemoryLocked: 0n,
        atomicMemoryUnlocked: 0n,
        unlockedUnstaked: 1000000000n,
        unlockedStaked: 2000000000n,
        pendingStaked: 1000000000n,
      },
    };

    const account = {
      ...createBaseAccount(),
      addressPVM: 'P-test123',
    };

    const pvmBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressPVM!]: {
          AVAX: pvmToken,
        },
      },
    };

    const networks = [createBaseNetwork(NetworkVMType.PVM)];

    const balance = calculateTotalBalance(account, networks, pvmBalances, true);

    // Should calculate from UTXO amounts (excluding pendingStaked)
    // unlockedUnstaked: 1000000000 nAVAX
    // unlockedStaked: 2000000000 nAVAX
    // lockedStaked: 500000000 nAVAX
    // Total UTXO: 3500000000 nAVAX = 3.5 AVAX
    // 3.5 AVAX * priceInCurrency (5) = 17.5
    expect(balance.sum).toBe(17.5);
  });

  it('should calculate balance for C-chain (EVM) AVAX token when isUsedForWalletBalance is true', () => {
    const cChainToken: NetworkTokenWithBalance = {
      ...createBaseToken(),
      balance: 1000000000n, // 1 AVAX in nAVAX
      balanceDisplayValue: '1.0',
    };

    const account = {
      ...createBaseAccount(),
      addressC: '0x123',
    };

    const cChainBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressC!]: {
          AVAX: cChainToken,
        },
      },
    };

    const networks = [createBaseNetwork(NetworkVMType.EVM)];

    const balance = calculateTotalBalance(
      account,
      networks,
      cChainBalances,
      true,
    );

    // Should use token.balance for C-chain
    // balance: 1000000000n (1 AVAX) * priceInCurrency (5) = 5
    expect(balance.sum).toBe(5);
  });

  it('should use regular balanceInCurrency for non-AVAX tokens', () => {
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

    const networks = [createBaseNetwork(NetworkVMType.EVM)];

    const balance = calculateTotalBalance(account, networks, evmBalances, true);

    // Should use regular balanceInCurrency for non-AVAX tokens
    expect(balance.sum).toBe(150);
  });

  it('should only include AVAX UTXOs in balance calculation when isUsedForWalletBalance is true', () => {
    const createUtxoEntryWithSymbol = (amount: string, symbol: string) => ({
      assetId: symbol,
      name: symbol,
      symbol,
      denomination: 9,
      type: PrimaryNetworkAssetType.SECP256K1,
      amount,
      utxoCount: 1,
    });

    const avmToken: TokenWithBalanceAVM = {
      ...createBaseToken(),
      utxos: {
        unlocked: [
          createUtxoEntryWithSymbol('1000000000', 'AVAX'), // 1 AVAX
          createUtxoEntryWithSymbol('2000000000', 'USDC'), // 2 USDC (should be ignored)
          createUtxoEntryWithSymbol('500000000', 'AVAX'), // 0.5 AVAX
        ],
        locked: [
          createUtxoEntryWithSymbol('300000000', 'AVAX'), // 0.3 AVAX
          createUtxoEntryWithSymbol('100000000', 'USDT'), // 0.1 USDT (should be ignored)
        ],
        atomicMemoryUnlocked: [],
        atomicMemoryLocked: [],
      },
      balancePerType: {
        locked: 300000000n,
        unlocked: 3500000000n,
        atomicMemoryUnlocked: 0n,
        atomicMemoryLocked: 0n,
      },
    };

    const account = {
      ...createBaseAccount(),
      addressAVM: 'X-test123',
    };

    const avmBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressAVM!]: {
          AVAX: avmToken,
        },
      },
    };

    const networks = [createBaseNetwork(NetworkVMType.AVM)];

    const balance = calculateTotalBalance(account, networks, avmBalances, true);

    // Should only include AVAX UTXOs in the calculation:
    // unlocked AVAX: 1000000000 + 500000000 = 1500000000 nAVAX = 1.5 AVAX
    // locked AVAX: 300000000 nAVAX = 0.3 AVAX
    // Total AVAX UTXOs: 1800000000 nAVAX = 1.8 AVAX
    // 1.8 AVAX * priceInCurrency (5) = 9
    expect(balance.sum).toBe(9);
  });

  it('should use priceChangesData for AVAX price when provided', () => {
    const cChainToken: NetworkTokenWithBalance = {
      ...createBaseToken(),
      balance: 1000000000n, // 1 AVAX in nAVAX
      balanceDisplayValue: '1.0',
      priceInCurrency: 5, // Default price
    };

    const account = {
      ...createBaseAccount(),
      addressC: '0x123',
    };

    const cChainBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressC!]: {
          AVAX: cChainToken,
        },
      },
    };

    const networks = [createBaseNetwork(NetworkVMType.EVM)];

    const priceChangesData: TokensPriceShortData = {
      AVAX: {
        currentPrice: 10, // Override price
        priceChangePercentage: 5,
        priceChange: 0.5,
      },
    };

    const balance = calculateTotalBalance(
      account,
      networks,
      cChainBalances,
      true,
      priceChangesData,
    );

    // Should use priceChangesData.currentPrice (10) instead of token.priceInCurrency (5)
    // balance: 1000000000n (1 AVAX) * priceInCurrency (10) = 10
    expect(balance.sum).toBe(10);
  });

  it('should fallback to default price when priceChangesData is not provided for AVAX', () => {
    const cChainToken: NetworkTokenWithBalance = {
      ...createBaseToken(),
      balance: 1000000000n, // 1 AVAX in nAVAX
      balanceDisplayValue: '1.0',
      priceInCurrency: 5, // Default price
    };

    const account = {
      ...createBaseAccount(),
      addressC: '0x123',
    };

    const cChainBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressC!]: {
          AVAX: cChainToken,
        },
      },
    };

    const networks = [createBaseNetwork(NetworkVMType.EVM)];

    const balance = calculateTotalBalance(
      account,
      networks,
      cChainBalances,
      true,
      undefined, // No priceChangesData
    );

    // Should use token.priceInCurrency (5) as fallback
    // balance: 1000000000n (1 AVAX) * priceInCurrency (5) = 5
    expect(balance.sum).toBe(5);
  });

  it('should use priceChangesData for AVM AVAX token when provided', () => {
    const avmToken: TokenWithBalanceAVM = {
      ...createBaseToken(),
      utxos: {
        unlocked: [createUtxoEntry('1000000000')], // 1 AVAX
        locked: [],
        atomicMemoryUnlocked: [],
        atomicMemoryLocked: [],
      },
      balancePerType: {
        locked: 0n,
        unlocked: 1000000000n,
        atomicMemoryUnlocked: 0n,
        atomicMemoryLocked: 0n,
      },
      priceInCurrency: 5, // Default price
    };

    const account = {
      ...createBaseAccount(),
      addressAVM: 'X-test123',
    };

    const avmBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressAVM!]: {
          AVAX: avmToken,
        },
      },
    };

    const networks = [createBaseNetwork(NetworkVMType.AVM)];

    const priceChangesData: TokensPriceShortData = {
      AVAX: {
        currentPrice: 15, // Override price
        priceChangePercentage: 10,
        priceChange: 1.5,
      },
    };

    const balance = calculateTotalBalance(
      account,
      networks,
      avmBalances,
      true,
      priceChangesData,
    );

    // Should use priceChangesData.currentPrice (15) instead of token.priceInCurrency (5)
    // balance: 1000000000n (1 AVAX) * priceInCurrency (15) = 15
    expect(balance.sum).toBe(15);
  });
});
