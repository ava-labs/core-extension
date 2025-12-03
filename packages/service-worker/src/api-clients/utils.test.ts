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
            extendedPublicKeyDetails: [
              // all the items are doubled because of the references, but the xpubs are different in reality for the different chains
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax111',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax111',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax112',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax112',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax121',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax121',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax122',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax122',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax123',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax123',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax124',
              },
              {
                extendedPublicKey: 'xpub1',
                walletId: 'avax124',
              },
            ],
          },
          {
            namespace: 'avax',
            references: ['8aDU0Kqh-5d23op-B-r-4YbQFRbsgF9a'],
            addressDetails: [
              {
                addresses: ['avax1aa'],
                walletId: 'avax1aa',
              },
              {
                addresses: ['avax1ab'],
                walletId: 'avax1ab',
              },
              {
                addresses: ['avax1ba'],
                walletId: 'avax1ba',
              },
              {
                addresses: ['avax1bb'],
                walletId: 'avax1bb',
              },
              {
                addresses: ['avax1bc'],
                walletId: 'avax1bc',
              },
              {
                addresses: ['avax1bd'],
                walletId: 'avax1bd',
              },
            ],
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
        currency: 'usd',
      };

      const actual = await createGetBalancePayload({
        accounts: payload.accounts as Account[],
        chainIds: payload.chainIds,
        secretsService: mockSecretsService as any,
      });

      expect(actual).toEqual(expected);
    });
  });
});
