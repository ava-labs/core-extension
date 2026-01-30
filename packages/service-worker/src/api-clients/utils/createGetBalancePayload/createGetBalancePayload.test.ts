import { Account, AccountType } from '@core/types';
import type { AddressResolver } from '~/services/secrets/AddressResolver';
import type { SecretsService } from '~/services/secrets/SecretsService';
import { createGetBalancePayload } from './createGetBalancePayload';

const payload = {
  chainIds: [
    43114, 4503599627370471, 4503599627370475, 1, 4503599627369476,
    4503599627370469,
  ],
  accounts: [
    {
      id: 'wallet-1-account-1',
      index: 0,
      name: 'Account 1',
      type: AccountType.PRIMARY,
      walletId: 'wallet1',
      addressC: '0xa1',
      addressBTC: 'bc111',
      addressAVM: 'X-avax111',
      addressPVM: 'P-avax111',
      addressCoreEth: 'C-avax1aa',
      addressSVM: 'AAA',
    },
    {
      id: 'wallet-1-account-2',
      index: 1,
      name: 'Account 2',
      type: AccountType.PRIMARY,
      walletId: 'wallet1',
      addressC: '0xa2',
      addressBTC: 'bc112',
      addressAVM: 'X-avax112',
      addressPVM: 'P-avax112',
      addressCoreEth: 'C-avax1ab',
      addressSVM: 'AAB',
    },
    {
      id: 'wallet-2-account-1',
      index: 0,
      name: 'Account 1',
      type: AccountType.PRIMARY,
      walletId: 'wallet2',
      addressC: '0xb1',
      addressBTC: 'bc121',
      addressAVM: 'X-avax121',
      addressPVM: 'P-avax121',
      addressCoreEth: 'C-avax1ba',
      addressSVM: 'BBA',
    },
    {
      id: 'wallet-2-account-2',
      index: 1,
      name: 'Account 2',
      type: AccountType.PRIMARY,
      walletId: 'wallet2',
      addressC: '0xb2',
      addressBTC: 'bc122',
      addressAVM: 'X-avax122',
      addressPVM: 'P-avax122',
      addressCoreEth: 'C-avax1bb',
      addressSVM: 'BBB',
    },
    {
      id: 'wallet-2-account-3',
      index: 2,
      name: 'Account 3',
      type: AccountType.PRIMARY,
      walletId: 'wallet2',
      addressC: '0xb3',
      addressBTC: 'bc123',
      addressAVM: 'X-avax123',
      addressPVM: 'P-avax123',
      addressCoreEth: 'C-avax1bc',
      addressSVM: 'BBC',
    },
    {
      id: 'wallet-2-account-4',
      index: 3,
      name: 'Account 4',
      type: AccountType.PRIMARY,
      walletId: 'wallet2',
      addressC: '0xb4',
      addressBTC: 'bc124',
      addressAVM: 'X-avax124',
      addressPVM: 'P-avax124',
      addressCoreEth: 'C-avax1bd',
      addressSVM: 'BBD',
    },
  ] satisfies Account[],
};

const createMockSecretsService = (
  xpubResponse: Awaited<
    ReturnType<SecretsService['getAvalancheExtendedPublicKey']>
  > | null = {
    key: 'xpub1',
    type: 'extended-pubkey',
    curve: 'secp256k1',
    derivationPath: '',
  },
) =>
  ({
    getAvalancheExtendedPublicKey: jest.fn(() => Promise.resolve(xpubResponse)),
  }) as unknown as jest.Mocked<SecretsService>;

const createMockAddressResolver = () =>
  ({
    getXPAddressesForAccountIndex: jest.fn(),
  }) as unknown as jest.Mocked<AddressResolver>;

