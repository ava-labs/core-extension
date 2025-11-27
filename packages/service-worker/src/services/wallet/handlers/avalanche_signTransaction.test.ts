import {
  AVM,
  utils,
  Credential,
  UnsignedTx,
  avaxSerial,
  evmSerial,
  EVM,
} from '@avalabs/avalanchejs';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { ethErrors } from 'eth-rpc-errors';
import { DAppProviderRequest, DEFERRED_RESPONSE, Action } from '@core/types';
import { AvalancheSignTransactionHandler } from './avalanche_signTransaction';
import getProvidedUtxos from '../utils/getProvidedUtxos';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { buildRpcCall } from '@shared/tests/test-utils';
import { HEADERS } from '../../glacier/glacierConfig';
import { AVALANCHE_XP_TEST_NETWORK } from '@avalabs/core-chains-sdk';

jest.mock('@avalabs/avalanchejs');
jest.mock('@avalabs/core-wallets-sdk');
jest.mock('../utils/getProvidedUtxos');
jest.mock('~/runtime/openApprovalWindow');

describe('src/background/services/wallet/handlers/avalanche_signTransaction', () => {
  const env = process.env;
  const frontendTabId = 951;
  const request = {
    id: '123',
    method: DAppProviderRequest.AVALANCHE_SIGN_TRANSACTION,
    params: { transactionHex: '0x00001', chainAlias: 'X' },
    site: {
      tabId: 1,
    } as any,
  };
  const requestWithUtxos = {
    ...request,
    params: {
      ...request.params,
      utxos: ['0x1', '0x2'],
    },
  };
  const activeAccountMock = {
    addressC: '0x123',
    addressAVM: 'X-fuji1',
    addressCoreEth: 'C-fuji1',
    addressPVM: 'C-fuji1',
  };
  const walletServiceMock = {
    sign: jest.fn(),
  };
  const networkServiceMock = {
    getAvalanceProviderXP: jest.fn(),
    getAvalancheNetworkXP: jest.fn(),
    isMainnet: () => false,
  };
  const accountsServiceMock = {
    getActiveAccount: async () => activeAccountMock,
  };
  const txBytes = new Uint8Array([0, 1, 2]);
  const providerMock = {};
  const txMock = {
    getSigIndices: jest.fn(),
  };
  const signerAddressBytesMock = new Uint8Array([3, 4, 5]);
  const signerAddressMock = { foo: 'bar' };
  const unsignedTxJson = { biz: 'baz' };
  const unsignedTxMock = {
    getSigIndicesForAddress: jest.fn(),
    getSigIndices: jest.fn(),
    toJSON: jest.fn(),
    getInputUtxos: jest.fn(),
    getTx: () => ({
      foo: 'bar',
    }),
  };
  const codecManagerMock = {
    unpack: jest.fn(),
  };
  const utxosMock = [{ utxoId: '1' }, { utxoId: '2' }];

  beforeAll(() => {
    process.env = {
      ...env,
      GLACIER_URL: 'https://glacierurl.example',
      GLACIER_API_KEY: 'apiKey',
    };
  });

  afterAll(() => {
    process.env = env;
  });

  beforeEach(() => {
    (Avalanche.getVmByChainAlias as jest.Mock).mockReturnValue(AVM);
    (utils.hexToBuffer as jest.Mock).mockReturnValue(txBytes);
    networkServiceMock.getAvalanceProviderXP.mockReturnValue(providerMock);
    networkServiceMock.getAvalancheNetworkXP.mockReturnValueOnce(
      AVALANCHE_XP_TEST_NETWORK,
    );
    (utils.unpackWithManager as jest.Mock).mockReturnValue(txMock);
    (utils.addressesFromBytes as jest.Mock).mockReturnValue([
      signerAddressMock,
    ]);
    (utils.parse as jest.Mock).mockReturnValue([
      undefined,
      undefined,
      signerAddressBytesMock,
    ]);
    (utils.getManagerForVM as jest.Mock).mockReturnValue(codecManagerMock);
    txMock.getSigIndices.mockReturnValue([]);
    unsignedTxMock.toJSON.mockReturnValue(unsignedTxJson);
    jest.mocked(openApprovalWindow).mockResolvedValue({} as any);
    (Avalanche.getUtxosByTxFromGlacier as jest.Mock).mockReturnValue(utxosMock);
    (getProvidedUtxos as jest.Mock).mockReturnValue(utxosMock);
  });

  describe('handleUnauthenticated', () => {
    it('returns error for unauthorized requests', async () => {
      const handler = new AvalancheSignTransactionHandler(
        {} as any,
        {} as any,
        { getActiveAccount: async () => undefined } as any,
      );
      const result = await handler.handleUnauthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.provider.unauthorized(),
      });
    });
  });

  describe('handleAuthenticated', () => {
    it('returns error if transactionHex was not provided', async () => {
      const { params, ...requestWithoutParam } = request;
      const handler = new AvalancheSignTransactionHandler(
        {} as any,
        {} as any,
        accountsServiceMock as any,
      );
      const result = await handler.handleAuthenticated(
        buildRpcCall(requestWithoutParam),
      );

      expect(result).toEqual({
        ...requestWithoutParam,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing mandatory param(s)',
        }),
      });
    });

    it('returns error if chainAlias was not provided', async () => {
      const { params, ...requestWithoutParam } = request;
      const requestWithoutChainAlias = {
        ...requestWithoutParam,
        params: { transactionHex: params.transactionHex },
      };
      const handler = new AvalancheSignTransactionHandler(
        {} as any,
        {} as any,
        {} as any,
      );
      const result = await handler.handleAuthenticated(
        buildRpcCall(requestWithoutChainAlias),
      );

      expect(result).toEqual({
        ...requestWithoutChainAlias,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing mandatory param(s)',
        }),
      });
    });

    it('returns error if there is no active account', async () => {
      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        { getActiveAccount: async () => undefined } as any,
      );

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias,
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex,
      );
    });

    it('returns error if signer address is missing', async () => {
      (getProvidedUtxos as jest.Mock).mockReturnValue([]);

      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any,
      );

      (utils.addressesFromBytes as jest.Mock).mockReturnValue([]);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Missing signer address',
        }),
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias,
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex,
      );
      expect(Avalanche.getUtxosByTxFromGlacier).toHaveBeenCalledWith({
        transactionHex: request.params.transactionHex,
        chainAlias: request.params.chainAlias,
        network: 'fuji',
        url: process.env.GLACIER_URL,
        token: process.env.GLACIER_API_KEY,
        headers: HEADERS,
      });
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
        tx: txMock,
        provider: providerMock,
        credentials: [],
        utxos: utxosMock,
      });
      expect(utils.addressesFromBytes).toHaveBeenCalledWith([
        signerAddressBytesMock,
      ]);
    });

    it('returns error if there are no signature indices for the account', async () => {
      (getProvidedUtxos as jest.Mock).mockReturnValue([]);

      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any,
      );

      unsignedTxMock.getSigIndicesForAddress.mockReturnValue(undefined);
      (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
        unsignedTxMock,
      );

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'This account has nothing to sign',
        }),
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias,
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex,
      );
      expect(Avalanche.getUtxosByTxFromGlacier).toHaveBeenCalledWith({
        transactionHex: request.params.transactionHex,
        chainAlias: request.params.chainAlias,
        network: 'fuji',
        url: process.env.GLACIER_URL,
        token: process.env.GLACIER_API_KEY,
        headers: HEADERS,
      });
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
        tx: txMock,
        provider: providerMock,
        credentials: [],
        utxos: utxosMock,
      });
      expect(utils.addressesFromBytes).toHaveBeenCalledWith([
        signerAddressBytesMock,
      ]);
      expect(utils.parse).toHaveBeenCalledWith(activeAccountMock.addressAVM);
      expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
        signerAddressMock,
      );
    });

    it('returns error if there are no valid signature indices for the account', async () => {
      (getProvidedUtxos as jest.Mock).mockReturnValue([]);

      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any,
      );

      unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([]);
      unsignedTxMock.getSigIndices.mockReturnValueOnce([]);
      (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
        unsignedTxMock,
      );

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'This account has nothing to sign',
        }),
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias,
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex,
      );
      expect(Avalanche.getUtxosByTxFromGlacier).toHaveBeenCalledWith({
        transactionHex: request.params.transactionHex,
        chainAlias: request.params.chainAlias,
        network: 'fuji',
        url: process.env.GLACIER_URL,
        token: process.env.GLACIER_API_KEY,
        headers: HEADERS,
      });
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
        tx: txMock,
        provider: providerMock,
        credentials: [],
        utxos: utxosMock,
      });
      expect(utils.addressesFromBytes).toHaveBeenCalledWith([
        signerAddressBytesMock,
      ]);
      expect(utils.parse).toHaveBeenCalledWith(activeAccountMock.addressAVM);
      expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
        signerAddressMock,
      );
      expect(unsignedTxMock.getSigIndices).toHaveBeenCalled();
    });

    it('returns error if it fails to parse the transaction', async () => {
      (getProvidedUtxos as jest.Mock).mockReturnValue([]);

      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any,
      );

      unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([[0, 1]]);
      unsignedTxMock.getSigIndices.mockReturnValueOnce([[1, 2]]);
      (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
        unsignedTxMock,
      );
      (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
        type: 'unknown',
      });

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Unable to parse transaction data. Unsupported tx type',
        }),
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias,
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex,
      );
      expect(Avalanche.getUtxosByTxFromGlacier).toHaveBeenCalledWith({
        transactionHex: request.params.transactionHex,
        chainAlias: request.params.chainAlias,
        network: 'fuji',
        url: process.env.GLACIER_URL,
        token: process.env.GLACIER_API_KEY,
        headers: HEADERS,
      });
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
        tx: txMock,
        provider: providerMock,
        credentials: [],
        utxos: utxosMock,
      });
      expect(utils.addressesFromBytes).toHaveBeenCalledWith([
        signerAddressBytesMock,
      ]);
      expect(utils.parse).toHaveBeenCalledWith(activeAccountMock.addressAVM);
      expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
        signerAddressMock,
      );
      expect(unsignedTxMock.getSigIndices).toHaveBeenCalled();
      expect(Avalanche.parseAvalancheTx).toHaveBeenCalledWith(
        unsignedTxMock,
        providerMock,
        activeAccountMock.addressAVM,
      );
    });

    describe('approval window and deferred response', () => {
      it('works with EVM export transactions', async () => {
        const requestMock = {
          id: '123',
          method: DAppProviderRequest.AVALANCHE_SIGN_TRANSACTION,
          params: { transactionHex: '0x00001', chainAlias: 'C' },
          site: {
            tabId: 1,
          } as any,
        };

        const evmExportTxMock = {
          ins: [{ address: { toHex: () => '0x123' } }],
        };

        jest
          .mocked(utils.unpackWithManager)
          .mockReturnValueOnce(evmExportTxMock as any);

        jest.mocked(evmSerial.isExportTx).mockReturnValueOnce(true);
        (getProvidedUtxos as jest.Mock).mockReturnValue([]);

        (Avalanche.getVmByChainAlias as jest.Mock).mockReturnValueOnce(EVM);
        (Avalanche.getUtxosByTxFromGlacier as jest.Mock).mockReturnValueOnce(
          [],
        );
        (Avalanche.createAvalancheEvmUnsignedTx as jest.Mock).mockReturnValue(
          unsignedTxMock,
        );

        unsignedTxMock.getSigIndices.mockReturnValueOnce([[0, 0]]);
        unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([[0, 0]]);

        (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
          type: 'export',
        });

        const handler = new AvalancheSignTransactionHandler(
          walletServiceMock as any,
          networkServiceMock as any,
          accountsServiceMock as any,
        );

        const result = await handler.handleAuthenticated(
          buildRpcCall(requestMock),
        );

        expect(result).toEqual({
          ...requestMock,
          result: DEFERRED_RESPONSE,
        });
        expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
          requestMock.params.chainAlias,
        );
        expect(utils.hexToBuffer).toHaveBeenCalledWith(
          requestMock.params.transactionHex,
        );
        expect(Avalanche.createAvalancheEvmUnsignedTx).toHaveBeenCalledWith({
          txBytes,
          vm: EVM,
          utxos: [],
          fromAddress: activeAccountMock.addressCoreEth,
        });
        expect(utils.parse).toHaveBeenCalledWith(
          activeAccountMock.addressCoreEth,
        );
        expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
          signerAddressMock,
        );
        expect(unsignedTxMock.getSigIndices).toHaveBeenCalled();
        expect(Avalanche.parseAvalancheTx).toHaveBeenCalledWith(
          unsignedTxMock,
          providerMock,
          activeAccountMock.addressCoreEth,
        );

        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            ...requestMock,
            displayData: {
              unsignedTxJson: JSON.stringify(unsignedTxJson),
              txData: {
                type: 'export',
              },
              ownSignatureIndices: [[0, 0]],
              vm: EVM,
            },
          }),
          'approve/avalancheSignTx',
        );
      });

      describe('unsinged tx', () => {
        const checkExpected = (req, result) => {
          expect(result).toEqual({
            ...req,
            result: DEFERRED_RESPONSE,
          });

          expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
            req.params.chainAlias,
          );
          expect(utils.hexToBuffer).toHaveBeenCalledWith(
            req.params.transactionHex,
          );
          expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledTimes(1);
          expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
            tx: txMock,
            provider: providerMock,
            credentials: [
              (Credential as unknown as jest.Mock).mock.instances[0],
              (Credential as unknown as jest.Mock).mock.instances[1],
            ],
            utxos: utxosMock,
          });
          expect(utils.addressesFromBytes).toHaveBeenCalledWith([
            signerAddressBytesMock,
          ]);
          expect(utils.parse).toHaveBeenCalledWith(
            activeAccountMock.addressAVM,
          );
          expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
            signerAddressMock,
          );
          expect(unsignedTxMock.getSigIndices).toHaveBeenCalled();
          expect(Avalanche.parseAvalancheTx).toHaveBeenCalledWith(
            unsignedTxMock,
            providerMock,
            activeAccountMock.addressAVM,
          );

          expect(openApprovalWindow).toHaveBeenCalledWith(
            expect.objectContaining({
              ...req,
              displayData: {
                unsignedTxJson: JSON.stringify(unsignedTxJson),
                txData: {
                  type: 'import',
                },
                ownSignatureIndices: [[0, 1]],
                vm: 'AVM',
              },
            }),
            'approve/avalancheSignTx',
          );
        };

        it('works with provided UTXOs', async () => {
          const handler = new AvalancheSignTransactionHandler(
            walletServiceMock as any,
            networkServiceMock as any,
            accountsServiceMock as any,
          );

          txMock.getSigIndices.mockReturnValueOnce([
            [0, 1],
            [1, 1],
          ]);
          codecManagerMock.unpack.mockReturnValueOnce(new Error('some error'));
          unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([[0, 1]]);
          unsignedTxMock.getSigIndices.mockReturnValueOnce([[1, 2]]);
          (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
            unsignedTxMock,
          );
          (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
            type: 'import',
          });

          const result = await handler.handleAuthenticated(
            buildRpcCall(requestWithUtxos),
          );

          checkExpected(requestWithUtxos, result);
          expect(Avalanche.getUtxosByTxFromGlacier).not.toHaveBeenCalled();
        });

        it('works without provided UTXOs', async () => {
          (getProvidedUtxos as jest.Mock).mockReturnValue([]);

          const handler = new AvalancheSignTransactionHandler(
            walletServiceMock as any,
            networkServiceMock as any,
            accountsServiceMock as any,
          );

          txMock.getSigIndices.mockReturnValueOnce([
            [0, 1],
            [1, 1],
          ]);
          codecManagerMock.unpack.mockReturnValueOnce(new Error('some error'));
          unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([[0, 1]]);
          unsignedTxMock.getSigIndices.mockReturnValueOnce([[1, 2]]);
          (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
            unsignedTxMock,
          );
          (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
            type: 'import',
          });

          const result = await handler.handleAuthenticated(
            buildRpcCall(request),
          );

          checkExpected(request, result);
          expect(Avalanche.getUtxosByTxFromGlacier).toHaveBeenCalledWith({
            transactionHex: request.params.transactionHex,
            chainAlias: request.params.chainAlias,
            network: 'fuji',
            url: process.env.GLACIER_URL,
            token: process.env.GLACIER_API_KEY,
            headers: HEADERS,
          });
        });
      });

      describe('(partially) signed tx', () => {
        const checkExpected = (req, result, signaturesMock) => {
          expect(result).toEqual({
            ...req,
            result: DEFERRED_RESPONSE,
          });

          expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
            req.params.chainAlias,
          );
          expect(utils.hexToBuffer).toHaveBeenCalledWith(
            req.params.transactionHex,
          );

          expect(Credential).toHaveBeenCalledTimes(2);
          expect(Credential).toHaveBeenNthCalledWith(1, signaturesMock[0]);
          expect(Credential).toHaveBeenNthCalledWith(2, signaturesMock[1]);

          expect(Avalanche.populateCredential).toHaveBeenCalledTimes(2);
          expect(Avalanche.populateCredential).toHaveBeenNthCalledWith(
            1,
            [0, 1],
            {
              unsignedTx: unsignedTxMock,
              credentialIndex: 0,
            },
          );
          expect(Avalanche.populateCredential).toHaveBeenNthCalledWith(
            2,
            [1, 1],
            {
              unsignedTx: unsignedTxMock,
              credentialIndex: 1,
            },
          );
          expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledTimes(2);
          expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenNthCalledWith(
            1,
            {
              tx: txMock,
              provider: providerMock,
              credentials: [{ biz: 'baz' }, { baz: 'biz' }],
              utxos: utxosMock,
            },
          );
          expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenNthCalledWith(
            2,
            {
              tx: txMock,
              provider: providerMock,
              credentials: [
                (Credential as unknown as jest.Mock).mock.instances[0],
                (Credential as unknown as jest.Mock).mock.instances[1],
              ],
              utxos: utxosMock,
            },
          );
          expect(utils.addressesFromBytes).toHaveBeenCalledWith([
            signerAddressBytesMock,
          ]);
          expect(utils.parse).toHaveBeenCalledWith(
            activeAccountMock.addressAVM,
          );
          expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
            signerAddressMock,
          );
          expect(unsignedTxMock.getSigIndices).toHaveBeenCalled();
          expect(Avalanche.parseAvalancheTx).toHaveBeenCalledWith(
            unsignedTxMock,
            providerMock,
            activeAccountMock.addressAVM,
          );

          expect(openApprovalWindow).toHaveBeenCalledWith(
            expect.objectContaining({
              ...req,
              displayData: {
                unsignedTxJson: JSON.stringify(unsignedTxJson),
                txData: {
                  type: 'import',
                },
                ownSignatureIndices: [[0, 1]],
                vm: 'AVM',
              },
            }),
            'approve/avalancheSignTx',
          );
        };

        it('works with provided UTXOs', async () => {
          const signedTxMock = {
            getCredentials: () =>
              [{ biz: 'baz' }, { baz: 'biz' }] as unknown as Credential[],
          };

          const signaturesMock = [
            [{ _type: 'signature' }],
            [{ _type: 'signature' }, { _type: 'signature' }],
          ];

          const handler = new AvalancheSignTransactionHandler(
            walletServiceMock as any,
            networkServiceMock as any,
            accountsServiceMock as any,
          );

          txMock.getSigIndices.mockReturnValueOnce([
            [0, 1],
            [1, 1],
          ]);
          codecManagerMock.unpack.mockReturnValueOnce(signedTxMock);
          unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([[0, 1]]);
          unsignedTxMock.getSigIndices.mockReturnValueOnce([
            [1, 2],
            [1, 0],
          ]);
          (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
            unsignedTxMock,
          );
          (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
            type: 'import',
          });
          (Avalanche.populateCredential as jest.Mock)
            .mockReturnValueOnce(signaturesMock[0])
            .mockReturnValueOnce(signaturesMock[1]);

          const result = await handler.handleAuthenticated(
            buildRpcCall(requestWithUtxos),
          );

          checkExpected(requestWithUtxos, result, signaturesMock);
          expect(Avalanche.getUtxosByTxFromGlacier).not.toHaveBeenCalled();
        });

        it('works without provided UTXOs', async () => {
          (getProvidedUtxos as jest.Mock).mockReturnValue([]);

          const signedTxMock = {
            getCredentials: () =>
              [{ biz: 'baz' }, { baz: 'biz' }] as unknown as Credential[],
          };

          const signaturesMock = [
            [{ _type: 'signature' }],
            [{ _type: 'signature' }, { _type: 'signature' }],
          ];

          const handler = new AvalancheSignTransactionHandler(
            walletServiceMock as any,
            networkServiceMock as any,
            accountsServiceMock as any,
          );

          txMock.getSigIndices.mockReturnValueOnce([
            [0, 1],
            [1, 1],
          ]);
          codecManagerMock.unpack.mockReturnValueOnce(signedTxMock);
          unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([[0, 1]]);
          unsignedTxMock.getSigIndices.mockReturnValueOnce([
            [1, 2],
            [1, 0],
          ]);
          (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
            unsignedTxMock,
          );
          (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
            type: 'import',
          });
          (Avalanche.populateCredential as jest.Mock)
            .mockReturnValueOnce(signaturesMock[0])
            .mockReturnValueOnce(signaturesMock[1]);

          const result = await handler.handleAuthenticated(
            buildRpcCall(request),
          );

          checkExpected(request, result, signaturesMock);
          expect(Avalanche.getUtxosByTxFromGlacier).toHaveBeenCalledWith({
            transactionHex: request.params.transactionHex,
            chainAlias: request.params.chainAlias,
            network: 'fuji',
            url: process.env.GLACIER_URL,
            token: process.env.GLACIER_API_KEY,
            headers: HEADERS,
          });
        });
      });
    });
  });

  describe('onActionApproved', () => {
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();
    const pendingActionMock = {
      displayData: {
        ownSignatureIndices: [[0, 2]],
        unsignedTxJson,
      },
      params: {},
    } as unknown as Action;

    const signedTransactionJsonMock = JSON.stringify({ signed: true });

    const mockedTx = {
      getSigIndices: jest.fn(() => [[0, 2]]),
    };

    const signedTxMock = {
      ...mockedTx,
      getCredentials: jest.fn(() => [
        {
          toJSON: () => [
            {
              sig: '0x3463463645',
              toString: () => '0x3463463645', // other owner's
            },
            {
              sig: '0x0',
              toString: () => '0x0', // placeholder to fill the gap
            },
            {
              sig: '0x1231241242',
              toString: () => '0x1231241242', // our signature
            },
          ],
        },
      ]),
      getTx: jest.fn(() => mockedTx),
    };

    const signedTxInstanceMock = jest.fn();
    const signedTransactionHex = '0x9999999';

    it('returns error if own signatures are missing', async () => {
      mockedTx.getSigIndices.mockReturnValueOnce([[0, 3]]);
      walletServiceMock.sign.mockReturnValueOnce({
        signedTx: signedTransactionJsonMock,
      });
      (UnsignedTx.fromJSON as jest.Mock)
        .mockReturnValueOnce(mockedTx)
        .mockReturnValueOnce(signedTxMock);
      (avaxSerial.SignedTx as unknown as jest.Mock) = signedTxInstanceMock;
      (Avalanche.signedTxToHex as jest.Mock).mockReturnValueOnce(
        signedTransactionHex,
      );

      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any,
      );

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId,
      );

      expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to sign [0, 3]',
        }),
      );
    });

    it('returns error if own signatures are empty', async () => {
      signedTxMock.getCredentials.mockReturnValueOnce([
        {
          toJSON: () => [
            {
              sig: '0x3463463645',
              toString: () => '0x3463463645', // other owner's
            },
            {
              sig: '0x0',
              toString: () => '0x0', // placeholder to fill the gap
            },
            {
              sig: '0x0',
              toString: () => '0x0', // our empty signature
            },
          ],
        },
      ]);

      (utils.bufferToHex as jest.Mock).mockReturnValueOnce('0x0');
      walletServiceMock.sign.mockReturnValueOnce({
        signedTx: signedTransactionJsonMock,
      });
      (UnsignedTx.fromJSON as jest.Mock)
        .mockReturnValueOnce(mockedTx)
        .mockReturnValueOnce(signedTxMock);
      (avaxSerial.SignedTx as unknown as jest.Mock) = signedTxInstanceMock;
      (Avalanche.signedTxToHex as jest.Mock).mockReturnValueOnce(
        signedTransactionHex,
      );
      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any,
      );

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId,
      );

      expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to sign [0, 2]',
        }),
      );
    });

    it('returns the correct (partially) signed transaction details', async () => {
      walletServiceMock.sign.mockReturnValueOnce({
        signedTx: signedTransactionJsonMock,
      });
      (UnsignedTx.fromJSON as jest.Mock)
        .mockReturnValueOnce(mockedTx)
        .mockReturnValueOnce(signedTxMock);
      (avaxSerial.SignedTx as unknown as jest.Mock) = signedTxInstanceMock;
      (Avalanche.signedTxToHex as jest.Mock).mockReturnValueOnce(
        signedTransactionHex,
      );

      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any,
      );

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId,
      );

      expect(onSuccessMock).toHaveBeenCalledWith({
        signedTransactionHex,
        signatures: [
          {
            signature: '0x1231241242',
            sigIndices: [0, 2],
          },
        ],
      });

      expect(UnsignedTx.fromJSON).toHaveBeenCalledTimes(2);
      expect(UnsignedTx.fromJSON).toHaveBeenNthCalledWith(1, unsignedTxJson);
      expect(UnsignedTx.fromJSON).toHaveBeenNthCalledWith(
        2,
        signedTransactionJsonMock,
      );

      expect(walletServiceMock.sign).toHaveBeenCalledWith(
        {
          tx: mockedTx,
        },
        AVALANCHE_XP_TEST_NETWORK,
        frontendTabId,
      );
      expect(signedTxMock.getCredentials).toHaveBeenCalled();
      expect(mockedTx.getSigIndices).toHaveBeenCalled();
      expect(Credential).toHaveBeenCalledWith([
        expect.objectContaining({
          sig: '0x3463463645',
        }),
        expect.objectContaining({
          sig: '0x1231241242',
        }),
      ]);
      expect(avaxSerial.SignedTx).toHaveBeenCalledWith(mockedTx, [
        (Credential as unknown as jest.Mock).mock.instances[0],
      ]);
    });
  });
});
