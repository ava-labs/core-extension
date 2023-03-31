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

export function Legal({ goBack, navigateTo, width }) {
  const { t } = useTranslation();
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
            onClick={() => window.open(`https://core.app/terms/core`, '_blank')}
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
            onClick={() =>
              window.open(`https://www.avalabs.org/privacy-policy`, '_blank')
            }
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
