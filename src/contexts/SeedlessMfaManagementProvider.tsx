import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { RecoveryMethod } from '@src/background/services/seedless/models';
import { GetRecoveryMethodsHandler } from '@src/background/services/seedless/handlers/getRecoveryMethods';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { useConnectionContext } from './ConnectionProvider';
import { useWalletContext } from './WalletProvider';
import { SecretType } from '@src/background/services/secrets/models';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';

interface SeedlessMfaManagementContextProps {
  children?: React.ReactNode;
}

export const SeedlessMfaManagementContext = createContext<{
  isLoadingRecoveryMethods: boolean;
  recoveryMethods: RecoveryMethod[];
  isMfaSetupPromptVisible: boolean;
}>({
  isLoadingRecoveryMethods: false,
  recoveryMethods: [],
  isMfaSetupPromptVisible: false,
});

export const SeedlessMfaManagementProvider = ({
  children,
}: SeedlessMfaManagementContextProps) => {
  const { request } = useConnectionContext();
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

  useEffect(() => {
    if (walletDetails?.type !== SecretType.Seedless) {
      return;
    }

    loadRecoveryMethods();
  }, [loadRecoveryMethods, walletDetails?.type]);

  return (
    <SeedlessMfaManagementContext.Provider
      value={{
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
