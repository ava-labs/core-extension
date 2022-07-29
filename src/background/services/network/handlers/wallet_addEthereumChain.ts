import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { ActionsService } from '../../actions/ActionsService';
import { AddEthereumChainParameter } from '../models';
import { NetworkService } from '../NetworkService';

/**
 * @link https://eips.ethereum.org/EIPS/eip-3085
 * @param data
 */
@injectable()
export class WalletAddEthereumChainHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_ADD_CHAIN];
  constructor(
    private networkService: NetworkService,
    private actionsService: ActionsService
  ) {}

  handleUnauthenticated = async (request) => {
    const requestedChain: AddEthereumChainParameter = request.params?.[0];
    const chains = await this.networkService.activeNetworks.promisify();
    const currentActiveNetwork =
      await this.networkService.activeNetwork.promisify();
    const supportedChainIds = Object.keys(chains);
    const requestedChainId = Number(requestedChain.chainId);
    const chainRequestedIsSupported =
      requestedChain && supportedChainIds.includes(requestedChainId.toString());
    const isSameNetwork = requestedChainId === currentActiveNetwork?.chainId;

    if (isSameNetwork)
      return {
        ...request,
        result: null,
      };

    if (chainRequestedIsSupported) {
      const actionData = {
        ...request,
        displayData: requestedChain,
        tabId: request.site.tabId,
      };

      await this.actionsService.addAction(actionData);

      await openExtensionNewWindow(
        `network/switch?id=${request.id}`,
        '',
        request.meta?.coords
      );

      return { ...request, result: DEFERRED_RESPONSE };
    }

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
    };
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

    const actionData = {
      ...request,
      displayData: customNetwork,
      tabId: request.site.tabId,
    };
    await this.actionsService.addAction(actionData);

    await openExtensionNewWindow(
      `networks/add-popup?id=${request.id}`,
      '',
      request.meta?.coords
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };
}
