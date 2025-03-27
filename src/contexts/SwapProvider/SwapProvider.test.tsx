import { createRef, forwardRef, useImperativeHandle } from 'react';
import { act } from 'react-dom/test-utils';

import { matchingPayload, render } from '@src/tests/test-utils';

import { useAccountsContext } from '../AccountsProvider';
import { useAnalyticsContext } from '../AnalyticsProvider';
import { useNetworkContext } from '../NetworkProvider';
import { useConnectionContext } from '../ConnectionProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';
import { useWalletContext } from '../WalletProvider';

import { ChainId } from '@avalabs/core-chains-sdk';
import { Contract } from 'ethers';
import Big from 'big.js';
import {
  GetRateParams,
  SwapContextAPI,
  SwapErrorCode,
  SwapParams,
} from './models';
import { SwapContextProvider, useSwapContext } from './SwapProvider';
import { useNetworkFeeContext } from '../NetworkFeeProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { SecretType } from '@src/background/services/secrets/models';
import { RpcMethod } from '@avalabs/vm-module-types';
import * as swapUtils from './swap-utils';
import { CommonError } from '@src/utils/errors';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { constructPartialSDK, OptimalRate } from '@paraswap/sdk';
import { NATIVE_TOKEN_ADDRESS } from './constants';

const ACTIVE_ACCOUNT_ADDRESS = 'addressC';
const ROUTE_ADDRESS = '0x12341234';

const getSwapProvider = async (): Promise<SwapContextAPI> => {
  const ref = createRef<SwapContextAPI>();

  await act(async () => {
    render(
      <SwapContextProvider>
        <TestConsumerComponent ref={ref} />
      </SwapContextProvider>,
    );
  });

  return ref.current ?? ({} as SwapContextAPI);
};

const waitForRetries = async (retries: number) => {
  for (let i = 0; i < retries; i++) {
    jest.runAllTimers();
    await new Promise(jest.requireActual('timers').setImmediate);
  }
};

const TestConsumerComponent = forwardRef((_props: unknown, ref) => {
  const { getRate, swap } = useSwapContext();

  useImperativeHandle(ref, () => ({
    getRate,
    swap,
  }));

  return <></>;
});
TestConsumerComponent.displayName = 'TestComponent';

jest.mock('@paraswap/sdk');

jest.mock('../AnalyticsProvider', () => ({
  useAnalyticsContext: jest.fn(),
}));

jest.mock('../NetworkProvider', () => ({
  useNetworkContext: jest.fn(),
}));

jest.mock('../AccountsProvider', () => ({
  useAccountsContext: jest.fn(),
}));

jest.mock('../WalletProvider', () => ({
  useWalletContext: jest.fn(),
}));

jest.mock('../FeatureFlagsProvider', () => ({
  useFeatureFlagContext: jest.fn(),
}));

jest.mock('../NetworkFeeProvider', () => ({
  useNetworkFeeContext: jest.fn(),
}));

jest.mock('../ConnectionProvider', () => ({
  useConnectionContext: jest.fn(),
}));

jest.mock('@src/utils/network/getProviderForNetwork');
jest.mock('@src/hooks/useTokensWithBalances');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => k,
  }),
}));

jest.mock('ethers');
jest.mock('@avalabs/core-k2-components', () => ({
  toast: {
    success: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
    error: jest.fn(),
    custom: jest.fn(),
    remove: jest.fn(),
  },
}));

