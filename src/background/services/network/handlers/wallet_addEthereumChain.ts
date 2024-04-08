import { NetworkVMType } from '@avalabs/chains-sdk';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import {
  AddEthereumChainDisplayData,
  AddEthereumChainParameter,
  Network,
} from '../models';
import { NetworkService } from '../NetworkService';

/**
 * @link https://eips.ethereum.org/EIPS/eip-3085
 * @param data
 */
@injectable()
export class WalletAddEthereumChainHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_ADD_CHAIN];
  constructor(private networkService: NetworkService) {
    super();
  }

  handleUnauthenticated = async (request) => {
    const requestedChain: AddEthereumChainParameter = request.params?.[0];

    if (!requestedChain) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Chain config missing',
        }),
      };
    }

    const chains = await this.networkService.allNetworks.promisify();
    const currentActiveNetwork = this.networkService.activeNetwork;
    const supportedChainIds = Object.keys(chains ?? {});
    const requestedChainId = Number(requestedChain.chainId);
    const chainRequestedIsSupported =
      requestedChain && supportedChainIds.includes(requestedChainId.toString());
    const isSameNetwork = requestedChainId === currentActiveNetwork?.chainId;

    if (isSameNetwork)
      return {
        ...request,
        result: null,
      };

    const rpcUrl = requestedChain.rpcUrls?.[0];
    if (!rpcUrl) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'RPC url missing',
        }),
      };
    }

    if (!requestedChain.nativeCurrency) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Expected nativeCurrency param to be defined',
        }),
      };
    }

    const customNetwork: Network = {
      chainId: requestedChainId,
      chainName: requestedChain.chainName || '',
      vmName: NetworkVMType.EVM,
      rpcUrl,
      networkToken: {
        symbol: requestedChain.nativeCurrency.symbol,
        decimals: requestedChain.nativeCurrency.decimals,
        description: '',
        name: requestedChain.nativeCurrency.name,
        logoUri: requestedChain.iconUrls?.[0] || '',
      },
      logoUri: requestedChain.iconUrls?.[0] || '',
      explorerUrl: requestedChain.blockExplorerUrls?.[0] || '',
      primaryColor: 'black',
      isTestnet: !!requestedChain.isTestnet,
    };

    if (!customNetwork.chainName) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Network Name is required',
        }),
      };
    }

    if (!customNetwork.networkToken.symbol) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Network Token Symbol is required',
        }),
      };
    }

    if (!customNetwork.networkToken.name) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Network Token Name is required',
        }),
      };
    }

    if (chainRequestedIsSupported) {
      const actionData: Action<Network> = {
        ...request,
        displayData: customNetwork,
        tabId: request.site?.tabId,
      };

      await this.openApprovalWindow(actionData, `network/switch`);

      return { ...request, result: DEFERRED_RESPONSE };
    }

    const isValid = await this.networkService.isValidRPCUrl(
      customNetwork.chainId,
      customNetwork.rpcUrl
    );
    if (!isValid) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'ChainID does not match the rpc url',
        }),
      };
    }

    const actionData: Action<AddEthereumChainDisplayData> = {
      ...request,
      displayData: {
        network: customNetwork,
        options: {
          requiresGlacierApiKey: Boolean(requestedChain.requiresGlacierApiKey),
        },
      },
      tabId: request.site?.tabId,
    };
    await this.openApprovalWindow(actionData, `networks/add-popup`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };

  onActionApproved = async (
    pendingAction: Action<AddEthereumChainDisplayData>,
    _result,
    onSuccess,
    onError
  ) => {
    try {
      const chains = await this.networkService.allNetworks.promisify();
      if (!chains) {
        onError('networks not found');
        return;
      }

      const supportedChainIds = Object.keys(chains);

      const { network } = pendingAction.displayData;

      if (network.customRpcHeaders) {
        // eslint-disable-next-line
        const { rpcUrl, ...overrides } = network; // we do not want to apply rpcUrl override from here
        await this.networkService.updateNetworkOverrides(overrides);
      }

      if (supportedChainIds.includes(network.chainId.toString())) {
        await this.networkService.setNetwork(network.chainId);
      } else {
        await this.networkService.saveCustomNetwork(network);
      }
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