describe('utils', () => {
  describe('createGetBalancePayload', () => {
    it('Should return the expected payload', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      const actual = await createGetBalancePayload({
        accounts: payload.accounts,
        chainIds: payload.chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      const expected: typeof actual = [
        {
          data: [
            {
              namespace: 'avax',
              references: [
                'Rr9hnPVPxuUvrdCul-vjEsU1zmqKqRDo',
                'imji8papUf2EhV3le337w1vgFauqkJg-',
              ],
              extendedPublicKeyDetails: [
                {
                  extendedPublicKey: 'xpub1',
                  id: 'avax111',
                },
                {
                  extendedPublicKey: 'xpub1',
                  id: 'avax112',
                },
                {
                  extendedPublicKey: 'xpub1',
                  id: 'avax121',
                },
                {
                  extendedPublicKey: 'xpub1',
                  id: 'avax122',
                },
                {
                  extendedPublicKey: 'xpub1',
                  id: 'avax123',
                },
                {
                  extendedPublicKey: 'xpub1',
                  id: 'avax124',
                },
              ],
            },
            {
              addressDetails: [
                {
                  addresses: ['avax1aa'],
                  id: 'avax1aa',
                },
                {
                  addresses: ['avax1ab'],
                  id: 'avax1ab',
                },
                {
                  addresses: ['avax1ba'],
                  id: 'avax1ba',
                },
                {
                  addresses: ['avax1bb'],
                  id: 'avax1bb',
                },
                {
                  addresses: ['avax1bc'],
                  id: 'avax1bc',
                },
                {
                  addresses: ['avax1bd'],
                  id: 'avax1bd',
                },
              ],
              namespace: 'avax',
              references: ['8aDU0Kqh-5d23op-B-r-4YbQFRbsgF9a'],
            },
            {
              namespace: 'eip155',
              references: ['43114', '1'],
              addresses: ['0xa1', '0xa2', '0xb1', '0xb2', '0xb3', '0xb4'],
            },
            {
              namespace: 'bip122',
              references: ['000000000019d6689c085ae165831e93'],
              addresses: ['bc111', 'bc112', 'bc121', 'bc122', 'bc123', 'bc124'],
            },
            {
              namespace: 'solana',
              references: ['5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'],
              addresses: ['AAA', 'AAB', 'BBA', 'BBB', 'BBC', 'BBD'],
            },
          ],
          showUntrustedTokens: true,
          currency: 'usd',
        },
      ];

      expect(actual).toEqual(expected);
    });

    it('Should split up the payload if the chain IDs (references array) are more than 20', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      const account: Account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: AccountType.PRIMARY,
        walletId: 'wallet1',
        addressC: '0xa1',
        addressBTC: 'bc111',
        addressAVM: 'X-avax111',
        addressPVM: 'P-avax111',
        addressCoreEth: 'C-avax1aa',
        addressSVM: 'AAA',
      };

      const chainIds = new Array(30).fill('').map((_, index) => index + 1);

      const actual = await createGetBalancePayload({
        accounts: [account],
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      const expected: typeof actual = [
        {
          currency: 'usd',
          data: [
            {
              addressDetails: [
                {
                  addresses: ['avax1aa'],
                  id: 'avax1aa',
                },
              ],
              namespace: 'avax',
              references: ['8aDU0Kqh-5d23op-B-r-4YbQFRbsgF9a'],
            },
            {
              addresses: ['0xa1'],
              namespace: 'eip155',
              references: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
              ],
            },
            {
              addresses: ['0xa1'],
              namespace: 'eip155',
              references: [
                '21',
                '22',
                '23',
                '24',
                '25',
                '26',
                '27',
                '28',
                '29',
                '30',
              ],
            },
          ],
          showUntrustedTokens: true,
        },
      ];

      expect(actual).toEqual(expected);
    });

    it('Should split up the payload if addresses exceed 50 (maxItems limit)', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      // Create 60 accounts to exceed the 50 address limit
      const accounts: Account[] = new Array(60).fill(null).map((_, index) => ({
        id: `wallet-1-account-${index}`,
        index,
        name: `Account ${index + 1}`,
        type: AccountType.PRIMARY,
        walletId: 'wallet1',
        addressC: `0x${'a'.repeat(39)}${index.toString(16).padStart(1, '0')}`,
        addressBTC: `bc1account${index}`,
        addressAVM: `X-avax1account${index}`,
        addressPVM: `P-avax1account${index}`,
        addressCoreEth: `C-avax1account${index}`,
        addressSVM: `SVM${index}`,
      }));

      // Only use a single EVM chain to test address splitting
      const chainIds = [1];

      const actual = await createGetBalancePayload({
        accounts,
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // There should be 2 EVM request items due to address splitting (50 + 10)
      const evmItems = actual.flatMap((req) =>
        req.data.filter((item) => item.namespace === 'eip155'),
      );
      expect(evmItems.length).toBe(2);
      expect(evmItems[0]?.addresses?.length).toBe(50);
      expect(evmItems[1]?.addresses?.length).toBe(10);
    });

    it('Should split data into multiple requests if data items exceed 5 (maxItems limit)', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      const account: Account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: AccountType.PRIMARY,
        walletId: 'wallet1',
        addressC: '0xa1',
        addressBTC: 'bc111',
        addressAVM: 'X-avax111',
        addressPVM: 'P-avax111',
        addressCoreEth: 'C-avax1aa',
        addressSVM: 'AAA',
      };

      // Create enough chain IDs to generate more than 5 data items after reference splitting
      // Each EVM item can have max 20 references, so 100 chains = 5 EVM items
      // Plus avalanche items = more than 5 total
      const chainIds = new Array(100).fill('').map((_, index) => index + 1);

      const actual = await createGetBalancePayload({
        accounts: [account],
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // Should be split into multiple request bodies
      expect(actual.length).toBeGreaterThan(1);

      // Each request body should have at most 5 data items
      actual.forEach((request) => {
        expect(request.data.length).toBeLessThanOrEqual(5);
      });
    });

    it('Should split extendedPublicKeyDetails if they exceed 50', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      // Create 60 accounts from different wallets to generate 60 extendedPublicKeyDetails
      const accounts: Account[] = new Array(60).fill(null).map((_, index) => ({
        id: `wallet-${index}-account-0`,
        index: 0,
        name: `Account 1`,
        type: AccountType.PRIMARY,
        walletId: `wallet${index}`,
        addressC: `0x${'a'.repeat(39)}${index.toString(16).padStart(1, '0')}`,
        addressBTC: `bc1account${index}`,
        addressAVM: `X-avax1account${index}`,
        addressPVM: `P-avax1account${index}`,
        addressCoreEth: `C-avax1account${index}`,
        addressSVM: `SVM${index}`,
      }));

      // Use X and P chain IDs to trigger extendedPublicKeyDetails usage
      const chainIds = [4503599627370471, 4503599627370475]; // X and P chains

      const actual = await createGetBalancePayload({
        accounts,
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // Find all avalanche XP items with extendedPublicKeyDetails
      const xpItems = actual.flatMap((req) =>
        req.data.filter(
          (item) =>
            item.namespace === 'avax' && 'extendedPublicKeyDetails' in item,
        ),
      );

      // Each item should have at most 50 extendedPublicKeyDetails
      xpItems.forEach((item) => {
        if (
          'extendedPublicKeyDetails' in item &&
          item.extendedPublicKeyDetails
        ) {
          expect(item.extendedPublicKeyDetails.length).toBeLessThanOrEqual(50);
        }
      });
    });

    it('Should handle non-PRIMARY accounts using addressDetails instead of extendedPublicKeyDetails', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      const importedAccount: Account = {
        id: 'imported-account-1',
        name: 'Imported Account',
        type: AccountType.IMPORTED,
        addressC: '0xb1',
        addressBTC: 'bc1imported',
        addressAVM: 'X-avax1imported',
        addressPVM: 'P-avax1imported',
        addressCoreEth: 'C-avax1imported',
        addressSVM: 'IMPORTED',
      };

      const chainIds = [4503599627370471, 4503599627370469]; // P and X chains

      const actual = await createGetBalancePayload({
        accounts: [importedAccount],
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // For non-PRIMARY accounts, should use addressDetails, not extendedPublicKeyDetails
      const xpItem = actual[0]?.data.find(
        (item) => item.namespace === 'avax' && 'addressDetails' in item,
      );

      expect(xpItem).toBeDefined();
      if (xpItem && 'addressDetails' in xpItem) {
        expect(xpItem.addressDetails).toBeDefined();
        expect(xpItem.addressDetails?.length).toBeGreaterThan(0);
      }
    });

    it('Should use the provided currency parameter', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      const account: Account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: AccountType.PRIMARY,
        walletId: 'wallet1',
        addressC: '0xa1',
        addressBTC: 'bc111',
        addressAVM: 'X-avax111',
        addressPVM: 'P-avax111',
        addressCoreEth: 'C-avax1aa',
        addressSVM: 'AAA',
      };

      const actual = await createGetBalancePayload({
        accounts: [account],
        chainIds: [1],
        currency: 'eur',
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      expect(actual[0]?.currency).toBe('eur');
    });

    it('Should handle only EVM chains (no Avalanche X/P chains)', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      const account: Account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: AccountType.PRIMARY,
        walletId: 'wallet1',
        addressC: '0xa1',
        addressBTC: 'bc111',
        addressAVM: 'X-avax111',
        addressPVM: 'P-avax111',
        addressCoreEth: 'C-avax1aa',
        addressSVM: 'AAA',
      };

      // Only EVM chain IDs
      const chainIds = [1, 137, 42161];

      const actual = await createGetBalancePayload({
        accounts: [account],
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // Should have EVM items but no X/P chain items (only CoreEth avax item)
      const hasEvmItems = actual.some((req) =>
        req.data.some((item) => item.namespace === 'eip155'),
      );
      expect(hasEvmItems).toBe(true);

      // Should still have CoreEth item
      const hasCoreEthItem = actual.some((req) =>
        req.data.some(
          (item) =>
            item.namespace === 'avax' &&
            'addressDetails' in item &&
            (item.references as string[])?.includes(
              '8aDU0Kqh-5d23op-B-r-4YbQFRbsgF9a',
            ),
        ),
      );
      expect(hasCoreEthItem).toBe(true);
    });

    it('Should handle only Avalanche X/P chains (no EVM chains)', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      const account: Account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: AccountType.PRIMARY,
        walletId: 'wallet1',
        addressC: '0xa1',
        addressBTC: 'bc111',
        addressAVM: 'X-avax111',
        addressPVM: 'P-avax111',
        addressCoreEth: 'C-avax1aa',
        addressSVM: 'AAA',
      };

      // Only X and P chain IDs (4503599627370471 = P-chain, 4503599627370469 = X-chain)
      const chainIds = [4503599627370471, 4503599627370469];

      const actual = await createGetBalancePayload({
        accounts: [account],
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // Should have Avalanche XP items
      const hasXpItems = actual.some((req) =>
        req.data.some(
          (item) =>
            item.namespace === 'avax' && 'extendedPublicKeyDetails' in item,
        ),
      );
      expect(hasXpItems).toBe(true);
    });

    it('Should handle accounts missing certain address types', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      // WalletConnect accounts don't require all address types
      const accountWithoutSVM: Account = {
        id: 'wc-account-1',
        name: 'WalletConnect Account',
        type: AccountType.WALLET_CONNECT,
        addressC: '0xa1',
        // No addressSVM - it's optional for WalletConnect accounts
      };

      // Include Solana chain (4503599627369476 = SOLANA_MAINNET_ID)
      const chainIds = [1, 4503599627369476];

      const actual = await createGetBalancePayload({
        accounts: [accountWithoutSVM],
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // Should have EVM item
      const hasEvmItem = actual.some((req) =>
        req.data.some((item) => item.namespace === 'eip155'),
      );
      expect(hasEvmItem).toBe(true);

      // Solana item should not exist since account has no SVM address
      const solanaItem = actual
        .flatMap((req) => req.data)
        .find((item) => item.namespace === 'solana');
      expect(solanaItem).toBeUndefined();
    });

    it('Should return empty array for empty accounts', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      const actual = await createGetBalancePayload({
        accounts: [],
        chainIds: [1, 43114],
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // Should return empty data or no requests with valid data
      expect(actual.every((req) => req.data.length === 0)).toBe(true);
    });

    it('Should handle empty chainIds array', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      const account: Account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: AccountType.PRIMARY,
        walletId: 'wallet1',
        addressC: '0xa1',
        addressBTC: 'bc111',
        addressAVM: 'X-avax111',
        addressPVM: 'P-avax111',
        addressCoreEth: 'C-avax1aa',
        addressSVM: 'AAA',
      };

      const actual = await createGetBalancePayload({
        accounts: [account],
        chainIds: [],
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // Should still have CoreEth item since it's added regardless of chainIds
      const hasCoreEthItem = actual.some((req) =>
        req.data.some((item) => item.namespace === 'avax'),
      );
      expect(hasCoreEthItem).toBe(true);
    });

    it('Should call addressResolver when xpub is not available for PRIMARY accounts', async () => {
      const mockSecretsService = createMockSecretsService(null);
      const mockAddressResolver = createMockAddressResolver();

      // Mock the address resolver to return legacy addresses
      mockAddressResolver.getXPAddressesForAccountIndex.mockResolvedValue({
        externalAddresses: [
          { address: 'avax1legacy1', index: 0 },
          { address: 'avax1legacy2', index: 1 },
        ],
        internalAddresses: [],
      });

      const account: Account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: AccountType.PRIMARY,
        walletId: 'wallet1',
        addressC: '0xa1',
        addressBTC: 'bc111',
        addressAVM: 'X-avax111',
        addressPVM: 'P-avax111',
        addressCoreEth: 'C-avax1aa',
        addressSVM: 'AAA',
      };

      // 4503599627370471 = P-chain, 4503599627370469 = X-chain
      const chainIds = [4503599627370471, 4503599627370469];

      await createGetBalancePayload({
        accounts: [account],
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // When xpub is null, addressResolver should be called for X/P chain addresses
      expect(
        mockAddressResolver.getXPAddressesForAccountIndex,
      ).toHaveBeenCalled();

      // Verify it was called for the correct wallet and account index
      expect(
        mockAddressResolver.getXPAddressesForAccountIndex,
      ).toHaveBeenCalledWith('wallet1', 0, 'AVM');
    });

    it('Should split addressDetails if they exceed 50', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      // Create 60 imported accounts to generate 60 addressDetails entries
      const accounts: Account[] = new Array(60).fill(null).map((_, index) => ({
        id: `imported-account-${index}`,
        name: `Imported Account ${index + 1}`,
        type: AccountType.IMPORTED,
        addressC: `0x${'a'.repeat(39)}${index.toString(16).padStart(1, '0')}`,
        addressBTC: `bc1imported${index}`,
        addressAVM: `X-avax1imported${index}`,
        addressPVM: `P-avax1imported${index}`,
        addressCoreEth: `C-avax1imported${index}`,
        addressSVM: `IMPORTED${index}`,
      }));

      // Use X and P chain IDs (4503599627370471 = P-chain, 4503599627370469 = X-chain)
      const chainIds = [4503599627370471, 4503599627370469];

      const actual = await createGetBalancePayload({
        accounts,
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      // Find all items with addressDetails
      const itemsWithAddressDetails = actual.flatMap((req) =>
        req.data.filter(
          (item) => 'addressDetails' in item && item.addressDetails,
        ),
      );

      // Each item should have at most 50 addressDetails
      itemsWithAddressDetails.forEach((item) => {
        if ('addressDetails' in item && item.addressDetails) {
          expect(item.addressDetails.length).toBeLessThanOrEqual(50);
        }
      });
    });

    it('Should handle Solana chains correctly', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      const account: Account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: AccountType.PRIMARY,
        walletId: 'wallet1',
        addressC: '0xa1',
        addressBTC: 'bc111',
        addressAVM: 'X-avax111',
        addressPVM: 'P-avax111',
        addressCoreEth: 'C-avax1aa',
        addressSVM: 'AAASolanaAddress',
      };

      // 4503599627369476 is ChainId.SOLANA_MAINNET_ID
      const chainIds = [4503599627369476];

      const actual = await createGetBalancePayload({
        accounts: [account],
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      const solanaItem = actual
        .flatMap((req) => req.data)
        .find((item) => item.namespace === 'solana');

      expect(solanaItem).toBeDefined();
      if (solanaItem && 'addresses' in solanaItem) {
        expect(solanaItem.addresses).toContain('AAASolanaAddress');
      }
    });

    it('Should deduplicate addresses and references', async () => {
      const mockSecretsService = createMockSecretsService();
      const mockAddressResolver = createMockAddressResolver();

      // Create accounts with same addresses
      const accounts: Account[] = [
        {
          id: 'wallet-1-account-1',
          index: 0,
          name: 'Account 1',
          type: AccountType.PRIMARY,
          walletId: 'wallet1',
          addressC: '0xa1',
          addressBTC: 'bc111',
          addressAVM: 'X-avax111',
          addressPVM: 'P-avax111',
          addressCoreEth: 'C-avax1aa',
          addressSVM: 'AAA',
        },
        {
          id: 'wallet-1-account-2',
          index: 1,
          name: 'Account 2',
          type: AccountType.PRIMARY,
          walletId: 'wallet1',
          addressC: '0xa1', // Same address as account 1
          addressBTC: 'bc111', // Same address
          addressAVM: 'X-avax111',
          addressPVM: 'P-avax111',
          addressCoreEth: 'C-avax1aa',
          addressSVM: 'AAA',
        },
      ];

      const chainIds = [1, 1]; // Duplicate chain IDs

      const actual = await createGetBalancePayload({
        accounts,
        chainIds,
        secretsService: mockSecretsService,
        addressResolver: mockAddressResolver,
        filterSmallUtxos: false,
      });

      expect(actual).toEqual([
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              namespace: 'eip155',
              // No duplicate addresses or references, only unique values
              addresses: ['0xa1'],
              references: ['1'],
            }),
          ]),
        }),
      ]);
    });
  });
});
