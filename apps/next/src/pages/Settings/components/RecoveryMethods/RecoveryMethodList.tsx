import { WarningMessage } from '@/components/WarningMessage';
import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import { Button, Divider, Paper } from '@avalabs/k2-alpine';
import { openFullscreenTab } from '@core/common';
import { FeatureGates } from '@core/types';
import { useAnalyticsContext, useFeatureFlagContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { getRecoveryMethodCards } from './recoveryMethodCards.config';

interface RecoveryMethodListProps {
  hasTotpConfigured: boolean;
  hasMFAConfigured: boolean;
  onNext: () => void;
}

export const RecoveryMethodList = ({
  hasTotpConfigured,
  hasMFAConfigured,
  onNext,
}: RecoveryMethodListProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { capture } = useAnalyticsContext();
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
    hasMFAConfigured,
  });

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          width: '100%',
          backgroundColor: 'surface.primary',
        }}
      >
        {!noMFAMethodsAvailable && (
          <CardMenu divider={<Divider sx={{ ml: 8, mr: 3 }} />}>
            {recoveryMethodCards.map((card, idx) => {
              if (
                (card.method === 'authenticator' && hasTotpConfigured) ||
                !card.isOn
              ) {
                return null;
              }

              return (
                <CardMenuItem
                  onClick={() => {
                    capture(card.analyticsKey);
                    if (card.newTab === false) {
                      history.push(card.to);
                      return;
                    }
                    openFullscreenTab(card.to);
                  }}
                  icon={card.icon}
                  text={card.title}
                  description={card.description}
                  key={idx}
                  size="small"
                />
              );
            })}
          </CardMenu>
        )}
        {noMFAMethodsAvailable && (
          <WarningMessage sx={{ p: 2 }}>
            {t(
              'You cannot add a new recovery method for your wallet! Try again later!',
            )}
          </WarningMessage>
        )}
      </Paper>
      <Button
        variant="contained"
        color="primary"
        size="extension"
        fullWidth
        sx={{ mt: 'auto' }}
        onClick={onNext}
        disabled={noMFAMethodsAvailable}
      >
        {t('Add recovery method')}
      </Button>
    </>
  );
};
