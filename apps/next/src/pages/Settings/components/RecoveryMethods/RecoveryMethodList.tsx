import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import {
  Divider,
  EncryptedIcon,
  PasswordIcon,
  SecurityKeyIcon,
} from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';

export const MethodIcons = {
  passkey: <PasswordIcon fontSize="large" />,
  authenticator: <EncryptedIcon fontSize="large" />,
  yubikey: <SecurityKeyIcon fontSize="large" />,
};

export const RecoveryMethodList = () => {
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
      to: '/onboarding/import',
      analyticsKey: 'AddPasskeyClicked',
    },
    {
      icon: MethodIcons.authenticator,
      title: t('Authenticator app'),
      description: t(
        'Authenticator apps generate secure, time-based codes for wallet recovery.',
      ),
      to: `${path}/authenticator`,
      analyticsKey: 'AddAuthenticatorClicked',
    },
    {
      icon: MethodIcons.yubikey,
      title: t('Yubikey'),
      description: t(
        'YubiKeys are physical, hardware-based protection and strong authentication.',
      ),
      to: '/onboarding/import',
      analyticsKey: 'AddYubikeyClicked',
    },
  ];

  return (
    <div>
      <CardMenu divider={<Divider sx={{ ml: 8, mr: 3 }} />}>
        {recoveryMethodCards.map((card, idx) => {
          return (
            <CardMenuItem
              onClick={() => {
                capture(card.analyticsKey);
                history.push(card.to);
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
