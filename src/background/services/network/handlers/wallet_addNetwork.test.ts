import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { NetworkService } from '../NetworkService';
import { WalletAddNetworkHandler } from './wallet_addNetwork';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { buildRpcCall } from '@src/tests/test-utils';

jest.mock('../NetworkService');
jest.mock('@src/background/runtime/openApprovalWindow');
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
    chainId: 1243345969594372,
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
    mockNetworkService = new NetworkService({} as any, {} as any);
    // (mockNetworkService.isValidRPCUrl as jest.Mock).mockReturnValue(true);
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
    // (crypto.randomUUID as jest.Mock).mockReturnValue('uuid');
  });
  it('should return null when the network has benn already added', async () => {
    // const request = {
    //   id: '1234',
    //   method: DAppProviderRequest.WALLET_ADD_NETWORK,
    //   params: [mockActiveNetwork],
    //   site: {
    //     domain: 'core.app',
    //     tabId: 1,
    //   },
    // };
    // jest
    //   .spyOn(mockNetworkService, 'getNetwork')
    //   .mockResolvedValue({ chainId: 43114 } as any);
    // const result = await handler.handleUnauthenticated(buildRpcCall(request));
    // console.log('result: ', result);
    // expect(result).toEqual({
    //   ...request,
    //   result: null,
    // });
  });
});
