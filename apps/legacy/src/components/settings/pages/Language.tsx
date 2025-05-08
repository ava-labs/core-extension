import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@core/ui';
import { useAnalyticsContext } from '@core/ui';
import {
  Stack,
  Scrollbars,
  Typography,
  ListItem,
  List,
  CheckIcon,
} from '@avalabs/core-k2-components';
import { StyledListButton } from '../components/StyledListItemButton';

export function Language({ goBack, navigateTo, width }: SettingsPageProps) {
  const { t } = useTranslation();
  const { availableLanguages, currentLanguage, changeLanguage } = useLanguage();
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
        title={t('Language')}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <List sx={{ py: 0 }}>
          {availableLanguages.map((lang) => (
            <ListItem key={lang.code} sx={{ p: 0 }}>
              <StyledListButton
                data-testid={`language-menu-item-${lang.code}`}
                selected={lang.code === currentLanguage?.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  capture('AppLanguageChanged', {
                    language: lang.code,
                  });
                }}
              >
                <Typography variant="body2">
                  {lang.name} ({lang.originalName})
                </Typography>
                {lang.code === currentLanguage?.code && <CheckIcon size={16} />}
              </StyledListButton>
            </ListItem>
          ))}
        </List>
      </Scrollbars>
    </Stack>
  );
}
