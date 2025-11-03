import { WarningMessage } from '@/components/WarningMessage';
import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import {
  Button,
  Divider,
  EncryptedIcon,
  Paper,
  PasswordIcon,
  SecurityKeyIcon,
} from '@avalabs/k2-alpine';
import { openFullscreenTab } from '@core/common';
import { FeatureGates } from '@core/types';
import { useAnalyticsContext, useFeatureFlagContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export const MethodIcons = {
  passkey: <PasswordIcon size={24} />,
  authenticator: <EncryptedIcon size={24} />,
  yubikey: <SecurityKeyIcon size={24} />,
};

export const RecoveryMethodList = ({
  hasTotpConfigured,
  hasMFAConfigured,
  onNext,
}: {
  hasTotpConfigured: boolean;
  hasMFAConfigured: boolean;
  onNext: () => void;
}) => {
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

  const recoveryMethodCards = [
    {
      icon: MethodIcons.passkey,
      title: t('Passkey'),
      description: t(
        'Passkeys are used for quick, password-free recovery and enhanced security.',
      ),
      to: 'update-recovery-method/fido/add/passkey',
      analyticsKey: 'AddPasskeyClicked',
      method: 'passkey',
      isOn: isPasskeyOn,
    },
    {
      icon: MethodIcons.authenticator,
      title: t('Authenticator app'),
      description: t(
        'Authenticator apps generate secure, time-based codes for wallet recovery.',
      ),
      // add url for in-extension version
      to: !hasMFAConfigured
        ? '/settings/recovery-method/authenticator'
        : 'update-recovery-method/totp/add',
      analyticsKey: 'AddAuthenticatorClicked',
      method: 'authenticator',
      newTab: !hasMFAConfigured ? false : true,
      isOn: isAuthenticatorOn,
    },
    {
      icon: MethodIcons.yubikey,
      title: t('Yubikey'),
      description: t(
        'YubiKeys are physical, hardware-based protection and strong authentication.',
      ),
      to: 'update-recovery-method/fido/add/yubikey',
      analyticsKey: 'AddYubikeyClicked',
      method: 'yubikey',
      isOn: isYubikeyOn,
    },
  ];

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
