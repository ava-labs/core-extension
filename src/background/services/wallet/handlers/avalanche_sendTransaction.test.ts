import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { AvalancheSendTransactionHandler } from './avalanche_sendTransaction';
import {
  UnsignedTx,
  EVMUnsignedTx,
  AVM,
  utils,
  EVM,
} from '@avalabs/avalanchejs-v2';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';
import { Avalanche } from '@avalabs/wallets-sdk';

jest.mock('@avalabs/avalanchejs-v2');
jest.mock('@avalabs/wallets-sdk');

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
    addressPVM: 'C-fuji1',
  };
  const walletServiceMock = {
    sign: signMock,
    getAddressesByIndices: getAddressesByIndicesMock,
  };
  const networkServiceMock = {
    getAvalanceProviderXP: getAvalanceProviderXPMock,
    getAvalancheNetworkXP: getAvalancheNetworkXPMock,
    isMainnet: () => false,
  };
  const accountsServiceMock = {};
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
  });

  describe('handleUnauthenticated', () => {
    it('returns error for unauthorized requests', async () => {
      const handler = new AvalancheSendTransactionHandler(
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
      const handler = new AvalancheSendTransactionHandler(
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
      const handler = new AvalancheSendTransactionHandler(
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
      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
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

      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );
      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Unable to parse transaction data. Unsupported tx type',
        }),
      });
    });

    it('X/P: opens the approval window and returns deferred response', async () => {
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
      (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValueOnce(
        unsignedTxMock
      );

      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );
      const result = await handler.handleAuthenticated(request);

      expect(openApprovalWindowSpy).toHaveBeenCalledWith(
        {
          ...request,
          tabId: request.site.tabId,
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
        ...request,
        result: DEFERRED_RESPONSE,
      });

      expect(Avalanche.getUtxosByTxFromGlacier).toHaveBeenCalledWith({
        transactionHex: request.params.transactionHex,
        chainAlias: request.params.chainAlias,
        isTestnet: true,
        url: process.env.GLACIER_URL,
        token: process.env.GLACIER_API_KEY,
      });

      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
        tx,
        utxos: utxosMock,
        provider: providerMock,
        fromAddressBytes: [new Uint8Array([0, 1, 2])],
      });
    });

    it('C: opens the approval window and returns deferred response', async () => {
      (Avalanche.getVmByChainAlias as jest.Mock).mockReturnValue(EVM);
      (utils.hexToBuffer as jest.Mock).mockReturnValueOnce(
        new Uint8Array([0, 1, 2])
      );
      getAddressesByIndicesMock.mockResolvedValue([]);
      (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
        type: 'import',
      });
      (Avalanche.createAvalancheEvmUnsignedTx as jest.Mock).mockReturnValueOnce(
        unsignedTxMock
      );

      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );
      const result = await handler.handleAuthenticated(request);

      expect(openApprovalWindowSpy).toHaveBeenCalledWith(
        {
          ...request,
          tabId: request.site.tabId,
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
        ...request,
        result: DEFERRED_RESPONSE,
      });

      expect(Avalanche.getUtxosByTxFromGlacier).toHaveBeenCalledWith({
        transactionHex: request.params.transactionHex,
        chainAlias: request.params.chainAlias,
        isTestnet: true,
        url: process.env.GLACIER_URL,
        token: process.env.GLACIER_API_KEY,
      });

      expect(Avalanche.createAvalancheEvmUnsignedTx).toHaveBeenCalledWith({
        txBytes: new Uint8Array([0, 1, 2]),
        utxos: utxosMock,
        vm: EVM,
        fromAddress: activeAccountMock.addressCoreEth,
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
      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

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
    });

    it('returns error when signing fails', async () => {
      const error = new Error('some error');
      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      signMock.mockRejectedValueOnce(error);

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId
      );

      expect(onErrorMock).toHaveBeenCalledWith(error);
    });

    it('returns error when signatures are missing', async () => {
      hasAllSignaturesMock.mockReturnValueOnce(false);

      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

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

      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

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
    });

    it('signs transactions correctly on X/P', async () => {
      const signedTxHex = '0x000142';
      hasAllSignaturesMock.mockReturnValueOnce(true);
      (Avalanche.signedTxToHex as jest.Mock).mockReturnValueOnce(signedTxHex);

      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

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
    });

    it('signs transactions correctly on X/P with multiple addresses', async () => {
      const signedTxHex = '0x000142';
      hasAllSignaturesMock.mockReturnValueOnce(true);
      (Avalanche.signedTxToHex as jest.Mock).mockReturnValueOnce(signedTxHex);

      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

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
    });
  });
});
