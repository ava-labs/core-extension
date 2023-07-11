import { DefiItemType } from '../models';
import { DebankService } from './DebankService';

import fixture_chainList from './fixtures/chain_list.json';
import fixture_userAllComplexProtocolList from './fixtures/user_all_complex_protocol_list.json';

const buildResponse = (result?: any) => ({
  json: () => Promise.resolve(result),
});

const waitForInitialization = async () => {
  // Wait a tick for the initialization promise to settle.
  await new Promise(process.nextTick);
};

describe('src/background/services/defi/debank/DebankService.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('upon construction', () => {
    it('fetches the chain list', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce(buildResponse());

      new DebankService();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching('/chain/list$')
      );
    });

    describe('when initialization succeeds', () => {
      beforeEach(() => {
        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(buildResponse([{ community_id: 1 }]));
      });

      it('saves the chain list', async () => {
        const service = new DebankService();

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
            buildResponse(fixture_userAllComplexProtocolList)
          );
      });

      it('saves an empty chain list', async () => {
        const service = new DebankService();

        await waitForInitialization();

        expect(service.chains).toEqual([]);
      });

      it('still lets other requests through', async () => {
        const service = new DebankService();

        await waitForInitialization();
        await service.getUserProtocols('0x1234');

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('user/all_complex_protocol_list')
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
          buildResponse(fixture_userAllComplexProtocolList)
        );
    });

    it('queries the correct endpoint', async () => {
      const service = new DebankService();

      await waitForInitialization();
      await service.getUserProtocols('0x1234');

      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringContaining('user/all_complex_protocol_list?id=0x1234')
      );
    });

    it('normalizes the results', async () => {
      const service = new DebankService();

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
      const service = new DebankService();

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
      const service = new DebankService();

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
            buildResponse(fixture_userAllComplexProtocolList)
          );
      });

      it('does not decorate results with chain data', async () => {
        const service = new DebankService();

        const protocols = await service.getUserProtocols('0x1234');

        protocols.forEach((protocol) => {
          expect(protocol.chainId).toBeUndefined();
          expect(protocol.chainLogoUrl).toBeUndefined();
        });
      });
    });
  });
});
