import { ChainId, SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';
import { act, renderHook } from '@testing-library/react-hooks';

import { CommonError } from '@src/utils/errors';
import { SecretType } from '@src/background/services/secrets/models';
import { NetworkWithCaipId } from '@src/background/services/network/models';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { expectToThrowErrorCode } from '@src/tests/test-utils';

import { useConnectionContext } from '../ConnectionProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';

import {
  GetRateParams,
  JupiterQuote,
  SwapAdapterMethods,
  SwapErrorCode,
  SwapParams,
  SwapWalletState,
} from './models';

import * as swapUtils from './swap-utils';
import { useSolanaSwap } from './useSolanaSwap';
import { RpcMethod } from '@avalabs/vm-module-types';
import { isSolanaProvider } from '@avalabs/core-wallets-sdk';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k) => k }) }));
jest.mock('@avalabs/core-wallets-sdk', () => ({
  isSolanaProvider: jest.fn(),
}));
jest.mock('@solana/kit', () => ({
  signature: jest.fn(),
}));

jest.mock('@src/utils/network/getProviderForNetwork');

jest.mock('../ConnectionProvider', () => ({ useConnectionContext: jest.fn() }));
jest.mock('../FeatureFlagsProvider', () => ({
  useFeatureFlagContext: jest.fn(),
}));

