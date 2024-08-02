import Big from 'big.js';
import {
  useBridgeSDK,
  Blockchain,
  AssetType,
  isNativeAsset,
} from '@avalabs/core-bridge-sdk';
import { act, renderHook } from '@testing-library/react-hooks';

import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';

import { useAvalancheBridge } from './useAvalancheBridge';
import { useAssetBalancesEVM } from './useAssetBalancesEVM';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => k,
  }),
}));
jest.mock('@avalabs/core-bridge-sdk');
jest.mock('./useAssetBalancesEVM');
jest.mock('@src/contexts/BridgeProvider');
jest.mock('@src/contexts/AccountsProvider');
jest.mock('@src/contexts/NetworkFeeProvider');
jest.mock('@src/contexts/ConnectionProvider');

describe('src/pages/Bridge/hooks/useAvalancheBridge', () => {
  let requestFn = jest.fn();
  let createBridgeTransactionFn = jest.fn();
  let transferEVMAssetFn = jest.fn();

  const highFee = 20n;
  const lowFee = 8n;

  const currentAssetData = {
    assetType: AssetType.BTC,
    denomination: 8,
    wrappedAssetSymbol: 'BTC.b',
    tokenName: 'Bitcoin',
    symbol: 'BTC',
    nativeNetwork: Blockchain.BITCOIN,
  };

  const btcWithBalance = {
    symbol: 'BTC',
    asset: currentAssetData,
    balance: new Big('0.1'),
    price: 60_000,
  };

  beforeEach(() => {
    jest.resetAllMocks();

    requestFn = jest.fn();
    transferEVMAssetFn = jest.fn();
    createBridgeTransactionFn = jest.fn();

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
      assetsWithBalances: [btcWithBalance],
    } as any);

    jest.mocked(useBridgeContext).mockReturnValue({
      createBridgeTransaction: createBridgeTransactionFn,
      transferEVMAsset: transferEVMAssetFn,
    } as any);

    jest.mocked(useBridgeSDK).mockReturnValue({
      bridgeConfig: {
        config: {},
      },
      currentAsset: 'BTC',
      currentAssetData,
      setTransactionDetails: jest.fn(),
      currentBlockchain: Blockchain.AVALANCHE,
      targetBlockchain: Blockchain.BITCOIN,
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
  });

  it('provides maximum transfer amount', async () => {
    const amount = new Big('0.1');
    const fee = new Big('0.0003');
    const minimum = new Big('0.0006');

    const { result: hook } = renderHook(() =>
      useAvalancheBridge(amount, fee, minimum)
    );

    // Wait for the state to be set
    await new Promise(process.nextTick);

    expect(hook.current.maximum).toEqual(btcWithBalance.balance);
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
          useAvalancheBridge(amount, fee, minimum)
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
        useAvalancheBridge(amount, fee, minimum)
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
        useAvalancheBridge(amount, fee, minimum)
      );

      const fakeHash = '0xHash';

      transferEVMAssetFn.mockResolvedValue({
        hash: fakeHash,
      });

      await act(async () => {
        await hook.current.transfer();

        expect(createBridgeTransactionFn).toHaveBeenCalledWith({
          sourceChain: Blockchain.AVALANCHE,
          sourceTxHash: fakeHash,
          sourceStartedAt: expect.any(Number),
          targetChain: Blockchain.BITCOIN,
          amount,
          symbol: 'BTC',
        });
      });
    });
  });
});
