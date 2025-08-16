import { Page } from '@/components/Page';
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
        {cards.map((card, idx) => {
          console.log('card: ', card);
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                position: 'relative',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
              onClick={() => {
                capture(card.analyticsKey);
                history.push(card.to);
              }}
              key={card.title}
            >
              <Box
                sx={{
                  mr: 2,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {card.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </Box>
              <IconButton edge="end" size="large" sx={{ ml: 1 }}>
                <ChevronRightIcon />
              </IconButton>
              {idx < cards.length - 1 && (
                <Divider
                  sx={{
                    position: 'absolute',
                    left: 64,
                    right: 0,
                    bottom: 0,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Paper>
    </Page>
  );
};
