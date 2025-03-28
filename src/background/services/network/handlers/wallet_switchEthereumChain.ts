import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import {
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { Action, buildActionForRequest } from '../../actions/models';
import { NetworkService } from '../NetworkService';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { NetworkWithCaipId } from '../models';
import { canSkipApproval } from '@src/utils/canSkipApproval';

type Params = [{ chainId: string | number }];

/**
 * @link https://eips.ethereum.org/EIPS/eip-3326
 * @param data
 */
@injectable()
export class WalletSwitchEthereumChainHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.WALLET_SWITCH_ETHEREUM_CHAIN];

  constructor(private networkService: NetworkService) {
    super();
  }

  handleUnauthenticated = async ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  handleAuthenticated = async ({
    request,
    scope,
  }: JsonRpcRequestParams<DAppProviderRequest, Params>) => {
    if (!request.site?.domain || !request.site.tabId) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Missing dApp domain information',
        }),
      };
    }

    const params = request.params;
    const targetChainID = params?.[0]?.chainId; // chain ID is hex with 0x perfix
    const supportedNetwork = await this.networkService.getNetwork(
      Number(targetChainID),
    );
    const currentActiveNetwork = await this.networkService.getNetwork(scope);

    // If switch ethereum network is called, we need to verify the wallet
    // is not currently on the requested network. If it is, we just need to return early
    // to prevent an unnecessary UX
    if (Number(targetChainID) === currentActiveNetwork?.chainId) {
      return {
        ...request,
        result: null,
      };
    }

    // If the extension is not currently on the requested network and we currently support the network
    // then we need to show a confirmation popup to confirm user wants to switch to the requested network
    // from the dApp they are on.
    if (supportedNetwork?.chainId) {
      const skipApproval = await canSkipApproval(
        request.site.domain,
        request.site.tabId,
      );

      if (skipApproval) {
        await this.networkService.setNetwork(
          request.site.domain,
          supportedNetwork.caipId,
        );
        return { ...request, result: null };
      }

      const actionData = buildActionForRequest(request, {
        scope,
        displayData: {
          network: supportedNetwork,
        },
      });
      await openApprovalWindow(actionData, `network/switch`);

      return { ...request, result: DEFERRED_RESPONSE };
    } else {
      // If the user is not already on the requested network, and we currently do not support
      // the network, then we need to pop a confirmation window asking them if they want to add
      // the custom network to storage for them to use. For now, we will just return an error message,
      // until we have an internal tool for getting indexed network info. Because for now, the swithEthereumChain
      // request only provides a chainId, with no other info.
      return {
        ...request,
        error: ethErrors.provider.custom({
          code: 4902, // To-be-standardized "unrecognized chain ID" error
          message: `Unrecognized chain ID "${targetChainID}". Try adding the chain using ${DAppProviderRequest.WALLET_ADD_CHAIN} first.`,
        }),
      };
    }
  };

  onActionApproved = async (
    pendingAction: Action<{ network: NetworkWithCaipId }>,
    _result,
    onSuccess,
    onError,
  ) => {
    if (!pendingAction.site?.domain) {
      return onError(new Error('Unrecognized domain'));
    }

    try {
      await this.networkService.setNetwork(
        pendingAction.site.domain,
        pendingAction.displayData.network.caipId,
      );

      onSuccess(null);
    } catch (err) {
      onError(err);
    }
  };
}
