import React from 'react';
import {
  DropDownMenu,
  DropDownMenuItem,
  HamburgerIcon,
  Typography,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';

export function SettingsMenu() {
  const theme = useTheme();
  return (
    <DropDownMenu
      coords={{
        right: '0px',
      }}
      icon={<HamburgerIcon color={theme.colors.text} />}
    >
      <DropDownMenuItem>
        <Typography>Settings</Typography>
      </DropDownMenuItem>
    </DropDownMenu>
  );
}
