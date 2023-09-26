import { WalletConnectSigner } from './WalletConnectSigner';
import { TransactionRequest } from 'ethers';
import { WalletConnectSessionInfo, WalletConnectTransport } from './models';
import { PubKeyType } from '../wallet/models';
import { AVM, EVM, PVM } from '@avalabs/avalanchejs-v2';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { BNLike } from 'ethereumjs-util';
import { makeBNLike } from '@src/utils/makeBNLike';

jest.mock('@src/utils/makeBNLike', () => ({
  makeBNLike: jest.fn(),
}));

describe('src/background/services/walletConnect/WalletConnectSigner.ts', () => {
  let service: WalletConnectSigner;

  const testChainId = 1234;
  const testAddress = crypto.randomUUID();
  const testTabId = 987;
  const testResultString = 'Here is the response!';
  const testResultString2 = 'Here is another response!';
  const transportTestOptions = {
    chainId: testChainId,
    tabId: testTabId,
    fromAddress: testAddress,
  };
  const testPubKeyType: PubKeyType = {
    evm: 'hello',
    xp: 'goodbye',
    btcWalletPolicyDetails: {
      hmacHex: 'Good Morning',
      xpub: 'Good Afternoon',
      masterFingerprint: 'Good Evening',
      name: 'Good Night',
    },
  };

  const testSession: WalletConnectSessionInfo = {
    addresses: [crypto.randomUUID()],
    topic: 'testSessionTopic',
    chains: [654],
    walletApp: {
      name: 'testAppName',
      description: 'testAppDescription',
      url: 'testAppUrl',
      icons: [],
    },
  };

  const transportMock = {
    request: jest.fn(),
    getSessionInfo: jest.fn(),
  } as unknown as WalletConnectTransport;

  beforeEach(() => {
    jest.resetAllMocks();

    service = new WalletConnectSigner(
      transportMock,
      testChainId,
      testAddress,
      testTabId
    );

    jest.mocked(makeBNLike).mockImplementation((input) => input as BNLike);
    jest.mocked(transportMock.request).mockImplementation((payload) => {
      if (payload.method === 'avalanche_getAccountPubKey') {
        return Promise.resolve(testPubKeyType);
      } else if (payload.method === 'eth_sendTransaction') {
        return Promise.resolve(testResultString);
      } else if (payload.method === 'avalanche_signTransaction') {
        return Promise.resolve(testResultString2);
      }

      throw new Error('Unsupported method');
    });
    jest.mocked(transportMock.getSessionInfo).mockImplementation(() => {
      return Promise.resolve(testSession);
    });
  });

  it('signTransaction should return expected string', async () => {
    const txParams: TransactionRequest = {
      to: crypto.randomUUID(),
      from: crypto.randomUUID(),
      nonce: 1,
      gasLimit: 2,
      gasPrice: 3,
      data: '0x000102',
      value: 4,
      type: 5,
      maxPriorityFeePerGas: 6,
      maxFeePerGas: 7,
    };
    const { txHash } = await service.signTransaction(txParams);
    expect(transportMock.request).toHaveBeenCalledTimes(1);
    expect(transportMock.request).toHaveBeenCalledWith(
      {
        method: 'eth_sendTransaction',
        params: [
          {
            to: txParams.to,
            from: testAddress,
            nonce: txParams.nonce,
            gasLimit: txParams.gasLimit,
            data: txParams.data,
            value: txParams.value,
            type: txParams.type,
            maxPriorityFeePerGas: txParams.maxPriorityFeePerGas,
            maxFeePerGas: txParams.maxFeePerGas,
          },
        ],
      },
      transportTestOptions
    );
    expect(makeBNLike).toBeCalledTimes(5);
    expect(makeBNLike).toHaveBeenNthCalledWith(1, txParams.nonce);
    expect(makeBNLike).toHaveBeenNthCalledWith(2, txParams.maxFeePerGas);
    expect(makeBNLike).toHaveBeenNthCalledWith(
      3,
      txParams.maxPriorityFeePerGas
    );
    expect(makeBNLike).toHaveBeenNthCalledWith(4, txParams.gasLimit);
    expect(makeBNLike).toHaveBeenNthCalledWith(5, txParams.value);
    expect(txHash).toEqual(testResultString);
  });

  describe('signTx', () => {
    it('signTx should return expected string without a method specified', async () => {
      const testBytes = new Uint8Array([3, 4, 5]);
      const testTx = {
        getVM: jest.fn().mockReturnValue(EVM),
        toBytes: jest.fn().mockReturnValue(testBytes),
      };

      const signTxRequestParams = {
        tx: testTx,
        externalIndices: [1],
        internalIndices: [2],
      } as any;

      const { signedTx } = await service.signTx(signTxRequestParams);
      expect(signedTx).toEqual(JSON.stringify(testResultString2));
      expect(testTx.toBytes).toHaveBeenCalledTimes(1);
      expect(testTx.getVM).toHaveBeenCalledTimes(1);
      expect(transportMock.getSessionInfo).toHaveBeenCalledTimes(1);
      expect(transportMock.getSessionInfo).toBeCalledWith(testAddress);
      expect(transportMock.request).toHaveBeenCalledTimes(1);
      expect(transportMock.request).toBeCalledWith(
        {
          method: DAppProviderRequest.AVALANCHE_SIGN_TRANSACTION,
          params: {
            transactionHex: `0x${Buffer.from(testBytes).toString('hex')}`,
            chainAlias: 'C',
            externalIndices: [1],
            internalIndices: [2],
          },
        },
        { ...transportTestOptions, chainId: testSession.chains[0] }
      );
    });

    it('signTx should call request with a method specified', async () => {
      const testBytes = new Uint8Array([3, 4, 5]);
      const testTx = {
        getVM: jest.fn().mockReturnValue(AVM),
        toBytes: jest.fn().mockReturnValue(testBytes),
      };

      const signTxRequestParams = {
        tx: testTx,
        externalIndices: [1],
        internalIndices: [2],
      } as any;
      await service.signTx(signTxRequestParams, 'avalanche_signTransaction');
      expect(transportMock.request).toHaveBeenCalledTimes(1);
      expect(transportMock.request).toBeCalledWith(
        {
          method: 'avalanche_signTransaction',
          params: {
            transactionHex: `0x${Buffer.from(testBytes).toString('hex')}`,
            chainAlias: 'X',
            externalIndices: [1],
            internalIndices: [2],
          },
        },
        { ...transportTestOptions, chainId: testSession.chains[0] }
      );
    });

    it('should use the default chainId when session is not available', async () => {
      jest.mocked(transportMock.getSessionInfo).mockImplementation(() => {
        return Promise.resolve(null);
      });
      const testBytes = new Uint8Array([3, 4, 5]);
      const testTx = {
        getVM: jest.fn().mockReturnValue(PVM),
        toBytes: jest.fn().mockReturnValue(testBytes),
      };

      const signTxRequestParams = {
        tx: testTx,
        externalIndices: [1],
        internalIndices: [2],
      } as any;
      await service.signTx(signTxRequestParams, 'avalanche_signTransaction');
      expect(transportMock.request).toHaveBeenCalledTimes(1);
      expect(transportMock.request).toBeCalledWith(
        {
          method: 'avalanche_signTransaction',
          params: {
            transactionHex: `0x${Buffer.from(testBytes).toString('hex')}`,
            chainAlias: 'P',
            externalIndices: [1],
            internalIndices: [2],
          },
        },
        transportTestOptions
      );
    });
  });
});
