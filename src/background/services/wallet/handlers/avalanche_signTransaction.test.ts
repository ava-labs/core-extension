import {
  AVM,
  utils,
  Credential,
  UnsignedTx,
  avaxSerial,
} from '@avalabs/avalanchejs-v2';
import { Avalanche } from '@avalabs/wallets-sdk';
import { ethErrors } from 'eth-rpc-errors';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AvalancheSignTransactionHandler } from './avalanche_signTransaction';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { Action } from '../../actions/models';

jest.mock('@avalabs/avalanchejs-v2');
jest.mock('@avalabs/wallets-sdk');

describe('src/background/services/wallet/handlers/avalanche_signTransaction', () => {
  const openApprovalWindowSpy = jest.spyOn(
    DAppRequestHandler.prototype,
    'openApprovalWindow'
  );
  const frontendTabId = 951;
  const request = {
    id: '123',
    method: DAppProviderRequest.AVALANCHE_SIGN_TRANSACTION,
    params: { transactionHex: '0x00001', chainAlias: 'X' },
    site: {
      tabId: 1,
    },
  };
  const activeAccountMock = {
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
  };
  const accountsServiceMock = {
    activeAccount: activeAccountMock,
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

  beforeEach(() => {
    (Avalanche.getVmByChainAlias as jest.Mock).mockReturnValue(AVM);
    (utils.hexToBuffer as jest.Mock).mockReturnValue(txBytes);
    networkServiceMock.getAvalanceProviderXP.mockReturnValue(providerMock);
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
    openApprovalWindowSpy.mockResolvedValue(undefined);
  });

  describe('handleUnauthenticated', () => {
    it('returns error for unauthorized requests', async () => {
      const handler = new AvalancheSignTransactionHandler(
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
      const handler = new AvalancheSignTransactionHandler(
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
      const handler = new AvalancheSignTransactionHandler(
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
      const handler = new AvalancheSignTransactionHandler(
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

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex
      );
    });

    it('returns error if signer address is missing', async () => {
      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      (utils.addressesFromBytes as jest.Mock).mockReturnValue([]);

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Missing signer address',
        }),
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex
      );
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
        tx: txMock,
        vm: AVM,
        provider: providerMock,
        credentials: [],
        utxos: undefined,
      });
      expect(utils.addressesFromBytes).toHaveBeenCalledWith([
        signerAddressBytesMock,
      ]);
    });

    it('returns error if there are no signature indices for the account', async () => {
      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      unsignedTxMock.getSigIndicesForAddress.mockReturnValue(undefined);
      (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
        unsignedTxMock
      );

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'This account has nothing to sign',
        }),
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex
      );
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
        tx: txMock,
        vm: AVM,
        provider: providerMock,
        credentials: [],
        utxos: undefined,
      });
      expect(utils.addressesFromBytes).toHaveBeenCalledWith([
        signerAddressBytesMock,
      ]);
      expect(utils.parse).toHaveBeenCalledWith(
        accountsServiceMock.activeAccount.addressAVM
      );
      expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
        signerAddressMock
      );
    });

    it('returns error if there are no valid signature indices for the account', async () => {
      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([]);
      unsignedTxMock.getSigIndices.mockReturnValueOnce([]);
      (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
        unsignedTxMock
      );

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'This account has nothing to sign',
        }),
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex
      );
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
        tx: txMock,
        vm: AVM,
        provider: providerMock,
        credentials: [],
        utxos: undefined,
      });
      expect(utils.addressesFromBytes).toHaveBeenCalledWith([
        signerAddressBytesMock,
      ]);
      expect(utils.parse).toHaveBeenCalledWith(activeAccountMock.addressAVM);
      expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
        signerAddressMock
      );
      expect(unsignedTxMock.getSigIndices).toHaveBeenCalled();
    });

    it('returns error if it fails to parse the transaction', async () => {
      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([[0, 1]]);
      unsignedTxMock.getSigIndices.mockReturnValueOnce([[1, 2]]);
      (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
        unsignedTxMock
      );
      (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
        type: 'unknown',
      });

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Unable to parse transaction data. Unsupported tx type',
        }),
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex
      );
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
        tx: txMock,
        vm: AVM,
        provider: providerMock,
        credentials: [],
        utxos: undefined,
      });
      expect(utils.addressesFromBytes).toHaveBeenCalledWith([
        signerAddressBytesMock,
      ]);
      expect(utils.parse).toHaveBeenCalledWith(activeAccountMock.addressAVM);
      expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
        signerAddressMock
      );
      expect(unsignedTxMock.getSigIndices).toHaveBeenCalled();
      expect(Avalanche.parseAvalancheTx).toHaveBeenCalledWith(
        unsignedTxMock,
        providerMock,
        activeAccountMock.addressAVM
      );
    });

    it('unsigned: opens the approval window and returns deferred response', async () => {
      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      txMock.getSigIndices.mockReturnValueOnce([
        [0, 1],
        [1, 1],
      ]);
      codecManagerMock.unpack.mockReturnValueOnce(new Error('some error'));
      unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([[0, 1]]);
      unsignedTxMock.getSigIndices.mockReturnValueOnce([[1, 2]]);
      (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
        unsignedTxMock
      );
      (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
        type: 'import',
      });

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex
      );
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledTimes(1);
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledWith({
        tx: txMock,
        vm: AVM,
        provider: providerMock,
        credentials: [
          (Credential as unknown as jest.Mock).mock.instances[0],
          (Credential as unknown as jest.Mock).mock.instances[1],
        ],
        utxos: undefined,
      });
      expect(utils.addressesFromBytes).toHaveBeenCalledWith([
        signerAddressBytesMock,
      ]);
      expect(utils.parse).toHaveBeenCalledWith(activeAccountMock.addressAVM);
      expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
        signerAddressMock
      );
      expect(unsignedTxMock.getSigIndices).toHaveBeenCalled();
      expect(Avalanche.parseAvalancheTx).toHaveBeenCalledWith(
        unsignedTxMock,
        providerMock,
        activeAccountMock.addressAVM
      );

      expect(openApprovalWindowSpy).toHaveBeenCalledWith(
        {
          ...request,
          tabId: request.site.tabId,
          displayData: {
            unsignedTxJson: JSON.stringify(unsignedTxJson),
            txData: {
              type: 'import',
            },
            ownSignatureIndices: [[0, 1]],
            vm: 'AVM',
          },
        },
        'approve/avalancheSignTx'
      );
    });

    it('signed: opens the approval window and returns deferred response', async () => {
      const signedTxMock = {
        getCredentials: () =>
          [{ biz: 'baz' }, { baz: 'biz' }] as unknown as Credential[],
      };

      const signaturesMock = [
        [{ _type: 'signature' }],
        [{ _type: 'signature' }, { _type: 'signature' }],
      ];

      const utxosMock = [
        { utxoID: { txID: '0x1' } },
        { utxoID: { txID: '0x2' } },
      ];

      const handler = new AvalancheSignTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      txMock.getSigIndices.mockReturnValueOnce([
        [0, 1],
        [1, 1],
      ]);
      codecManagerMock.unpack.mockReturnValueOnce(signedTxMock);
      unsignedTxMock.getInputUtxos.mockReturnValueOnce(utxosMock);
      unsignedTxMock.getSigIndicesForAddress.mockReturnValueOnce([[0, 1]]);
      unsignedTxMock.getSigIndices.mockReturnValueOnce([
        [1, 2],
        [1, 0],
      ]);
      (Avalanche.createAvalancheUnsignedTx as jest.Mock).mockReturnValue(
        unsignedTxMock
      );
      (Avalanche.parseAvalancheTx as jest.Mock).mockReturnValueOnce({
        type: 'import',
      });
      (Avalanche.populateCredential as jest.Mock)
        .mockReturnValueOnce(signaturesMock[0])
        .mockReturnValueOnce(signaturesMock[1]);

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });

      expect(Avalanche.getVmByChainAlias).toHaveBeenCalledWith(
        request.params.chainAlias
      );
      expect(utils.hexToBuffer).toHaveBeenCalledWith(
        request.params.transactionHex
      );

      expect(Credential).toHaveBeenCalledTimes(2);
      expect(Credential).toHaveBeenNthCalledWith(1, signaturesMock[0]);
      expect(Credential).toHaveBeenNthCalledWith(2, signaturesMock[1]);

      expect(Avalanche.populateCredential).toHaveBeenCalledTimes(2);
      expect(Avalanche.populateCredential).toHaveBeenNthCalledWith(1, [0, 1], {
        unsignedTx: unsignedTxMock,
        credentialIndex: 0,
      });
      expect(Avalanche.populateCredential).toHaveBeenNthCalledWith(2, [1, 1], {
        unsignedTx: unsignedTxMock,
        credentialIndex: 1,
      });

      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenCalledTimes(2);
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenNthCalledWith(1, {
        tx: txMock,
        vm: AVM,
        provider: providerMock,
        credentials: [{ biz: 'baz' }, { baz: 'biz' }],
      });
      expect(Avalanche.createAvalancheUnsignedTx).toHaveBeenNthCalledWith(2, {
        tx: txMock,
        vm: AVM,
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
      expect(utils.parse).toHaveBeenCalledWith(activeAccountMock.addressAVM);
      expect(unsignedTxMock.getSigIndicesForAddress).toHaveBeenCalledWith(
        signerAddressMock
      );
      expect(unsignedTxMock.getSigIndices).toHaveBeenCalled();
      expect(Avalanche.parseAvalancheTx).toHaveBeenCalledWith(
        unsignedTxMock,
        providerMock,
        activeAccountMock.addressAVM
      );

      expect(openApprovalWindowSpy).toHaveBeenCalledWith(
        {
          ...request,
          tabId: request.site.tabId,
          displayData: {
            unsignedTxJson: JSON.stringify(unsignedTxJson),
            txData: {
              type: 'import',
            },
            ownSignatureIndices: [[0, 1]],
            vm: 'AVM',
          },
        },
        'approve/avalancheSignTx'
      );
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
        signedTransactionHex
      );
      networkServiceMock.getAvalancheNetworkXP.mockReturnValueOnce(
        providerMock
      );

      const handler = new AvalancheSignTransactionHandler(
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
          message: 'Failed to sign [0, 3]',
        })
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
        signedTransactionHex
      );
      networkServiceMock.getAvalancheNetworkXP.mockReturnValueOnce(
        providerMock
      );

      const handler = new AvalancheSignTransactionHandler(
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
          message: 'Failed to sign [0, 2]',
        })
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
        signedTransactionHex
      );
      networkServiceMock.getAvalancheNetworkXP.mockReturnValueOnce(
        providerMock
      );

      const handler = new AvalancheSignTransactionHandler(
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
        signedTransactionJsonMock
      );

      expect(walletServiceMock.sign).toHaveBeenCalledWith(
        {
          tx: mockedTx,
        },
        frontendTabId,
        providerMock
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
