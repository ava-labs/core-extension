import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { ChainList, NetworkVMType } from '@avalabs/core-chains-sdk';
import {
  Action,
  AddEthereumChainDisplayData,
  AddEthereumChainParameter,
  buildActionForRequest,
  DAppProviderRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
  JsonRpcRequestParams,
  NetworkWithCaipId,
} from '@core/types';
import {
  canSkipApproval,
  decorateWithCaipId,
  isDevelopment,
  isValidHttpHeader,
} from '@core/common';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

function isAllowedRpcUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== 'https:' && !(isDevelopment() && protocol === 'http:'))
      return false;
    // Block private/reserved IP ranges in production to prevent SSRF.
    // In development these are needed for local nodes (e.g. localhost:9650).
    if (
      !isDevelopment() &&
      (hostname === 'localhost' ||
        hostname === '169.254.169.254' ||
        /^127\./.test(hostname) ||
        /^10\./.test(hostname) ||
        /^192\.168\./.test(hostname) ||
        /^172\.(1[6-9]|2[0-9]|3[01])\./.test(hostname))
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function isValidExplorerUrl(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

type Params = [AddEthereumChainParameter];

/**
 * @link https://eips.ethereum.org/EIPS/eip-3085
 * @param data
 */
@injectable()
export class WalletAddEthereumChainHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.WALLET_ADD_CHAIN];
  constructor(private networkService: NetworkService) {
    super();
  }

  handleUnauthenticated = async ({
    request,
    scope,
  }: JsonRpcRequestParams<DAppProviderRequest, Params>) => {
    const requestedChain: AddEthereumChainParameter = request.params?.[0];

    if (!request.site?.domain || !request.site?.tabId) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Missing dApp domain information',
        }),
      };
    }

    if (!requestedChain) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Chain config missing',
        }),
      };
    }

    const chains = await this.networkService.allNetworks.promisify();
    const currentActiveNetwork = await this.networkService.getNetwork(scope);
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

    if (!isAllowedRpcUrl(rpcUrl)) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'RPC URL must use HTTPS and must not target a private address',
        }),
      };
    }

    const explorerUrl = requestedChain.blockExplorerUrls?.[0] || '';
    if (explorerUrl && !isValidExplorerUrl(explorerUrl)) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Explorer URL must use HTTPS',
        }),
      };
    }

    const customNetwork = decorateWithCaipId({
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
      explorerUrl,
      primaryColor: 'black',
      isTestnet: !!requestedChain.isTestnet,
    });

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
    const skipApproval = await canSkipApproval(
      request.site.domain,
      request.site.tabId,
    );

    if (skipApproval) {
      await this.actionHandler(chains, customNetwork, request.site.domain);
      return { ...request, result: null };
    }

    if (chainRequestedIsSupported) {
      const actionData = buildActionForRequest(request, {
        scope,
        displayData: {
          network: chains[requestedChainId.toString()],
          currentNetwork: currentActiveNetwork,
        },
      });

      await openApprovalWindow(actionData, `network/switch`);

      return { ...request, result: DEFERRED_RESPONSE };
    }

    const isValid = await this.networkService.isValidRPCUrl(
      customNetwork.chainId,
      customNetwork.rpcUrl,
    );
    if (!isValid) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'ChainID does not match the rpc url',
        }),
      };
    }

    const actionData = buildActionForRequest(request, {
      scope,
      displayData: {
        network: customNetwork,
        options: {
          requiresGlacierApiKey: Boolean(requestedChain.requiresGlacierApiKey),
        },
      },
    });

    await openApprovalWindow(actionData, `networks/add-popup`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (rpcCall) => {
    return this.handleUnauthenticated(rpcCall);
  };

  async actionHandler(
    chains: ChainList,
    network: NetworkWithCaipId,
    domain: string,
  ) {
    const supportedChainIds = Object.keys(chains);

    if (network.customRpcHeaders) {
      const areHeadersValid = Object.entries(network.customRpcHeaders).every(
        ([name, value]) => isValidHttpHeader(name, value),
      );
      if (!areHeadersValid) {
        throw new Error('Invalid RPC headers configuration');
      }
      const { rpcUrl, ...overrides } = network; // we do not want to apply rpcUrl override from here
      await this.networkService.updateNetworkOverrides(overrides);
    }

    // Add a custom network if it is not on the list yet.
    if (!supportedChainIds.includes(network.chainId.toString())) {
      await this.networkService.saveCustomNetwork(network);
    }

    await this.networkService.setNetwork(domain, network.caipId);
  }

  onActionApproved = async (
    pendingAction: Action<AddEthereumChainDisplayData>,
    _result,
    onSuccess,
    onError,
  ) => {
    try {
      const chains = await this.networkService.allNetworks.promisify();
      if (!chains) {
        onError('networks not found');
        return;
      }
      const domain = pendingAction.site?.domain;

      if (!domain) {
        return onError(new Error('Unrecognized domain'));
      }

      const { network } = pendingAction.displayData;

      await this.actionHandler(chains, network, domain);

      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
