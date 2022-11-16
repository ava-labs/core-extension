import {
  CheckmarkIcon,
  SecondaryDropDownMenuItem,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@src/hooks/useLanguages';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export function Language({ goBack, navigateTo, width }: SettingsPageProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { availableLanguages, currentLanguage, changeLanguage } = useLanguage();
  const { capture } = useAnalyticsContext();

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Language')}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        {availableLanguages.map((lang) => (
          <SecondaryDropDownMenuItem
            data-testid={`language-menu-item-${lang.code}`}
            selected={lang.code === currentLanguage?.code}
            padding="10px 16px"
            key={lang.code}
            justify="space-between"
            align="center"
            onClick={() => {
              changeLanguage(lang.code);
              capture('AppLanguageChanged', {
                language: lang.code,
              });
            }}
          >
            <Typography size={14} height="17px">
              {lang.name} ({lang.originalName})
            </Typography>
            {lang.code === currentLanguage?.code && (
              <CheckmarkIcon height="16px" color={theme.colors.icon1} />
            )}
          </SecondaryDropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
