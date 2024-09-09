import Big from 'big.js';
import { BN } from 'bn.js';
import { act, renderHook } from '@testing-library/react-hooks';
import {
  useBridgeConfig,
  useBridgeSDK,
  getBtcAsset,
  Blockchain,
  btcToSatoshi,
} from '@avalabs/core-bridge-sdk';

import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';

import { useBtcBridge } from './useBtcBridge';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => k,
  }),
}));
jest.mock('@avalabs/core-bridge-sdk');
jest.mock('@src/contexts/BridgeProvider');
jest.mock('@src/contexts/AccountsProvider');
jest.mock('@src/contexts/NetworkFeeProvider');
jest.mock('@src/contexts/ConnectionProvider');
jest.mock('@src/hooks/useTokensWithBalances');

describe('src/pages/Bridge/hooks/useBtcBridge', () => {
  let requestFn = jest.fn();
  let createBridgeTransactionFn = jest.fn();

  const highFee = 20n;
  const lowFee = 8n;

  beforeEach(() => {
    jest.resetAllMocks();

    requestFn = jest.fn();
    createBridgeTransactionFn = jest.fn();

    jest.mocked(useConnectionContext).mockReturnValue({
      request: requestFn,
    } as any);

    jest.mocked(useAccountsContext).mockReturnValue({
      accounts: {
        active: {
          addressBTC: 'user-btc-address',
        },
      },
    } as any);

    jest.mocked(useTokensWithBalances).mockReturnValue([
      {
        symbol: 'BTC',
        decimals: 8,
        balance: new BN('10000000', 8),
      } as any,
    ]);

    jest.mocked(useBridgeContext).mockReturnValue({
      createBridgeTransaction: createBridgeTransactionFn,
    } as any);

    jest.mocked(getBtcAsset).mockReturnValue({
      symbol: 'BTC',
      denomination: 8,
      tokenName: 'Bitcoin',
    } as any);

    jest.mocked(useBridgeSDK).mockReturnValue({
      setTransactionDetails: jest.fn(),
      currentBlockchain: Blockchain.BITCOIN,
    } as any);

    jest.mocked(useBridgeConfig).mockReturnValue({
      config: {
        criticalBitcoin: {
          walletAddresses: {
            btc: 'bridge-btc-address',
            avalanche: 'bridge-avax-address',
          },
        },
      },
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

  describe('transfer()', () => {
    describe('when active account has no BTC address', () => {
      beforeEach(() => {
        jest.mocked(useAccountsContext).mockReturnValue({
          accounts: {
            active: {
              addressC: 'user-c-address',
              addressBTC: '',
            },
          },
        } as any);
      });

      it('throws error', async () => {
        const amount = new Big('0.1');
        const { result: hook } = renderHook(() => useBtcBridge(amount));

        await act(async () => {
          await expect(hook.current.transfer()).rejects.toThrow(
            'Unsupported account'
          );
        });
      });
    });

    describe('when bridge config is not loaded yet', () => {
      beforeEach(() => {
        jest.mocked(useBridgeConfig).mockReturnValue({ config: undefined });
      });

      it('throws error', async () => {
        const amount = new Big('0.1');
        const { result: hook } = renderHook(() => useBtcBridge(amount));

        await act(async () => {
          await expect(hook.current.transfer()).rejects.toThrow(
            'Bridge not ready'
          );
        });
      });
    });

    describe('when fee rate is not loaded yet', () => {
      beforeEach(() => {
        jest.mocked(useNetworkFeeContext).mockReturnValue({
          currentFeeInfo: null,
        } as any);
      });

      it('throws error', async () => {
        const amount = new Big('0.1');
        const { result: hook } = renderHook(() => useBtcBridge(amount));

        await act(async () => {
          await expect(hook.current.transfer()).rejects.toThrow(
            'Bridge not ready'
          );
        });
      });
    });

    describe('when fee rate is not loaded yet', () => {
      beforeEach(() => {
        jest.mocked(useNetworkFeeContext).mockReturnValue({
          networkFee: null,
        } as any);
      });

      it('throws error', async () => {
        const amount = new Big('0.1');
        const { result: hook } = renderHook(() => useBtcBridge(amount));

        await act(async () => {
          await expect(hook.current.transfer()).rejects.toThrow(
            'Bridge not ready'
          );
        });
      });
    });

    describe('when amount is not provided', () => {
      it('throws error', async () => {
        const amount = new Big('0');
        const { result: hook } = renderHook(() => useBtcBridge(amount));

        await act(async () => {
          await expect(hook.current.transfer()).rejects.toThrow(
            'Amount not provided'
          );
        });
      });
    });

    it('sends a bitcoin_sendTransaction request with proper parameters', async () => {
      const amount = new Big('0.1');
      const { result: hook } = renderHook(() => useBtcBridge(amount));

      const fakeHash = '0xTxHash';

      requestFn.mockResolvedValue(fakeHash);

      await act(async () => {
        const hash = await hook.current.transfer();

        expect(requestFn).toHaveBeenCalledWith(
          {
            method: DAppProviderRequest.BITCOIN_SEND_TRANSACTION,
            params: {
              from: 'user-btc-address',
              to: 'bridge-btc-address',
              amount: btcToSatoshi(amount),
              feeRate: Number(highFee),
            },
          },
          {
            customApprovalScreenTitle: 'Confirm Bridge',
          }
        );

        expect(hash).toEqual(fakeHash);
      });
    });

    it('tracks the bridge transaction', async () => {
      const amount = new Big('0.1');
      const { result: hook } = renderHook(() => useBtcBridge(amount));

      const fakeHash = '0xTxHash';

      requestFn.mockResolvedValue(fakeHash);

      await act(async () => {
        await hook.current.transfer();

        expect(createBridgeTransactionFn).toHaveBeenCalledWith({
          sourceChain: Blockchain.BITCOIN,
          sourceTxHash: fakeHash,
          sourceStartedAt: expect.any(Number),
          targetChain: Blockchain.AVALANCHE,
          amount,
          symbol: 'BTC',
        });
      });
    });
  });
});
