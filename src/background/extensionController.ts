import { merge, tap } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';
import { ExtensionConnectionMessage } from './connections/models';
import { networkUpdateEvents } from './services/network/events/networkUpdatedEvent';
import { getSelectedNetwork } from './services/network/handlers/getSelectedNetwork';
import { setSelectedNetwork } from './services/network/handlers/setSelectedNetwork';
import { onboardingPhaseUpdatedEvent } from './services/onboarding/events/onboardingPhaseEvent';
import { onboardingUpdatedEvent } from './services/onboarding/events/onboardingUpdatedEvent';
import { getIsOnBoarded } from './services/onboarding/handlers/getIsOnBoarded';
import { setOnboardingFinalized } from './services/onboarding/handlers/setOnboardingFinalized';
import { setWalletImportOrCreatePhase } from './services/onboarding/handlers/setWalletImportOrCreatePhase';
import { setWalletMnemonic } from './services/onboarding/handlers/setWalletMnemonic';
import { setWalletPassword } from './services/onboarding/handlers/setWalletPassword';
import { lockWalletFromSettings } from './services/settings/handlers/lockWallet';
import { walletUpdateEvents } from './services/wallet/events/walletStateUpdates';
import { initializeWalletState } from './services/wallet/handlers/initWalletState';
import { unlockWalletState } from './services/wallet/handlers/unlockWalletState';
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
      wallet_unlockWalletState(request) {
        unlockWalletState(request).then(respondToRequest);
      },
      settings_lockWallet(request) {
        lockWalletFromSettings(request).then(respondToRequest);
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
    walletUpdateEvents,
    onboardingPhaseUpdatedEvent()
  ).pipe(
    tap((evt) => {
      formatAndLog(`event to extension (${evt.name})`, evt, {
        color: LoggerColors.success,
      });
      connection.postMessage(evt);
    })
  );
}
