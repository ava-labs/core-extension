import { Page } from '@/components/Page';
import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import {
  Box,
  ChevronRightIcon,
  Divider,
  EncryptedIcon,
  IconButton,
  Paper,
  PasswordIcon,
  SecurityKeyIcon,
  Typography,
} from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlinePassword } from 'react-icons/md';
import { useHistory, useRouteMatch } from 'react-router-dom';

export const RecoveryMethods: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { capture } = useAnalyticsContext();
  const { path } = useRouteMatch();
  console.log('path: ', path);

  const cards = [
    {
      icon: <PasswordIcon fontSize="large" />,
      title: t('Passkey'),
      description: t(
        'Passkeys are used for quick, password-free recovery and enhanced security.',
      ),
      to: '/onboarding/import',
      analyticsKey: 'AddPasskeyClicked',
    },
    {
      icon: <EncryptedIcon fontSize="large" />,
      title: t('Authenticator app'),
      description: t(
        'Authenticator apps generate secure, time-based codes for wallet recovery.',
      ),
      to: `${path}/authenticator`,
      analyticsKey: 'AddAuthenticatorClicked',
    },
    {
      icon: <SecurityKeyIcon fontSize="large" />,
      title: t('Yubikey'),
      description: t(
        'YubiKeys are physical, hardware-based protection and strong authentication.',
      ),
      to: '/onboarding/import',
      analyticsKey: 'AddYubikeyClicked',
    },
  ];

  return (
    <Page
      title={t('Recovery methods')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
        }}
      >
        <CardMenu divider={<Divider sx={{ ml: 8, mr: 3 }} />}>
          {cards.map((card, idx) => {
            console.log('card: ', card);
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
      </Paper>
    </Page>
  );
};
