import type { Network } from '@avalabs/core-chains-sdk';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { DefiItemType } from '../defi/models';
import type { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { FeatureGates } from '../featureFlags/models';
import { DebankService } from './DebankService';

import fixture_chainList from './fixtures/chain_list.json';
import fixture_explainTx from './fixtures/explain_tx.json';
import fixture_preExecTx from './fixtures/pre_exec_tx.json';
import fixture_userAllComplexProtocolList from './fixtures/user_all_complex_protocol_list.json';
import type { EthSendTransactionParamsWithGas } from '../wallet/handlers/eth_sendTransaction/models';
import { TransactionType } from '../wallet/handlers/eth_sendTransaction/models';
import { debankActionsToTransactionActions } from './utils/debankActionsToTransactionActions';

jest.mock('../featureFlags/FeatureFlagService');
jest.mock('./utils/debankActionsToTransactionActions');

const buildResponse = (result?: any) => ({
  json: () => Promise.resolve(result),
  ok: true,
});

const waitForInitialization = async () => {
  // Wait a tick for the initialization promise to settle.
  await new Promise(process.nextTick);
};

describe('src/background/services/defi/debank/DebankService.ts', () => {
  let featureFlagService: FeatureFlagService;
  beforeEach(() => {
    jest.clearAllMocks();

    featureFlagService = {
      featureFlags: {
        [FeatureGates.DEBANK_TRANSACTION_PARSING]: true,
        [FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: true,
      },
      ensureFlagEnabled: jest.fn(),
    } as any;

    jest.mocked(debankActionsToTransactionActions).mockReturnValue([
      {
        type: TransactionType.DEPLOY_CONTRACT,
        fromAddress: '0x123',
      },
    ]);
  });

  describe('upon construction', () => {
    it('fetches the chain list', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce(buildResponse());

      new DebankService(featureFlagService);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching('/chain/list$'),
      );
    });

    describe('when initialization succeeds', () => {
      beforeEach(() => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(buildResponse([{ community_id: 1 }]));
      });

      it('saves the chain list', async () => {
        const service = new DebankService(featureFlagService);

        await waitForInitialization();

        expect(service.chains).toEqual([{ community_id: 1 }]);
      });
    });

    describe('when initialization fails', () => {
      beforeEach(() => {
        global.fetch = jest
          .fn()
          .mockRejectedValueOnce(buildResponse())
          .mockResolvedValueOnce(
            buildResponse(fixture_userAllComplexProtocolList),
          );
      });

      it('saves an empty chain list', async () => {
        const service = new DebankService(featureFlagService);

        await waitForInitialization();

        expect(service.chains).toEqual([]);
      });

      it('still lets other requests through', async () => {
        const service = new DebankService(featureFlagService);

        await waitForInitialization();
        await service.getUserProtocols('0x1234');

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('user/all_complex_protocol_list'),
        );
      });
    });
  });

  describe('.getUserProtocols()', () => {
    beforeEach(async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce(buildResponse(fixture_chainList))
        .mockResolvedValueOnce(
          buildResponse(fixture_userAllComplexProtocolList),
        );
    });

    it('queries the correct endpoint', async () => {
      const service = new DebankService(featureFlagService);

      await waitForInitialization();
      await service.getUserProtocols('0x1234');

      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringContaining('user/all_complex_protocol_list?id=0x1234'),
      );
    });

    it('normalizes the results', async () => {
      const service = new DebankService(featureFlagService);

      await waitForInitialization();
      const protocols = await service.getUserProtocols('0x1234');

      expect(protocols).toEqual([
        expect.objectContaining({
          id: 'avax_aave3',
          groups: [
            {
              name: 'Lending',
              totalUsdValue: 12.5,
              items: [
                expect.objectContaining({
                  name: 'Lending',
                  type: DefiItemType.Lending,
                  supplyTokens: [
                    expect.objectContaining({
                      symbol: 'USDC',
                      price: 1,
                      amount: 3,
                      usdValue: 3,
                    }),
                  ],
                  borrowTokens: [
                    expect.objectContaining({
                      symbol: 'USDt',
                      price: 1,
                      amount: 0.5,
                      usdValue: 0.5,
                    }),
                  ],
                  rewardTokens: [
                    expect.objectContaining({
                      symbol: 'AVAX',
                      price: 20,
                      amount: 0.5,
                      usdValue: 10,
                    }),
                  ],
                }),
              ],
            },
          ],
          logoUrl:
            'https://static.debank.com/image/project/logo_url/avax_aave3/9459cb86efd13145537eab8104e923bf.png',
          name: 'Aave V3',
          siteUrl: 'https://app.aave.com',
        }),
        expect.objectContaining({
          id: 'avax_pangolin',
          groups: [
            {
              name: 'Farming',
              totalUsdValue: 0.104,
              items: [
                expect.objectContaining({
                  name: 'Farming',
                  type: DefiItemType.Common,
                  supplyTokens: [
                    expect.objectContaining({
                      symbol: 'PNG',
                      price: 0.02,
                      amount: 5,
                      usdValue: 0.1,
                    }),
                  ],
                  rewardTokens: [
                    expect.objectContaining({
                      symbol: 'PNG',
                      price: 0.02,
                      amount: 0.2,
                      usdValue: 0.004,
                    }),
                  ],
                }),
              ],
            },
          ],
          logoUrl:
            'https://static.debank.com/image/project/logo_url/avax_pangolin/0a6a8bcb10deb8000f445160d05b0571.png',
          name: 'Pangolin',
          siteUrl: 'https://app.pangolin.exchange',
        }),
        expect.objectContaining({
          id: 'avax_traderjoexyz',
          groups: [
            {
              name: 'Liquidity Pool',
              totalUsdValue: 1.7 + 0.103,
              items: [
                expect.objectContaining({
                  name: 'Liquidity Pool',
                  type: DefiItemType.Common,
                  netUsdValue: 1.7,
                  supplyTokens: [
                    expect.objectContaining({
                      symbol: 'USDC.e',
                      price: 1.0,
                      amount: 0.5,
                      usdValue: 0.5,
                    }),
                    expect.objectContaining({
                      symbol: 'USDC',
                      price: 1.0,
                      amount: 1,
                      usdValue: 1,
                    }),
                  ],
                  rewardTokens: [
                    expect.objectContaining({
                      symbol: 'USDC.e',
                      price: 1.0,
                      amount: 0.1,
                      usdValue: 0.1,
                    }),
                    expect.objectContaining({
                      symbol: 'USDC',
                      price: 1.0,
                      amount: 0.1,
                      usdValue: 0.1,
                    }),
                  ],
                }),
                expect.objectContaining({
                  name: 'Liquidity Pool',
                  type: DefiItemType.Common,
                  netUsdValue: 0.103,
                  supplyTokens: [
                    expect.objectContaining({
                      symbol: 'AVAX',
                      price: 11.8,
                      amount: 0.1,
                      usdValue: 1.1800000000000002,
                    }),
                    expect.objectContaining({
                      symbol: 'USDC',
                      price: 1.0,
                      amount: 0.01,
                      usdValue: 0.01,
                    }),
                  ],
                  rewardTokens: [
                    expect.objectContaining({
                      symbol: 'AVAX',
                      price: 11.8,
                      amount: 0.01,
                      usdValue: 0.11800000000000001,
                    }),
                    expect.objectContaining({
                      symbol: 'USDC',
                      price: 1.0,
                      amount: 0.02,
                      usdValue: 0.02,
                    }),
                  ],
                }),
              ],
            },
            {
              name: 'Staked',
              totalUsdValue: 0.403,
              items: [
                expect.objectContaining({
                  name: 'Staked',
                  type: DefiItemType.Common,
                  netUsdValue: 0.403,
                  supplyTokens: [
                    expect.objectContaining({
                      symbol: 'JOE',
                      price: 0.3,
                      amount: 1,
                      usdValue: 0.3,
                    }),
                  ],
                  rewardTokens: [
                    expect.objectContaining({
                      symbol: 'USDC',
                      price: 1.0,
                      amount: 0.1,
                      usdValue: 0.1,
                    }),
                    expect.objectContaining({
                      symbol: 'JOE',
                      price: 0.3,
                      amount: 0.01,
                      usdValue: 0.003,
                    }),
                  ],
                }),
              ],
            },
          ],
          logoUrl:
            'https://static.debank.com/image/project/logo_url/avax_traderjoexyz/961dd8fbeac3d6ee62170c8db600ba25.png',
          name: 'Trader Joe',
          siteUrl: 'https://traderjoexyz.com',
        }),
      ]);
    });

    it('decorates results with chain id and logo URL', async () => {
      const service = new DebankService(featureFlagService);

      const protocols = await service.getUserProtocols('0x1234');

      expect(protocols).toEqual([
        expect.objectContaining({
          chainId: 43114,
          chainLogoUrl:
            'https://static.debank.com/image/chain/logo_url/avax/4d1649e8a0c7dec9de3491b81807d402.png',
        }),
        expect.objectContaining({
          chainId: 43114,
          chainLogoUrl:
            'https://static.debank.com/image/chain/logo_url/avax/4d1649e8a0c7dec9de3491b81807d402.png',
        }),
        expect.objectContaining({
          chainId: 43114,
          chainLogoUrl:
            'https://static.debank.com/image/chain/logo_url/avax/4d1649e8a0c7dec9de3491b81807d402.png',
        }),
      ]);
    });

    it('calculates total value for each defi protocol', async () => {
      const service = new DebankService(featureFlagService);

      const protocols = await service.getUserProtocols('0x1234');

      expect(protocols).toEqual([
        expect.objectContaining({
          totalUsdValue: 12.5,
        }),
        expect.objectContaining({
          totalUsdValue: 0.104,
        }),
        expect.objectContaining({
          totalUsdValue: 2.206,
        }),
      ]);
    });

    describe('when initialization fails', () => {
      beforeEach(async () => {
        global.fetch = jest
          .fn()
          .mockRejectedValueOnce(buildResponse())
          .mockResolvedValueOnce(
            buildResponse(fixture_userAllComplexProtocolList),
          );
      });

      it('does not decorate results with chain data', async () => {
        const service = new DebankService(featureFlagService);

        const protocols = await service.getUserProtocols('0x1234');

        protocols.forEach((protocol) => {
          expect(protocol.chainId).toBeUndefined();
          expect(protocol.chainLogoUrl).toBeUndefined();
        });
      });
    });
  });

  describe('.isPreExecuteTxAvailable()', () => {
    it('returns false if feature flag is disabled', async () => {
      const service = new DebankService({
        featureFlags: {
          [FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: false,
        },
      } as any);

      await expect(service.isPreExecuteTxAvailable(1)).resolves.toBe(false);
    });

    it('waits for initialization', async () => {
      let resolveFetch;
      global.fetch = jest.fn().mockImplementation(
        () =>
          new Promise((res) => {
            resolveFetch = res;
          }),
      );

      const service = new DebankService(featureFlagService);

      const resultCallback = jest.fn();
      service.isPreExecuteTxAvailable(1).then(resultCallback);

      await new Promise(process.nextTick);

      expect(resultCallback).not.toHaveBeenCalled();

      resolveFetch(buildResponse(fixture_chainList));

      await new Promise(process.nextTick);

      expect(resultCallback).toHaveBeenCalledWith(false);
    });

    it('returns false for unsupported chains', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(buildResponse(fixture_chainList));

      const service = new DebankService(featureFlagService);

      await expect(service.isPreExecuteTxAvailable(123)).resolves.toBe(false);
    });

    it('returns true for supported chains', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(buildResponse(fixture_chainList));

      const service = new DebankService(featureFlagService);

      await expect(service.isPreExecuteTxAvailable(43114)).resolves.toBe(true);
    });
  });

  describe('.parseTransaction()', () => {
    const networkMock: Network = {
      chainId: 43114,
      vmName: NetworkVMType.EVM,
      chainName: '',
      rpcUrl: '',
      explorerUrl: 'https://explorer.url',
      logoUri: '',
      networkToken: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
        description: '',
        logoUri: '',
      },
    };

    const requestMock: EthSendTransactionParamsWithGas = {
      from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
      to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
      value: '0x5af3107a4000',
      gasLimit: '0x123',
      maxFeePerGas: '0x456',
      type: 2,
    };

    it('throws error if `DEBANK_TRANSACTION_PARSING` flag is disabled', async () => {
      const service = new DebankService({
        ensureFlagEnabled: jest.fn().mockImplementation((flag) => {
          throw new Error(`${flag} flag disabled`);
        }),
      } as any);

      await expect(
        service.parseTransaction(networkMock, requestMock),
      ).rejects.toStrictEqual(
        new Error('debank-transaction-parsing flag disabled'),
      );
    });

    it('waits for initialization', async () => {
      let resolveFetch;
      global.fetch = jest
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise((res) => {
              resolveFetch = res;
            }),
        )
        .mockRejectedValue(new Error('network error'));

      const service = new DebankService(featureFlagService);

      const resultCallback = jest.fn();
      service
        .parseTransaction(networkMock, requestMock)
        .catch(() => {})
        .finally(resultCallback);

      await new Promise(process.nextTick);

      expect(resultCallback).not.toHaveBeenCalled();

      resolveFetch(buildResponse(fixture_chainList));

      await new Promise(process.nextTick);

      expect(resultCallback).toHaveBeenCalled();
    });

    describe('explainTx', () => {
      it('throws error if explain tx fails', async () => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(buildResponse(fixture_chainList))
          .mockRejectedValue(new Error('network error'));

        const service = new DebankService({
          featureFlags: {
            [FeatureGates.DEBANK_TRANSACTION_PARSING]: true,
            [FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: false,
          },
          ensureFlagEnabled: jest.fn(),
        } as any);

        await expect(
          service.parseTransaction(networkMock, requestMock),
        ).rejects.toStrictEqual(new Error('DeBank transaction parsing failed'));

        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenNthCalledWith(
          2,
          'undefined/proxy/debank/v1/wallet/explain_tx',
          {
            body: '{"tx":{"from":"0x473B6494E2632ec1c9F90Ce05327e96e30767638","to":"0x473B6494E2632ec1c9F90Ce05327e96e30767638","data":"0x","value":"0x5af3107a4000","chainId":43114,"gas":"0x0","nonce":"0x1"}}',
            headers: { 'content-type': 'application/json' },
            method: 'post',
          },
        );
      });

      it('throws error if empty response is returned', async () => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(buildResponse(fixture_chainList))
          .mockResolvedValue(buildResponse({}));

        const service = new DebankService({
          ...featureFlagService,
          featureFlags: {
            ...featureFlagService.featureFlags,
            [FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: false,
          },
        } as any);

        await expect(
          service.parseTransaction(networkMock, requestMock),
        ).rejects.toStrictEqual(new Error('DeBank transaction parsing failed'));

        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      it('throws error if response is not ok', async () => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(buildResponse(fixture_chainList))
          .mockResolvedValue({
            ...buildResponse(fixture_explainTx),
            ok: false,
          });

        const service = new DebankService({
          ...featureFlagService,
          featureFlags: {
            ...featureFlagService.featureFlags,
            [FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: false,
          },
        } as any);

        await expect(
          service.parseTransaction(networkMock, requestMock),
        ).rejects.toStrictEqual(new Error('DeBank transaction parsing failed'));

        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      it('returns parsed transaction information', async () => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(buildResponse(fixture_chainList))
          .mockResolvedValue(buildResponse(fixture_explainTx));
        jest.mocked(debankActionsToTransactionActions).mockReturnValue([
          {
            type: TransactionType.DEPLOY_CONTRACT,
            fromAddress: '0x123',
          },
        ]);

        const service = new DebankService({
          ...featureFlagService,
          featureFlags: {
            ...featureFlagService.featureFlags,
            [FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: false,
          },
        } as any);

        const result = await service.parseTransaction(networkMock, requestMock);

        expect(result).toEqual({
          abi: {
            func: 'setApprovalForAll',
            params: ['0x1E0049783F008A0085193E00003D00cd54003c71', false],
          },
          actions: [{ fromAddress: '0x123', type: 'deploy_contract' }],
          balanceChange: undefined,
          fromAddress: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          gas: {
            gasLimit: 291,
            maxFeePerGas: 1110n,
            maxPriorityFeePerGas: undefined,
            recommendedGasLimit: undefined,
          },
          preExecSuccess: false,
        });

        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    describe('preExecuteTx', () => {
      it('does nothing when feature flag is off', async () => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(buildResponse(fixture_chainList))
          .mockResolvedValue(buildResponse(fixture_explainTx));

        const service = new DebankService({
          featureFlags: {
            [FeatureGates.DEBANK_TRANSACTION_PARSING]: true,
            [FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: false,
          },
          ensureFlagEnabled: jest
            .fn()
            .mockImplementation(
              (flag) => flag !== FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION,
            ),
        } as any);

        await expect(
          service.parseTransaction(networkMock, requestMock),
        ).resolves.toStrictEqual({
          abi: {
            func: 'setApprovalForAll',
            params: ['0x1E0049783F008A0085193E00003D00cd54003c71', false],
          },
          actions: [{ fromAddress: '0x123', type: 'deploy_contract' }],
          balanceChange: undefined,
          fromAddress: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          gas: {
            gasLimit: 291,
            maxFeePerGas: 1110n,
            maxPriorityFeePerGas: undefined,
            recommendedGasLimit: undefined,
          },
          preExecSuccess: false,
        });

        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      it('returns explain result if pre-exec fails', async () => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(buildResponse(fixture_chainList))
          .mockResolvedValueOnce(buildResponse(fixture_explainTx))
          .mockRejectedValue(new Error('network error'));

        const service = new DebankService(featureFlagService);

        await expect(
          service.parseTransaction(networkMock, requestMock),
        ).resolves.toStrictEqual({
          abi: {
            func: 'setApprovalForAll',
            params: ['0x1E0049783F008A0085193E00003D00cd54003c71', false],
          },
          actions: [{ fromAddress: '0x123', type: 'deploy_contract' }],
          balanceChange: undefined,
          fromAddress: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          gas: {
            gasLimit: 291,
            maxFeePerGas: 1110n,
            maxPriorityFeePerGas: undefined,
            recommendedGasLimit: undefined,
          },
          preExecSuccess: false,
        });

        expect(global.fetch).toHaveBeenCalledTimes(3);
      });

      it('returns explain result if pre-exec is not ok', async () => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(buildResponse(fixture_chainList))
          .mockResolvedValueOnce(buildResponse(fixture_explainTx))
          .mockResolvedValueOnce({
            ...buildResponse(fixture_preExecTx),
            ok: false,
          });

        const service = new DebankService(featureFlagService);

        await expect(
          service.parseTransaction(networkMock, requestMock),
        ).resolves.toStrictEqual({
          abi: {
            func: 'setApprovalForAll',
            params: ['0x1E0049783F008A0085193E00003D00cd54003c71', false],
          },
          actions: [{ fromAddress: '0x123', type: 'deploy_contract' }],
          balanceChange: undefined,
          fromAddress: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          gas: {
            gasLimit: 291,
            maxFeePerGas: 1110n,
            maxPriorityFeePerGas: undefined,
            recommendedGasLimit: undefined,
          },
          preExecSuccess: false,
        });

        expect(global.fetch).toHaveBeenCalledTimes(3);
      });

      it('returns parsed tx info', async () => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(buildResponse(fixture_chainList))
          .mockResolvedValueOnce(buildResponse(fixture_explainTx))
          .mockResolvedValueOnce(buildResponse(fixture_preExecTx));

        const service = new DebankService(featureFlagService);

        await expect(
          service.parseTransaction(networkMock, requestMock),
        ).resolves.toStrictEqual({
          abi: {
            func: 'setApprovalForAll',
            params: ['0x1E0049783F008A0085193E00003D00cd54003c71', false],
          },
          actions: [{ fromAddress: '0x123', type: 'deploy_contract' }],
          balanceChange: {
            receiveNftList: [
              {
                address: '0x2123123',
                amount: 0n,
                collection: {
                  description: 'NFT Collection description',
                  logoUri: 'collection.url',
                  name: 'NFT Collection name',
                },
                description: 'NFT description',
                isScam: undefined,
                isSuspicious: undefined,
                logoUri: 'ntf2.thumbnail.url',
                name: 'OtherNFT',
                type: 'ERC1155',
                symbol: undefined,
              },
            ],
            receiveTokenList: [
              {
                address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
                amount: 100000505n,
                decimals: 6,
                isInfinity: false,
                isScam: false,
                isSuspicious: false,
                logoUri: 'token.logo.url',
                name: 'USD Coin',
                symbol: 'USDC',
                usdPrice: 1.0001,
                usdValue: 3,
              },
            ],
            sendNftList: [
              {
                address: '0x253954d29386e174ed4bc69902391a8ed3fd51ca',
                amount: 0n,
                collection: {
                  description: 'NFT Collection description',
                  logoUri: 'collection.url',
                  name: 'NFT Collection name',
                },
                description: 'NFT description',
                isScam: undefined,
                isSuspicious: undefined,
                logoUri: 'ntf.thumbnail.url',
                name: 'NFTflow Membership Pass',
                type: 'ERC1155',
                symbol: undefined,
              },
            ],
            sendTokenList: [
              {
                address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
                amount: 3000505n,
                decimals: 6,
                isInfinity: false,
                isScam: false,
                isSuspicious: false,
                logoUri: 'token.logo.url',
                name: 'USD Coin',
                symbol: 'USDC',
                usdPrice: 1.0001,
                usdValue: 3,
              },
            ],
            usdValueChange: 0,
          },
          fromAddress: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          gas: {
            gasLimit: 291,
            maxFeePerGas: 1110n,
            maxPriorityFeePerGas: undefined,
            recommendedGasLimit: 47037,
          },
          preExecSuccess: true,
        });

        expect(global.fetch).toHaveBeenCalledTimes(3);
      });
    });
  });
});
