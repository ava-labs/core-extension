import { ChainId, NetworkToken } from '@avalabs/core-chains-sdk';
import { Account, AccountType, Balances } from '@core/types';
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
      type: TokenType.NATIVE,
      name: 'Avalanche',
      symbol: 'AVAX',
      balance: 100n,
      balanceDisplayValue: '0.0000001',
      coingeckoId: 'avax',
      decimals: 9,
      description: 'Avalanche native token',
      logoUri: 'avax-logo',
      balanceInCurrency: 5,
      utxos: {
        unlocked: [
          {
            assetId: 'AVAX',
            name: 'Avalanche',
            symbol: 'AVAX',
            denomination: 9,
            type: PrimaryNetworkAssetType.SECP256K1,
            amount: '1000000000',
            utxoCount: 1,
          },
          {
            assetId: 'AVAX',
            name: 'Avalanche',
            symbol: 'AVAX',
            denomination: 9,
            type: PrimaryNetworkAssetType.SECP256K1,
            amount: '2000000000',
            utxoCount: 1,
          },
        ],
        locked: [
          {
            assetId: 'AVAX',
            name: 'Avalanche',
            symbol: 'AVAX',
            denomination: 9,
            type: PrimaryNetworkAssetType.SECP256K1,
            amount: '500000000',
            utxoCount: 1,
          },
        ],
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

    const account: Account = {
      id: 'account1',
      name: 'test account',
      addressAVM: 'X-test123',
      addressBTC: 'btc-address',
      addressC: 'c-address',
      type: AccountType.PRIMARY,
      index: 0,
      walletId: 'walletId',
    };

    const avmBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressAVM!]: {
          AVAX: avmToken,
        },
      },
    };

    const networks: NetworkWithCaipId[] = [
      {
        chainId: ChainId.AVALANCHE_MAINNET_ID,
        vmName: NetworkVMType.AVM,
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
      },
    ];

    const balance = calculateTotalBalance(account, networks, avmBalances, true);

    // Should include UTXO balance (unlocked + locked, excluding pendingStaked)
    // unlocked: 1000000000 + 2000000000 = 3000000000
    // locked: 500000000
    // Total UTXO: 3500000000 (3.5 AVAX)
    expect(balance.sum).toBe(3500000000);
  });

  it('should calculate UTXO balance for PVM token when isUsedForWalletBalance is true', () => {
    const pvmToken: TokenWithBalancePVM = {
      type: TokenType.NATIVE,
      name: 'Avalanche',
      symbol: 'AVAX',
      balance: 100n,
      balanceDisplayValue: '0.0000001',
      coingeckoId: 'avax',
      decimals: 9,
      description: 'Avalanche native token',
      logoUri: 'avax-logo',
      balanceInCurrency: 5,
      utxos: {
        unlockedUnstaked: [
          {
            assetId: 'AVAX',
            name: 'Avalanche',
            symbol: 'AVAX',
            denomination: 9,
            type: PrimaryNetworkAssetType.SECP256K1,
            amount: '1000000000',
            utxoCount: 1,
          },
        ],
        unlockedStaked: [
          {
            assetId: 'AVAX',
            name: 'Avalanche',
            symbol: 'AVAX',
            denomination: 9,
            type: PrimaryNetworkAssetType.SECP256K1,
            amount: '2000000000',
            utxoCount: 1,
          },
        ],
        lockedStaked: [
          {
            assetId: 'AVAX',
            name: 'Avalanche',
            symbol: 'AVAX',
            denomination: 9,
            type: PrimaryNetworkAssetType.SECP256K1,
            amount: '500000000',
            utxoCount: 1,
          },
        ],
        pendingStaked: [
          {
            assetId: 'AVAX',
            name: 'Avalanche',
            symbol: 'AVAX',
            denomination: 9,
            type: PrimaryNetworkAssetType.SECP256K1,
            amount: '1000000000',
            utxoCount: 1,
          },
        ],
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

    const account: Account = {
      id: 'account1',
      name: 'test account',
      addressPVM: 'P-test123',
      addressBTC: 'btc-address',
      addressC: 'c-address',
      type: AccountType.PRIMARY,
      index: 0,
      walletId: 'walletId',
    };

    const pvmBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressPVM!]: {
          AVAX: pvmToken,
        },
      },
    };

    const networks: NetworkWithCaipId[] = [
      {
        chainId: ChainId.AVALANCHE_MAINNET_ID,
        vmName: NetworkVMType.PVM,
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
      },
    ];

    const balance = calculateTotalBalance(account, networks, pvmBalances, true);

    // Should include UTXO balance (unlockedUnstaked + unlockedStaked + lockedStaked, excluding pendingStaked)
    // unlockedUnstaked: 1000000000
    // unlockedStaked: 2000000000
    // lockedStaked: 500000000
    // Total UTXO: 3500000000 (3.5 AVAX)
    expect(balance.sum).toBe(3500000000);
  });

  it('should use regular balanceInCurrency for non-AVM/PVM tokens', () => {
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

    const account: Account = {
      id: 'account1',
      name: 'test account',
      addressC: '0x123',
      addressBTC: 'btc-address',
      type: AccountType.PRIMARY,
      index: 0,
      walletId: 'walletId',
    };

    const evmBalances: Balances = {
      [ChainId.AVALANCHE_MAINNET_ID.toString()]: {
        [account.addressC!]: {
          ETH: evmToken,
        },
      },
    };

    const networks: NetworkWithCaipId[] = [
      {
        chainId: ChainId.AVALANCHE_MAINNET_ID,
        vmName: NetworkVMType.EVM,
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
      },
    ];

    const balance = calculateTotalBalance(account, networks, evmBalances, true);

    // Should use regular balanceInCurrency for EVM tokens
    expect(balance.sum).toBe(150);
  });
});
