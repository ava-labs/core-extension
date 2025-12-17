import { createRef, forwardRef, useImperativeHandle } from 'react';
import { render } from '@shared/tests/test-utils';
import Big from 'big.js';
import {
  AssetType,
  Blockchain,
  WrapStatus,
  estimateGas as sdkEstimateGas,
  transferAssetEVM,
  useBridgeSDK,
} from '@avalabs/core-bridge-sdk';

import { useConnectionContext } from './ConnectionProvider';
import { useAccountsContext } from './AccountsProvider';
import { useNetworkContext } from './NetworkProvider';
import {
  BridgeContext,
  BridgeProvider,
  useBridgeContext,
} from './BridgeProvider';
import { act } from 'react-dom/test-utils';
import { RpcMethod } from '@avalabs/vm-module-types';

const ACTIVE_ACCOUNT_ADDRESS = 'addressC';

const getBridgeProvider = (): BridgeContext => {
  const ref = createRef<BridgeContext>();

  render(
    <BridgeProvider>
      <TestConsumerComponent ref={ref} />
    </BridgeProvider>,
  );

  return ref.current ?? ({} as BridgeContext);
};

const TestConsumerComponent = forwardRef((_props, ref) => {
  const { estimateGas, transferEVMAsset } = useBridgeContext();

  useImperativeHandle(ref, () => ({
    estimateGas,
    transferEVMAsset,
  }));

  return <></>;
});
TestConsumerComponent.displayName = 'TestComponent';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => k,
  }),
}));

jest.mock('@avalabs/core-bridge-sdk', () => {
  const actual = jest.requireActual('@avalabs/core-bridge-sdk');
  const MockSDKProvider = ({ children }) => <>{children}</>;

  return {
    ...actual,
    estimateGas: jest.fn(),
    BridgeSDKProvider: MockSDKProvider,
    transferAssetEVM: jest.fn(),
    useBridgeSDK: jest.fn(),
  };
});
jest.mock('./NetworkProvider');
jest.mock('./AccountsProvider');
jest.mock('./ConnectionProvider');

