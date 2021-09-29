import React from 'react';
import {
  CaretIcon,
  DropDownMenuItem,
  IconDirection,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps, SettingsPages } from '../models';
import { SettingsHeader } from '../SettingsHeader';

export function SecurityAndPrivacy({ goBack, navigateTo }: SettingsPageProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width="375px" padding="12px 0">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Secuirty & Privacy'}
      />
      <DropDownMenuItem
        justify="space-between"
        align="center"
        onClick={() => navigateTo(SettingsPages.CHANGE_PASSWORD)}
      >
        <Typography>Change password</Typography>
        <CaretIcon
          color={theme.colors.textAccent}
          height="12px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem
        justify="space-between"
        align="center"
        onClick={() => navigateTo(SettingsPages.RECOVERY_PHRASE)}
      >
        <Typography>Show recovery phrase</Typography>
        <CaretIcon
          color={theme.colors.textAccent}
          height="12px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
    </VerticalFlex>
  );
}
