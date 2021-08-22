import { merge, tap } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '../models';
import { CancelPendingMessageRequest } from '../../services/messages/handlers/cancelPendingMessage';
import { GetPendingMessageRequest } from '../../services/messages/handlers/getPendingMessage';
import { SignMessageRequest } from '../../services/messages/handlers/signMessage';
import { networkUpdateEvents } from '../../services/network/events/networkUpdatedEvent';
import { GetNetworkRequest } from '../../services/network/handlers/getSelectedNetwork';
import { SetNetworkRequest } from '../../services/network/handlers/setSelectedNetwork';
import { onboardingPhaseUpdatedEvent } from '../../services/onboarding/events/onboardingPhaseEvent';
import { onboardingUpdatedEvent } from '../../services/onboarding/events/onboardingUpdatedEvent';
import { GetOnboardingStateRequest } from '../../services/onboarding/handlers/getIsOnBoarded';
import { SetOnboardingFinalizedRequest } from '../../services/onboarding/handlers/setOnboardingFinalized';
import { SetOnboardingPhaseRequest } from '../../services/onboarding/handlers/setWalletImportOrCreatePhase';
import { SetOnboardingMnemonicRequest } from '../../services/onboarding/handlers/setWalletMnemonic';
import { SetOnboardingPasswordRequest } from '../../services/onboarding/handlers/setWalletPassword';
import { AddPermissionsForDomainRequest } from '../../services/permissions/handlers/addPermissionsForDomain';
import { GetAccountsForPermissionsRequest } from '../../services/permissions/handlers/getAccountsForPermissions';
import { GetPermissionsForDomainRequest } from '../../services/permissions/handlers/getPermissionsForDomain';
import { SettingsLockWalletStateRequest } from '../../services/settings/handlers/lockWallet';
import { gasPriceTransactionUpdate } from '../../services/transactions/events/gasPriceTransactionUpdate';
import { transactionFinalizedUpdate } from '../../services/transactions/events/transactionFinalizedUpdate';
import { GetTransactionByIdRequest } from '../../services/transactions/handlers/getTransaction';
import { UpdateTransactionByIdRequest } from '../../services/transactions/handlers/updateTransaction';
import { walletUpdateEvents } from '../../services/wallet/events/walletStateUpdates';
import { GetWalletStateRequest } from '../../services/wallet/handlers/initWalletState';
import { UnlockWalletStateRequest } from '../../services/wallet/handlers/unlockWalletState';
import { eventLog, requestLog, responseLog } from '../../../utils/logging';

const extensionRequestHandlerMap = new Map<
  ExtensionRequest,
  ConnectionRequestHandler
>([
  SignMessageRequest,
  GetPendingMessageRequest,
  CancelPendingMessageRequest,
  GetOnboardingStateRequest,
  SetOnboardingPhaseRequest,
  SetOnboardingFinalizedRequest,
  SetOnboardingMnemonicRequest,
  SetOnboardingPasswordRequest,
  GetNetworkRequest,
  SetNetworkRequest,
  GetWalletStateRequest,
  UnlockWalletStateRequest,
  SettingsLockWalletStateRequest,
  AddPermissionsForDomainRequest,
  GetPermissionsForDomainRequest,
  GetAccountsForPermissionsRequest,
  UpdateTransactionByIdRequest,
  GetTransactionByIdRequest,
]);

export function extensionMessageHandler(connection: Runtime.Port) {
  function respondToRequest(response) {
    responseLog(`extension reponse (${response.method})`, response);
    connection.postMessage(response);
  }

  return (message: ExtensionConnectionMessage) => {
    requestLog(`extension request (${message.method})`, message);

    const handler = extensionRequestHandlerMap.get(
      message.method as ExtensionRequest
    );

    if (!handler) {
      return respondToRequest({
        ...message,
        error: new Error('no handler for this request found'),
      });
    }

    handler(message).then(respondToRequest);
  };
}

export function extensionEventsHandler(connection: Runtime.Port) {
  return merge(
    onboardingUpdatedEvent(),
    networkUpdateEvents(),
    walletUpdateEvents,
    onboardingPhaseUpdatedEvent(),
    gasPriceTransactionUpdate(),
    transactionFinalizedUpdate()
  ).pipe(
    tap((evt) => {
      eventLog(`extension event (${evt.name})`, evt);
      connection.postMessage(evt);
    })
  );
}
