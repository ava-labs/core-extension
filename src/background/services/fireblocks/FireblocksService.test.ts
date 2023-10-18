import { PeerType } from 'fireblocks-sdk';
import { FireblocksService } from './FireblocksService';
import { FireblocksError, NetworkError } from './models';

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

const apiKey = 'api-key';
const secretKey = 'secret-key';
const extWalletAddr = 'tb1q32r4p22fyexux0m0gr8lf8z9entmzu8sl2t29n';
const intWalletAddr = 'tb1a2b3c4d5e6f5e4d3c2b1axuxemuzebalt2t2nda';
const vaultAcctAddr = 'tb1jsdjadsuidhkjadj8as78yu1idajdjk12387a8s';

const mockResponsesByPath =
  (responses: Record<string, any>) =>
  async (url: RequestInfo): Promise<Response> => {
    const path = (url as string).replace('https://api.fireblocks.io/v1', '');

    if (responses[path]) {
      return {
        json: () => Promise.resolve(responses[path]),
        ok: true,
      } as Response;
    }

    return {
      json: () => Promise.resolve(null),
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response;
  };

describe('src/background/services/fireblocks/FireblocksService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();
  });

  describe('.getAllKnownAddressesForAsset()', () => {
    describe('when matching external wallets exist', () => {
      beforeEach(() => {
        jest.mocked(global.fetch).mockImplementation(
          mockResponsesByPath({
            '/external_wallets': [
              {
                id: 'ext-wallet-1',
                assets: [
                  {
                    id: 'BTC',
                    address: extWalletAddr,
                  },
                ],
              },
            ],
          })
        );
      });

      it('includes the external wallets', async () => {
        const service = new FireblocksService(apiKey, secretKey);

        const addresses = await service.getAllKnownAddressesForAsset('BTC');

        expect(addresses.get(extWalletAddr)).toEqual({
          type: PeerType.EXTERNAL_WALLET,
          walletId: 'ext-wallet-1',
        });
      });
    });

    describe('when matching internal wallets exist', () => {
      beforeEach(() => {
        jest.mocked(global.fetch).mockImplementation(
          mockResponsesByPath({
            '/internal_wallets': [
              {
                id: 'int-wallet-1',
                assets: [
                  {
                    id: 'BTC',
                    address: intWalletAddr,
                  },
                ],
              },
            ],
          })
        );
      });

      it('includes internal wallets', async () => {
        const service = new FireblocksService(apiKey, secretKey);

        const addresses = await service.getAllKnownAddressesForAsset('BTC');

        expect(addresses.get(intWalletAddr)).toEqual({
          type: PeerType.INTERNAL_WALLET,
          walletId: 'int-wallet-1',
        });
      });
    });

    describe('when matching vault accounts exist', () => {
      const vaultAccount1 = 'vault-account-1';
      beforeEach(() => {
        jest.mocked(global.fetch).mockImplementation(
          mockResponsesByPath({
            '/vault/accounts_paged?assetId=BTC': {
              accounts: [
                {
                  id: vaultAccount1,
                },
              ],
            },

            [`/vault/accounts/${vaultAccount1}/BTC/addresses`]: [
              {
                assetId: 'BTC',
                address: vaultAcctAddr,
              },
            ],
          })
        );
      });

      it('includes vault accounts wallets', async () => {
        const service = new FireblocksService(apiKey, secretKey);

        const addresses = await service.getAllKnownAddressesForAsset('BTC');

        expect(addresses.get(vaultAcctAddr)).toEqual({
          type: PeerType.VAULT_ACCOUNT,
          id: vaultAccount1,
        });
      });
    });
  });

  it('parses Fireblocks API errors if possible', async () => {
    const apiResponse = {
      code: 1427,
      message: 'Source type of transaction is invalid',
    };

    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(apiResponse),
      status: 400,
      statusText: 'Invalid Request',
    } as Response);

    const service = new FireblocksService(apiKey, secretKey);

    expect(() => service.request({ path: '/anything' })).rejects.toThrowError(
      new FireblocksError(`Request failed: [400] Invalid Request`, apiResponse)
    );
  });

  it('returns a NetworkError on totally failed requests', async () => {
    const error = new Error('Timeout');
    jest.mocked(global.fetch).mockRejectedValueOnce(error);

    const service = new FireblocksService(apiKey, secretKey);

    expect(() => service.request({ path: '/anything' })).rejects.toThrowError(
      new NetworkError(error)
    );
  });
});