describe('contexts/SwapProvider', () => {
  const connectionContext = {
    request: jest.fn(),
    events: jest.fn(),
  } as any;

  const accountsContext = {
    accounts: {
      active: {
        addressC: ACTIVE_ACCOUNT_ADDRESS,
      },
    },
  } as any;

  const rpcProvider = {
    waitForTransaction: jest.fn(),
    estimateGas: jest.fn(),
    _network: {
      chainId: ChainId.AVALANCHE_MAINNET_ID,
    },
  } as any;

  const networkContextAVA = {
    network: {
      chainId: ChainId.AVALANCHE_MAINNET_ID,
      isTestnet: false,
      networkToken: {
        symbol: 'AVAX',
      },
    },
  } as any;

  const paraswapInstance = {
    getRate: jest.fn(),
    getSpender: jest.fn().mockResolvedValue(ROUTE_ADDRESS),
    buildTx: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
    global.fetch = jest.fn().mockResolvedValue({});
    jest.mocked(constructPartialSDK).mockReturnValue(paraswapInstance);

    jest.mocked(useWalletContext).mockReturnValue({
      walletDetails: {
        type: SecretType.Mnemonic,
      },
    } as any);
    jest.mocked(useConnectionContext).mockReturnValue(connectionContext);
    jest.mocked(useAccountsContext).mockReturnValue(accountsContext);
    jest.mocked(useNetworkContext).mockReturnValue(networkContextAVA);
    jest.mocked(useFeatureFlagContext).mockReturnValue({
      isFlagEnabled: (flagName) => flagName !== FeatureGates.ONE_CLICK_SWAP,
    } as any);
    jest.mocked(useTokensWithBalances).mockReturnValue([]);
    jest.mocked(rpcProvider.estimateGas).mockResolvedValue(10000n);
    rpcProvider.waitForTransaction.mockResolvedValue({
      status: 1,
    });
    jest.mocked(getProviderForNetwork).mockResolvedValue(rpcProvider);
    jest.mocked(useNetworkFeeContext).mockReturnValue({
      networkFee: {
        low: {
          maxFee: BigInt(25 * 10 ** 9),
        },
      },
    } as any);

    jest.mocked(useAnalyticsContext).mockReturnValue({
      captureEncrypted: jest.fn(),
    } as any);
  });

  describe('getRate() function', () => {
    const buildGetRateParams = (overrides?: Partial<GetRateParams>) =>
      ({
        srcToken: 'srcToken',
        srcDecimals: 10,
        destToken: 'destToken',
        destDecimals: 10,
        srcAmount: '1000',
        ...overrides,
      }) as SwapParams;

    describe('when network is not supported', () => {
      it.each([{ network: undefined }, { isTestnet: true }])(
        'returns an error',
        async (failingNetworkContext) => {
          jest
            .mocked(useNetworkContext)
            .mockReturnValue(failingNetworkContext as any);
          const { getRate } = await getSwapProvider();

          await expect(getRate(buildGetRateParams())).rejects.toThrow(
            swapUtils.swapError(CommonError.UnknownNetwork),
          );
        },
      );
    });

    describe('when C-chain address is unknown', () => {
      it.each([
        { accounts: { active: undefined } },
        { accounts: { active: { addressC: '' } } },
      ])('returns an error', async (failingAccountsContext) => {
        jest
          .mocked(useAccountsContext)
          .mockReturnValue(failingAccountsContext as any);
        const { getRate } = await getSwapProvider();

        await expect(getRate(buildGetRateParams())).rejects.toThrow(
          swapUtils.swapError(CommonError.NoActiveAccount),
        );
      });
    });

    describe('when SWAP feature is disabled', () => {
      beforeEach(() => {
        jest.mocked(useFeatureFlagContext).mockReturnValue({
          isFlagEnabled: () => false,
        } as any);
      });

      it('returns an error', async () => {
        const { getRate } = await getSwapProvider();

        await expect(getRate(buildGetRateParams())).rejects.toThrow(
          'Feature (SWAP) is currently unavailable',
        );
      });
    });

    describe('when a network problem occurs', () => {
      beforeEach(() => {
        paraswapInstance.getRate
          .mockRejectedValueOnce(new TypeError('Failed to fetch'))
          .mockResolvedValueOnce({
            destAmount: '123',
            bestRoute: [],
          } as any as OptimalRate);
      });

      it('retries the fetch call', async () => {
        const { getRate } = await getSwapProvider();

        const result = await getRate(buildGetRateParams());

        expect(paraswapInstance.getRate).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
          destAmount: '123',
          optimalRate: {
            destAmount: '123',
            bestRoute: [],
          },
        });
      });
    });

    it('maps srcToken to 0xEeEe... when its the native token', async () => {
      paraswapInstance.getRate.mockResolvedValueOnce({
        address: ROUTE_ADDRESS,
        destAmount: 1000,
      } as any);

      const { getRate } = await getSwapProvider();
      const params = buildGetRateParams({
        srcToken: networkContextAVA.network.networkToken.symbol,
      });

      await getRate(params);

      expect(paraswapInstance.getRate).toHaveBeenCalledWith({
        amount: params.srcAmount,
        srcToken: NATIVE_TOKEN_ADDRESS,
        srcDecimals: 18,
        destToken: 'destToken',
        destDecimals: 10,
        side: 'SELL',
        userAddress: 'addressC',
      });
    });

    it('maps destToken to 0xEeEe... when its the native token', async () => {
      paraswapInstance.getRate.mockResolvedValueOnce({
        address: ROUTE_ADDRESS,
        destAmount: 1000,
      } as any);

      const { getRate } = await getSwapProvider();
      const params = buildGetRateParams({
        destToken: networkContextAVA.network.networkToken.symbol,
      });

      await getRate(params);

      expect(paraswapInstance.getRate).toHaveBeenCalledWith({
        destToken: NATIVE_TOKEN_ADDRESS,
        destDecimals: 18,
        amount: '1000',
        srcToken: 'srcToken',
        srcDecimals: 10,
        side: 'SELL',
        userAddress: 'addressC',
      });
    });

    describe('when a server times out', () => {
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
        const { getRate } = await getSwapProvider();

        const result = await getRate(buildGetRateParams());

        expect(paraswapInstance.getRate).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
          destAmount: 1000,
          optimalRate: {
            address: '0x12341234',
            destAmount: 1000,
          },
        });
      });
    });

    describe('when a non-recoverable error occurs', () => {
      beforeEach(() => {
        paraswapInstance.getRate.mockResolvedValueOnce({
          error: 'Invalid tokens',
        } as any);
      });

      it('does not retry', async () => {
        const { getRate } = await getSwapProvider();

        await expect(getRate(buildGetRateParams())).rejects.toThrow(
          swapUtils.swapError(CommonError.Unknown, new Error('Invalid tokens')),
        );

        expect(paraswapInstance.getRate).toHaveBeenCalledTimes(1);
      });
    });

    it('returns the correct route with native token and missing side', async () => {
      paraswapInstance.getRate.mockResolvedValueOnce({
        address: ROUTE_ADDRESS,
        destAmount: 1000,
      } as any);

      const { getRate } = await getSwapProvider();
      const params = buildGetRateParams({ swapSide: undefined });

      expect(await getRate(params)).toStrictEqual({
        destAmount: 1000,
        optimalRate: {
          destAmount: 1000,
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
        userAddress: 'addressC',
      });
    });
  });

  describe('swap() function', () => {
    const getSwapParams = (overrides?: Partial<SwapParams>) =>
      ({
        srcToken: 'srcToken',
        srcDecimals: 10,
        destToken: 'destToken',
        destDecimals: 10,
        srcAmount: '1000',
        priceRoute: {
          blockNumber: 1,
          destAmount: '1',
        } as any,
        destAmount: '100',
        gasLimit: 30000,
        slippage: 1,
        ...overrides,
      }) as SwapParams;

    beforeEach(() => {
      rpcProvider.waitForTransaction.mockResolvedValue({
        status: 1,
      });
    });

    it.each([
      ['srcToken', getSwapParams({ srcToken: undefined })],
      ['destToken', getSwapParams({ destToken: undefined })],
      ['srcDecimals', getSwapParams({ srcDecimals: undefined })],
      ['destDecimals', getSwapParams({ destDecimals: undefined })],
      ['srcAmount', getSwapParams({ srcAmount: undefined })],
      ['priceRoute', getSwapParams({ priceRoute: undefined })],
      ['destAmount', getSwapParams({ destAmount: undefined })],
    ])('validates the presence of %s parameter', async (paramName, params) => {
      const { swap } = await getSwapProvider();

      await expect(swap(params)).rejects.toThrow(
        swapUtils.swapError(
          SwapErrorCode.MissingParams,
          new Error(`Missing parameter: ${paramName}`),
        ),
      );
    });

    describe('when network is not supported', () => {
      it.each([{ network: undefined }, { isTestnet: true }])(
        'returns an error',
        async (failingNetworkContext) => {
          jest
            .mocked(useNetworkContext)
            .mockReturnValue(failingNetworkContext as any);
          const { swap } = await getSwapProvider();

          await expect(swap(getSwapParams())).rejects.toThrow();
        },
      );
    });

    describe('when C-chain address is unknown', () => {
      it.each([
        { accounts: { active: undefined } },
        { accounts: { active: { addressC: '' } } },
      ])('returns an error', async (failingAccountsContext) => {
        jest
          .mocked(useAccountsContext)
          .mockReturnValue(failingAccountsContext as any);
        const { swap } = await getSwapProvider();

        await expect(swap(getSwapParams())).rejects.toThrow();
      });
    });

    describe('when SWAP feature is disabled', () => {
      beforeEach(() => {
        jest.mocked(useFeatureFlagContext).mockReturnValue({
          isFlagEnabled: () => false,
        } as any);
      });

      it('returns an error', async () => {
        const { swap } = await getSwapProvider();

        await expect(swap(getSwapParams())).rejects.toThrow(
          'Feature (SWAP) is currently unavailable',
        );
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
        const { swap } = await getSwapProvider();

        await expect(
          swap(
            getSwapParams({
              srcToken: 'JEWEL',
            }),
          ),
        ).rejects.toThrow();
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
        const { swap } = await getSwapProvider();

        await expect(
          swap(
            getSwapParams({
              srcToken: 'JEWEL',
            }),
          ),
        ).rejects.toThrow();
      });
    });

    fdescribe('when swapping non-native token', () => {
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

      fit('prompts a spend approval first', async () => {
        const { swap } = await getSwapProvider();

        await swap(
          getSwapParams({
            srcToken: 'JEWEL',
          }),
        );

        expect(allowanceMock).toHaveBeenCalled();
        expect(requestMock).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'eth_sendTransaction',
            params: [expect.objectContaining(mockedTx)],
          }),
        );
      });
    });

    it('uses Paraswap API to build the transaction data', async () => {
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

      const { swap } = await getSwapProvider();

      const {
        destAmount,
        destDecimals,
        destToken,
        srcAmount,
        srcDecimals,
        srcToken,
        priceRoute,
        slippage,
      } = getSwapParams();

      await swap({
        srcToken,
        srcDecimals,
        srcAmount,
        destToken,
        destDecimals,
        destAmount,
        priceRoute,
        slippage,
      });

      expect(paraswapInstance.buildTx).toHaveBeenCalledWith(
        {
          srcToken,
          srcDecimals,
          srcAmount: new Big(srcAmount).times(1 + slippage / 100).toFixed(0), // increased by slippage
          destToken,
          destDecimals,
          destAmount: '1', // from optimal route mock
          priceRoute,
          userAddress: 'addressC',
          partner: 'Avalanche',
          partnerAddress: '0xcEA3b9415F269B5686403909d781959570f32CF0',
          partnerFeeBps: 85,
          isDirectFeeTransfer: true,
        },
        { ignoreChecks: undefined },
      );
    });

    it('verifies Paraswap API response for correct parameters', async () => {
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

      const { swap } = await getSwapProvider();

      const {
        destAmount,
        destDecimals,
        destToken,
        srcAmount,
        srcDecimals,
        srcToken,
        priceRoute,
        slippage,
      } = getSwapParams();

      jest.useFakeTimers();

      swap({
        srcToken,
        srcDecimals,
        srcAmount,
        destToken,
        destDecimals,
        destAmount,
        priceRoute,
        slippage,
      })
        .then(() => {
          fail('Expected to throw');
        })
        .catch((err) => {
          expect(err.message).toEqual('Invalid transaction params');
        });

      await waitForRetries(10);
    });

    it('handles Paraswap API error responses', async () => {
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

      const { swap } = await getSwapProvider();

      const {
        destAmount,
        destDecimals,
        destToken,
        srcAmount,
        srcDecimals,
        srcToken,
        priceRoute,
        slippage,
      } = getSwapParams();

      jest.useFakeTimers();

      swap({
        srcToken,
        srcDecimals,
        srcAmount,
        destToken,
        destDecimals,
        destAmount,
        priceRoute,
        slippage,
      })
        .then(() => {
          fail('Expected to throw');
        })
        .catch((err) => {
          expect(err.message).toEqual('Some API error happened');
        });

      await waitForRetries(10);
    });

    it('handles API HTTP errors', async () => {
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

      const { swap } = await getSwapProvider();

      const {
        destAmount,
        destDecimals,
        destToken,
        srcAmount,
        srcDecimals,
        srcToken,
        priceRoute,
        slippage,
      } = getSwapParams();

      jest.useFakeTimers();

      swap({
        srcToken,
        srcDecimals,
        srcAmount,
        destToken,
        destDecimals,
        destAmount,
        priceRoute,
        slippage,
      })
        .then(() => {
          fail('Expected to throw');
        })
        .catch((err) => {
          expect(err.message).toEqual('Invalid transaction params');
        });

      await waitForRetries(10);
    });

    describe('when ONE_CLICK_SWAP feature flag is enabled', () => {
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
          jest.mocked(useWalletContext).mockReturnValue({
            walletDetails: {
              type: secretType,
            },
          } as any);

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
            const { swap } = await getSwapProvider();

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
          const { swap } = await getSwapProvider();

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
          const { swap } = await getSwapProvider();

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

    describe('when everything goes right', () => {
      let allowanceMock;
      let requestMock;

      beforeEach(() => {
        allowanceMock = jest.fn().mockResolvedValue(0);

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
        const { swap } = await getSwapProvider();

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
});
