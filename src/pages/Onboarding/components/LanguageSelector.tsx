import {
  CaretIcon,
  CheckmarkIcon,
  DropDownMenu,
  DropDownMenuItem,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  Typography,
} from '@avalabs/react-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useLanguage } from '@src/hooks/useLanguages';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

export function LanguageSelector() {
  const theme = useTheme();

  const { availableLanguages, changeLanguage, currentLanguage } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  return (
    <>
      <DropDownMenu
        onMenuToggle={setIsDropdownOpen}
        icon={
          <HorizontalFlex
            align="center"
            data-testid="onboarding-language-selector"
          >
            <Typography size={14} margin="0 4px 0 0 ">
              {t('Language')}
            </Typography>
            <Typography
              size={14}
              margin="0 8px 0 0 "
              color={theme.colors.text2}
            >
              ({currentLanguage?.name})
            </Typography>
            <CaretIcon
              direction={
                !isDropdownOpen ? IconDirection.DOWN : IconDirection.UP
              }
              height={'12px'}
              color={theme.colors.text1}
            />
          </HorizontalFlex>
        }
        coords={{
          top: '30px',
          right: 0,
        }}
      >
        {availableLanguages.map((lang, index) => {
          return (
            <React.Fragment key={lang.code}>
              <DropDownMenuItem
                onClick={() => {
                  changeLanguage(lang.code);
                  capture('OnboardingLanguageChanged', {
                    language: lang.code,
                  });
                }}
                data-testid={`onboarding-language-selector-menu-item-${lang.code}`}
                width="300px"
                padding="8px 10px"
                selected={lang.code === currentLanguage?.code}
              >
                <HorizontalFlex
                  justify="space-between"
                  align="center"
                  width="100%"
                >
                  <Typography>
                    {lang.name} ({lang.originalName})
                  </Typography>
                  {lang.code === currentLanguage?.code && (
                    <CheckmarkIcon height={'12px'} color={theme.colors.text1} />
                  )}
                </HorizontalFlex>
              </DropDownMenuItem>
              {index < availableLanguages.length - 1 && (
                <HorizontalSeparator margin="0" />
              )}
            </React.Fragment>
          );
        })}
      </DropDownMenu>
    </>
  );
}
