import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { filter } from 'rxjs';

import {
  incrementalPromiseResolve,
  isSeedlessMfaMethodsUpdatedEvent,
} from '@core/common';
import type {
  AddFidoDeviceHandler,
  CompleteAuthenticatorChangeHandler,
  GetRecoveryMethodsHandler,
  InitAuthenticatorChangeHandler,
  RemoveFidoDeviceHandler,
} from '@core/service-worker';
import {
  ExtensionRequest,
  FeatureGates,
  KeyType,
  MfaRequestType,
  RecoveryMethod,
  SecretType,
  TotpResetChallenge,
} from '@core/types';

import { RemoveTotpHandler } from '@core/service-worker';
import { useConnectionContext } from './ConnectionProvider';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { useWalletContext } from './WalletProvider';

interface SeedlessMfaManagementContextProps {
  children?: React.ReactNode;
}

export const SeedlessMfaManagementContext = createContext<
  | {
      initAuthenticatorChange(): Promise<TotpResetChallenge>;
      completeAuthenticatorChange(totpId: string, code: string): Promise<void>;
      addFidoDevice(name: string, keyType: KeyType): Promise<void>;
      removeFidoDevice(id: string): Promise<void>;
      removeTotp(): Promise<void>;
      isLoadingRecoveryMethods: boolean;
      recoveryMethods: RecoveryMethod[];
      isMfaSetupPromptVisible: boolean;
      hasMfaConfigured: boolean;
      hasTotpConfigured: boolean;
      hasFidoConfigured: boolean;
    }
  | undefined
>(undefined);

export const SeedlessMfaManagementProvider = ({
  children,
}: SeedlessMfaManagementContextProps) => {
  const { events, request } = useConnectionContext();
  const { walletDetails } = useWalletContext();
  const { isFlagEnabled } = useFeatureFlagContext();
  const areMfaSettingsAvailable = isFlagEnabled(
    FeatureGates.SEEEDLESS_MFA_SETTINGS,
  );

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
        (err) => err === 'Forbidden',
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
    [request],
  );

  const completeAuthenticatorChange = useCallback(
    (totpId: string, code: string) =>
      request<CompleteAuthenticatorChangeHandler>({
        method: ExtensionRequest.SEEDLESS_COMPLETE_AUTHENTICATOR_CHANGE,
        params: [totpId, code],
      }),
    [request],
  );

  const addFidoDevice = useCallback(
    (name: string, keyType: KeyType) =>
      request<AddFidoDeviceHandler>({
        method: ExtensionRequest.SEEDLESS_ADD_FIDO_DEVICE,
        params: [name, keyType],
      }),
    [request],
  );

  const removeFidoDevice = useCallback(
    (id: string) =>
      request<RemoveFidoDeviceHandler>({
        method: ExtensionRequest.SEEDLESS_REMOVE_FIDO_DEVICE,
        params: [id],
      }),
    [request],
  );

  const removeTotp = useCallback(
    () =>
      request<RemoveTotpHandler>({
        method: ExtensionRequest.SEEDLESS_REMOVE_TOTP,
      }),
    [request],
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
        addFidoDevice,
        removeFidoDevice,
        removeTotp,
        completeAuthenticatorChange,
        initAuthenticatorChange,
        isLoadingRecoveryMethods,
        isMfaSetupPromptVisible,
        recoveryMethods,
        hasMfaConfigured: recoveryMethods.length > 0,
        hasTotpConfigured: recoveryMethods.some(
          ({ type }) => type === MfaRequestType.Totp,
        ),
        hasFidoConfigured: recoveryMethods.some(
          ({ type }) => type === MfaRequestType.Fido,
        ),
      }}
    >
      {children}
    </SeedlessMfaManagementContext.Provider>
  );
};

export function useSeedlessMfaManager() {
  const context = useContext(SeedlessMfaManagementContext);

  if (!context) {
    throw new Error(
      'useSeedlessMfaManager must be used within a SeedlessMfaManagementProvider',
    );
  }

  return context;
}
