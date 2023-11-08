import { SettingsHeader } from '../SettingsHeader';
import { useTranslation } from 'react-i18next';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export function Legal({ goBack, navigateTo, width }) {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  return (
    <Stack
      sx={{
        width: `${width}`,
        height: '100%',
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Legal')}
      />
      <List>
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              py: 0.5,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            onClick={async () => {
              try {
                await capture('TermsOfUseClicked');
              } catch (err) {
                console.error(err);
              }

              window.open(
                `https://core.app/terms/core`,
                '_blank',
                'noreferrer'
              );
            }}
            data-testid="terms-of-use-link"
          >
            <ListItemText>
              <Typography variant="body2">{t('Terms of Use')}</Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              py: 0.5,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            onClick={async () => {
              try {
                await capture('PrivacyPolicyClicked');
              } catch (err) {
                console.error(err);
              }
              window.open(
                `https://www.avalabs.org/privacy-policy`,
                '_blank',
                'noreferrer'
              );
            }}
            data-testid="privacy-policy-link"
          >
            <ListItemText>
              <Typography variant="body2">{t('Privacy Policy')}</Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Stack>
  );
}
