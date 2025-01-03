import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { injectable } from 'tsyringe';
import { DappPermissions } from '../models';
import { PermissionsService } from '../PermissionsService';
import { ActionsService } from './../../actions/ActionsService';
import { ActionStatus, ActionUpdate } from './../../actions/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.PERMISSIONS_ADD_DOMAIN,
  true,
  [permissions: DappPermissions, id: ActionUpdate['id']]
>;

@injectable()
export class PermissionsAddDomainHandler implements HandlerType {
  method = ExtensionRequest.PERMISSIONS_ADD_DOMAIN as const;

  constructor(
    private permissionsService: PermissionsService,
    private actionsService: ActionsService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [permissions, id] = request.params;

    if (!permissions.domain || !permissions.accounts) {
      return {
        ...request,
        error: 'no permissions in params',
      };
    }

    this.permissionsService.addPermission(permissions);
    this.actionsService.updateAction({
      status: ActionStatus.COMPLETED,
      id,
      result: [this.accountsService.activeAccount?.addressC],
    });

    return {
      ...request,
      result: true,
    };
  };
}
