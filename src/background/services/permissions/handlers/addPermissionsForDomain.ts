import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import type { AccountsService } from '@src/background/services/accounts/AccountsService';
import { injectable } from 'tsyringe';
import type { DappPermissions } from '../models';
import type { PermissionsService } from '../PermissionsService';
import type { ActionsService } from './../../actions/ActionsService';
import type { ActionUpdate } from './../../actions/models';
import { ActionStatus } from './../../actions/models';

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
