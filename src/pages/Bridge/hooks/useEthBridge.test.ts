import Big from 'big.js';
import {
  useBridgeSDK,
  Blockchain,
  AssetType,
  isNativeAsset,
  getMaxTransferAmount,
} from '@avalabs/core-bridge-sdk';
import { act, renderHook } from '@testing-library/react-hooks';

import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';

import { useEthBridge } from './useEthBridge';
import { useAssetBalancesEVM } from './useAssetBalancesEVM';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => k,
  }),
}));
jest.mock('@avalabs/core-bridge-sdk');
jest.mock('./useAssetBalancesEVM');
jest.mock('@src/contexts/BridgeProvider');
jest.mock('@src/contexts/NetworkProvider');
jest.mock('@src/contexts/AccountsProvider');
jest.mock('@src/contexts/NetworkFeeProvider');
jest.mock('@src/contexts/ConnectionProvider');

describe('src/pages/Bridge/hooks/useEthBridge', () => {
  let requestFn = jest.fn();
  let createBridgeTransactionFn = jest.fn();
  let transferEVMAssetFn = jest.fn();

  const highFee = 20n;
  const lowFee = 8n;

  const currentAssetData = {
    assetType: AssetType.NATIVE,
    denomination: 18,
    wrappedAssetSymbol: 'WETH',
    tokenName: 'Ethereum',
    symbol: 'ETH',
    nativeNetwork: Blockchain.ETHEREUM,
  };

  beforeEach(() => {
    jest.resetAllMocks();

    requestFn = jest.fn();
    transferEVMAssetFn = jest.fn();
    createBridgeTransactionFn = jest.fn();

    jest.mocked(getMaxTransferAmount).mockResolvedValue(new Big('0.01'));

    jest.mocked(useConnectionContext).mockReturnValue({
      request: requestFn,
    } as any);

    jest.mocked(useAccountsContext).mockReturnValue({
      accounts: {
        active: {
          addressC: 'user-c-address',
          addressBTC: 'user-btc-address',
        },
      },
    } as any);

    jest.mocked(useAssetBalancesEVM).mockReturnValue({
      assetsWithBalances: [
        {
          symbol: 'ETH',
          asset: currentAssetData,
          balance: new Big('0.1'),
          price: 2000,
        },
      ],
    } as any);

    jest.mocked(useBridgeContext).mockReturnValue({
      createBridgeTransaction: createBridgeTransactionFn,
      transferEVMAsset: transferEVMAssetFn,
    } as any);

    jest.mocked(useBridgeSDK).mockReturnValue({
      bridgeConfig: {
        config: {},
      },
      currentAsset: 'ETH',
      currentAssetData,
      setTransactionDetails: jest.fn(),
      currentBlockchain: Blockchain.ETHEREUM,
    } as any);

    jest.mocked(useNetworkFeeContext).mockReturnValue({
      networkFee: {
        high: {
          maxFee: highFee,
        },
        low: {
          maxFee: lowFee,
        },
        displayDecimals: 8,
      },
    } as any);

    jest.mocked(useNetworkContext).mockReturnValue({
      ethereumProvider: {},
    } as any);
  });

  it('provides maximum transfer amount', async () => {
    const amount = new Big('0.1');
    const fee = new Big('0.0003');
    const minimum = new Big('0.0006');

    const fakeMax = new Big('0.9');
    jest.mocked(getMaxTransferAmount).mockResolvedValue(fakeMax);

    const { result: hook } = renderHook(() =>
      useEthBridge(amount, fee, minimum)
    );

    await act(async () => {
      expect(getMaxTransferAmount).toHaveBeenCalled();
    });

    // Wait for the state to be set
    await new Promise(process.nextTick);

    expect(hook.current.maximum).toEqual(fakeMax);
  });

  describe('transfer()', () => {
    beforeEach(() => {
      jest.mocked(isNativeAsset).mockReturnValue(true);
    });

    describe('when no asset is selected', () => {
      beforeEach(() => {
        jest.mocked(useBridgeSDK).mockReturnValue({
          bridgeConfig: {
            config: {},
          },
          currentAsset: '',
          currentAssetData: undefined,
          setTransactionDetails: jest.fn(),
          currentBlockchain: Blockchain.ETHEREUM,
        } as any);
      });

      it('throws error', async () => {
        const amount = new Big('0.1');
        const fee = new Big('0.0003');
        const minimum = new Big('0.0006');

        const { result: hook } = renderHook(() =>
          useEthBridge(amount, fee, minimum)
        );

        await act(async () => {
          await expect(hook.current.transfer()).rejects.toThrow(
            'No asset selected'
          );
        });
      });
    });

    it("calls the provider's transfer function", async () => {
      const amount = new Big('0.1');
      const fee = new Big('0.0003');
      const minimum = new Big('0.0006');

      const { result: hook } = renderHook(() =>
        useEthBridge(amount, fee, minimum)
      );

      const fakeHash = '0xHash';

      transferEVMAssetFn.mockResolvedValue({
        hash: fakeHash,
      });

      await act(async () => {
        const hash = await hook.current.transfer();

        expect(transferEVMAssetFn).toHaveBeenCalledWith(
          amount,
          currentAssetData
        );

        expect(hash).toEqual(fakeHash);
      });
    });

    it('tracks the bridge transaction', async () => {
      const amount = new Big('0.1');
      const fee = new Big('0.0003');
      const minimum = new Big('0.0006');

      const { result: hook } = renderHook(() =>
        useEthBridge(amount, fee, minimum)
      );

      const fakeHash = '0xHash';

      transferEVMAssetFn.mockResolvedValue({
        hash: fakeHash,
      });

      await act(async () => {
        await hook.current.transfer();

        expect(createBridgeTransactionFn).toHaveBeenCalledWith({
          sourceChain: Blockchain.ETHEREUM,
          sourceTxHash: fakeHash,
          sourceStartedAt: expect.any(Number),
          targetChain: Blockchain.AVALANCHE,
          amount,
          symbol: 'WETH',
        });
      });
    });
  });
});
