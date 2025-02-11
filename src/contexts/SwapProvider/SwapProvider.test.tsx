import { SwapSide } from 'paraswap';
import { createRef, forwardRef, useImperativeHandle } from 'react';

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
import { GetRateParams, SwapContextAPI, SwapParams } from './models';
import { SwapContextProvider, useSwapContext } from './SwapProvider';
import { useNetworkFeeContext } from '../NetworkFeeProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { SecretType } from '@src/background/services/secrets/models';
import { RpcMethod } from '@avalabs/vm-module-types';

const API_URL = 'https://apiv5.paraswap.io';
const ACTIVE_ACCOUNT_ADDRESS = 'addressC';
const ROUTE_ADDRESS = '0x0000000000';

const getSwapProvider = (): SwapContextAPI => {
  const ref = createRef<SwapContextAPI>();

  render(
    <SwapContextProvider>
      <TestConsumerComponent ref={ref} />
    </SwapContextProvider>,
  );

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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => k,
  }),
}));

jest.mock('ethers');
jest.mock('@avalabs/core-k2-components', () => ({
  toast: {
    success: jest.fn(),
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

  const networkContext = {
    network: {
      isTestnet: false,
      networkToken: {
        symbol: 'AVAX',
      },
    },
    avaxProviderC: {
      waitForTransaction: jest.fn(),
      estimateGas: jest.fn(),
    },
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({}),
      ok: true,
    } as any);

    jest.mocked(useWalletContext).mockReturnValue({
      walletDetails: {
        type: SecretType.Mnemonic,
      },
    } as any);
    jest.mocked(useConnectionContext).mockReturnValue(connectionContext);
    jest.mocked(useAccountsContext).mockReturnValue(accountsContext);
    jest.mocked(useNetworkContext).mockReturnValue(networkContext);
    jest.mocked(useFeatureFlagContext).mockReturnValue({
      isFlagEnabled: (flagName) => flagName !== FeatureGates.ONE_CLICK_SWAP,
    } as any);

    jest
      .mocked(networkContext.avaxProviderC.estimateGas)
      .mockResolvedValue(10000n);
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
    const getExpectedURL = (path, params: GetRateParams) => {
      const {
        srcToken,
        srcDecimals,
        destToken,
        destDecimals,
        srcAmount,
        swapSide,
      } = params;

      const expectedQuery = new URLSearchParams({
        srcToken,
        destToken,
        amount: srcAmount,
        side: swapSide || SwapSide.SELL,
        network: `${ChainId.AVALANCHE_MAINNET_ID}`,
        srcDecimals: `${srcDecimals}`,
        destDecimals: `${destDecimals}`,
        userAddress: ACTIVE_ACCOUNT_ADDRESS,
      });

      return `${API_URL}/${path}/?${expectedQuery.toString()}`;
    };

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
          const { getRate } = getSwapProvider();

          await expect(getRate(buildGetRateParams())).rejects.toThrow(
            'Unsupported network',
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
        const { getRate } = getSwapProvider();

        await expect(getRate(buildGetRateParams())).rejects.toThrow(
          'Account address missing',
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
        const { getRate } = getSwapProvider();

        await expect(getRate(buildGetRateParams())).rejects.toThrow(
          'Feature (SWAP) is currently unavailable',
        );
      });
    });

    describe('when a network problem occurs', () => {
      beforeEach(() => {
        jest
          .spyOn(global, 'fetch')
          .mockRejectedValueOnce(new TypeError('Failed to fetch'))
          .mockResolvedValueOnce({
            json: () => ({
              priceRoute: { price: 'route' },
            }),
          } as any);
      });

      it('retries the fetch call', async () => {
        const { getRate } = getSwapProvider();

        const result = await getRate(buildGetRateParams());

        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
          optimalRate: {
            price: 'route',
          },
        });
      });
    });

    describe('when a server times out', () => {
      beforeEach(() => {
        jest
          .spyOn(global, 'fetch')
          .mockResolvedValueOnce({
            json: () => ({
              error: 'Price Timeout',
            }),
          } as any)
          .mockResolvedValueOnce({
            json: () => ({
              priceRoute: { price: 'route' },
            }),
          } as any);
      });

      it('retries the fetch call', async () => {
        const { getRate } = getSwapProvider();

        const result = await getRate(buildGetRateParams());

        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
          optimalRate: {
            price: 'route',
          },
        });
      });
    });

    describe('when a non-recoverable error occurs', () => {
      beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          json: () => ({
            error: 'Invalid tokens',
          }),
          ok: true,
        } as any);
      });

      it('does not retry', async () => {
        const { getRate } = getSwapProvider();

        await expect(getRate(buildGetRateParams())).rejects.toThrow(
          'Invalid tokens',
        );

        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });

    it('returns the correct route with native token and missing side', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: async () => ({
          priceRoute: {
            address: ROUTE_ADDRESS,
            destAmount: 1000,
          },
        }),
        ok: true,
      } as any);

      const { getRate } = getSwapProvider();
      const params = buildGetRateParams({ swapSide: undefined });

      expect(await getRate(params)).toStrictEqual({
        destAmount: 1000,
        optimalRate: {
          destAmount: 1000,
          address: ROUTE_ADDRESS,
        },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        getExpectedURL('prices', params),
      );
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
      networkContext.avaxProviderC.waitForTransaction.mockResolvedValue({
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
      const { swap } = getSwapProvider();

      await expect(swap(params)).rejects.toThrow(
        `Missing parameter: ${paramName}`,
      );
    });

    describe('when network is not supported', () => {
      it.each([{ network: undefined }, { isTestnet: true }])(
        'returns an error',
        async (failingNetworkContext) => {
          jest
            .mocked(useNetworkContext)
            .mockReturnValue(failingNetworkContext as any);
          const { swap } = getSwapProvider();

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
        const { swap } = getSwapProvider();

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
        const { swap } = getSwapProvider();

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
        const { swap } = getSwapProvider();

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

        jest
          .mocked(networkContext.avaxProviderC.estimateGas)
          .mockResolvedValue(10000n);

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
        const { swap } = getSwapProvider();

        await expect(
          swap(
            getSwapParams({
              srcToken: 'JEWEL',
            }),
          ),
        ).rejects.toThrow();
      });
    });

    describe('when swapping non-native token', () => {
      let allowanceMock;
      let requestMock;

      const mockedTx = {
        gas: '0x2710', // 10000n
        data: 'approval-tx-data',
      };

      beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
          json: jest.fn().mockResolvedValue({
            data: 'data',
            to: '0xParaswapContractAddress',
            from: '0x123',
            value: '0x0',
            gas: '1223',
            chainId: 123,
          }),
          ok: true,
        } as any);

        allowanceMock = jest.fn().mockResolvedValue(0);
        requestMock = jest.fn().mockResolvedValue('0xALLOWANCE_HASH');

        jest
          .mocked(networkContext.avaxProviderC.estimateGas)
          .mockResolvedValue(10000n);
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
        const { swap } = getSwapProvider();

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

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          data: 'data',
          to: '0xParaswapContractAddress',
          from: '0x123',
          value: '0x0',
          chainId: 123,
          someExtraParam: '123',
        }),
        ok: true,
      } as any);

      jest.mocked(Contract).mockReturnValue({
        allowance: jest.fn().mockResolvedValue(Infinity),
      } as any);

      jest.mocked(useConnectionContext).mockReturnValue({
        request: requestMock.mockResolvedValue('0xSwapHash'),
        events: jest.fn(),
      } as any);

      const { swap } = getSwapProvider();

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

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('transactions/43114'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            srcToken,
            srcDecimals,
            srcAmount: new Big(srcAmount).times(1 + slippage / 100).toFixed(0), // increased by slippage
            destToken,
            destDecimals,
            destAmount: '1', // from optimal route mock
            priceRoute,
            userAddress: 'addressC',
            partner: 'Avalanche',
          }),
        }),
      );
    });

    it('verifies Paraswap API response for correct parameters', async () => {
      const requestMock = jest.fn();

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          data: '',
          to: '',
          from: '0x123',
          value: '0x0',
          chainId: 123,
        }),
        ok: true,
      } as any);

      jest.mocked(Contract).mockReturnValue({
        allowance: jest.fn().mockResolvedValue(Infinity),
      } as any);

      jest.mocked(useConnectionContext).mockReturnValue({
        request: requestMock.mockResolvedValue('0xSwapHash'),
        events: jest.fn(),
      } as any);

      const { swap } = getSwapProvider();

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

      const { swap } = getSwapProvider();

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

      const { swap } = getSwapProvider();

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

        jest.spyOn(global, 'fetch').mockResolvedValue({
          json: async () => ({
            data: 'data',
            to: '0xParaswapContractAddress',
            from: '0x123',
            value: '0x0',
            chainId: 123,
          }),
          ok: true,
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
            const { swap } = getSwapProvider();

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
          const { swap } = getSwapProvider();

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
          const { swap } = getSwapProvider();

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
        const { swap } = getSwapProvider();

        await expect(() =>
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
