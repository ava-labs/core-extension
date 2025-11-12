import {
  Action,
  DAppProviderRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { PermissionsService } from '../PermissionsService';
import { openApprovalWindow } from '../../../runtime/openApprovalWindow';
import { NetworkVMType } from '@avalabs/vm-module-types';
import {
  getDappConnector,
  getLegacyDappConnector,
} from '~/services/web3/handlers/utils/connectToDapp';

@injectable()
export class WalletRequestPermissionsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_PERMISSIONS];

  constructor(
    private permissionsService: PermissionsService,
    private accountsService: AccountsService,
  ) {
    super();
  }

  handleUnauthenticated = async (rpcCall) => {
    const { request } = rpcCall;

    await openApprovalWindow(
      {
        ...request,
        displayData: {
          addressVM: NetworkVMType.EVM,
          // TODO: clean up domain* props for Legacy app
          domainName: request.site?.name,
          domainUrl: request.site?.domain,
          domainIcon: request.site?.icon,
          dappUrl: request.site?.url,
          dappIcon: request.site?.icon,
          dappDomain: request.site?.domain,
        },
      },
      `permissions`,
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (rpcCall) => {
    return await this.handleUnauthenticated(rpcCall);
  };

  onActionApproved = async (
    pendingAction: Action,
    result: string | { id: string; enabled: boolean }[],
    onSuccess: (result: unknown) => Promise<void>,
    onError: (error: Error) => Promise<void>,
  ) => {
    const connectorArgs = {
      accountsService: this.accountsService,
      permissionsService: this.permissionsService,
      vm: NetworkVMType.EVM,
      convertToMetaMaskStructure: true,
    };
    const baseCallbackArgs = {
      pendingAction,
      onSuccess,
      onError,
    };

    if (Array.isArray(result)) {
      return getDappConnector(connectorArgs)({ ...baseCallbackArgs, result });
    }

    return getLegacyDappConnector(connectorArgs)({
      ...baseCallbackArgs,
      result,
    });
  };
}
