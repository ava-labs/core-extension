import { waitForIntervalRuns } from '@src/tests/test-utils';
import { PeerType } from 'fireblocks-sdk';
import { FireblocksBTCSigner } from './FireblocksBTCSigner';
import { FireblocksService } from './FireblocksService';
import {
  FireblocksError,
  KnownAddressDictionary,
  NetworkError,
  TRANSACTION_POLLING_INTERVAL_MS,
  TX_SUBMISSION_FAILURE_STATUSES,
} from './models';

jest.mock('ethers', () => ({
  ...jest.requireActual('ethers'),
  sha256: jest.fn().mockReturnValue('0x1234'),
}));

jest.mock('jose', () => {
  const jose = jest.requireActual('jose');

  const signedJwt = 'signed-jwt';

  // Fake the sign() method as well.
  jose.SignJWT.prototype.sign = jest.fn().mockResolvedValue(signedJwt);

  return {
    ...jose,
    importPKCS8: jest.fn().mockResolvedValue({
      type: 'rsa2048',
    }),
  };
});

const knownAddress = 'tb1q32r4p22fyexux0m0gr8lf8z9entmzu8sl2t29n';
const unknownAddress = 'tb1a2b3c4d5e6f5e4d3c2b1axuxemuzebalt2t2nda';
const fireblocksContacts: KnownAddressDictionary = new Map([
  [
    knownAddress,
    {
      type: PeerType.EXTERNAL_WALLET,
      id: 'test-wallet',
    },
  ],
]);
const fbService = new FireblocksService({} as any);

describe('src/background/services/fireblocks/FireblocksBTCSigner', () => {
  describe('.signTx()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.clearAllMocks();
      jest
        .spyOn(fbService, 'getAllKnownAddressesForAsset')
        .mockResolvedValue(fireblocksContacts);

      global.fetch = jest.fn();
    });

    it('polls Fireblocks for transaction status until we have a hash', async () => {
      jest
        .spyOn(fbService, 'request')
        .mockResolvedValueOnce({ id: 'tx-id' }) // mocked POST transaction request (tx creation)
        .mockResolvedValueOnce({ status: 'SUBMITTING' }) // 1st polling request (transaction is still submitting)
        .mockResolvedValueOnce({ status: 'QUEUED' }) // 2nd polling request (transaction is queued)
        .mockResolvedValueOnce({ status: 'PENDING_SIGNATURE' }) // 3rd polling request (transaction is pending signatures)
        .mockResolvedValueOnce({ status: 'BROADCASTING', txHash: 'tx-hash' }); // 4th polling request (transaction is being broadcasted to the blockchain)

      const signer = new FireblocksBTCSigner(fbService, '0', true);

      signer
        .signTx(
          [],
          [
            {
              address: knownAddress,
              value: 1000,
            },
          ]
        )
        .then((result) => {
          expect(result).toEqual({ txHash: 'tx-hash' });
        });

      // The below is not exact. The overall number of requests will be higher,
      // but we're mocking the entire .getAllKnownAddressesForAsset() method,
      // so those requests are not counted here. The only requests being counted
      // below are the POST /transactions to create the transaction and then
      // GET /transactions that we use to poll for status updates.
      const expectedNumberOfCalls = 5;

      await waitForIntervalRuns(
        expectedNumberOfCalls,
        TRANSACTION_POLLING_INTERVAL_MS
      );
      expect(fbService.request).toHaveBeenCalledTimes(expectedNumberOfCalls);
    });

    describe('during a happy path', () => {
      beforeEach(async () => {
        jest
          .spyOn(fbService, 'request')
          .mockResolvedValueOnce({ id: 'tx-id' }) // mocked POST transaction request (tx creation)
          .mockResolvedValueOnce({ txHash: 'tx-hash' }); // mocked GET transaction request (tx status tracking)
      });

      it('calls Fireblocks API with BTC asset on mainnet', async () => {
        const signer = new FireblocksBTCSigner(fbService, '0', false);

        await signer.signTx(
          [],
          [
            {
              address: knownAddress,
              value: 1000,
            },
          ]
        );
        expect(fbService.request).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({
              assetId: 'BTC',
            }),
          })
        );
      });

      it('calls Fireblocks API with BTC_TEST asset on testnet', async () => {
        const signer = new FireblocksBTCSigner(fbService, '0', true);

        await signer.signTx(
          [],
          [
            {
              address: knownAddress,
              value: 1000,
            },
          ]
        );
        expect(fbService.request).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({
              assetId: 'BTC_TEST',
            }),
          })
        );
      });

      it('calls Fireblocks API with proper source', async () => {
        const signer = new FireblocksBTCSigner(fbService, '0', true);

        await signer.signTx(
          [],
          [
            {
              address: knownAddress,
              value: 1000,
            },
          ]
        );

        expect(fbService.request).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({
              source: {
                id: '0',
                type: PeerType.VAULT_ACCOUNT,
              },
            }),
          })
        );
      });

      it('calls Fireblocks API with proper destinations', async () => {
        const signer = new FireblocksBTCSigner(fbService, '0', true);

        await signer.signTx(
          [],
          [
            {
              address: knownAddress,
              value: 1000000,
            },
            {
              address: unknownAddress,
              value: 2000000,
            },
            {
              address: 'source-address',
              value: 500000,
            },
          ]
        );

        expect(fbService.request).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({
              destinations: [
                {
                  amount: '0.01',
                  destination: {
                    type: PeerType.EXTERNAL_WALLET,
                    id: 'test-wallet',
                  },
                },
                {
                  amount: '0.02',
                  destination: {
                    type: PeerType.ONE_TIME_ADDRESS,
                    oneTimeAddress: {
                      address: unknownAddress,
                    },
                  },
                },
              ],
            }),
          })
        );
      });
    });

    describe('when transaction submission fails due to network issues', () => {
      it('returns a NetworkError', async () => {
        jest.mocked(global.fetch).mockRejectedValueOnce(new Error('Timeout'));

        const signer = new FireblocksBTCSigner(fbService, '0', true);

        expect(() =>
          signer.signTx(
            [],
            [
              {
                address: knownAddress,
                value: 1000,
              },
            ]
          )
        ).rejects.toThrowError(NetworkError);
      });
    });

    describe('when transaction submission succeeds, but Fireblocks stops it with', () => {
      it.each(TX_SUBMISSION_FAILURE_STATUSES)(
        '"%s" status, we return a proper FireblocksError',
        async (status) => {
          jest
            .spyOn(fbService, 'request')
            .mockResolvedValueOnce({ id: 'tx-id' }) // mocked POST transaction request (tx creation)
            .mockResolvedValueOnce({ status }); // mocked GET transaction request (tx status tracking)

          const signer = new FireblocksBTCSigner(fbService, '0', true);

          expect(() =>
            signer.signTx(
              [],
              [
                {
                  address: knownAddress,
                  value: 1000,
                },
              ]
            )
          ).rejects.toThrowError(
            new FireblocksError(`Transaction unsuccessful (status: ${status})`)
          );
        }
      );
    });
  });
});
