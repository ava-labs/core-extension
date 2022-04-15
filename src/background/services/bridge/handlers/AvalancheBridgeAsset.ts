import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { defer, filter, firstValueFrom, map, tap } from 'rxjs';
import {
  addAction$,
  pendingActions$,
  updateAction$,
} from '../../actions/actions';
import { ActionStatus } from '../../actions/models';
import { transferAssetHandler } from './transferAsset';

// this is used for coreX web
class AvalancheBridgeAsset implements DappRequestHandler {
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

    addAction$.next(action);
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
        tap(() => {
          updateAction$.next({
            status: ActionStatus.ERROR_USER_CANCELED,
            id: request.id,
            error: 'Signature rejected by user',
          });
        })
      )
      .subscribe();

    const userAction = await firstValueFrom(
      pendingActions$.pipe(
        map(
          (currentPendingMessages) => currentPendingMessages[`${request.id}`]
        ),
        filter(
          (pending) =>
            (!!pending && pending.status === ActionStatus.SUBMITTING) ||
            pending.status === ActionStatus.ERROR_USER_CANCELED
        )
      )
    );

    if (userAction.status !== ActionStatus.SUBMITTING) {
      windowClosedSubscription.unsubscribe();
      return {
        ...request,
        error: 'user rejected request',
      };
    }
    const transferAsset$ = defer(async () => {
      const result = await transferAssetHandler(request);

      if (result.error) {
        updateAction$.next({
          status: ActionStatus.ERROR,
          id: request.id,
          error: result.error,
        });
        return result;
      }

      updateAction$.next({
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

export const AvalancheTransferAssetRequest: [
  DAppProviderRequest,
  DappRequestHandler
] = [DAppProviderRequest.AVALANCHE_BRIDGE_ASSET, new AvalancheBridgeAsset()];
