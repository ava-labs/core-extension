import { getRecoveryMethodCards } from '@/pages/Settings/components/RecoveryMethods/recoveryMethodCards.config';
import { FeatureGates } from '@core/types';
import { useFeatureFlagContext } from '@core/ui';
import { useTranslation } from 'react-i18next';

export const useRecoveryMethodsData = ({
  hasTotpConfigured,
  hasMfaConfigured,
}) => {
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlagContext();
  const isPasskeyOn = featureFlags[FeatureGates.SEEDLESS_MFA_PASSKEY];
  const isYubikeyOn = featureFlags[FeatureGates.SEEDLESS_MFA_YUBIKEY];
  const isAuthenticatorOn =
    featureFlags[FeatureGates.SEEDLESS_MFA_AUTHENTICATOR];

  const noMFAMethodsAvailable =
    !isPasskeyOn && !isYubikeyOn && (!isAuthenticatorOn || hasTotpConfigured);

  const recoveryMethodCards = getRecoveryMethodCards({
    t,
    isPasskeyOn,
    isYubikeyOn,
    isAuthenticatorOn,
    hasMFAConfigured: hasMfaConfigured,
  });

  return {
    noMFAMethodsAvailable,
    recoveryMethodCards,
  };
};
