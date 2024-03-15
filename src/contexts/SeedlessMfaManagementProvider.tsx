import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { filter } from 'rxjs';

import { SecretType } from '@src/background/services/secrets/models';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import {
  RecoveryMethod,
  TotpResetChallenge,
} from '@src/background/services/seedless/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetRecoveryMethodsHandler } from '@src/background/services/seedless/handlers/getRecoveryMethods';
import { InitAuthenticatorChangeHandler } from '@src/background/services/seedless/handlers/initAuthenticatorChange';
import { CompleteAuthenticatorChangeHandler } from '@src/background/services/seedless/handlers/completeAuthenticatorChange';
import { isSeedlessMfaMethodsUpdatedEvent } from '@src/background/services/seedless/events/eventFilters';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';

import { useConnectionContext } from './ConnectionProvider';
import { useWalletContext } from './WalletProvider';
import { useFeatureFlagContext } from './FeatureFlagsProvider';

interface SeedlessMfaManagementContextProps {
  children?: React.ReactNode;
}

export const SeedlessMfaManagementContext = createContext<{
  initAuthenticatorChange(): Promise<TotpResetChallenge>;
  completeAuthenticatorChange(totpId: string, code: string): Promise<void>;
  isLoadingRecoveryMethods: boolean;
  recoveryMethods: RecoveryMethod[];
  isMfaSetupPromptVisible: boolean;
}>({
  initAuthenticatorChange() {
    throw 'Not ready';
  },
  completeAuthenticatorChange() {
    throw 'Not ready';
  },
  isLoadingRecoveryMethods: false,
  recoveryMethods: [],
  isMfaSetupPromptVisible: false,
});

export const SeedlessMfaManagementProvider = ({
  children,
}: SeedlessMfaManagementContextProps) => {
  const { events, request } = useConnectionContext();
  const { walletDetails } = useWalletContext();
  const { featureFlags } = useFeatureFlagContext();
  const areMfaSettingsAvailable =
    featureFlags[FeatureGates.SEEEDLESS_MFA_SETTINGS];

  const [isLoadingRecoveryMethods, setIsLoadingRecoveryMethods] =
    useState(false);

  const [hasLoadedRecoveryMethods, setHasLoadedRecoveryMethods] =
    useState(false);

  const [recoveryMethods, setRecoveryMethods] = useState<RecoveryMethod[]>([]);

  const isMfaSetupPromptVisible = useMemo(() => {
    return (
      areMfaSettingsAvailable &&
      hasLoadedRecoveryMethods &&
      walletDetails?.type === SecretType.Seedless &&
      recoveryMethods.length === 0
    );
  }, [
    areMfaSettingsAvailable,
    hasLoadedRecoveryMethods,
    walletDetails?.type,
    recoveryMethods,
  ]);

  const loadRecoveryMethods = useCallback(async () => {
    setIsLoadingRecoveryMethods(true);

    try {
      const methods = await incrementalPromiseResolve(
        () =>
          request<GetRecoveryMethodsHandler>({
            method: ExtensionRequest.SEEDLESS_GET_RECOVERY_METHODS,
          }),
        // CubeSigner SDK attempts to refresh the session token whenever possible,
        // but sometimes a race condition happens and the request may temporarily fail
        // with a 403 Forbidden. In that case, we retry.
        (err) => err === 'Forbidden'
      );

      setRecoveryMethods(methods);
      setHasLoadedRecoveryMethods(true);
    } catch {
      setRecoveryMethods([]);
      setHasLoadedRecoveryMethods(false);
    } finally {
      setIsLoadingRecoveryMethods(false);
    }
  }, [request]);

  const initAuthenticatorChange = useCallback(
    () =>
      request<InitAuthenticatorChangeHandler>({
        method: ExtensionRequest.SEEDLESS_INIT_AUTHENTICATOR_CHANGE,
      }),
    [request]
  );

  const completeAuthenticatorChange = useCallback(
    (totpId: string, code: string) =>
      request<CompleteAuthenticatorChangeHandler>({
        method: ExtensionRequest.SEEDLESS_COMPLETE_AUTHENTICATOR_CHANGE,
        params: [totpId, code],
      }),
    [request]
  );

  useEffect(() => {
    if (walletDetails?.type !== SecretType.Seedless) {
      return;
    }

    loadRecoveryMethods();

    const eventsSubscription = events()
      .pipe(filter(isSeedlessMfaMethodsUpdatedEvent))
      .subscribe(async (event) => {
        setRecoveryMethods(event.value);
      });

    return () => {
      eventsSubscription.unsubscribe();
    };
  }, [events, loadRecoveryMethods, walletDetails?.type]);

  return (
    <SeedlessMfaManagementContext.Provider
      value={{
        completeAuthenticatorChange,
        initAuthenticatorChange,
        isLoadingRecoveryMethods,
        isMfaSetupPromptVisible,
        recoveryMethods,
      }}
    >
      {children}
    </SeedlessMfaManagementContext.Provider>
  );
};

export function useSeedlessMfaManager() {
  return useContext(SeedlessMfaManagementContext);
}
