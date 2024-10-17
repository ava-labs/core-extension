import { sha256 } from 'ethers';
import { PeerType } from 'fireblocks-sdk';
import { Account, AccountType, FireblocksAccount } from '../accounts/models';
import { SecretType } from '../secrets/models';
import { SecretsService } from '../secrets/SecretsService';
import { FireblocksSecretsService } from './FireblocksSecretsService';
import { FireblocksService } from './FireblocksService';
import { FireblocksErrorCode } from './models';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { CommonError } from '@src/utils/errors';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../accounts/AccountsService';

jest.mock('ethers');
jest.mock('../accounts/AccountsService');
jest.mock('../secrets/SecretsService');
jest.mock('@src/monitoring/sentryCaptureException');

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
const vaultAccount1 = 'vault-account-1';
const extWalletAddr = 'tb1q32r4p22fyexux0m0gr8lf8z9entmzu8sl2t29n';
const intWalletAddr = 'tb1a2b3c4d5e6f5e4d3c2b1axuxemuzebalt2t2nda';
const vaultAcctAddr = 'tb1jsdjadsuidhkjadj8as78yu1idajdjk12387a8s';
const vaultAcctAddr2 = 'tb1vaultAcctAddr2';

const mockResponsesByPath =
  (responses: Record<string, any>) =>
  async (url: URL | RequestInfo): Promise<Response> => {
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
  const accountsService: jest.Mocked<AccountsService> = {
    activeAccount: {} as unknown as Account,
  } as any;
  const secretsService = jest.mocked(new SecretsService({} as any));
  const secretsProvider = new FireblocksSecretsService(
    secretsService,
    accountsService
  );
  let service: FireblocksService;

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(sha256).mockReturnValue('0x1234');
    secretsService.getAccountSecrets.mockResolvedValue({
      secretType: SecretType.Fireblocks,
      addresses: {
        addressC: 'addressC',
        addressBTC: 'addressBTC',
      },
      api: {
        key: 'key',
        secret: 'secret',
        vaultAccountId: '1',
      },
      account: {
        type: AccountType.FIREBLOCKS,
        id: 'abcd-1234',
        index: 0,
      } as unknown as FireblocksAccount,
    });
    global.fetch = jest.fn();
    service = new FireblocksService(secretsProvider);
  });

  describe('getBtcAddressByAccountId', () => {
    it('should call the endpoint until all pages are fetched', async () => {
      jest.mocked(global.fetch).mockImplementation(
        mockResponsesByPath({
          [`/vault/accounts/${vaultAccount1}/BTC_TEST/addresses_paginated`]: {
            addresses: [
              {
                assetId: 'BTC_TEST',
                address: vaultAcctAddr,
                tag: 'tag',
                addressFormat: 'SEGWIT',
                type: 'Permanent',
                userDefined: false,
              },
            ],
          },
        })
      );

      const result = await service.getBtcAddressByAccountId(
        vaultAccount1,
        false
      );
      expect(result).toEqual(vaultAcctAddr);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should return the value even when account is not on the first page', async () => {
      jest.mocked(global.fetch).mockImplementation(
        mockResponsesByPath({
          [`/vault/accounts/${vaultAccount1}/BTC_TEST/addresses_paginated`]: {
            addresses: [
              {
                assetId: 'BTC_TEST',
                address: vaultAcctAddr,
                tag: 'Deposit',
                addressFormat: 'SEGWIT',
                type: 'test',
                userDefined: false,
              },
            ],
            paging: {
              after: 'paging-token',
            },
          },
          [`/vault/accounts/${vaultAccount1}/BTC_TEST/addresses_paginated?after=paging-token`]:
            {
              addresses: [
                {
                  assetId: 'BTC_TEST',
                  address: vaultAcctAddr2,
                  tag: 'tag',
                  addressFormat: 'SEGWIT',
                  type: 'Permanent',
                  userDefined: false,
                },
              ],
            },
        })
      );

      const result = await service.getBtcAddressByAccountId(
        vaultAccount1,
        false
      );
      expect(result).toEqual(vaultAcctAddr2);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllAddesses', () => {
    const primaryAddress = {
      assetId: 'BTC_TEST',
      address: vaultAcctAddr,
      tag: 'tag',
      addressFormat: 'SEGWIT',
      type: 'Permanent',
      userDefined: false,
    };
    const depositAddress = {
      assetId: 'BTC_TEST',
      address: vaultAcctAddr,
      tag: 'Deposit',
      addressFormat: 'SEGWIT',
      type: 'test',
      userDefined: false,
    };
    it('should fetch only once if there is no more pages', async () => {
      jest.mocked(global.fetch).mockImplementation(
        mockResponsesByPath({
          [`/vault/accounts/${vaultAccount1}/BTC_TEST/addresses_paginated`]: {
            addresses: [primaryAddress],
          },
        })
      );

      const result = await service.getAllAddesses(vaultAccount1, 'BTC_TEST');
      expect(result).toEqual([primaryAddress]);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should return the value when the account id is found', async () => {
      jest.mocked(global.fetch).mockImplementation(
        mockResponsesByPath({
          [`/vault/accounts/${vaultAccount1}/BTC_TEST/addresses_paginated`]: {
            addresses: [depositAddress],
            paging: {
              after: 'paging-token',
            },
          },
          [`/vault/accounts/${vaultAccount1}/BTC_TEST/addresses_paginated?after=paging-token`]:
            {
              addresses: [primaryAddress],
            },
        })
      );

      const result = await service.getAllAddesses(vaultAccount1, 'BTC_TEST');
      expect(result).toEqual([depositAddress, primaryAddress]);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
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
        const addresses = await service.getAllKnownAddressesForAsset('BTC');

        expect(addresses.get(extWalletAddr)).toEqual({
          type: PeerType.EXTERNAL_WALLET,
          id: 'ext-wallet-1',
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
        const addresses = await service.getAllKnownAddressesForAsset('BTC');

        expect(addresses.get(intWalletAddr)).toEqual({
          type: PeerType.INTERNAL_WALLET,
          id: 'int-wallet-1',
        });
      });
    });

    describe('when matching vault accounts exist', () => {
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

            [`/vault/accounts/${vaultAccount1}/BTC/addresses_paginated`]: {
              addresses: [
                {
                  assetId: 'BTC',
                  address: vaultAcctAddr,
                  tag: 'tag',
                  addressFormat: 'SEGWIT',
                  type: 'Permanent',
                  userDefined: false,
                },
              ],
            },
          })
        );
      });

      it('includes vault accounts wallets', async () => {
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

    await expect(service.request({ path: '/anything' })).rejects.toThrow(
      ethErrors.rpc.internal({
        data: {
          reason: FireblocksErrorCode.Unknown,
          httpStatus: 400,
          httpStatusText: 'Invalid Request',
          apiErrorCode: 1427,
          apiErrorMessage: 'Source type of transaction is invalid',
        },
      })
    );
  });

  it('captures API errors to Sentry', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({
          code: 1337,
          message: 'Cannot read properties of undefined (reading "type")',
        }),
      status: 500,
      statusText: 'Server Error',
    } as Response);

    try {
      await service.request({ path: '/anything' });
    } catch {
      expect(sentryCaptureException).toHaveBeenCalledWith(
        ethErrors.rpc.internal({
          data: {
            reason: FireblocksErrorCode.Unknown,
            httpStatus: 500,
            httpStatusText: 'Server Error',
            apiErrorCode: 1337,
            apiErrorMessage:
              'Cannot read properties of undefined (reading "type")',
          },
        }),
        SentryExceptionTypes.FIREBLOCKS
      );
    }
  });

  it('returns a NetworkError on totally failed requests', async () => {
    const error = new Error('Timeout');
    jest.mocked(global.fetch).mockRejectedValueOnce(error);

    await expect(service.request({ path: '/anything' })).rejects.toThrow(
      ethErrors.rpc.internal({
        data: {
          reason: CommonError.NetworkError,
        },
      })
    );
  });
});
