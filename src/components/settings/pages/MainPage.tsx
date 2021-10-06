import React from 'react';
import {
  CaretIcon,
  DropDownMenuItem,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  LockIcon,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { ThemeSelector } from '../ThemeSelector';
import { resetExtensionState } from '@src/utils/resetExtensionState';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPageProps, SettingsPages } from '../models';

export function MainPage({ navigateTo }: SettingsPageProps) {
  const theme = useTheme();
  const { lockWallet, toggleShowTokensWithoutBalanceSetting } =
    useSettingsContext();

  return (
    <VerticalFlex width="375px" padding="12px 0">
      <HorizontalFlex grow="1" justify="space-between" padding="12px 24px">
        <Typography size={18} weight={700} height="24px">
          Settings
        </Typography>
        <ThemeSelector />
      </HorizontalFlex>
      <DropDownMenuItem
        justify="space-between"
        align="center"
        onClick={() => navigateTo(SettingsPages.CURRENCIES)}
      >
        <Typography>Currency</Typography>
        <CaretIcon
          color={theme.colors.icon2}
          height="12px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem
        justify="space-between"
        align="center"
        onClick={() => navigateTo(SettingsPages.SECURITY_AND_PRIVACY)}
      >
        <Typography>Security &amp; Privacy</Typography>
        <CaretIcon
          color={theme.colors.icon2}
          height="12px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem justify="space-between" align="center">
        <Typography>Legal</Typography>
        <CaretIcon
          color={theme.colors.icon2}
          height="12px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem justify="space-between" align="center">
        <Typography>Advanced</Typography>
        <CaretIcon
          color={theme.colors.icon2}
          height="12px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem
        justify="space-between"
        onClick={() => toggleShowTokensWithoutBalanceSetting()}
      >
        <Typography>Hide tokens without balance</Typography>
      </DropDownMenuItem>

      <HorizontalSeparator margin="32px 0 12px" />

      <DropDownMenuItem justify="space-between" onClick={() => lockWallet()}>
        <Typography>Lock wallet</Typography>
        <LockIcon color={theme.colors.icon1} />
      </DropDownMenuItem>
      <DropDownMenuItem justify="space-between">
        <Typography>Version</Typography>
        <Typography color={theme.colors.text2}>0.0.0</Typography>
      </DropDownMenuItem>
      <DropDownMenuItem
        justify="space-between"
        onClick={() => resetExtensionState()}
      >
        <TextButton>Sign out</TextButton>
      </DropDownMenuItem>
    </VerticalFlex>
  );
}
