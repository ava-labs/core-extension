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
import { useAnalyticsContext } from '@core/ui';
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
    },
  ];

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <CardMenu divider={<Divider sx={{ ml: 8, mr: 3 }} />}>
          {recoveryMethodCards.map((card, idx) => {
            // Hide Authenticator option if TOTP is already configured
            if (card.method === 'authenticator' && hasTotpConfigured) {
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
      </Paper>
      <Button
        variant="contained"
        color="primary"
        size="extension"
        fullWidth
        sx={{ mt: 'auto' }}
        onClick={onNext}
      >
        {t('Add recovery method')}
      </Button>
    </>
  );
};
