import { ChainId } from '@avalabs/core-chains-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { constructPartialSDK, OptimalRate } from '@paraswap/sdk';
import { act, renderHook } from '@testing-library/react-hooks';
import Big from 'big.js';
import { Contract } from 'ethers';

import { getProviderForNetwork } from '@core/common';
import {
  CommonError,
  FeatureGates,
  NetworkWithCaipId,
  SecretType,
  SwapErrorCode,
} from '@core/types';
import { matchingPayload } from '@shared/tests/test-utils';

import { useConnectionContext } from '../ConnectionProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';
import { useNetworkFeeContext } from '../NetworkFeeProvider';

import {
  NATIVE_TOKEN_ADDRESS,
  PARASWAP_PARTNER_FEE_BPS,
  WAVAX_ADDRESS,
} from './constants';
import {
  GetRateParams,
  SwapAdapterMethods,
  SwapParams,
  SwapWalletState,
} from './models';
import * as swapUtils from './swap-utils';
import { useEvmSwap } from './useEvmSwap';
import { EvmSwapOperation, EvmUnwrapQuote, EvmWrapQuote } from './types';

const ROUTE_ADDRESS = '0x12341234';

const waitForRetries = async (retries: number) => {
  for (let i = 0; i < retries; i++) {
    jest.runAllTimers();
    await new Promise(jest.requireActual('timers').setImmediate);
  }
};

jest.mock('ethers');
jest.mock('@paraswap/sdk');
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k) => k }) }));

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  getProviderForNetwork: jest.fn(),
}));

jest.mock('../ConnectionProvider', () => ({ useConnectionContext: jest.fn() }));
jest.mock('../FeatureFlagsProvider', () => ({
  useFeatureFlagContext: jest.fn(),
}));
jest.mock('../NetworkFeeProvider');

