import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { DAppProviderRequest, DEFERRED_RESPONSE } from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { NetworkService } from '../NetworkService';
import { WalletAddNetworkHandler } from './wallet_addNetwork';

jest.mock('../NetworkService');
jest.mock('~/runtime/openApprovalWindow');
describe('background/services/network/handlers/wallet_addNetwork.ts', () => {
  const mockActiveNetwork: Network = {
    chainName: 'Avalanche (C-Chain)',
    chainId: 43114,
    vmName: NetworkVMType.EVM,
    subnetExplorerUriId: 'c-chain',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://explorer.url',
    networkToken: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      description: '',
      logoUri: 'token-logo.png',
    },
    logoUri: 'chain-logo.png',
    tokens: [],
    primaryColor: 'violet',
  };

  const mockHvmNetwork = {
    chainName: 'hyperVM-network',
    caipId: 'hvm:11414092629610059909939753419964',
    rpcUrl: 'http://localhost',
    networkToken: {
      symbol: 'HVM',
      decimals: 18,
      description: '',
      name: 'HyperToken',
      logoUri: '',
    },
    logoUri: '',
    tokenName: 'HyperToken',
    decimals: 18,
    vmName: NetworkVMType.HVM,
    additionalProperty1: '1',
    additionalProperty2: '2',
    additionalProperty3: '3',
  };
  let mockNetworkService: NetworkService;
  let handler: WalletAddNetworkHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    mockNetworkService = new NetworkService({} as any, {} as any, {} as any);
    jest.spyOn(mockNetworkService, 'setNetwork');
    mockNetworkService.allNetworks = {
      promisify: () =>
        Promise.resolve({
          [mockActiveNetwork.chainId]: { ...mockActiveNetwork },
          [43113]: { ...mockActiveNetwork, id: 43113 },
        }),
    } as any;
    handler = new WalletAddNetworkHandler(mockNetworkService);
    (openApprovalWindow as jest.Mock).mockReturnValue({ id: 123 });
  });
  it('should throw an error because there is no site info', async () => {
    const request = {
      id: '1234',
      method: DAppProviderRequest.WALLET_ADD_NETWORK,
      params: [mockActiveNetwork],
      site: {
        domain: '',
        tabId: 1,
      },
    };
    jest
      .spyOn(mockNetworkService, 'getNetwork')
      .mockResolvedValue({ chainId: 43114 } as any);
    const result = await handler.handleUnauthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      error: new Error('Missing dApp domain information'),
    });
  });
  it('should return null when the network has benn already added', async () => {
    const request = {
      id: '1234',
      method: DAppProviderRequest.WALLET_ADD_NETWORK,
      params: [mockActiveNetwork],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    };
    jest
      .spyOn(mockNetworkService, 'getNetwork')
      .mockResolvedValue({ chainId: 43114 } as any);
    const result = await handler.handleUnauthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      result: null,
    });
  });

  it('should add the network properly', async () => {
    const request = {
      id: '1234',
      method: DAppProviderRequest.WALLET_ADD_NETWORK,
      params: [mockHvmNetwork],
      site: {
        domain: 'hvm.app',
        tabId: 1,
      },
    };
    jest.spyOn(mockNetworkService, 'getNetwork').mockResolvedValue(undefined);
    const result = await handler.handleUnauthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      result: DEFERRED_RESPONSE,
    });
  });
});
