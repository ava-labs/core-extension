import { ChainId } from '@avalabs/core-chains-sdk';
import {
  NetworkVMType,
  TokenType,
  type TokenWithBalance,
} from '@avalabs/vm-module-types';

import {
  type Accounts,
  AccountType,
  ExtensionRequest,
  PrimaryAccount,
  ImportedAccount,
  Balances,
  AVALANCHE_BASE_DERIVATION_PATH,
  SecretType,
  AddressPublicKeyJson,
  FeatureGates,
} from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import type { SecretsService } from '~/services/secrets/SecretsService';
import type { NetworkService } from '~/services/network/NetworkService';
import type { AccountsService } from '~/services/accounts/AccountsService';
import { buildExtendedPublicKey } from '~/services/secrets/utils';

import type { BalanceAggregatorService } from '../../BalanceAggregatorService';

import { getAccountsWithActivity } from './helpers';
import { IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';
import { GetTotalBalanceForWalletHandler } from './getTotalBalanceForWallet';
import { hex } from '@scure/base';
import { calculateTotalAtomicFundsForAccounts } from '@core/common';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { FeatureFlagService } from '~/services/featureFlags/FeatureFlagService';

jest.mock('./helpers/getAccountsWithActivity');
jest.mock('@core/common', () => {
  const actual = jest.requireActual('@core/common');
  return {
    ...actual,
    calculateTotalAtomicFundsForAccounts: jest.fn(),
  };
});

describe('background/services/balances/handlers/getTotalBalanceForWallet.test.ts', () => {
  const secretsService: jest.Mocked<SecretsService> = {
    getWalletAccountsSecretsById: jest.fn(),
  } as any;

  const networkService: jest.Mocked<NetworkService> = {
    getAvalanceProviderXP: jest.fn(),
    getEnabledNetworks: jest.fn(),
    getNetwork: jest.fn(),
    isMainnet: jest.fn(),
    activeNetworks: {
      promisify: jest.fn(),
    },
  } as any;

  const accountsService: jest.Mocked<AccountsService> = {
    getAccounts: jest.fn(),
  } as any;

  const balanceAggregatorService: jest.Mocked<BalanceAggregatorService> = {
    getBalancesForNetworks: jest.fn(),
    getPriceChangesData: jest.fn(),
    atomicBalances: {},
  } as any;

  const FAVORITE_NETWORKS = [
    ChainId.BITCOIN,
    ChainId.BITCOIN_TESTNET,
    ChainId.ETHEREUM_HOMESTEAD,
    ChainId.ETHEREUM_TEST_SEPOLIA,
  ];
  const PROVIDER_XP = {
    getAddress: jest.fn(),
  } as any;

  const MAINNETS = {
    [ChainId.AVALANCHE_MAINNET_ID]: {
      chainId: ChainId.AVALANCHE_MAINNET_ID,
      vmName: NetworkVMType.EVM,
    },
    [ChainId.AVALANCHE_X]: {
      chainId: ChainId.AVALANCHE_X,
      vmName: NetworkVMType.AVM,
    },
    [ChainId.AVALANCHE_P]: {
      chainId: ChainId.AVALANCHE_P,
      vmName: NetworkVMType.PVM,
    },
    [ChainId.ETHEREUM_HOMESTEAD]: {
      chainId: ChainId.ETHEREUM_HOMESTEAD,
      vmName: NetworkVMType.EVM,
    },
    [ChainId.BITCOIN]: {
      chainId: ChainId.BITCOIN,
      vmName: NetworkVMType.BITCOIN,
    },
  } as any;

  const TESTNETS = {
    [ChainId.AVALANCHE_TESTNET_ID]: {
      chainId: ChainId.AVALANCHE_TESTNET_ID,
      vmName: NetworkVMType.EVM,
    },
    [ChainId.AVALANCHE_TEST_X]: {
      chainId: ChainId.AVALANCHE_TEST_X,
      vmName: NetworkVMType.AVM,
    },
    [ChainId.AVALANCHE_TEST_P]: {
      chainId: ChainId.AVALANCHE_TEST_P,
      vmName: NetworkVMType.PVM,
    },
    [ChainId.ETHEREUM_TEST_SEPOLIA]: {
      chainId: ChainId.ETHEREUM_TEST_SEPOLIA,
      vmName: NetworkVMType.EVM,
    },
    [ChainId.BITCOIN_TESTNET]: {
      chainId: ChainId.BITCOIN_TESTNET,
      vmName: NetworkVMType.BITCOIN,
    },
  } as any;

  const buildHandler = (withBalanceServiceIntegration = false) =>
    new GetTotalBalanceForWalletHandler(
      secretsService,
      networkService,
      accountsService,
      balanceAggregatorService,
      (withBalanceServiceIntegration
        ? {
            featureFlags: {
              [FeatureGates.BALANCE_SERVICE_INTEGRATION]: true,
            },
          }
        : {
            featureFlags: { [FeatureGates.BALANCE_SERVICE_INTEGRATION]: false },
          }) as FeatureFlagService,
    );

  const handleRequest = (walletId: string) =>
    buildHandler().handle(
      buildRpcCall({
        id: '123',
        method: ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET,
        params: {
          walletId,
        },
      }),
    );

  const mockEnv = (isMainnet = true) => {
    networkService.isMainnet.mockReturnValue(isMainnet);
    jest
      .mocked(networkService.activeNetworks.promisify)
      .mockResolvedValue(isMainnet ? MAINNETS : TESTNETS);
  };

  const mockAccounts = (accounts = ACCOUNTS) => {
    accountsService.getAccounts.mockResolvedValue(accounts);
  };

  const mockSecrets = (
    xpubXP?: string,
    xpPublicKeys?: AddressPublicKeyJson[],
  ) => {
    secretsService.getWalletAccountsSecretsById.mockResolvedValueOnce({
      secretType: SecretType.Mnemonic,
      publicKeys: xpPublicKeys ?? [],
      extendedPublicKeys: xpubXP
        ? [buildExtendedPublicKey(xpubXP, AVALANCHE_BASE_DERIVATION_PATH)]
        : [],
    } as any);
  };

  const mockAccountsWithActivity = (addresses: string[]) => {
    jest.mocked(getAccountsWithActivity).mockResolvedValue(addresses);
  };

  const buildAccount = <T = PrimaryAccount>({ id, ...opts }) =>
    ({
      id,
      name: `name-${id}`,
      addressC: `${id}-addressC`,
      addressPVM: `${id}-addressPVM`,
      addressAVM: `${id}-addressAVM`,
      addressBTC: `${id}-addressBTC`,
      ...opts,
      type: opts.type ?? AccountType.PRIMARY,
    }) as T;

  const ACCOUNT_IMPORTED_0 = buildAccount<ImportedAccount>({
    id: 'imported-0',
    type: AccountType.IMPORTED,
  });
  const ACCOUNT_IMPORTED_1 = buildAccount<ImportedAccount>({
    id: 'imported-1',
    type: AccountType.IMPORTED,
  });
  const ACCOUNT_SEED_0 = buildAccount({
    id: 'seedphrase-0',
    index: 0,
    walletId: 'seedphrase',
  });
  const ACCOUNT_SEED_1 = buildAccount({
    id: 'seedphrase-1',
    index: 1,
    walletId: 'seedphrase',
  });
  const ACCOUNT_LEDGER_0 = buildAccount({
    id: 'ledger-0',
    index: 0,
    walletId: 'ledger',
  });
  const ACCOUNT_LEDGER_1 = buildAccount({
    id: 'ledger-1',
    index: 1,
    walletId: 'ledger',
  });
  const ACCOUNT_SEEDLESS = buildAccount({
    id: 'seedless-0',
    index: 0,
    walletId: 'seedless',
  });

  const ACCOUNTS: Accounts = {
    imported: {
      [ACCOUNT_IMPORTED_0.id]: ACCOUNT_IMPORTED_0,
      [ACCOUNT_IMPORTED_1.id]: ACCOUNT_IMPORTED_1,
    },
    primary: {
      seedphrase: [ACCOUNT_SEED_0, ACCOUNT_SEED_1],
      ledger: [ACCOUNT_LEDGER_0, ACCOUNT_LEDGER_1],
      seedless: [ACCOUNT_SEEDLESS],
    },
  };

  const buildBalance = (
    symbolOrAddress: string,
    value: number,
    priceChangeValue?: number,
  ) => ({
    [symbolOrAddress]: {
      balanceInCurrency: value,
      ...(priceChangeValue !== undefined && {
        priceChanges: {
          value: priceChangeValue,
          percentage: 0, // Not used in the calculation, but required by type
        },
      }),
    } as TokenWithBalance,
  });

  const mockBalances = (
    isMainnet = true,
    secondCallBalances?: {
      P: Balances[keyof Balances];
      X: Balances[keyof Balances];
    },
  ) => {
    balanceAggregatorService.getPriceChangesData.mockResolvedValue({});
    balanceAggregatorService.getBalancesForNetworks.mockResolvedValue({
      nfts: {},
      atomic: {},
      tokens: {
        [isMainnet
          ? ChainId.AVALANCHE_MAINNET_ID
          : ChainId.AVALANCHE_TESTNET_ID]: {
          [ACCOUNT_SEED_0.addressC]: {
            ...buildBalance('AVAX', 100),
            ...buildBalance('BTC.b', 1000),
          },
          [ACCOUNT_SEED_1.addressC]: {
            ...buildBalance('AVAX', 10),
          },
          [ACCOUNT_LEDGER_0.addressC]: {
            ...buildBalance('AVAX', 20),
          },
          [ACCOUNT_LEDGER_1.addressC]: {
            ...buildBalance('AVAX', 120),
            ...buildBalance('WETH.e', 1300),
          },
          [ACCOUNT_IMPORTED_0.addressC]: {
            ...buildBalance('AVAX', 50),
          },
          [ACCOUNT_IMPORTED_1.addressC]: {
            ...buildBalance('AVAX', 75),
          },
          [ACCOUNT_SEEDLESS.addressC]: {
            ...buildBalance('AVAX', 750),
            ...buildBalance('JOE', 43000),
          },
        },
        [isMainnet ? ChainId.BITCOIN : ChainId.BITCOIN_TESTNET]: {
          [ACCOUNT_SEED_0.addressBTC]: {
            ...buildBalance('BTC', 15000),
          },
        },
        [isMainnet ? ChainId.AVALANCHE_P : ChainId.AVALANCHE_TEST_P]: {
          [ACCOUNT_SEED_0.addressPVM as string]: {
            ...buildBalance('AVAX', 350),
          },
          ...secondCallBalances?.P,
        },
        [isMainnet ? ChainId.AVALANCHE_X : ChainId.AVALANCHE_TEST_X]: {
          [ACCOUNT_SEED_1.addressAVM as string]: {
            ...buildBalance('AVAX', 650),
          },
          ...secondCallBalances?.X,
        },
        [isMainnet
          ? ChainId.ETHEREUM_HOMESTEAD
          : ChainId.ETHEREUM_TEST_SEPOLIA]: {
          [ACCOUNT_SEED_1.addressC as string]: {
            ...buildBalance('AVAX', 400),
          },
        },
      },
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();

    jest
      .mocked(calculateTotalAtomicFundsForAccounts)
      .mockImplementation(() => new TokenUnit('0', 18, 'N/A'));
    networkService.getEnabledNetworks.mockResolvedValue(FAVORITE_NETWORKS);
    networkService.getNetwork.mockImplementation(
      (chainId) => MAINNETS[chainId] ?? TESTNETS[chainId],
    );
    networkService.getAvalanceProviderXP.mockResolvedValue(PROVIDER_XP);
  });

  describe(`when passed walletId is "${IMPORTED_ACCOUNTS_WALLET_ID}"`, () => {
    beforeEach(() => {
      mockEnv(true);
      mockAccounts();
      mockBalances(true);
    });

    it('does not look for underived addresses', async () => {
      const response = await handleRequest(IMPORTED_ACCOUNTS_WALLET_ID);
      expect(response.error).toBeUndefined();
      expect(getAccountsWithActivity).not.toHaveBeenCalled();
    });

    it('only fetches balances for the imported accounts', async () => {
      const response = await handleRequest(IMPORTED_ACCOUNTS_WALLET_ID);
      expect(response.error).toBeUndefined();
      // Now expects 2 calls: all networks per accounts
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(2);

      // Call 1: All networks for first derived account (native + ERC20 tokens)
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenNthCalledWith(
        1,
        expect.arrayContaining([
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_X,
          ChainId.AVALANCHE_P,
          ChainId.BITCOIN,
          ChainId.ETHEREUM_HOMESTEAD,
        ]),
        [ACCOUNT_IMPORTED_0],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenNthCalledWith(
        2,
        expect.arrayContaining([
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_X,
          ChainId.AVALANCHE_P,
          ChainId.BITCOIN,
          ChainId.ETHEREUM_HOMESTEAD,
        ]),
        [ACCOUNT_IMPORTED_1],
        [TokenType.NATIVE, TokenType.ERC20],
      );
    });

    it('returns the correct total balance for imported accounts', async () => {
      const response = await handleRequest(IMPORTED_ACCOUNTS_WALLET_ID);
      expect(response.result).toEqual({
        hasBalanceOnUnderivedAccounts: false,
        totalBalanceInCurrency: 125,
        balanceChange: undefined,
        percentageChange: undefined,
      });
    });
  });

  describe('when requested wallet does not include xpubXP or any XP public keys', () => {
    beforeEach(() => {
      mockEnv(true);
      mockAccounts();
      mockBalances(true);
      mockSecrets(undefined); // No xpubXP
    });

    it('does not look for underived addresses', async () => {
      const response = await handleRequest('seedless');
      expect(response.error).toBeUndefined();
      expect(getAccountsWithActivity).not.toHaveBeenCalled();
    });

    it('only fetches balances for already derived accounts', async () => {
      const response = await handleRequest('seedless');
      expect(response.error).toBeUndefined();
      // Now expects 1 call: all networks for derived accounts
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(1);

      // Call 1: All networks for derived accounts (native + ERC20 tokens)
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenNthCalledWith(
        1,
        expect.arrayContaining([
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_X,
          ChainId.AVALANCHE_P,
          ChainId.BITCOIN,
          ChainId.ETHEREUM_HOMESTEAD,
        ]),
        [ACCOUNT_SEEDLESS],
        [TokenType.NATIVE, TokenType.ERC20],
      );
    });

    it('returns the correct total balance for already derived accounts', async () => {
      const response = await handleRequest('seedless');
      expect(response.result).toEqual({
        hasBalanceOnUnderivedAccounts: false,
        totalBalanceInCurrency: 43750,
        balanceChange: undefined,
        percentageChange: undefined,
      });
    });
  });

  describe('when requested wallet does include XP public key', () => {
    beforeEach(() => {
      mockEnv(true);
      mockAccounts();
      mockBalances(true);
      mockSecrets('xpubXP'); // We've got xpubXP
    });

    it('fetches C-, X- and P-Chain balances along with favorite networks for already derived accounts within the wallet', async () => {
      mockAccountsWithActivity([]); // No underived addresses with activity

      const response = await handleRequest('seedphrase');
      expect(response.error).toBeUndefined();
      // Now expects 2 calls: all networks per derived account
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(2);

      // Call 1: All networks for first derived account (native + ERC20 tokens)
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenNthCalledWith(
        1,
        expect.arrayContaining([
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_X,
          ChainId.AVALANCHE_P,
          ChainId.BITCOIN,
          ChainId.ETHEREUM_HOMESTEAD,
        ]),
        [ACCOUNT_SEED_0],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenNthCalledWith(
        2,
        expect.arrayContaining([
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_X,
          ChainId.AVALANCHE_P,
          ChainId.BITCOIN,
          ChainId.ETHEREUM_HOMESTEAD,
        ]),
        [ACCOUNT_SEED_1],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(response.result).toEqual({
        hasBalanceOnUnderivedAccounts: false,
        totalBalanceInCurrency: 17510,
        balanceChange: undefined,
        percentageChange: undefined,
      });
    });

    it('works with testnets', async () => {
      mockEnv(false);
      mockBalances(false);
      mockAccountsWithActivity([]); // No underived addresses with activity

      const response = await handleRequest('seedphrase');
      expect(response.error).toBeUndefined();
      // Now expects 2 calls: all networks per account
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(2);

      // Call 1: All networks for first derived account (native + ERC20 tokens)
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenNthCalledWith(
        1,
        expect.arrayContaining([
          ChainId.AVALANCHE_TESTNET_ID,
          ChainId.AVALANCHE_TEST_X,
          ChainId.AVALANCHE_TEST_P,
          ChainId.BITCOIN_TESTNET,
          ChainId.ETHEREUM_TEST_SEPOLIA,
        ]),
        [ACCOUNT_SEED_0],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenNthCalledWith(
        2,
        expect.arrayContaining([
          ChainId.AVALANCHE_TESTNET_ID,
          ChainId.AVALANCHE_TEST_X,
          ChainId.AVALANCHE_TEST_P,
          ChainId.BITCOIN_TESTNET,
          ChainId.ETHEREUM_TEST_SEPOLIA,
        ]),
        [ACCOUNT_SEED_1],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(response.result).toEqual({
        hasBalanceOnUnderivedAccounts: false,
        totalBalanceInCurrency: 17510,
        balanceChange: undefined,
        percentageChange: undefined,
      });
    });
  });

  describe('when requested wallet has additional XP public keys for some accounts', () => {
    const keys = ['00000001', '00000002'];
    const additionalXPKeys: AddressPublicKeyJson[] = keys.map((key, index) => ({
      type: 'address-pubkey',
      key,
      derivationPath: `m/44'/9000'/0'/0/${index + 1}`,
      curve: 'secp256k1',
    }));

    beforeEach(() => {
      mockEnv(true);
      mockAccounts();
      mockBalances(true);
      mockSecrets(undefined, additionalXPKeys); // We've got additional XP public keys

      PROVIDER_XP.getAddress.mockImplementation(
        (key) => `X-${hex.encode(Uint8Array.from(key))}`,
      );
    });

    it('fetches balances for the additional XP public keys', async () => {
      const unresolvedAddresses = [
        'avaxUnresolvedAddress-1',
        'avaxUnresolvedAddress-2',
      ];
      mockAccountsWithActivity(unresolvedAddresses);

      const response = await handleRequest('seedphrase');
      expect(response.error).toBeUndefined();
      expect(getAccountsWithActivity).not.toHaveBeenCalled();

      additionalXPKeys.forEach((key, index) => {
        expect(PROVIDER_XP.getAddress).toHaveBeenNthCalledWith(
          index + 1,
          Buffer.from(hex.decode(key.key)),
          'X',
        );
      });

      // Expect calls for X/P balances of the addresses derived from the additional X/P keys
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledWith(
        expect.arrayContaining([ChainId.AVALANCHE_X, ChainId.AVALANCHE_P]),
        keys.map((key) => ({ addressPVM: `P-${key}`, addressAVM: `X-${key}` })),
        [TokenType.NATIVE],
        false,
      );
    });
  });

  describe('balance change and percentage change calculations', () => {
    beforeEach(() => {
      mockEnv(true);
      mockAccounts();
      mockSecrets(undefined); // No XP for simplicity
    });

    it('calculates positive balance change and percentage correctly', async () => {
      // Current balance: 100, Price change: +10 => Previous balance: 90
      // Percentage change: (10 / 90) * 100 = 11.11%
      balanceAggregatorService.getBalancesForNetworks.mockResolvedValue({
        nfts: {},
        atomic: {},
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            [ACCOUNT_SEEDLESS.addressC]: {
              ...buildBalance('AVAX', 100, 10), // balance: 100, priceChange: +10
            },
          },
        },
      });

      const response = await handleRequest('seedless');

      expect(response.result?.totalBalanceInCurrency).toBe(100);
      expect(response.result?.balanceChange).toBe(10);
      expect(response.result?.percentageChange).toBeCloseTo(11.11, 2);
    });

    it('calculates negative balance change and percentage correctly', async () => {
      // Current balance: 100, Price change: -20 => Previous balance: 120
      // Percentage change: (-20 / 120) * 100 = -16.67%
      balanceAggregatorService.getBalancesForNetworks.mockResolvedValue({
        nfts: {},
        atomic: {},
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            [ACCOUNT_SEEDLESS.addressC]: {
              ...buildBalance('AVAX', 100, -20), // balance: 100, priceChange: -20
            },
          },
        },
      });

      const response = await handleRequest('seedless');

      expect(response.result?.totalBalanceInCurrency).toBe(100);
      expect(response.result?.balanceChange).toBe(-20);
      expect(response.result?.percentageChange).toBeCloseTo(-16.67, 2);
    });

    it('aggregates price changes across multiple accounts correctly', async () => {
      // Account 0: balance 100, change +10
      // Account 1: balance 200, change -30
      // Total: balance 300, change -20
      // Previous balance: 320
      // Percentage: (-20 / 320) * 100 = -6.25%
      let callCount = 0;
      balanceAggregatorService.getBalancesForNetworks.mockImplementation(
        async () => {
          callCount++;
          if (callCount === 1) {
            // First account
            return {
              nfts: {},
              atomic: {},
              tokens: {
                [ChainId.AVALANCHE_MAINNET_ID]: {
                  [ACCOUNT_SEED_0.addressC]: {
                    ...buildBalance('AVAX', 100, 10),
                  },
                },
              },
            };
          } else {
            // Second account
            return {
              nfts: {},
              atomic: {},
              tokens: {
                [ChainId.AVALANCHE_MAINNET_ID]: {
                  [ACCOUNT_SEED_1.addressC]: {
                    ...buildBalance('AVAX', 200, -30),
                  },
                },
              },
            };
          }
        },
      );

      const response = await handleRequest('seedphrase');

      expect(response.result?.totalBalanceInCurrency).toBe(300);
      expect(response.result?.balanceChange).toBe(-20);
      expect(response.result?.percentageChange).toBeCloseTo(-6.25, 2);
    });

    it('returns undefined for balanceChange when priceChange is 0', async () => {
      balanceAggregatorService.getBalancesForNetworks.mockResolvedValue({
        nfts: {},
        atomic: {},
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            [ACCOUNT_SEEDLESS.addressC]: {
              ...buildBalance('AVAX', 100, 0), // No price change
            },
          },
        },
      });

      const response = await handleRequest('seedless');

      expect(response.result?.totalBalanceInCurrency).toBe(100);
      expect(response.result?.balanceChange).toBeUndefined();
      expect(response.result?.percentageChange).toBeUndefined();
    });

    it('returns undefined for balanceChange when no priceChanges data exists', async () => {
      balanceAggregatorService.getBalancesForNetworks.mockResolvedValue({
        nfts: {},
        atomic: {},
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            [ACCOUNT_SEEDLESS.addressC]: {
              ...buildBalance('AVAX', 100), // No priceChanges field
            },
          },
        },
      });

      const response = await handleRequest('seedless');

      expect(response.result?.totalBalanceInCurrency).toBe(100);
      expect(response.result?.balanceChange).toBeUndefined();
      expect(response.result?.percentageChange).toBeUndefined();
    });

    it('returns undefined for percentageChange when totalBalance is 0', async () => {
      balanceAggregatorService.getBalancesForNetworks.mockResolvedValue({
        nfts: {},
        atomic: {},
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            [ACCOUNT_SEEDLESS.addressC]: {
              ...buildBalance('AVAX', 0, 10),
            },
          },
        },
      });

      const response = await handleRequest('seedless');

      expect(response.result?.totalBalanceInCurrency).toBe(0);
      expect(response.result?.balanceChange).toBe(10);
      expect(response.result?.percentageChange).toBeUndefined();
    });

    it('returns undefined for percentageChange when previous balance is 0 or negative', async () => {
      // Current balance: 10, Price change: +10 => Previous balance: 0
      // Cannot calculate percentage change from 0
      balanceAggregatorService.getBalancesForNetworks.mockResolvedValue({
        nfts: {},
        atomic: {},
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            [ACCOUNT_SEEDLESS.addressC]: {
              ...buildBalance('AVAX', 10, 10),
            },
          },
        },
      });

      const response = await handleRequest('seedless');

      expect(response.result?.totalBalanceInCurrency).toBe(10);
      expect(response.result?.balanceChange).toBe(10);
      expect(response.result?.percentageChange).toBeUndefined();
    });

    it('aggregates price changes across multiple tokens in same account', async () => {
      // AVAX: balance 100, change +10
      // BTC: balance 50, change +5
      // Total: balance 150, change +15
      // Previous balance: 135
      // Percentage: (15 / 135) * 100 = 11.11%
      balanceAggregatorService.getBalancesForNetworks.mockResolvedValue({
        nfts: {},
        atomic: {},
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            [ACCOUNT_SEEDLESS.addressC]: {
              ...buildBalance('AVAX', 100, 10),
              ...buildBalance('BTC.b', 50, 5),
            },
          },
        },
      });

      const response = await handleRequest('seedless');

      expect(response.result?.totalBalanceInCurrency).toBe(150);
      expect(response.result?.balanceChange).toBe(15);
      expect(response.result?.percentageChange).toBeCloseTo(11.11, 2);
    });

    it('handles mixed positive and negative price changes on same network', async () => {
      // C-Chain AVAX: balance 100, change +20
      // C-Chain USDC: balance 100, change -10
      // Total: balance 200, change +10 (20 + (-10))
      // Previous balance: 190 (200 - 10)
      // Percentage: (10 / 190) * 100 = 5.26%
      balanceAggregatorService.getBalancesForNetworks.mockResolvedValue({
        nfts: {},
        atomic: {},
        tokens: {
          [ChainId.AVALANCHE_MAINNET_ID]: {
            [ACCOUNT_SEEDLESS.addressC]: {
              AVAX: {
                balanceInCurrency: 100,
                priceChanges: { value: 20, percentage: 0 },
              } as TokenWithBalance,
              USDC: {
                balanceInCurrency: 100,
                priceChanges: { value: -10, percentage: 0 },
              } as TokenWithBalance,
            },
          },
        },
      });

      const response = await handleRequest('seedless');

      expect(response.result?.totalBalanceInCurrency).toBe(200);
      expect(response.result?.balanceChange).toBe(10);
      expect(response.result?.percentageChange).toBeCloseTo(5.26, 2);
    });
  });

  describe('with balance service integration', () => {
    beforeEach(() => {
      mockEnv(true);
      const accounts = {
        imported: {},
        primary: {
          testing: [
            ACCOUNT_SEED_0,
            ACCOUNT_SEED_1,
            ACCOUNT_LEDGER_0,
            ACCOUNT_LEDGER_1,
            ACCOUNT_SEEDLESS,
          ],
        },
      };
      mockAccounts(accounts);
      mockBalances(true);
      mockSecrets('xpubXP'); // We've got xpubXP
    });

    it('Should call getBalancesForNetworks once and with all the accounts', async () => {
      await buildHandler(true).handle(
        buildRpcCall({
          id: '123',
          method: ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET,
          params: {
            walletId: 'testing',
          },
        }),
      );

      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(1);
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenNthCalledWith(
        1,
        [43114, 4503599627370471, 4503599627370469, 4503599627370475, 1],
        [
          ACCOUNT_SEED_0,
          ACCOUNT_SEED_1,
          ACCOUNT_LEDGER_0,
          ACCOUNT_LEDGER_1,
          ACCOUNT_SEEDLESS,
        ],
        ['NATIVE', 'ERC20'],
      );
    });
  });
});
