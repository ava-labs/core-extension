import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import { AddEthereumChainParameter } from '../models';
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
    };

    if (chainRequestedIsSupported) {
      const actionData = {
        ...request,
        displayData: customNetwork,
        tabId: request.site?.tabId,
      };

      await this.openApprovalWindow(
        actionData,
        `network/switch?id=${request.id}`
      );

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

    const actionData = {
      ...request,
      displayData: customNetwork,
      tabId: request.site?.tabId,
    };
    await this.openApprovalWindow(
      actionData,
      `networks/add-popup?id=${request.id}`
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
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
      if (
        supportedChainIds.includes(pendingAction.displayData.chainId.toString())
      ) {
        await this.networkService.setNetwork(pendingAction.displayData.chainId);
      } else {
        await this.networkService.saveCustomNetwork(pendingAction.displayData);
      }
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
