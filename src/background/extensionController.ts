import { merge, tap } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';
import { ExtensionConnectionMessage } from './connections/models';
import {
  getSelectedNetwork,
  networkUpdateEvents,
  setSelectedNetwork,
} from './services/network/handlers';
import {
  getIsOnBoarded,
  onboardingUpdatedEvent,
  setOnboardingFinalized,
  setWalletImportOrCreatePhase,
  setWalletMnemonic,
  setWalletPassword,
} from './services/onboarding/handlers';
import {
  initializeWalletState,
  walletUpdateEvents,
} from './services/wallet/handlers';
import { formatAndLog, LoggerColors } from './utils/logging';

export function extensionMessageHandler(connection: Runtime.Port) {
  function respondToRequest(response) {
    formatAndLog('extension request reponse: ', response, {
      color: LoggerColors.success,
    });
    connection.postMessage(response);
  }

  return (message: ExtensionConnectionMessage) => {
    const handlers = {
      onboarding_getIsOnBoarded(request) {
        getIsOnBoarded(request).then(respondToRequest);
      },
      onboarding_setCurrentPhase(request) {
        setWalletImportOrCreatePhase(request).then(respondToRequest);
      },
      onboarding_setWalletMnemonic(request) {
        setWalletMnemonic(request).then(respondToRequest);
      },
      onboarding_setWalletPassword(request) {
        setWalletPassword(request).then(respondToRequest);
      },
      onboarding_setOnboardingFinalized(request) {
        setOnboardingFinalized(request).then(respondToRequest);
      },
      network_getSelectedNetwork(request) {
        getSelectedNetwork(request).then(respondToRequest);
      },
      network_setSelectedNetwork(request) {
        setSelectedNetwork(request).then(respondToRequest);
      },
      wallet_InitializeState(request) {
        initializeWalletState(request).then(respondToRequest);
      },
    };

    formatAndLog('extension request recieved: ', message);

    handlers[message.method](message);
  };
}

export function extensionEventsHandler(connection: Runtime.Port) {
  return merge(
    onboardingUpdatedEvent(),
    networkUpdateEvents(),
    walletUpdateEvents
  ).pipe(
    tap((evt) => {
      connection.postMessage(evt);
    })
  );
}
