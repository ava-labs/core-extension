import { bnToBig, stringToBN } from '@avalabs/utils-sdk';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { resolve } from '@src/utils/promiseResolver';
import { defer, firstValueFrom, map, tap } from 'rxjs';
import { injectable } from 'tsyringe';
import { ActionsService } from '../../actions/ActionsService';
import { Action, ActionsEvent, ActionStatus } from '../../actions/models';
import { BridgeService } from '../BridgeService';

// this is used for coreX web
@injectable()
export class AvalancheBridgeAsset implements DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_BRIDGE_ASSET];

  constructor(
    private bridgeService: BridgeService,
    private actionsService: ActionsService
  ) {}

  handleAuthenticated = async (request) => {
    const [currentBlockchain, amountStr, asset] = request.params || [];

    const action = {
      ...request,
      displayData: {
        currentBlockchain,
        amountStr,
        asset,
      },
    };

    await this.actionsService.addAction(action);

    const window = await openExtensionNewWindow(
      `approve?id=${request.id}`,
      '',
      request.meta?.coords
    );

    const windowClosedSubscription = window.removed
      .pipe(
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
      )
      .subscribe();

    const userAction = await new Promise<Action>((resolve) => {
      const listener = (currentPendingMessages) => {
        if (
          currentPendingMessages[`${request.id}`]?.status ===
            ActionStatus.SUBMITTING ||
          currentPendingMessages[`${request.id}`]?.status ===
            ActionStatus.ERROR_USER_CANCELED
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

    if (userAction.status !== ActionStatus.SUBMITTING) {
      windowClosedSubscription.unsubscribe();
      return {
        ...request,
        error: 'user rejected request',
      };
    }
    const amount = bnToBig(
      stringToBN(amountStr, asset.denomination),
      asset.denomination
    );

    const transferAsset$ = defer(async () => {
      const [result, error] = await resolve(
        this.bridgeService.transferAsset(currentBlockchain, amount, asset)
      );

      if (error) {
        await this.actionsService.updateAction({
          status: ActionStatus.ERROR,
          id: request.id,
          error: error.toString(),
        });
        return result;
      }

      await this.actionsService.updateAction({
        status: ActionStatus.COMPLETED,
        id: request.id,
        result,
      });
      return result;
    });

    return firstValueFrom(transferAsset$).finally(() =>
      windowClosedSubscription.unsubscribe()
    );
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
