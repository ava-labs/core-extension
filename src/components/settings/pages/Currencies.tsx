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
import { resetExtensionState } from '@src/utils/resetExtensionState';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPageProps } from '../models';

export function Currencies({ navigateTo, goBack }: SettingsPageProps) {
  const theme = useTheme();
  const { lockWallet } = useSettingsContext();

  return (
    <VerticalFlex width="375px" padding="12px 0">
      <HorizontalFlex grow="1" justify="space-between" padding="12px 24px">
        <CaretIcon
          height="20px"
          direction={IconDirection.LEFT}
          onClick={goBack}
        />
        <Typography size={18} weight={700} height="24px">
          Currencies
        </Typography>
      </HorizontalFlex>
      <DropDownMenuItem justify="space-between" align="center">
        <Typography>Currency</Typography>
        <CaretIcon
          color={theme.colors.textAccent}
          height="12px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem justify="space-between" align="center">
        <Typography>Security &amp; Privacy</Typography>
        <CaretIcon
          color={theme.colors.textAccent}
          height="12px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem justify="space-between" align="center">
        <Typography>Legal</Typography>
        <CaretIcon
          color={theme.colors.textAccent}
          height="12px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem justify="space-between" align="center">
        <Typography>Advanced</Typography>
        <CaretIcon
          color={theme.colors.textAccent}
          height="12px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem justify="space-between">
        <Typography>Hide tokens without balance</Typography>
      </DropDownMenuItem>
      <HorizontalSeparator margin="12px 0" />
      <DropDownMenuItem justify="space-between" onClick={() => lockWallet()}>
        <Typography>Lock wallet</Typography>
        <LockIcon color={theme.colors.textAccent} />
      </DropDownMenuItem>
      <DropDownMenuItem justify="space-between">
        <Typography>Version</Typography>
        <Typography color={theme.colors.textAccent}>0.0.0</Typography>
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
