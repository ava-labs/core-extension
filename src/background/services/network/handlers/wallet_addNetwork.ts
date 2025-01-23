import { injectable } from 'tsyringe';

import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import {
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';

import { Action } from '../../actions/models';
import { NetworkService } from '../NetworkService';
import { CustomNetworkPayload } from '../models';
import { resolve } from '@avalabs/core-utils-sdk';
import { runtime } from 'webextension-polyfill';
import { caipToChainId } from '@src/utils/caipConversion';
import { NetworkToken, NetworkVMType } from '@avalabs/core-chains-sdk';

interface AddNetworkPayload {
  caipId: string;
  chainName: string;
  rpcUrl: string;
  vmName: NetworkVMType;
  tokenName: string;
  decimals: number;
  networkToken: NetworkToken;
  logoUri: string;
  explorerUrl: string;
  chainId?: number;
}

type Params = [AddNetworkPayload];

@injectable()
export class WalletAddNetworkHandler extends DAppRequestHandler<Params, null> {
  methods = [DAppProviderRequest.WALLET_ADD_NETWORK];

  constructor(private networkService: NetworkService) {
    super();
  }

  handleUnauthenticated = async ({
    request,
    scope,
  }: JsonRpcRequestParams<DAppProviderRequest, Params>) => {
    if (!request.site?.domain || !request.site?.tabId) {
      return {
        ...request,
        error: new Error('Missing dApp domain information'),
      };
    }

    const [network] = request.params;

    if (!network) {
      return {
        ...request,
        error: new Error('Network is not provided in params'),
      };
    }

    const chainId = network.chainId ?? caipToChainId(network.caipId);

    const isCustomNetworkExist = await this.networkService.getNetwork(
      network.caipId,
    );

    if (isCustomNetworkExist) {
      return {
        ...request,
        result: null,
      };
    }

    const actionData: Action<{
      network: CustomNetworkPayload;
    }> = {
      ...request,
      scope,
      displayData: {
        network: {
          ...network,
          chainId,
        },
      },
    };

    await openApprovalWindow(actionData, 'networks/add-popup');

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (rpcCall) => {
    return this.handleUnauthenticated(rpcCall);
  };

  onActionApproved = async (
    pendingAction: Action<{ network: CustomNetworkPayload }>,
    _,
    onSuccess,
    onError,
  ) => {
    try {
      const { network } = pendingAction.displayData;

      const [addedNetwork, err] = await resolve(
        this.networkService.saveCustomNetwork(network),
      );

      if (err || !addedNetwork) {
        throw new Error(String(err));
      }

      await this.networkService.setNetwork(runtime.id, addedNetwork.caipId);
      onSuccess(null);
    } catch (err) {
      onError(err);
    }
  };
}
