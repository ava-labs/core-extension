import { WalletSwitchEthereumChainHandler } from './wallet_switchEthereumChain';
import { buildRpcCall } from './../../../../tests/test-utils';
import { DAppProviderRequest } from './../../../connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from './../../../connections/middlewares/models';
import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { ethErrors } from 'eth-rpc-errors';
import { canSkipApproval } from '@src/utils/canSkipApproval';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';

jest.mock('@src/background/runtime/openApprovalWindow');
jest.mock('@src/utils/canSkipApproval');

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
  let handler: WalletSwitchEthereumChainHandler;
  const switchChainRequest = {
    id: '1234',
    method: DAppProviderRequest.WALLET_SWITCH_ETHEREUM_CHAIN,
    params: [
      {
        chainId: '0xa869', // 43113
      },
    ],
    site: {
      domain: 'core.app',
      tabId: 1,
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (networkServiceMock.isValidRPCUrl as jest.Mock).mockResolvedValue(true);

    handler = new WalletSwitchEthereumChainHandler(networkServiceMock);
    (crypto.randomUUID as jest.Mock).mockReturnValue('uuid');
    jest.mocked(canSkipApproval).mockResolvedValue(false);
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

      expect(openApprovalWindow).toHaveBeenCalledTimes(1);
      expect(openApprovalWindow).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1234' }),
        'network/switch'
      );
    });

    it('does not open approval dialog because the request comes from core web', async () => {
      jest.mocked(canSkipApproval).mockResolvedValue(true);

      const result = await handler.handleAuthenticated(
        buildRpcCall(switchChainRequest)
      );

      expect(result).toEqual({
        ...switchChainRequest,
        result: null,
      });

      expect(openApprovalWindow).toHaveBeenCalledTimes(0);
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
        site: {
          domain: 'core.app',
          tabId: 1,
        },
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

      expect(openApprovalWindow).toHaveBeenCalledTimes(0);
    });
  });
});
