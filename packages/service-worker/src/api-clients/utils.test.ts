import { Account } from '@core/types';
import { createGetBalancePayload } from './utils';

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
      type: 'primary',
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
      type: 'primary',
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
      type: 'primary',
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
      type: 'primary',
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
      type: 'primary',
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
      type: 'primary',
      walletId: 'wallet2',
      addressC: '0xb4',
      addressBTC: 'bc124',
      addressAVM: 'X-avax124',
      addressPVM: 'P-avax124',
      addressCoreEth: 'C-avax1bd',
      addressSVM: 'BBD',
    },
  ],
};

describe('utils', () => {
  describe('createGetBalancePayload', () => {
    it('Should return the expected payload', async () => {
      const mockSecretsService = { getAvalancheExtendedPublicKey: jest.fn() };
      const mockAddressResolver = { getXPAddressesForAccountIndex: jest.fn() };
      mockSecretsService.getAvalancheExtendedPublicKey.mockResolvedValue({
        key: 'xpub1',
      });
      const expected = {
        data: [
          {
            namespace: 'avax',
            references: [
              'Rr9hnPVPxuUvrdCul-vjEsU1zmqKqRDo',
              'imji8papUf2EhV3le337w1vgFauqkJg-',
            ],
            addressDetails: [],
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
            filterOutDustUtxos: false,
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
      };

      const actual = await createGetBalancePayload({
        accounts: payload.accounts as Account[],
        chainIds: payload.chainIds,
        secretsService: mockSecretsService as any,
        addressResolver: mockAddressResolver as any,
        filterSmallUtxos: false,
      });

      expect(actual).toEqual(expected);
    });

    it('Should split up the payload if the chain IDs (references array) are more than 20', async () => {
      const mockSecretsService = { getAvalancheExtendedPublicKey: jest.fn() };
      const mockAddressResolver = { getXPAddressesForAccountIndex: jest.fn() };
      mockSecretsService.getAvalancheExtendedPublicKey.mockResolvedValue({
        key: 'xpub1',
      });

      const account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: 'primary',
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
        accounts: [account] as Account[],
        chainIds,
        secretsService: mockSecretsService as any,
        addressResolver: mockAddressResolver as any,
        filterSmallUtxos: false,
      });

      const expected = {
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
      };

      expect(actual).toEqual(expected);
    });

    it('should set filterOutDustUtxos to true when filterSmallUtxos is true', async () => {
      const mockSecretsService = { getAvalancheExtendedPublicKey: jest.fn() };
      const mockAddressResolver = { getXPAddressesForAccountIndex: jest.fn() };
      mockSecretsService.getAvalancheExtendedPublicKey.mockResolvedValue({
        key: 'xpub1',
      });

      const account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: 'primary',
        walletId: 'wallet1',
        addressC: '0xa1',
        addressBTC: 'bc111',
        addressAVM: 'X-avax111',
        addressPVM: 'P-avax111',
        addressCoreEth: 'C-avax1aa',
        addressSVM: 'AAA',
      };

      const actual = await createGetBalancePayload({
        accounts: [account] as Account[],
        chainIds: [4503599627370471, 4503599627370475], // X and P chain IDs
        secretsService: mockSecretsService as any,
        addressResolver: mockAddressResolver as any,
        filterSmallUtxos: true,
      });

      // Find the avax namespace item (X/P chains)
      const avaxItem = actual.data.find(
        (item) =>
          item.namespace === 'avax' &&
          'extendedPublicKeyDetails' in item &&
          (item as any).extendedPublicKeyDetails?.length > 0,
      );

      expect(avaxItem).toBeDefined();
      expect((avaxItem as any).filterOutDustUtxos).toBe(true);
    });

    it('should set filterOutDustUtxos to false when filterSmallUtxos is false', async () => {
      const mockSecretsService = { getAvalancheExtendedPublicKey: jest.fn() };
      const mockAddressResolver = { getXPAddressesForAccountIndex: jest.fn() };
      mockSecretsService.getAvalancheExtendedPublicKey.mockResolvedValue({
        key: 'xpub1',
      });

      const account = {
        id: 'wallet-1-account-1',
        index: 0,
        name: 'Account 1',
        type: 'primary',
        walletId: 'wallet1',
        addressC: '0xa1',
        addressBTC: 'bc111',
        addressAVM: 'X-avax111',
        addressPVM: 'P-avax111',
        addressCoreEth: 'C-avax1aa',
        addressSVM: 'AAA',
      };

      const actual = await createGetBalancePayload({
        accounts: [account] as Account[],
        chainIds: [4503599627370471, 4503599627370475], // X and P chain IDs
        secretsService: mockSecretsService as any,
        addressResolver: mockAddressResolver as any,
        filterSmallUtxos: false,
      });

      // Find the avax namespace item (X/P chains)
      const avaxItem = actual.data.find(
        (item) =>
          item.namespace === 'avax' &&
          'extendedPublicKeyDetails' in item &&
          (item as any).extendedPublicKeyDetails?.length > 0,
      );

      expect(avaxItem).toBeDefined();
      expect((avaxItem as any).filterOutDustUtxos).toBe(false);
    });
  });
});
