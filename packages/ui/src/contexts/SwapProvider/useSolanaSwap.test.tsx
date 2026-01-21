import { ChainId, SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';
import { act, renderHook } from '@testing-library/react';

import { getProviderForNetwork } from '@core/common';
import {
  CommonError,
  NetworkWithCaipId,
  SecretType,
  SwapErrorCode,
} from '@core/types';
import { useConnectionContext } from '../ConnectionProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';

import {
  GetRateParams,
  JupiterQuote,
  SwapAdapterMethods,
  SwapParams,
  SwapWalletState,
} from './models';

import { isSolanaProvider } from '@avalabs/core-wallets-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { expectToThrowErrorCode } from '@shared/tests/test-utils';
import * as swapUtils from './swap-utils';
import { useSolanaSwap } from './useSolanaSwap';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k) => k }) }));
jest.mock('@avalabs/core-wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/core-wallets-sdk'),
  isSolanaProvider: jest.fn(),
}));
jest.mock('@solana/kit', () => ({
  signature: jest.fn(),
}));

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  getProviderForNetwork: jest.fn(),
}));

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
  });

  // TODO: Fix this suite
  describe.skip('swap() function', () => {
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
