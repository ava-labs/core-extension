import { useTheme } from 'styled-components';
import {
  ConfigureIcon,
  HorizontalFlex,
  TextButton,
} from '@avalabs/react-components';
import React from 'react';
import { HeaderProps } from './HeaderFlow';
import { AccountSelector } from '../account/AccountSelector';
import { SettingsMenu } from '@src/components/settings/SettingsMenu';
import { SettingsMenuFlow } from '@src/components/settings/SettingsMenuFlow';

function HeaderMiniMode({ onDrawerStateChanged }: HeaderProps) {
  const theme = useTheme();

  return (
    <HorizontalFlex justify="space-between" align="center" padding="16px">
      <SettingsMenuFlow />
      <AccountSelector />
      <TextButton disabled={true}>
        <ConfigureIcon color={theme.colors.disabled} />
      </TextButton>
    </HorizontalFlex>
  );
}

export default HeaderMiniMode;
