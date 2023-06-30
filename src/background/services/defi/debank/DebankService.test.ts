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
          logoUrl:
            'https://static.debank.com/image/project/logo_url/avax_aave3/9459cb86efd13145537eab8104e923bf.png',
          name: 'Aave V3',
          siteUrl: 'https://app.aave.com',
        }),
        expect.objectContaining({
          id: 'avax_pangolin',
          logoUrl:
            'https://static.debank.com/image/project/logo_url/avax_pangolin/0a6a8bcb10deb8000f445160d05b0571.png',
          name: 'Pangolin',
          siteUrl: 'https://app.pangolin.exchange',
        }),
        expect.objectContaining({
          id: 'avax_traderjoexyz',
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
          totalUsdValue: 2.5007843529359093,
        }),
        expect.objectContaining({
          totalUsdValue: 0.13330312829968227,
        }),
        expect.objectContaining({
          totalUsdValue: 0.2344205136007694,
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
