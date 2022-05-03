import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { defer, firstValueFrom, map, merge, tap } from 'rxjs';
import { injectable } from 'tsyringe';
import { ActionsService } from '../../actions/ActionsService';
import { Action, ActionsEvent, ActionStatus } from '../../actions/models';
import { WalletService } from '../../wallet/WalletService';
import { MessageType } from '../models';
import { paramsToMessageParams } from '../utils/messageParamsParser';

@injectable()
export class PersonalSignHandler implements DAppRequestHandler {
  methods = [
    MessageType.ETH_SIGN,
    MessageType.SIGN_TYPED_DATA,
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V1,
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3,
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4,
    MessageType.PERSONAL_SIGN,
  ];

  constructor(
    private actionsService: ActionsService,
    private walletService: WalletService
  ) {}

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: `account not available`,
    };
  };

  handleAuthenticated = async (request) => {
    if (!this.walletService.walletState?.walletType) {
      return {
        ...request,
        error: 'wallet undefined',
      };
    }
    const actionData = {
      ...request,
      displayData: paramsToMessageParams(request),
    };
    await this.actionsService.addAction(actionData);

    const window = await openExtensionNewWindow(
      `sign?id=${request.id}`,
      '',
      request.meta?.coords
    );

    const windowClosed$ = window.removed.pipe(
      map(() => ({
        ...request,
        error: 'Signature rejected by user',
      })),
      tap(async () => {
        await this.actionsService.updateAction({
          status: ActionStatus.ERROR_USER_CANCELED,
          id: request.id,
          error: 'Signature rejected by user',
        });
      })
    );

    const signTx$ = defer(async () => {
      const pendingMessage = await new Promise<Action>((resolve) => {
        const listener = (currentPendingMessages) => {
          if (
            currentPendingMessages[`${request.id}`]?.status ===
            ActionStatus.SUBMITTING
          ) {
            this.actionsService.removeListener(
              ActionsEvent.ACTION_UPDATED,
              listener
            );
            resolve(currentPendingMessages[`${request.id}`]);
          }
        };
        this.actionsService.addListener(ActionsEvent.ACTION_UPDATED, listener);
      });

      return this.walletService
        .signMessage(
          pendingMessage.method as MessageType,
          pendingMessage.displayData.data
        )
        .then(async (result) => {
          await this.actionsService.updateAction({
            status: ActionStatus.COMPLETED,
            id: request.id,
            result,
          });
          return { ...request, result };
        })
        .catch(async (err) => {
          await this.actionsService.updateAction({
            status: ActionStatus.ERROR,
            id: request.id,
            error: err?.message ?? err.toString(),
          });
          return { ...request, error: err };
        });
    });

    return firstValueFrom(merge(windowClosed$, signTx$));
  };
}
