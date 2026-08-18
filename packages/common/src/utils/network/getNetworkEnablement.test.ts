import { NetworkVMType, ChainId } from '@avalabs/core-chains-sdk';
import {
  ChainList,
  Network,
  NETWORKS_ENABLED_BY_DEFAULT,
  NETWORKS_ENABLED_FOREVER,
} from '@core/types';
import {
  getAlwaysEnabledNetworkIds,
  getDefaultEnabledNetworkIds,
} from './getNetworkEnablement';

const buildNetwork = (network: Partial<Network> & { chainId: number }) =>
  ({
    chainName: `Network ${network.chainId}`,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'https://rpc.example',
    explorerUrl: 'https://explorer.example',
    networkToken: {
      name: 'Token',
      symbol: 'TKN',
      description: '',
      decimals: 18,
      logoUri: '',
    },
    logoUri: '',
    ...network,
  }) as Network;

const buildChainList = (networks: Network[]): ChainList =>
  networks.reduce<ChainList>((acc, network) => {
    acc[network.chainId] = network;
    return acc;
  }, {});

describe('getAlwaysEnabledNetworkIds', () => {
  it('returns the hardcoded floor when no network is flagged', () => {
    const chainList = buildChainList([buildNetwork({ chainId: 111 })]);

    expect(getAlwaysEnabledNetworkIds(chainList)).toEqual(
      NETWORKS_ENABLED_FOREVER,
    );
  });

  it('augments the floor with API isAlwaysEnabled networks', () => {
    const chainList = buildChainList([
      buildNetwork({ chainId: 111, isAlwaysEnabled: true }),
      buildNetwork({ chainId: 222, isAlwaysEnabled: false }),
    ]);

    const result = getAlwaysEnabledNetworkIds(chainList);

    expect(result).toEqual(expect.arrayContaining(NETWORKS_ENABLED_FOREVER));
    expect(result).toContain(111);
    expect(result).not.toContain(222);
  });

  it('does not duplicate ids already in the floor', () => {
    const firstForeverId = NETWORKS_ENABLED_FOREVER[0]!;
    const chainList = buildChainList([
      buildNetwork({ chainId: firstForeverId, isAlwaysEnabled: true }),
    ]);

    const result = getAlwaysEnabledNetworkIds(chainList);

    expect(result.filter((id) => id === firstForeverId)).toHaveLength(1);
  });

  it('keeps C-Chain in the floor when the API sends isAlwaysEnabled false', () => {
    const chainList = buildChainList([
      buildNetwork({
        chainId: ChainId.AVALANCHE_MAINNET_ID,
        isAlwaysEnabled: false,
      }),
    ]);

    expect(getAlwaysEnabledNetworkIds(chainList)).toContain(
      ChainId.AVALANCHE_MAINNET_ID,
    );
  });

  it('keeps floor ids when the API flag is undefined', () => {
    const firstForeverId = NETWORKS_ENABLED_FOREVER[0]!;
    const chainList = buildChainList([
      buildNetwork({ chainId: firstForeverId }),
    ]);

    expect(getAlwaysEnabledNetworkIds(chainList)).toContain(firstForeverId);
  });
});

describe('getDefaultEnabledNetworkIds', () => {
  it('returns the hardcoded floor when no network is flagged', () => {
    const chainList = buildChainList([buildNetwork({ chainId: 111 })]);

    const result = getDefaultEnabledNetworkIds(chainList);

    expect(result).toEqual(
      expect.arrayContaining([
        ...NETWORKS_ENABLED_BY_DEFAULT,
        ...NETWORKS_ENABLED_FOREVER,
      ]),
    );
  });

  it('augments the floor with API isEnabledByDefault networks', () => {
    const chainList = buildChainList([
      buildNetwork({ chainId: 111, isEnabledByDefault: true }),
      buildNetwork({ chainId: 222, isEnabledByDefault: false }),
    ]);

    const result = getDefaultEnabledNetworkIds(chainList);

    expect(result).toContain(111);
    expect(result).not.toContain(222);
  });

  it('includes always-enabled networks as enabled by default', () => {
    const chainList = buildChainList([
      buildNetwork({ chainId: 333, isAlwaysEnabled: true }),
    ]);

    expect(getDefaultEnabledNetworkIds(chainList)).toContain(333);
  });

  it('removes floor ids when the API flags them isEnabledByDefault false', () => {
    const firstDefaultId = NETWORKS_ENABLED_BY_DEFAULT[0]!;
    const chainList = buildChainList([
      buildNetwork({ chainId: firstDefaultId, isEnabledByDefault: false }),
    ]);

    expect(getDefaultEnabledNetworkIds(chainList)).not.toContain(
      firstDefaultId,
    );
  });

  it('keeps always-enabled networks even when flagged isEnabledByDefault false', () => {
    const chainList = buildChainList([
      buildNetwork({
        chainId: 444,
        isAlwaysEnabled: true,
        isEnabledByDefault: false,
      }),
    ]);

    expect(getDefaultEnabledNetworkIds(chainList)).toContain(444);
  });
});
