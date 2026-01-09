import { Account } from '@core/types';
import {
  createGetBalancePayload,
  convertBalanceResponsesToCacheBalanceObject,
  convertBalanceResponseToAtomicCacheBalanceObject,
} from './utils';
import {
  createGetBalancePayloadMethodPayload,
  expectedCreateGetBalancePayloadResponse,
  balanceApiResponse,
  expectedCacheBalanceObject,
  balanceApiResponseForAtomic,
  expectedAtomicBalanceCacheObject,
} from './test-data/utilsTestData';

describe('utils', () => {
  describe('createGetBalancePayload', () => {
    it('Should return the expected payload', async () => {
      const mockSecretsService = { getAvalancheExtendedPublicKey: jest.fn() };
      const mockAddressResolver = { getXPAddressesForAccountIndex: jest.fn() };
      mockSecretsService.getAvalancheExtendedPublicKey.mockResolvedValue({
        key: 'xpub1',
      });

      const actual = await createGetBalancePayload({
        accounts: createGetBalancePayloadMethodPayload.accounts as Account[],
        chainIds: createGetBalancePayloadMethodPayload.chainIds,
        secretsService: mockSecretsService as any,
        addressResolver: mockAddressResolver as any,
      });

      expect(actual).toEqual(expectedCreateGetBalancePayloadResponse);
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
  });

  describe('convertBalanceResponsesToCacheBalanceObject', () => {
    it('Should convert response to the required object', () => {
      const actual =
        // @ts-expect-error -- Good enough
        convertBalanceResponsesToCacheBalanceObject(balanceApiResponse);

      expect(actual).toEqual(expectedCacheBalanceObject);
    });
  });

  describe('convertBalanceResponseToAtomicCacheBalanceObject', () => {
    it('Should convert response to the required object', () => {
      const actual = convertBalanceResponseToAtomicCacheBalanceObject(
        // @ts-expect-error -- Good enough
        balanceApiResponseForAtomic,
      );

      expect(actual).toEqual(expectedAtomicBalanceCacheObject);
    });
  });
});
