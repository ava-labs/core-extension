import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import {
  Divider,
  EncryptedIcon,
  PasswordIcon,
  SecurityKeyIcon,
} from '@avalabs/k2-alpine';
import { openFullscreenTab } from '@core/common';
import { useAnalyticsContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';

export const MethodIcons = {
  passkey: <PasswordIcon fontSize="large" />,
  authenticator: <EncryptedIcon fontSize="large" />,
  yubikey: <SecurityKeyIcon fontSize="large" />,
};

export const RecoveryMethodList = ({
  hasTotpConfigured,
}: {
  hasTotpConfigured: boolean;
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { capture } = useAnalyticsContext();
  const { path } = useRouteMatch();

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
      to: `update-recovery-method/totp/add`,
      analyticsKey: 'AddAuthenticatorClicked',
      method: 'authenticator',
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
    <div>
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
                console.log('card.to: ', card.to);
                openFullscreenTab(card.to);
              }}
              icon={card.icon}
              text={card.title}
              description={card.description}
              key={idx}
            />
          );
        })}
      </CardMenu>
    </div>
  );
};