describe('contexts/BridgeProvider', () => {
  const requestFn = jest.fn();
  const eventsFn = jest.fn();

  const connectionContext = {
    request: requestFn,
    events: eventsFn,
  } as any;

  const accountsContext = {
    accounts: {
      active: {
        addressC: ACTIVE_ACCOUNT_ADDRESS,
      },
    },
  } as any;

  const networkContext = {
    network: {
      isTestnet: false,
      networkToken: {
        symbol: 'AVAX',
      },
    },
    avaxProviderC: {
      waitForTransaction: jest.fn(),
    },
    ethereumProvider: {
      waitForTransaction: jest.fn(),
    },
  } as any;

  const currentAssetData = {
    assetType: AssetType.NATIVE,
    denomination: 18,
    wrappedAssetSymbol: 'WETH',
    tokenName: 'Ethereum',
    symbol: 'ETH',
    nativeNetwork: Blockchain.ETHEREUM,
  } as any;

  const bridgeSDKContext = {
    currentAsset: currentAssetData.symbol,
    currentAssetData,
    currentBlockchain: Blockchain.ETHEREUM,
    bridgeConfig: {
      config: {},
    },
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();

    // Mock events flow
    eventsFn.mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
      }),
    });

    // Mock state initialization response
    requestFn.mockResolvedValueOnce({
      bridgeTransactions: {},
      isDevEnv: false,
    });

    jest.mocked(useBridgeSDK).mockReturnValue(bridgeSDKContext);
    jest.mocked(useConnectionContext).mockReturnValue(connectionContext);
    jest.mocked(useAccountsContext).mockReturnValue(accountsContext);
    jest.mocked(useNetworkContext).mockReturnValue(networkContext);
  });

  describe('transferEVMAsset() function', () => {
    describe('when not on EVM chain', () => {
      beforeEach(() => {
        jest.mocked(useBridgeSDK).mockReturnValue({
          ...bridgeSDKContext,
          currentBlockchain: Blockchain.BITCOIN,
        });
      });

      it('throws error', async () => {
        const { transferEVMAsset } = getBridgeProvider();

        await act(async () => {
          await expect(
            transferEVMAsset(new Big('0.1'), {} as any),
          ).rejects.toThrow('Wrong source chain');
        });
      });
    });

    it('send eth_sendTransaction request to the wallet', async () => {
      // We need to mock the SDK method in a way that will allow us to trigger
      // the callbacks we need.
      const fakeSdkTransferFn = async ({ onStatusChange, signAndSendEVM }) =>
        ({
          onStatusChange,
          signAndSendEVM,
          hash: '0xHash',
        }) as any;

      jest
        .mocked(transferAssetEVM)
        .mockImplementationOnce(fakeSdkTransferFn as any);
      const { transferEVMAsset } = getBridgeProvider();

      const amount = new Big('0.1');

      await act(async () => {
        const {
          // eslint-disable-next-line
          // @ts-expect-error
          hash: { onStatusChange, signAndSendEVM },
        } = await transferEVMAsset(amount, currentAssetData);

        // Mock the deposit TX being prompted and signed
        const fakeDepositTx = {
          maxFeePerGas: 50n,
          to: 'bridge-eth-address',
          from: accountsContext.accounts.active.addressC,
        };

        onStatusChange(WrapStatus.WAITING_FOR_DEPOSIT_CONFIRMATION);
        signAndSendEVM(fakeDepositTx);

        expect(requestFn).toHaveBeenCalledWith(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [
              { ...fakeDepositTx, maxFeePerGas: '0x32', gasPrice: undefined },
            ],
          },
          {
            context: {
              customApprovalScreenTitle: 'Confirm Bridge',
              isBridge: true,
              alert: {
                type: 'info',
                title: 'This operation requires {{total}} approvals.',
                notice: 'You will be prompted {{remaining}} more time(s).',
              },
            },
          },
        );

        // Mock the transfer TX being prompted and signed
        const fakeTransferTx = {
          maxFeePerGas: 55n,
          to: 'bridge-eth-address',
          from: accountsContext.accounts.active.addressC,
        };

        onStatusChange(WrapStatus.WAITING_FOR_CONFIRMATION);
        signAndSendEVM(fakeTransferTx);

        expect(requestFn).toHaveBeenCalledWith(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [
              { ...fakeTransferTx, maxFeePerGas: '0x37', gasPrice: undefined },
            ],
          },
          {
            context: {
              customApprovalScreenTitle: 'Confirm Bridge',
              isBridge: true,
            },
          },
        );
      });
    });

    it('uses the SDK to build the transaction', async () => {
      const { transferEVMAsset } = getBridgeProvider();

      const amount = new Big('0.1');

      await act(async () => {
        await transferEVMAsset(amount, currentAssetData);

        expect(transferAssetEVM).toHaveBeenCalledWith({
          currentBlockchain: bridgeSDKContext.currentBlockchain,
          amount,
          asset: currentAssetData,
          account: accountsContext.accounts.active.addressC,
          avalancheProvider: networkContext.avaxProviderC,
          ethereumProvider: networkContext.ethereumProvider,
          config: bridgeSDKContext.bridgeConfig.config,
          onStatusChange: expect.any(Function),
          onTxHashChange: expect.any(Function),
          signAndSendEVM: expect.any(Function),
        });
      });
    });
  });

  describe('estimateGas() function', () => {
    const expectToReturnUndefined = () => {
      it('returns undefined', async () => {
        const { estimateGas } = getBridgeProvider();

        await act(async () => {
          expect(await estimateGas(new Big('0.1'), {} as any)).toBeUndefined();
        });
      });
    };

    describe('when not on EVM chain', () => {
      beforeEach(() => {
        jest.mocked(useBridgeSDK).mockReturnValue({
          ...bridgeSDKContext,
          currentBlockchain: Blockchain.BITCOIN,
        });
      });

      expectToReturnUndefined();
    });

    describe('when config is not initialized', () => {
      beforeEach(() => {
        jest.mocked(useBridgeSDK).mockReturnValue({
          ...bridgeSDKContext,
          bridgeConfig: {
            config: undefined,
          },
        });
      });

      expectToReturnUndefined();
    });

    describe('when network is not initialized', () => {
      beforeEach(() => {
        jest.mocked(useNetworkContext).mockReturnValue({
          ...networkContext,
          ethereumProvider: undefined,
          avaxProviderC: undefined,
        });
      });

      expectToReturnUndefined();
    });

    describe('when active account is not known', () => {
      beforeEach(() => {
        jest.mocked(useAccountsContext).mockReturnValue({
          ...accountsContext,
          accounts: {
            active: undefined,
          },
        });
      });

      expectToReturnUndefined();
    });

    it('estimates gas using the SDK', async () => {
      const fakeGas = 1234n;
      jest.mocked(sdkEstimateGas).mockResolvedValue(fakeGas);

      const { estimateGas } = getBridgeProvider();

      const amount = new Big('0.1');
      const asset = {} as any;

      await act(async () => {
        expect(await estimateGas(amount, asset)).toEqual(fakeGas);
        expect(sdkEstimateGas).toHaveBeenCalledWith(
          amount,
          accountsContext.accounts.active.addressC,
          asset,
          {
            ethereum: networkContext.ethereumProvider,
            avalanche: networkContext.avaxProviderC,
          },
          bridgeSDKContext.bridgeConfig.config,
          bridgeSDKContext.currentBlockchain,
        );
      });
    });
  });
});
