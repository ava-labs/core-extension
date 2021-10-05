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
import { ValidateSendAvaxStateRequest } from '@src/background/services/sendAvax/handlers/validateSendAvaxState';
import { ResetSendAvaxStateRequest } from '@src/background/services/sendAvax/handlers/resetSendAvaxState';
import { SubmitSendAvaxStateRequest } from '@src/background/services/sendAvax/handlers/submitSendAvaxState';
import { SubmitSendAntStateRequest } from '@src/background/services/sendAnt/handlers/submitSendAntState';
import { ResetSendAntStateRequest } from '@src/background/services/sendAnt/handlers/resetSendAntState';
import { ValidateSendAntStateRequest } from '@src/background/services/sendAnt/handlers/validateSendAntState';
import { ResetSendErc20StateRequest } from '@src/background/services/sendErc20/handlers/resetSendErc20State';
import { ValidateSendErc20StateRequest } from '@src/background/services/sendErc20/handlers/validateSendErc20State';
import { SubmitSendErc20StateRequest } from '@src/background/services/sendErc20/handlers/submitSendErc20State';
import { GetSettingsStateRequest } from '@src/background/services/settings/handlers/getSettings';
import { settingsUpdatedEvent } from '@src/background/services/settings/events/settingsUpdatedEvent';
import { SettingsUpdateCurrencySelectionRequest } from '@src/background/services/settings/handlers/updateCurrencySelection';
import { SettingsUpdateShowTokensWithBalanceRequest } from '@src/background/services/settings/handlers/updateShowTokensNoBalance';
import { ChangeWalletPasswordRequest } from '@src/background/services/wallet/handlers/changeWalletPassword';
import { GetUnencryptedMnemonicRequest } from '@src/background/services/wallet/handlers/getUnencryptedMnemonic';

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
  ChangeWalletPasswordRequest,
  GetUnencryptedMnemonicRequest,

  AddPermissionsForDomainRequest,
  GetPermissionsForDomainRequest,
  GetAccountsForPermissionsRequest,

  UpdateTransactionByIdRequest,
  GetTransactionByIdRequest,

  ValidateSendAvaxStateRequest,
  ResetSendAvaxStateRequest,
  SubmitSendAvaxStateRequest,

  SubmitSendAntStateRequest,
  ResetSendAntStateRequest,
  ValidateSendAntStateRequest,

  ResetSendErc20StateRequest,
  ValidateSendErc20StateRequest,
  SubmitSendErc20StateRequest,

  GetSettingsStateRequest,
  SettingsUpdateCurrencySelectionRequest,
  SettingsUpdateShowTokensWithBalanceRequest,
  SettingsLockWalletStateRequest,
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
    transactionFinalizedUpdate(),
    settingsUpdatedEvent()
  ).pipe(
    tap((evt) => {
      eventLog(`extension event (${evt.name})`, evt);
      connection.postMessage(evt);
    })
  );
}
