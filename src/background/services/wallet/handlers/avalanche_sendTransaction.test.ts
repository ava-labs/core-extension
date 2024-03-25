import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { AvalancheSendTransactionHandler } from './avalanche_sendTransaction';
import {
  UnsignedTx,
  EVMUnsignedTx,
  AVM,
  utils,
  EVM,
} from '@avalabs/avalanchejs';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';
import { Avalanche } from '@avalabs/wallets-sdk';
import getProvidedUtxos from '../utils/getProvidedUtxos';
import { ChainId } from '@avalabs/chains-sdk';
import { encryptAnalyticsData } from '../../analytics/utils/encryptAnalyticsData';

jest.mock('@avalabs/avalanchejs');
jest.mock('@avalabs/wallets-sdk');
jest.mock('../utils/getProvidedUtxos');
jest.mock('../../analytics/utils/encryptAnalyticsData');

describe('src/background/services/wallet/handlers/avalanche_sendTransaction.ts', () => {
  const env = process.env;
  const request = {
    id: '123',
    method: DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
    params: { transactionHex: '0x00001', chainAlias: 'X' },
    site: {
      tabId: 1,
    },
  };
  const requestWithUtxos = {
    ...request,
    params: {
      ...request.params,
      utxos: ['0x1', '0x2'],
    },
  };

  const frontendTabId = 951;
  const txBytes = new Uint8Array([0, 1, 2]);

  const openApprovalWindowSpy = jest.spyOn(
    DAppRequestHandler.prototype,
    'openApprovalWindow'
  );
  const getAvalanceProviderXPMock = jest.fn();
  const getAvalancheNetworkXPMock = jest.fn();
  const signMock = jest.fn();
  const issueTxHexMock = jest.fn();
  const getAddressesMock = jest.fn();
  const onSuccessMock = jest.fn();
  const onErrorMock = jest.fn();
  const getAddressesByIndicesMock = jest.fn();
  const hasAllSignaturesMock = jest.fn();

  const activeAccountMock = {
    addressAVM: 'X-fuji1',
    addressCoreEth: 'C-fuji1',
    addressPVM: 'P-fuji1',
    addressC: 'c-chain-address',
  };
  const walletServiceMock = {
    sign: signMock,
    getAddressesByIndices: getAddressesByIndicesMock,
  } as any;
  const networkServiceMock = {
    getAvalanceProviderXP: getAvalanceProviderXPMock,
    getAvalancheNetworkXP: getAvalancheNetworkXPMock,
    isMainnet: jest.fn(),
  } as any;
  const accountsServiceMock = {} as any;
  const analyticsServicePosthogMock = {
    captureEncryptedEvent: jest.fn(),
  } as any;

  const unsignedTxJson = { foo: 'bar' };
  const unsignedTxMock = {
    addressMaps: {
      getAddresses: getAddressesMock,
    },
    hasAllSignatures: hasAllSignaturesMock,
    toJSON: () => unsignedTxJson,
    getSignedTx: () => 'signedTx',
    getTx: () => ({
      foo: 'bar',
    }),
  };
  const providerMock = {
    issueTxHex: issueTxHexMock,
  };
  const utxosMock = [{ utxoId: '1' }, { utxoId: '2' }];

  let handler: AvalancheSendTransactionHandler;

  const mockedEncryptResult = {
    data: 'testData',
    enc: 'testEnc',
    keyID: 'testKeyId',
  };

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
    jest.resetAllMocks();

    (UnsignedTx.fromJSON as jest.Mock).mockReturnValue(unsignedTxMock);
    (EVMUnsignedTx.fromJSON as jest.Mock).mockReturnValue(unsignedTxMock);
    signMock.mockReturnValue({ signedTx: 'baz' });
    getAvalancheNetworkXPMock.mockReturnValue('network');
    issueTxHexMock.mockResolvedValue({ txID: 1 });
    getAvalanceProviderXPMock.mockResolvedValue(providerMock);
    getAddressesMock.mockReturnValue([]);
    openApprovalWindowSpy.mockResolvedValue(undefined);
    (accountsServiceMock as any).activeAccount = activeAccountMock;
    (Avalanche.getVmByChainAlias as jest.Mock).mockReturnValue(AVM);
    (Avalanche.getUtxosByTxFromGlacier as jest.Mock).mockReturnValue(utxosMock);
    (utils.hexToBuffer as jest.Mock).mockReturnValue(txBytes);
    (getProvidedUtxos as jest.Mock).mockReturnValue(utxosMock);
    handler = new AvalancheSendTransactionHandler(
      walletServiceMock,
      networkServiceMock,
      accountsServiceMock,
      analyticsServicePosthogMock
    );
    (encryptAnalyticsData as jest.Mock).mockResolvedValue(mockedEncryptResult);
    networkServiceMock.isMainnet.mockReturnValue(false);
  });

  describe('handleUnauthenticated', () => {
    it('returns error for unauthorized requests', async () => {
      handler = new AvalancheSendTransactionHandler(
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      const result = await handler.handleUnauthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.provider.unauthorized(),
      });
    });
  });

  describe('handleAuthenticated', () => {
    it('returns error if transactionHex was not provided', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { params, ...requestWithoutParam } = request;
      handler = new AvalancheSendTransactionHandler(
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      const result = await handler.handleAuthenticated(requestWithoutParam);

      expect(result).toEqual({
        ...requestWithoutParam,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing mandatory param(s)',
        }),
      });
    });

    it('returns error if chainAlias was not provided', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { params, ...requestWithoutParam } = request;
      const requestWithoutChainAlias = {
        ...requestWithoutParam,
        params: { transactionHex: params.transactionHex },
      };
      handler = new AvalancheSendTransactionHandler(
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      const result = await handler.handleAuthenticated(
        requestWithoutChainAlias
      );

      expect(result).toEqual({
        ...requestWithoutChainAlias,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing mandatory param(s)',
        }),
      });
    });

    it('returns error if there is no active account', async () => {
      handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        {} as any,
        {} as any
      );

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      });
    });

    it('returns error if fails to parse transaction', async () => {
      getAddressesByIndicesMock.mockResolvedValue([]);
      (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
        type: 'unknown',
      });
      (utils.parse as jest.Mock).mockReturnValueOnce([
        undefined,
        undefined,
        new Uint8Array([0, 1, 2]),
      ]);
      (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValueOnce(
        unsignedTxMock
      );

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Unable to parse transaction data. Unsupported tx type',
        }),
      });
    });

    describe('approval window and deferred response', () => {
      describe('for X/P chain', () => {
        const checkExpected = (req, result, tx) => {
          expect(openApprovalWindowSpy).toHaveBeenCalledWith(
            {
              ...req,
              tabId: req.site.tabId,
              displayData: {
                unsignedTxJson: JSON.stringify(unsignedTxJson),
                txData: {
                  type: 'import',
                },
                vm: 'AVM',
              },
            },
            'approve/avalancheSignTx'
          );

          expect(result).toEqual({
            ...req,
            result: DEFERRED_RESPONSE,
          });

          expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
            tx,
            utxos: utxosMock,
            provider: providerMock,
            fromAddressBytes: [new Uint8Array([0, 1, 2])],
          });
        };

        it('works with provided UTXOs', async () => {
          const tx = { vm: AVM };
          (utils.unpackWithManager as jest.Mock).mockReturnValueOnce(tx);
          getAddressesByIndicesMock.mockResolvedValue([]);
          (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
            type: 'import',
          });
          (utils.parse as jest.Mock).mockReturnValueOnce([
            undefined,
            undefined,
            new Uint8Array([0, 1, 2]),
          ]);
          (
            Avalanche.createAvalancheUnsignedTx as jest.Mock
          ).mockReturnValueOnce(unsignedTxMock);

          const result = await handler.handleAuthenticated(requestWithUtxos);

          expect(Avalanche.getUtxosByTxFromGlacier).not.toHaveBeenCalled();
          checkExpected(requestWithUtxos, result, tx);
        });

        it('works without provided UTXOs', async () => {
          const tx = { vm: AVM };
          (utils.unpackWithManager as jest.Mock).mockReturnValueOnce(tx);
          getAddressesByIndicesMock.mockResolvedValue([]);
          (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
            type: 'import',
          });
          (utils.parse as jest.Mock).mockReturnValueOnce([
            undefined,
            undefined,
            new Uint8Array([0, 1, 2]),
          ]);
          (
            Avalanche.createAvalancheUnsignedTx as jest.Mock
          ).mockReturnValueOnce(unsignedTxMock);
          (getProvidedUtxos as jest.Mock).mockReturnValue([]);

          const result = await handler.handleAuthenticated(request);

          expect(Avalanche.getUtxosByTxFromGlacier).toHaveBeenCalledWith({
            transactionHex: request.params.transactionHex,
            chainAlias: request.params.chainAlias,
            isTestnet: true,
            url: process.env.GLACIER_URL,
            token: process.env.GLACIER_API_KEY,
          });
          checkExpected(request, result, tx);
        });
      });

      describe('for C chain', () => {
        const checkExpected = (req, result) => {
          expect(openApprovalWindowSpy).toHaveBeenCalledWith(
            {
              ...req,
              tabId: req.site.tabId,
              displayData: {
                unsignedTxJson: JSON.stringify(unsignedTxJson),
                txData: {
                  type: 'import',
                },
                vm: 'EVM',
              },
            },
            'approve/avalancheSignTx'
          );

          expect(result).toEqual({
            ...req,
            result: DEFERRED_RESPONSE,
          });

          expect(Avalanche.createAvalancheEvmUnsignedTx).toHaveBeenCalledWith({
            txBytes: new Uint8Array([0, 1, 2]),
            utxos: utxosMock,
            vm: EVM,
            fromAddress: activeAccountMock.addressCoreEth,
          });
        };

        it('works with provided UTXOs', async () => {
          (Avalanche.getVmByChainAlias as jest.Mock).mockReturnValue(EVM);
          (utils.hexToBuffer as jest.Mock).mockReturnValueOnce(
            new Uint8Array([0, 1, 2])
          );
          getAddressesByIndicesMock.mockResolvedValue([]);
          (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
            type: 'import',
          });
          (
            Avalanche.createAvalancheEvmUnsignedTx as jest.Mock
          ).mockReturnValueOnce(unsignedTxMock);

          const result = await handler.handleAuthenticated(requestWithUtxos);

          checkExpected(requestWithUtxos, result);
          expect(Avalanche.getUtxosByTxFromGlacier).not.toHaveBeenCalled();
        });

        it('works without provided UTXOs', async () => {
          (Avalanche.getVmByChainAlias as jest.Mock).mockReturnValue(EVM);
          (utils.hexToBuffer as jest.Mock).mockReturnValueOnce(
            new Uint8Array([0, 1, 2])
          );
          getAddressesByIndicesMock.mockResolvedValue([]);
          (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
            type: 'import',
          });
          (
            Avalanche.createAvalancheEvmUnsignedTx as jest.Mock
          ).mockReturnValueOnce(unsignedTxMock);
          (getProvidedUtxos as jest.Mock).mockReturnValue([]);

          const result = await handler.handleAuthenticated(request);

          checkExpected(request, result);
          expect(Avalanche.getUtxosByTxFromGlacier).toHaveBeenCalledWith({
            transactionHex: request.params.transactionHex,
            chainAlias: request.params.chainAlias,
            isTestnet: true,
            url: process.env.GLACIER_URL,
            token: process.env.GLACIER_API_KEY,
          });
        });
      });
    });
  });

  describe('onActionApproved', () => {
    const pendingActionMock = {
      displayData: {
        vm: 'AVM',
        unsignedTxJson,
      },
      params: {},
    } as unknown as Action;

    it('returns error when there are multiple addresses without indices', async () => {
      getAddressesMock.mockReturnValueOnce(['addr1', 'addr2']);

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId
      );

      expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message:
            'Transaction contains multiple addresses, but indices were not provided',
        })
      );

      expect(
        analyticsServicePosthogMock.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'avalanche_sendTransaction_failed',
          properties: {
            address: activeAccountMock.addressAVM,
            chainId: ChainId.AVALANCHE_TEST_XP,
          },
        })
      );
    });

    it('returns error when signing fails', async () => {
      networkServiceMock.isMainnet.mockReturnValue(true);

      const error = new Error('some error');

      signMock.mockRejectedValueOnce(error);

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId
      );

      expect(onErrorMock).toHaveBeenCalledWith(error);

      expect(
        analyticsServicePosthogMock.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'avalanche_sendTransaction_failed',
          properties: {
            address: activeAccountMock.addressAVM,
            chainId: ChainId.AVALANCHE_XP,
          },
        })
      );
    });

    it('returns error when signatures are missing', async () => {
      hasAllSignaturesMock.mockReturnValueOnce(false);

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId
      );

      expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Signing error, missing signatures.',
        })
      );
    });

    it('signs transactions correctly on C', async () => {
      const signedTxHex = '0x000142';
      hasAllSignaturesMock.mockReturnValueOnce(true);
      (Avalanche.signedTxToHex as jest.Mock).mockReturnValueOnce(signedTxHex);

      await handler.onActionApproved(
        {
          ...pendingActionMock,
          displayData: { ...pendingActionMock.displayData, vm: 'EVM' },
        } as unknown as Action,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId
      );

      expect(signMock).toHaveBeenCalledWith(
        {
          tx: unsignedTxMock,
          externalIndices: undefined,
          internalIndices: undefined,
        },
        frontendTabId,
        'network',
        'avalanche_sendTransaction'
      );
      expect(EVMUnsignedTx.fromJSON).toBeCalledWith(
        pendingActionMock.displayData.unsignedTxJson
      );
      expect(Avalanche.signedTxToHex).toHaveBeenCalledWith('signedTx');
      expect(issueTxHexMock).toHaveBeenCalledWith(signedTxHex, 'EVM');
      expect(onSuccessMock).toHaveBeenCalledWith(1);

      expect(
        analyticsServicePosthogMock.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'avalanche_sendTransaction_success',
          properties: {
            address: activeAccountMock.addressC,
            txHash: 1,
            chainId: ChainId.AVALANCHE_TESTNET_ID,
          },
        })
      );
    });

    it('signs transactions correctly on X/P', async () => {
      const signedTxHex = '0x000142';
      hasAllSignaturesMock.mockReturnValueOnce(true);
      (Avalanche.signedTxToHex as jest.Mock).mockReturnValueOnce(signedTxHex);

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId
      );

      expect(signMock).toHaveBeenCalledWith(
        {
          tx: unsignedTxMock,
          externalIndices: undefined,
          internalIndices: undefined,
        },
        frontendTabId,
        'network',
        'avalanche_sendTransaction'
      );
      expect(UnsignedTx.fromJSON).toBeCalledWith(
        pendingActionMock.displayData.unsignedTxJson
      );
      expect(Avalanche.signedTxToHex).toHaveBeenCalledWith('signedTx');
      expect(issueTxHexMock).toHaveBeenCalledWith(signedTxHex, 'AVM');
      expect(onSuccessMock).toHaveBeenCalledWith(1);

      expect(
        analyticsServicePosthogMock.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'avalanche_sendTransaction_success',
          properties: {
            address: activeAccountMock.addressAVM,
            txHash: 1,
            chainId: ChainId.AVALANCHE_TEST_XP,
          },
        })
      );
    });

    it('signs transactions correctly on X/P with multiple addresses', async () => {
      const signedTxHex = '0x000142';
      hasAllSignaturesMock.mockReturnValueOnce(true);
      (Avalanche.signedTxToHex as jest.Mock).mockReturnValueOnce(signedTxHex);

      getAddressesMock.mockReturnValueOnce(['addr1', 'addr2']);

      await handler.onActionApproved(
        {
          ...pendingActionMock,
          params: { externalIndices: [0, 1], internalIndices: [2, 3] },
        } as unknown as Action,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId
      );

      expect(signMock).toHaveBeenCalledWith(
        {
          tx: unsignedTxMock,
          externalIndices: [0, 1],
          internalIndices: [2, 3],
        },
        frontendTabId,
        'network',
        'avalanche_sendTransaction'
      );
      expect(UnsignedTx.fromJSON).toBeCalledWith(
        pendingActionMock.displayData.unsignedTxJson
      );
      expect(Avalanche.signedTxToHex).toHaveBeenCalledWith('signedTx');
      expect(issueTxHexMock).toHaveBeenCalledWith(signedTxHex, 'AVM');
      expect(onSuccessMock).toHaveBeenCalledWith(1);

      expect(
        analyticsServicePosthogMock.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'avalanche_sendTransaction_success',
          properties: {
            address: activeAccountMock.addressAVM,
            txHash: 1,
            chainId: ChainId.AVALANCHE_TEST_XP,
          },
        })
      );
    });
  });
});
