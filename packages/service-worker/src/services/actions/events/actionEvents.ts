import { ActionsService } from '../ActionsService';
import {
  Action,
  ActionCompletedEventType,
  Actions,
  ActionsEvent,
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  isBatchApprovalAction,
  MultiTxAction,
} from '@core/types';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { serializeError } from 'eth-rpc-errors';
import browser from 'webextension-polyfill';

/**
 * The approval payload a dApp connection is allowed to see.
 *
 * The extension's own UI drives the approval screen from these events and needs
 * the whole action. A dApp does not: it learns the outcome from its JSON-RPC
 * response, so the signing payload and the rendered approval data are stripped
 * before the event leaves for a web page.
 */
const withoutSigningPayload = (
  action: Action | MultiTxAction,
): Action | MultiTxAction => {
  if (isBatchApprovalAction(action)) {
    const {
      signingRequests: _signingRequests,
      displayData: _d,
      ...rest
    } = action;
    return rest as unknown as MultiTxAction;
  }

  const {
    signingData: _signingData,
    displayData: _displayData,
    ...rest
  } = action;
  return rest as unknown as Action;
};

@injectable()
export class ActionEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(private actionService: ActionsService) {
    this.actionService.addListener(
      ActionsEvent.ACTION_COMPLETED,
      ({ type, action, result }) => {
        if (
          action.tabId === this._connectionInfo?.tabId ||
          action.site?.tabId === this._connectionInfo?.tabId ||
          this._connectionInfo?.domain === browser.runtime.id
        ) {
          const response =
            type === ActionCompletedEventType.ERROR
              ? {
                  ...action,
                  error: serializeError(result),
                }
              : { ...action, result: result };
          this.eventEmitter.emit('update', response);
        }
      },
    );
    this.actionService.addListener(
      ActionsEvent.ACTION_UPDATED,
      (actions: Actions) => {
        // Check if any of the updated actions belong to the current connection (tabId or domain)
        const filtered = Object.fromEntries(
          Object.entries(actions).filter(
            ([, action]) =>
              action.tabId === this._connectionInfo?.tabId ||
              action.site?.tabId === this._connectionInfo?.tabId ||
              this._connectionInfo?.domain === browser.runtime.id,
          ),
        );

        const isExtensionUi =
          this._connectionInfo?.domain === browser.runtime.id;

        if (isExtensionUi || Object.keys(filtered).length > 0) {
          this.eventEmitter.emit('update', {
            name: ActionsEvent.ACTION_UPDATED,
            value: isExtensionUi
              ? filtered
              : Object.fromEntries(
                  Object.entries(filtered).map(([id, action]) => [
                    id,
                    withoutSigningPayload(action),
                  ]),
                ),
          });
        }
      },
    );
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void,
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
