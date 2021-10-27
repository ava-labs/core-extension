import React from 'react';
import {
  DropDownMenuItem,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { ThemeSelector } from '../ThemeSelector';
import Scrollbars from 'react-custom-scrollbars';

export function Advanced({ goBack, navigateTo }: SettingsPageProps) {
  const theme = useTheme();

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
        >
          <Typography>Theme</Typography>
          <ThemeSelector />
        </DropDownMenuItem>
      </Scrollbars>
    </VerticalFlex>
  );
}