describe('contexts/SwapProvider/useSolanaSwap', () => {
  const connectionContext = {
    request: jest.fn(),
  } as any;

  const rpcProvider = {
    getTransaction: jest.fn(),
  } as any;

  const networkSolana = {
    chainId: ChainId.SOLANA_MAINNET_ID,
    caipId: SolanaCaip2ChainId.MAINNET,
    isTestnet: false,
    networkToken: {
      symbol: 'SOL',
    },
  } as NetworkWithCaipId;

  const onTransactionReceipt = jest.fn();
  const showPendingToast = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
    global.fetch = jest.fn().mockResolvedValue({});

    jest.mocked(useConnectionContext).mockReturnValue(connectionContext);
    jest.mocked(useFeatureFlagContext).mockReturnValue({
      isFlagEnabled: () => true,
    } as any);
    rpcProvider.getTransaction.mockReturnValue({
      send: jest.fn().mockResolvedValue({
        meta: {
          err: null,
        },
      }),
    });
    jest.mocked(getProviderForNetwork).mockResolvedValue(rpcProvider);
    jest.mocked(isSolanaProvider).mockReturnValue(true);
  });

  const buildWalletState = (overrides?: Partial<SwapWalletState>) => ({
    account: { addressC: '0x12341234', addressSVM: '0x12341234' } as any,
    network: networkSolana,
    walletDetails: { type: SecretType.Mnemonic } as any,
    ...overrides,
  });

  const buildAdapter = async (
    walletState: SwapWalletState,
    methods?: SwapAdapterMethods,
  ) => {
    const { result } = renderHook(() =>
      useSolanaSwap(walletState, {
        onTransactionReceipt:
          methods?.onTransactionReceipt ?? onTransactionReceipt,
        showPendingToast: methods?.showPendingToast ?? showPendingToast,
      }),
    );

    await act(async () => {
      await new Promise(process.nextTick);
    });

    return result.current;
  };

  describe('getRate() function', () => {
    const buildGetRateParams = (overrides?: Partial<GetRateParams>) => ({
      srcToken: 'srcToken',
      srcDecimals: 10,
      destToken: 'destToken',
      destDecimals: 10,
      srcAmount: '1000',
      slippageTolerance: '1',
      ...overrides,
    });

    describe('when network is not supported', () => {
      it.each([
        buildWalletState({ network: undefined }),
        buildWalletState({ network: { isTestnet: true } } as any),
      ])('returns an error', async (wrongNetworkState) => {
        const { getRate } = await buildAdapter(wrongNetworkState);

        await act(async () => {
          await expect(getRate(buildGetRateParams())).rejects.toThrow(
            swapUtils.swapError(CommonError.UnknownNetwork),
          );
        });
      });
    });

    describe('when the feature flag is disabled', () => {
      beforeEach(() => {
        jest.mocked(useFeatureFlagContext).mockReturnValue({
          isFlagEnabled: () => false,
        } as any);
      });

      it('returns an error', async () => {
        const { getRate } = await buildAdapter(buildWalletState());

        await act(async () => {
          await expect(getRate(buildGetRateParams())).rejects.toThrow(
            swapUtils.swapError(SwapErrorCode.FeatureDisabled),
          );
        });
      });
    });

    it('validates the Jupiter API response', async () => {
      jest.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          inAmount: '1000',
        }),
      } as any);

      const { getRate } = await buildAdapter(buildWalletState());

      await act(async () => {
        const { quote, error } = await getRate(buildGetRateParams());

        expect(quote).toBe(null);
        expect(error).toEqual({ message: 'Failed to fetch the swap quote' });
      });
    });

    it('validates the balance needed upon receiving the quote', async () => {
      jest.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          inputMint: 'inputMint',
          inAmount: '1000',
          outputMint: 'outputMint',
          outAmount: '10000',
          otherAmountThreshold: '9500',
          swapMode: 'ExactIn',
          slippageBps: 100,
          platformFee: null,
          priceImpactPct: '0.000001',
          routePlan: [],
          contextSlot: 1234567,
          timeTaken: 273,
        }),
      } as any);

      const { getRate } = await buildAdapter(buildWalletState());

      await act(async () => {
        const { quote, error } = await getRate(
          buildGetRateParams({
            fromTokenBalance: 100n,
          }),
        );

        expect(quote).toBe(null);
        expect(error).toEqual({ message: 'Insufficient balance' });
      });
    });
  });

  describe('swap() function', () => {
    const getSwapParams = (overrides?: Partial<SwapParams<JupiterQuote>>) =>
      ({
        srcToken: 'srcToken',
        srcDecimals: 10,
        destToken: 'destToken',
        destDecimals: 10,
        quote: {
          inputMint: 'inputMint',
          inAmount: '100',
          outputMint: 'outputMint',
          outAmount: '1000',
        } as any,
        slippage: 1,
        ...overrides,
      }) as SwapParams<JupiterQuote>;

    describe('when network is not supported', () => {
      it.each([
        buildWalletState({ network: undefined }),
        buildWalletState({ network: { isTestnet: true } as any }),
      ])('returns an error', async (wrongNetworkState) => {
        const { swap } = await buildAdapter(wrongNetworkState);

        await act(async () => {
          await expect(swap(getSwapParams())).rejects.toThrow();
        });
      });
    });

    describe('when Solana address is unknown', () => {
      it.each([
        buildWalletState({ account: undefined }),
        buildWalletState({ account: { addressSVM: '' } as any }),
      ])('returns an error', async (wrongAccountState) => {
        const { swap } = await buildAdapter(wrongAccountState);

        await act(async () => {
          await expect(swap(getSwapParams())).rejects.toThrow();
        });
      });
    });

    it('validates the Jupiter API response', async () => {
      jest.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          swapTransaction: 'not-a-base-64-string', // should be a base64 encoded string
        }),
      } as any);

      const { swap } = await buildAdapter(buildWalletState());

      await act(async () => {
        await expectToThrowErrorCode(
          swap(getSwapParams()),
          SwapErrorCode.CannotBuildTx,
        );
      });
    });

    it('throws if Jupiter API transaction simulation returns an error', async () => {
      jest.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          swapTransaction: 'ZHVwYQ==', // should be a base64 encoded string
          simulationError: {
            errorCode: 'TRANSACTION_ERROR',
          },
        }),
      } as any);

      const { swap } = await buildAdapter(buildWalletState());

      await act(async () => {
        await expectToThrowErrorCode(
          swap(getSwapParams()),
          SwapErrorCode.TransactionError,
        );
      });
    });

    it('applies the fee account', async () => {
      jest
        .spyOn(swapUtils, 'getJupiterFeeAccount')
        .mockResolvedValueOnce('feeAccount');

      const requestMock = jest.fn().mockResolvedValueOnce('txsignature');

      jest.mocked(useConnectionContext).mockReturnValue({
        request: requestMock,
      } as any);

      jest.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          swapTransaction: 'ZHVwYQ==', // should be a base64 encoded string
        }),
      } as any);

      const { swap } = await buildAdapter(buildWalletState());

      await act(async () => {
        await swap(getSwapParams());

        await expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringContaining(`"feeAccount":"feeAccount"`), // part of JSON stringified body
          }),
        );
      });
    });

    it('sends a solana signing request', async () => {
      jest.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          swapTransaction: 'ZHVwYQ==',
        }),
      } as any);

      const requestMock = jest.fn().mockResolvedValueOnce('txsignature');

      jest.mocked(useConnectionContext).mockReturnValue({
        request: requestMock,
      } as any);

      const { swap } = await buildAdapter(buildWalletState());

      await act(async () => {
        await swap(getSwapParams());

        expect(requestMock).toHaveBeenCalledWith(
          expect.objectContaining({
            method: RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION,
            params: [
              {
                account: '0x12341234',
                serializedTx: 'ZHVwYQ==',
              },
            ],
          }),
        );
      });
    });
  });
});
