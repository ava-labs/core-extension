import { Network } from '@avalabs/glacier-sdk';
import { ChainId } from '@avalabs/core-chains-sdk';
import { TokenType, type TokenWithBalance } from '@avalabs/vm-module-types';

import { buildRpcCall } from '@src/tests/test-utils';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { SecretsService } from '@src/background/services/secrets/SecretsService';
import type { NetworkService } from '@src/background/services/network/NetworkService';
import type { GlacierService } from '@src/background/services/glacier/GlacierService';
import type { AccountsService } from '@src/background/services/accounts/AccountsService';
import {
  type Accounts,
  AccountType,
  PrimaryAccount,
  ImportedAccount,
} from '@src/background/services/accounts/models';

import type { Balances } from '../../models';
import type { BalanceAggregatorService } from '../../BalanceAggregatorService';

import { getAccountsWithActivity } from './helpers';
import { IMPORTED_ACCOUNTS_WALLET_ID } from './models';
import { GetTotalBalanceForWalletHandler } from './getTotalBalanceForWallet';

jest.mock('./helpers/getAccountsWithActivity');

describe('background/services/balances/handlers/getTotalBalanceForWallet.test.ts', () => {
  const secretsService: jest.Mocked<SecretsService> = {
    getWalletAccountsSecretsById: jest.fn(),
  } as any;

  const glacierService: jest.Mocked<GlacierService> = {
    getChainIdsForAddresses: jest.fn(),
  } as any;

  const networkService: jest.Mocked<NetworkService> = {
    getAvalanceProviderXP: jest.fn(),
    getFavoriteNetworks: jest.fn(),
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
  } as any;

  const FAVORITE_NETWORKS = [
    ChainId.BITCOIN,
    ChainId.BITCOIN_TESTNET,
    ChainId.ETHEREUM_HOMESTEAD,
    ChainId.ETHEREUM_TEST_SEPOLIA,
  ];
  const PROVIDER_XP = {} as any;

  const MAINNETS = {
    [ChainId.AVALANCHE_MAINNET_ID]: {},
    [ChainId.AVALANCHE_X]: {},
    [ChainId.AVALANCHE_P]: {},
    [ChainId.ETHEREUM_HOMESTEAD]: {},
    [ChainId.BITCOIN]: {},
  } as any;

  const TESTNETS = {
    [ChainId.AVALANCHE_TESTNET_ID]: {},
    [ChainId.AVALANCHE_TEST_X]: {},
    [ChainId.AVALANCHE_TEST_P]: {},
    [ChainId.ETHEREUM_TEST_SEPOLIA]: {},
    [ChainId.BITCOIN_TESTNET]: {},
  } as any;

  const buildHandler = () =>
    new GetTotalBalanceForWalletHandler(
      secretsService,
      glacierService,
      networkService,
      accountsService,
      balanceAggregatorService,
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
    accountsService.getAccounts.mockReturnValue(accounts);
  };

  const mockSecrets = (xpubXP?: string) => {
    secretsService.getWalletAccountsSecretsById.mockResolvedValueOnce({
      xpubXP,
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

  const buildBalance = (symbolOrAddress: string, value: number) => ({
    [symbolOrAddress]: { balanceInCurrency: value } as TokenWithBalance,
  });

  const mockBalances = (
    isMainnet = true,
    secondCallBalances?: {
      P: Balances[keyof Balances];
      X: Balances[keyof Balances];
    },
  ) => {
    balanceAggregatorService.getBalancesForNetworks.mockResolvedValue({
      nfts: {},
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

    networkService.getFavoriteNetworks.mockResolvedValue(FAVORITE_NETWORKS);
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
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(1);
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledWith(
        expect.any(Array),
        [ACCOUNT_IMPORTED_0, ACCOUNT_IMPORTED_1],
        [TokenType.NATIVE, TokenType.ERC20],
      );
    });

    it('returns the correct total balance for imported accounts', async () => {
      const response = await handleRequest(IMPORTED_ACCOUNTS_WALLET_ID);
      expect(response.result).toEqual({
        hasBalanceOnUnderivedAccounts: false,
        totalBalanceInCurrency: 125,
      });
    });
  });

  describe('when requested wallet does not include XP public key', () => {
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
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(1);
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledWith(
        expect.any(Array),
        [ACCOUNT_SEEDLESS],
        [TokenType.NATIVE, TokenType.ERC20],
      );
    });

    it('returns the correct total balance for already derived accounts', async () => {
      const response = await handleRequest('seedless');
      expect(response.result).toEqual({
        hasBalanceOnUnderivedAccounts: false,
        totalBalanceInCurrency: 43750,
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

    it('looks for XP-chain activity on underived addresses of the requested wallet', async () => {
      const unresolvedAddresses = ['avaxUnresolvedAddress'];
      mockAccountsWithActivity(unresolvedAddresses);

      const response = await handleRequest('seedphrase');
      expect(response.error).toBeUndefined();
      expect(getAccountsWithActivity).toHaveBeenCalledWith(
        'xpubXP',
        PROVIDER_XP,
        expect.any(Function),
      );

      // Let's also make sure the passed activity fetcher actually invokes the Glacier API:
      const fetcher = jest.mocked(getAccountsWithActivity).mock.lastCall?.[2];
      expect(fetcher).toEqual(expect.any(Function));
      fetcher?.(unresolvedAddresses);
      expect(glacierService.getChainIdsForAddresses).toHaveBeenCalledWith({
        addresses: unresolvedAddresses,
        network: Network.MAINNET,
      });
    });

    it('fetches C-, X- and P-Chain balances along with favorite networks for already derived accounts within the wallet', async () => {
      mockAccountsWithActivity([]); // No underived addresses with activity

      const response = await handleRequest('seedphrase');
      expect(response.error).toBeUndefined();
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(1);
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledWith(
        [
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_P,
          ChainId.AVALANCHE_X,
          ChainId.BITCOIN,
          ChainId.ETHEREUM_HOMESTEAD,
        ],
        [ACCOUNT_SEED_0, ACCOUNT_SEED_1],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(response.result).toEqual({
        hasBalanceOnUnderivedAccounts: false,
        totalBalanceInCurrency: 17510,
      });
    });

    it('works with testnets', async () => {
      mockEnv(false);
      mockBalances(false);
      mockAccountsWithActivity([]); // No underived addresses with activity

      const response = await handleRequest('seedphrase');
      expect(response.error).toBeUndefined();
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(1);
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledWith(
        [
          ChainId.AVALANCHE_TESTNET_ID,
          ChainId.AVALANCHE_TEST_P,
          ChainId.AVALANCHE_TEST_X,
          ChainId.BITCOIN_TESTNET,
          ChainId.ETHEREUM_TEST_SEPOLIA,
        ],
        [ACCOUNT_SEED_0, ACCOUNT_SEED_1],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(response.result).toEqual({
        hasBalanceOnUnderivedAccounts: false,
        totalBalanceInCurrency: 17510,
      });
    });

    it('fetches XP balances for underived accounts with activity', async () => {
      const xpAddress = 'ledger-2-address';
      const underivedAddresses = [xpAddress]; // One underived account with activity
      mockAccountsWithActivity(underivedAddresses);
      mockBalances(true, {
        X: {
          [`X-${xpAddress}`]: {
            ...buildBalance('AVAX', 300),
          },
        },
        P: {
          [`P-${xpAddress}`]: {
            ...buildBalance('AVAX', 450),
          },
        },
      });

      const response = await handleRequest('ledger');
      expect(response.error).toBeUndefined();

      // Fetching balances of derived accounts
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(2);
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenNthCalledWith(
        1,
        [
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_P,
          ChainId.AVALANCHE_X,
          ChainId.BITCOIN,
          ChainId.ETHEREUM_HOMESTEAD,
        ],
        [ACCOUNT_LEDGER_0, ACCOUNT_LEDGER_1],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      // Fetching XP balances of underived accounts, without caching
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenCalledTimes(2);
      expect(
        balanceAggregatorService.getBalancesForNetworks,
      ).toHaveBeenNthCalledWith(
        2,
        [ChainId.AVALANCHE_P, ChainId.AVALANCHE_X],
        [{ addressPVM: `P-${xpAddress}`, addressAVM: `X-${xpAddress}` }],
        [TokenType.NATIVE],
        false,
      );

      expect(response.result).toEqual({
        hasBalanceOnUnderivedAccounts: true,
        totalBalanceInCurrency: 2190, // 750 on underived accounts + 1440 on those mocked by default (already derived)
      });
    });
  });
});
