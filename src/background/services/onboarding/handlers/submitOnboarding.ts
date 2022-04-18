import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { saveToSessionStorage } from '@src/utils/storage/session-storage';
import nacl from 'tweetnacl';
import { initialAccountName$ } from '../../accounts/accounts';
import { storeAnalyticsIds } from '../../analytics/handlers/storeAnalyticsIds';
import { setPublicKeyAndCreateWallet } from '../../ledger/ledger';
import { settingsSetAnalyticsConsent } from '../../settings/handlers/setAnalyticsConsent';
import { setMnemonicAndCreateWallet } from '../../wallet/mnemonic';
import { SessionAuthData, SESSION_AUTH_DATA_KEY } from '../../wallet/models';
import { storageKey$ } from '../../wallet/storageKey';
import { onboardingState$ } from '../onboardingState';
import { saveOnboardingToStorage } from '../storage';

export async function submitOnboarding(request: ExtensionConnectionMessage) {
  const params = request.params;
  if (!params) {
    return {
      ...request,
      error: 'params missing from request',
    };
  }
  const { mnemonic, publicKey, password, accountName, analyticsConsent } =
    params[0];
  const storageKey = Buffer.from(nacl.box.keyPair().secretKey).toString('hex');
  if (mnemonic) {
    setMnemonicAndCreateWallet(mnemonic, password, storageKey);
  } else if (publicKey) {
    setPublicKeyAndCreateWallet(publicKey, password, storageKey);
  } else {
    return {
      ...request,
      error: 'unable to create a wallet',
    };
  }
  await saveOnboardingToStorage(true);
  const sessionData: SessionAuthData = {
    password: password,
    loginTime: Date.now(),
  };
  await saveToSessionStorage(SESSION_AUTH_DATA_KEY, sessionData);
  storageKey$.next(storageKey); // set storage key so the app can load data from and to the storage
  settingsSetAnalyticsConsent(analyticsConsent);
  if (analyticsConsent) {
    storeAnalyticsIds();
  }
  onboardingState$.next({ isOnBoarded: true, initialOpen: true });
  initialAccountName$.next(accountName);

  return {
    ...request,
    result: true,
  };
}

export const OnboardingSubmitRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ONBOARDING_SUBMIT, submitOnboarding];
