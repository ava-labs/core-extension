import { WalletSwitchEthereumChainHandler } from './wallet_switchEthereumChain';
import { openExtensionNewWindow } from './../../../../utils/extensionUtils';
import { buildRpcCall } from './../../../../tests/test-utils';
import { DAppProviderRequest } from './../../../connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from './../../../connections/middlewares/models';
import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { ethErrors } from 'eth-rpc-errors';
import { container } from 'tsyringe';
import { ActionsService } from '../../actions/ActionsService';
import { isCoreWeb } from '../../network/utils/isCoreWeb';

jest.mock('@src/utils/extensionUtils', () => ({
  openExtensionNewWindow: jest.fn(),
}));
jest.mock('../../network/utils/isCoreWeb');

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

describe('src/background/services/network/handlers/wallet_switchEthereumChain.ts', () => {
  const actionsServiceMock = {
    addAction: jest.fn(),
  } as any;

  const networkServiceMock = {
    isValidRPCUrl: jest.fn(),
    allNetworks: {
      promisify: () =>
        Promise.resolve({
          [mockActiveNetwork.chainId]: { ...mockActiveNetwork },
          [43113]: { ...mockActiveNetwork, id: 43113 },
        }),
    },
    getNetwork: (chainId: number | string) => {
      if (chainId === 'eip:43114') {
        return mockActiveNetwork;
      }

      if (chainId === 43112) {
        return Promise.resolve();
      }
      return Promise.resolve({
        ...mockActiveNetwork,
        id: 43113,
        chainId: 43113,
      });
    },

    setNetwork: () => Promise.resolve(),
  } as any;
  container.registerInstance(ActionsService, actionsServiceMock);
  let handler: WalletSwitchEthereumChainHandler;
  const switchChainRequest = {
    id: '1234',
    method: DAppProviderRequest.WALLET_SWITCH_ETHEREUM_CHAIN,
    params: [
      {
        chainId: '0xa869', // 43113
      },
    ],
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (openExtensionNewWindow as jest.Mock).mockReturnValue({ id: 123 });
    (networkServiceMock.isValidRPCUrl as jest.Mock).mockResolvedValue(true);

    handler = new WalletSwitchEthereumChainHandler(networkServiceMock);
    (crypto.randomUUID as jest.Mock).mockReturnValue('uuid');
    jest.mocked(isCoreWeb).mockResolvedValue(false);
  });

  it('handleUnauthenticated', async () => {
    const result = await handler.handleUnauthenticated(
      buildRpcCall(switchChainRequest)
    );
    expect(result).toEqual({
      ...switchChainRequest,
      error: ethErrors.provider.unauthorized(),
    });
  });

  describe('handleAuthenticated', () => {
    it('opens approval dialog', async () => {
      const result = await handler.handleAuthenticated(
        buildRpcCall(switchChainRequest, 'eip:43114')
      );

      expect(result).toEqual({
        ...switchChainRequest,
        result: DEFERRED_RESPONSE,
      });

      expect(openExtensionNewWindow).toHaveBeenCalledTimes(1);
      expect(openExtensionNewWindow).toHaveBeenCalledWith(
        'network/switch?actionId=uuid'
      );
      expect(actionsServiceMock.addAction).toHaveBeenCalledTimes(1);
      expect(actionsServiceMock.addAction).toHaveBeenCalledWith({
        ...switchChainRequest,
        actionId: 'uuid',
        displayData: {
          network: {
            chainId: 43113,
            chainName: 'Avalanche (C-Chain)',
            id: 43113,
            logoUri: 'chain-logo.png',
            vmName: NetworkVMType.EVM,
            primaryColor: 'violet',
            rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
            explorerUrl: 'https://explorer.url',
            subnetExplorerUriId: 'c-chain',
            tokens: [],
            networkToken: {
              symbol: 'AVAX',
              decimals: 18,
              description: '',
              name: 'Avalanche',
              logoUri: 'token-logo.png',
            },
          },
        },
        popupWindowId: 123,
      });
    });

    it('does not open approval dialog because the request comes from core web', async () => {
      jest.mocked(isCoreWeb).mockResolvedValue(true);

      const result = await handler.handleAuthenticated(
        buildRpcCall(switchChainRequest)
      );

      expect(result).toEqual({
        ...switchChainRequest,
        result: null,
      });

      expect(openExtensionNewWindow).toHaveBeenCalledTimes(0);
    });

    it('throws error when the requested network is not found', async () => {
      const requestWithBadChainId = {
        id: '1234',
        method: DAppProviderRequest.WALLET_SWITCH_ETHEREUM_CHAIN,
        params: [
          {
            chainId: '0xa868', // 43112
          },
        ],
      };

      const result = await handler.handleAuthenticated(
        buildRpcCall(requestWithBadChainId)
      );

      expect(result).toEqual({
        ...requestWithBadChainId,
        error: ethErrors.provider.custom({
          code: 4902,
          message: `Unrecognized chain ID "0xa868". Try adding the chain using ${DAppProviderRequest.WALLET_ADD_CHAIN} first.`,
        }),
      });

      expect(openExtensionNewWindow).toHaveBeenCalledTimes(0);
    });
  });
});
