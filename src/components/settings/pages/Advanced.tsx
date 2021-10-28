import React from 'react';
import {
  DropDownMenuItem,
  MoonIcon,
  SunshineIcon,
  Typography,
  useThemeContext,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { ThemeVariant } from '@src/background/services/settings/models';

export function Advanced({ goBack, navigateTo }: SettingsPageProps) {
  const theme = useTheme();
  const { darkMode, toggleDarkTheme } = useThemeContext();
  const { updateTheme } = useSettingsContext();

  const changeTheme = () => {
    updateTheme(darkMode ? ThemeVariant.LIGHT : ThemeVariant.DARK);
    toggleDarkTheme();
  };

  return (
    <VerticalFlex width="375px" background={theme.colors.bg2} height="100%">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Advanced'}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <DropDownMenuItem
          justify="space-between"
          align="center"
          padding="12px 16px"
          onClick={() => changeTheme()}
        >
          <Typography>Theme</Typography>
          {darkMode ? (
            <SunshineIcon color={theme.colors.text1} />
          ) : (
            <MoonIcon color={theme.colors.text1} />
          )}
        </DropDownMenuItem>
      </Scrollbars>
    </VerticalFlex>
  );
}