describe('contexts/SwapProvider/useEvmSwap', () => {
  const connectionContext = {
    request: jest.fn(),
  } as any;

  const rpcProvider = {
    waitForTransaction: jest.fn(),
    estimateGas: jest.fn(),
    _network: {
      chainId: ChainId.AVALANCHE_MAINNET_ID,
    },
  } as any;

  const networkCChain = {
    chainId: ChainId.AVALANCHE_MAINNET_ID,
    caipId: 'eip155:43114',
    isTestnet: false,
    networkToken: {
      symbol: 'AVAX',
    },
  } as NetworkWithCaipId;

  const paraswapInstance = {
    getRate: jest.fn(),
    getSpender: jest.fn().mockResolvedValue(ROUTE_ADDRESS),
    buildTx: jest.fn(),
  } as any;

  const onTransactionReceipt = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
    global.fetch = jest.fn().mockResolvedValue({});
    jest.mocked(constructPartialSDK).mockReturnValue(paraswapInstance);

    jest.mocked(useConnectionContext).mockReturnValue(connectionContext);
    jest.mocked(useFeatureFlagContext).mockReturnValue({
      isFlagEnabled: (flagName) => flagName !== FeatureGates.ONE_CLICK_SWAP,
    } as any);
    jest.mocked(useNetworkFeeContext).mockReturnValue({
      isGaslessOn: false,
    } as ReturnType<typeof useNetworkFeeContext>);
    jest.mocked(rpcProvider.estimateGas).mockResolvedValue(10000n);
    rpcProvider.waitForTransaction.mockResolvedValue({
      status: 1,
    });
    jest.mocked(getProviderForNetwork).mockResolvedValue(rpcProvider);
  });

  const buildWalletState = (overrides?: Partial<SwapWalletState>) => ({
    account: { addressC: '0x12341234' } as any,
    network: networkCChain,
    walletDetails: { type: SecretType.Mnemonic } as any,
    ...overrides,
  });

  const buildAdapter = async (
    walletState: SwapWalletState,
    methods?: SwapAdapterMethods,
  ) => {
    const { result } = renderHook(() =>
      useEvmSwap(walletState, {
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
      slippage: 1,
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

    describe('when C-chain address is unknown', () => {
      it.each([
        buildWalletState({ account: undefined }),
        buildWalletState({ account: { addressC: '' } as any }),
      ])('returns an error', async (wrongAccountState) => {
        const { getRate } = await buildAdapter(wrongAccountState);

        await act(async () => {
          await expect(getRate(buildGetRateParams())).rejects.toThrow(
            swapUtils.swapError(CommonError.NoActiveAccount),
          );
        });
      });
    });

    describe('when SWAP feature is disabled', () => {
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

    describe.skip('when a network problem occurs', () => {
      beforeEach(() => {
        paraswapInstance.getRate
          .mockRejectedValueOnce(new TypeError('Failed to fetch'))
          .mockResolvedValueOnce({
            destAmount: '123',
            srcAmount: '1',
            bestRoute: [],
          } as any as OptimalRate);
      });

      it('retries the fetch call', async () => {
        const { getRate } = await buildAdapter(buildWalletState());

        await act(async () => {
          const rate = await getRate(buildGetRateParams());

          expect(paraswapInstance.getRate).toHaveBeenCalledTimes(2);
          expect(rate).toEqual({
            destAmount: '1',
            quote: {
              destAmount: '123',
              srcAmount: '1',
              bestRoute: [],
            },
          });
        });
      });
    });

    it.skip('maps srcToken to 0xEeEe... when its the native token', async () => {
      paraswapInstance.getRate.mockResolvedValueOnce({
        address: ROUTE_ADDRESS,
        destAmount: 1000,
      } as any);

      const { getRate } = await buildAdapter(buildWalletState());

      await act(async () => {
        const params = buildGetRateParams({
          srcToken: networkCChain.networkToken.symbol,
        });

        await getRate(params);

        expect(paraswapInstance.getRate).toHaveBeenCalledWith({
          amount: params.srcAmount,
          srcToken: NATIVE_TOKEN_ADDRESS,
          srcDecimals: 18,
          destToken: 'destToken',
          destDecimals: 10,
          side: 'SELL',
          userAddress: '0x12341234',
        });
      });
    });

    it.skip('maps destToken to 0xEeEe... when its the native token', async () => {
      paraswapInstance.getRate.mockResolvedValueOnce({
        address: ROUTE_ADDRESS,
        destAmount: 1000,
      } as any);

      const { getRate } = await buildAdapter(buildWalletState());

      await act(async () => {
        const params = buildGetRateParams({
          destToken: networkCChain.networkToken.symbol,
        });

        await getRate(params);

        expect(paraswapInstance.getRate).toHaveBeenCalledWith({
          destToken: NATIVE_TOKEN_ADDRESS,
          destDecimals: 18,
          amount: '1000',
          srcToken: 'srcToken',
          srcDecimals: 10,
          side: 'SELL',
          userAddress: '0x12341234',
        });
      });
    });

    describe.skip('when a server times out', () => {
      beforeEach(() => {
        paraswapInstance.getRate
          .mockResolvedValueOnce({
            error: 'Price Timeout',
          } as any)
          .mockResolvedValueOnce({
            address: ROUTE_ADDRESS,
            destAmount: 1000,
          } as any);
      });

      it('retries the fetch call', async () => {
        const { getRate } = await buildAdapter(buildWalletState());

        await act(async () => {
          const rate = await getRate(buildGetRateParams());

          expect(paraswapInstance.getRate).toHaveBeenCalledTimes(2);
          expect(rate).toEqual({
            quote: {
              address: ROUTE_ADDRESS,
              destAmount: 1000,
            },
          });
        });
      });
    });

    describe.skip('when a non-recoverable error occurs', () => {
      beforeEach(() => {
        paraswapInstance.getRate.mockResolvedValueOnce({
          error: 'Invalid tokens',
        } as any);
      });

      it('does not automatically retry', async () => {
        const { getRate } = await buildAdapter(buildWalletState());

        await act(async () => {
          expect(await getRate(buildGetRateParams())).toEqual({
            error: {
              hasTryAgain: true,
              message: undefined,
            },
            quote: null,
          });

          expect(paraswapInstance.getRate).toHaveBeenCalledTimes(1);
        });
      });
    });

    it.skip('returns the correct route with native token and missing side', async () => {
      paraswapInstance.getRate.mockResolvedValueOnce({
        address: ROUTE_ADDRESS,
        destAmount: 1000,
        srcAmount: 10,
      } as any);

      const { getRate } = await buildAdapter(buildWalletState());

      const params = buildGetRateParams({ swapSide: undefined });

      await act(async () => {
        expect(await getRate(params)).toStrictEqual({
          destAmount: 10,
          quote: {
            destAmount: 1000,
            srcAmount: 10,
            address: ROUTE_ADDRESS,
          },
        });

        expect(paraswapInstance.getRate).toHaveBeenCalledWith({
          amount: '1000',
          destDecimals: 10,
          destToken: 'destToken',
          side: 'SELL',
          srcDecimals: 10,
          srcToken: 'srcToken',
          userAddress: '0x12341234',
        });
      });
    });

    it.skip('returns UNWRAP details when needed', async () => {
      const { getRate } = await buildAdapter(buildWalletState());

      const params = buildGetRateParams({
        srcToken: WAVAX_ADDRESS,
        destToken: 'AVAX',
      });

      await act(async () => {
        expect(await getRate(params)).toStrictEqual({
          destAmount: '1000',
          error: undefined,
          quote: {
            type: 'UNWRAP',
            source: WAVAX_ADDRESS,
            amount: '1000',
          },
        });
      });
    });

    it.skip('returns WRAP details when needed', async () => {
      const { getRate } = await buildAdapter(buildWalletState());

      const params = buildGetRateParams({
        srcToken: 'AVAX',
        destToken: WAVAX_ADDRESS,
      });

      await act(async () => {
        expect(await getRate(params)).toStrictEqual({
          destAmount: '1000',
          error: undefined,
          quote: {
            type: 'WRAP',
            target: WAVAX_ADDRESS,
            amount: '1000',
          },
        });
      });
    });
  });

  describe('swap() function', () => {
    const getSwapParams = (
      overrides?: Partial<
        SwapParams<OptimalRate | EvmWrapQuote | EvmUnwrapQuote>
      >,
    ) =>
      ({
        srcToken: 'srcToken',
        srcDecimals: 10,
        destToken: 'destToken',
        destDecimals: 10,
        quote: {
          blockNumber: 1,
          destAmount: '100',
          srcAmount: '1000',
        } as any,
        slippage: 1,
        ...overrides,
      }) as SwapParams<OptimalRate>;

    beforeEach(() => {
      rpcProvider.waitForTransaction.mockResolvedValue({
        status: 1,
      });
    });

    it.skip.each([
      ['srcToken', getSwapParams({ srcToken: undefined })],
      ['destToken', getSwapParams({ destToken: undefined })],
      ['srcDecimals', getSwapParams({ srcDecimals: undefined })],
      ['destDecimals', getSwapParams({ destDecimals: undefined })],
      ['srcAmount', getSwapParams({ quote: { srcAmount: undefined } as any })],
      [
        'priceRoute',
        getSwapParams({ quote: { priceRoute: undefined } as any }),
      ],
      [
        'destAmount',
        getSwapParams({ quote: { destAmount: undefined } as any }),
      ],
    ])('validates the presence of %s parameter', async (paramName, params) => {
      const { swap } = await buildAdapter(buildWalletState());

      await act(async () => {
        await expect(swap(params)).rejects.toThrow(
          swapUtils.swapError(
            SwapErrorCode.MissingParams,
            new Error(`Missing parameter: ${paramName}`),
          ),
        );
      });
    });

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

    describe('when C-chain address is unknown', () => {
      it.each([
        buildWalletState({ account: undefined }),
        buildWalletState({ account: { addressC: '' } as any }),
      ])('returns an error', async (wrongAccountState) => {
        const { swap } = await buildAdapter(wrongAccountState);

        await act(async () => {
          await expect(swap(getSwapParams())).rejects.toThrow();
        });
      });
    });

    describe('when SWAP feature is disabled', () => {
      beforeEach(() => {
        jest.mocked(useFeatureFlagContext).mockReturnValue({
          isFlagEnabled: () => false,
        } as any);
      });

      it('returns an error', async () => {
        const { swap } = await buildAdapter(buildWalletState());

        await act(async () => {
          await expect(swap(getSwapParams())).rejects.toThrow(
            swapUtils.swapError(SwapErrorCode.FeatureDisabled),
          );
        });
      });
    });

    describe('when fetching allowance fails', () => {
      let allowanceMock;
      beforeEach(() => {
        allowanceMock = jest
          .fn()
          .mockRejectedValueOnce(new Error('Could not fetch allowance'));

        jest.mocked(Contract).mockReturnValue({
          allowance: allowanceMock,
        } as any);
      });

      it('returns an error', async () => {
        const { swap } = await buildAdapter(buildWalletState());

        await act(async () => {
          await expect(
            swap(getSwapParams({ srcToken: 'JEWEL' })),
          ).rejects.toThrow();
        });
      });
    });

    describe('when approving allowance fails', () => {
      let allowanceMock;
      let requestMock;

      beforeEach(() => {
        allowanceMock = jest.fn().mockResolvedValue(0);

        requestMock = jest
          .fn()
          .mockRejectedValueOnce(new Error('Insufficient funds'));

        jest.mocked(rpcProvider.estimateGas).mockResolvedValue(10000n);

        jest.mocked(Contract).mockReturnValue({
          allowance: allowanceMock,
          approve: {
            populateTransaction: jest.fn().mockResolvedValueOnce({
              data: 'data',
            }),
          },
        } as any);

        jest.mocked(useConnectionContext).mockReturnValue({
          request: requestMock,
          events: jest.fn(),
        } as any);
      });

      it('returns an error', async () => {
        const { swap } = await buildAdapter(buildWalletState());

        await act(async () => {
          await expect(
            swap(getSwapParams({ srcToken: 'JEWEL' })),
          ).rejects.toThrow();
        });
      });
    });

    describe.skip('when swapping non-native token', () => {
      let allowanceMock;
      let requestMock;

      const mockedTx = {
        gas: '0x2710', // 10000n
        data: 'approval-tx-data',
      };

      beforeEach(() => {
        paraswapInstance.buildTx.mockResolvedValue({
          data: 'data',
          to: '0xParaswapContractAddress',
          from: '0x123',
          value: '0x0',
          gas: '1223',
          chainId: 123,
        } as any);

        allowanceMock = jest.fn().mockResolvedValue(0);
        requestMock = jest.fn().mockResolvedValue('0xALLOWANCE_HASH');

        jest.mocked(rpcProvider.estimateGas).mockResolvedValue(10000n);
        jest.mocked(Contract).mockReturnValue({
          allowance: allowanceMock,
          approve: {
            populateTransaction: jest.fn().mockResolvedValueOnce(mockedTx),
          },
        } as any);

        jest.mocked(useConnectionContext).mockReturnValue({
          request: requestMock,
          events: jest.fn(),
        } as any);
      });

      it('prompts a spend approval first', async () => {
        const { swap } = await buildAdapter(buildWalletState());

        await act(async () => {
          await swap(getSwapParams({ srcToken: 'JEWEL' }));

          expect(allowanceMock).toHaveBeenCalled();
          expect(requestMock).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'eth_sendTransaction',
              params: [expect.objectContaining(mockedTx)],
            }),
          );
        });
      });
    });

    it.skip('uses Paraswap API to build the transaction data', async () => {
      const requestMock = jest.fn();

      paraswapInstance.buildTx.mockResolvedValue({
        data: 'data',
        to: '0xParaswapContractAddress',
        from: '0x123',
        value: '0x0',
        chainId: 123,
        someExtraParam: '123',
      } as any);

      jest.mocked(Contract).mockReturnValue({
        allowance: jest.fn().mockResolvedValue(Infinity),
      } as any);

      jest.mocked(useConnectionContext).mockReturnValue({
        request: requestMock.mockResolvedValue('0xSwapHash'),
        events: jest.fn(),
      } as any);

      const { swap } = await buildAdapter(buildWalletState());

      const { quote, slippage, ...params } = getSwapParams();

      await act(async () => {
        await swap({ ...params, slippage, quote });

        const totalFeePercentage =
          slippage / 100 + PARASWAP_PARTNER_FEE_BPS / 10000;

        expect(paraswapInstance.buildTx).toHaveBeenCalledWith(
          {
            ...params,
            srcAmount: new Big(quote.srcAmount)
              .times(1 + totalFeePercentage)
              .toFixed(0), // increased by slippage + fees
            destAmount: quote.destAmount,
            priceRoute: quote,
            userAddress: '0x12341234',
            partner: 'Avalanche',
            partnerAddress: '0xcEA3b9415F269B5686403909d781959570f32CF0',
            partnerFeeBps: 85,
            isDirectFeeTransfer: true,
          },
          { ignoreChecks: undefined },
        );
      });
    });

    it.skip('verifies Paraswap API response for correct parameters', async () => {
      const requestMock = jest.fn();

      paraswapInstance.buildTx.mockResolvedValue({
        data: '',
        to: '',
        from: '0x123',
        value: '0x0',
        chainId: 123,
      } as any);

      jest.mocked(Contract).mockReturnValue({
        allowance: jest.fn().mockResolvedValue(Infinity),
      } as any);

      jest.mocked(useConnectionContext).mockReturnValue({
        request: requestMock.mockResolvedValue('0xSwapHash'),
        events: jest.fn(),
      } as any);

      const { swap } = await buildAdapter(buildWalletState());

      jest.useFakeTimers();

      await act(async () => {
        swap(getSwapParams())
          .then(() => {
            fail('Expected to throw');
          })
          .catch((err) => {
            expect(err.message).toEqual('Invalid transaction params');
          });

        await waitForRetries(10);
      });
    });

    it.skip('handles Paraswap API error responses', async () => {
      const requestMock = jest.fn();

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest
          .fn()
          .mockResolvedValue({ message: 'Some API error happened' }),
        ok: true,
      } as any);

      jest.mocked(Contract).mockReturnValue({
        allowance: jest.fn().mockResolvedValue(Infinity),
      } as any);

      jest.mocked(useConnectionContext).mockReturnValue({
        request: requestMock.mockResolvedValue('0xSwapHash'),
        events: jest.fn(),
      } as any);

      const { swap } = await buildAdapter(buildWalletState());

      jest.useFakeTimers();

      await act(async () => {
        swap(getSwapParams())
          .then(() => {
            fail('Expected to throw');
          })
          .catch((err) => {
            expect(err.message).toEqual('Some API error happened');
          });

        await waitForRetries(10);
      });
    });

    it.skip('handles API HTTP errors', async () => {
      const requestMock = jest.fn();

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          data: 'data',
          to: '0xParaswapContractAddress',
          from: '0x123',
          value: '0x0',
          chainId: 123,
        }),
        ok: false,
      } as any);

      jest.mocked(Contract).mockReturnValue({
        allowance: jest.fn().mockResolvedValue(Infinity),
      } as any);

      jest.mocked(useConnectionContext).mockReturnValue({
        request: requestMock.mockResolvedValue('0xSwapHash'),
        events: jest.fn(),
      } as any);

      const { swap } = await buildAdapter(buildWalletState());

      jest.useFakeTimers();

      await act(async () => {
        swap(getSwapParams())
          .then(() => {
            fail('Expected to throw');
          })
          .catch((err) => {
            expect(err.message).toEqual('Invalid transaction params');
          });

        await waitForRetries(10);
      });
    });

    describe.skip('when ONE_CLICK_SWAP feature flag is enabled', () => {
      let requestMock;

      beforeEach(() => {
        jest.mocked(useFeatureFlagContext).mockReturnValue({
          isFlagEnabled: () => true,
        } as any);

        paraswapInstance.buildTx.mockResolvedValue({
          data: 'data',
          to: '0xParaswapContractAddress',
          from: '0x123',
          value: '0x0',
          chainId: 123,
        } as any);

        jest.mocked(Contract).mockReturnValue({
          allowance: jest.fn().mockResolvedValue(0),
          approve: {
            populateTransaction: jest.fn().mockResolvedValueOnce({
              data: 'data',
            }),
          },
        } as any);
      });

      describe.each([
        [SecretType.Mnemonic, true],
        [SecretType.Seedless, true],
        [SecretType.PrivateKey, true],
        [SecretType.Ledger, false],
        [SecretType.Keystone, false],
        [SecretType.LedgerLive, false],
      ])('with a %s wallet', (secretType, isExpectedToUseBatchSigning) => {
        beforeEach(() => {
          if (isExpectedToUseBatchSigning) {
            requestMock = jest
              .fn()
              .mockResolvedValueOnce(['0xALLOWANCE_HASH', '0xSWAP_HASH']);
          } else {
            requestMock = jest
              .fn()
              .mockResolvedValueOnce('0xALLOWANCE_HASH')
              .mockResolvedValueOnce('0xSWAP_HASH');
          }

          jest.mocked(useConnectionContext).mockReturnValue({
            request: requestMock,
            events: jest.fn(),
          } as any);
        });

        it(
          isExpectedToUseBatchSigning
            ? 'uses batch signing'
            : 'does not use batch signing',
          async () => {
            const { swap } = await buildAdapter(
              buildWalletState({
                walletDetails: {
                  type: secretType,
                } as any,
              }),
            );

            await act(async () => {
              await swap(
                getSwapParams({
                  srcToken: 'JEWEL',
                }),
              );

              expect(requestMock).toHaveBeenCalledWith(
                matchingPayload({
                  method: isExpectedToUseBatchSigning
                    ? RpcMethod.ETH_SEND_TRANSACTION_BATCH
                    : RpcMethod.ETH_SEND_TRANSACTION,
                }),
                {
                  customApprovalButtonText: 'Swap',
                  customApprovalScreenTitle: 'Confirm Swap',
                },
              );
            });
          },
        );
      });

      describe('and user has enough allowance', () => {
        beforeEach(() => {
          jest.mocked(Contract).mockReturnValue({
            allowance: jest.fn().mockResolvedValue(Infinity),
            approve: {
              populateTransaction: jest.fn().mockResolvedValueOnce({
                data: 'data',
              }),
            },
          } as any);

          requestMock = jest
            .fn()
            .mockResolvedValueOnce(['0xALLOWANCE_HASH', '0xSWAP_HASH']);

          jest.mocked(useConnectionContext).mockReturnValue({
            request: requestMock,
            events: jest.fn(),
          } as any);
        });

        it('uses eth_sendTransaction request', async () => {
          const { swap } = await buildAdapter(buildWalletState());

          await act(async () => {
            await swap(
              getSwapParams({
                srcToken: 'JEWEL',
              }),
            );

            expect(requestMock).toHaveBeenCalledWith(
              matchingPayload({
                method: RpcMethod.ETH_SEND_TRANSACTION,
              }),
            );
          });
        });
      });

      describe('and user does not have enough allowance', () => {
        beforeEach(() => {
          jest.mocked(Contract).mockReturnValue({
            allowance: jest.fn().mockResolvedValue(0),
            approve: {
              populateTransaction: jest.fn().mockResolvedValueOnce({
                data: 'data',
              }),
            },
          } as any);

          requestMock = jest
            .fn()
            .mockResolvedValueOnce(['0xALLOWANCE_HASH', '0xSWAP_HASH']);

          jest.mocked(useConnectionContext).mockReturnValue({
            request: requestMock,
            events: jest.fn(),
          } as any);
        });

        it('uses eth_sendTransactionBatch request', async () => {
          const { swap } = await buildAdapter(buildWalletState());

          await act(async () => {
            await swap(
              getSwapParams({
                srcToken: 'JEWEL',
              }),
            );

            expect(requestMock).toHaveBeenCalledWith(
              matchingPayload({
                method: RpcMethod.ETH_SEND_TRANSACTION_BATCH,
                params: [
                  matchingPayload({ to: 'JEWEL' }),
                  matchingPayload({ to: '0xParaswapContractAddress' }),
                ],
              }),
              {
                customApprovalButtonText: 'Swap',
                customApprovalScreenTitle: 'Confirm Swap',
              },
            );
          });
        });
      });
    });

    describe.skip('when everything goes right', () => {
      let allowanceMock;
      let requestMock;

      beforeEach(() => {
        allowanceMock = jest.fn().mockResolvedValue(0);
        paraswapInstance.buildTx.mockResolvedValue({
          data: 'data',
          to: '0xParaswapContractAddress',
          from: '0x123',
          value: '0x0',
          chainId: 123,
        } as any);

        requestMock = jest
          .fn()
          .mockResolvedValueOnce('0xALLOWANCE_HASH')
          .mockResolvedValueOnce('0xSWAP_HASH');

        jest.mocked(Contract).mockReturnValue({
          allowance: allowanceMock,
          approve: {
            populateTransaction: jest.fn().mockResolvedValueOnce({
              data: 'data',
            }),
          },
        } as any);

        jest.mocked(useConnectionContext).mockReturnValue({
          request: requestMock,
          events: jest.fn(),
        } as any);
      });

      it('resolves', async () => {
        const { swap } = await buildAdapter(buildWalletState());

        await act(async () => {
          expect(() =>
            swap(
              getSwapParams({
                srcToken: 'JEWEL',
              }),
            ),
          ).not.toThrow();
        });
      });
    });

    it.skip('performs a wrap when needed', async () => {
      const requestMock = jest.fn().mockResolvedValueOnce('0xSWAP_HASH');

      jest.mocked(Contract).mockReturnValue({
        deposit: {
          populateTransaction: jest.fn().mockResolvedValueOnce({
            to: 'wrap_to',
            data: 'wrap_data',
          }),
        },
      } as any);

      jest.mocked(useConnectionContext).mockReturnValue({
        request: requestMock,
        events: jest.fn(),
      } as any);

      const { swap } = await buildAdapter(buildWalletState());

      await act(async () => {
        await swap(
          getSwapParams({
            srcToken: 'AVAX',
            destToken: WAVAX_ADDRESS,
            quote: {
              operation: EvmSwapOperation.WRAP,
              target: WAVAX_ADDRESS,
              amount: '1000',
            },
          }),
        );

        expect(requestMock).toHaveBeenCalledWith(
          matchingPayload({
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [matchingPayload({ to: 'wrap_to', data: 'wrap_data' })],
          }),
        );
      });
    });

    it.skip('performs an unwrap when needed', async () => {
      const requestMock = jest.fn().mockResolvedValueOnce('0xSWAP_HASH');

      jest.mocked(Contract).mockReturnValue({
        withdraw: {
          populateTransaction: jest.fn().mockResolvedValueOnce({
            to: 'unwrap_from',
            data: 'unwrap_data',
          }),
        },
      } as unknown as Contract);

      jest.mocked(useConnectionContext).mockReturnValue({
        request: requestMock,
        events: jest.fn(),
      } as any);

      const { swap } = await buildAdapter(buildWalletState());

      await act(async () => {
        await swap(
          getSwapParams({
            destToken: 'AVAX',
            srcToken: WAVAX_ADDRESS,
            quote: {
              operation: EvmSwapOperation.UNWRAP,
              source: WAVAX_ADDRESS,
              amount: '1000',
            },
          }),
        );

        expect(requestMock).toHaveBeenCalledWith(
          matchingPayload({
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [
              matchingPayload({ to: 'unwrap_from', data: 'unwrap_data' }),
            ],
          }),
        );
      });
    });
  });
});
