import React from 'react';
import {
  CaretIcon,
  DropDownMenuItem,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  Typography,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps, SettingsPages } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { resetExtensionState } from '@src/utils/resetExtensionState';

export function SecurityAndPrivacy({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const theme = useTheme();
  const { showDialog, clearDialog } = useDialog();

  const onLogoutClick = () => {
    showDialog({
      title: 'Have you recorded your recovery phrase?',
      body: 'Without it you will not be able to sign back in to your account.',
      confirmText: 'Yes',
      width: '343px',
      onConfirm: () => {
        clearDialog();
        resetExtensionState();
      },
      cancelText: 'No',
      onCancel: () => {
        clearDialog();
      },
    });
  };

  return (
    <VerticalFlex
      width={width}
      background={theme.colors.bg2}
      height="100%"
      justify="flex-start"
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Security & Privacy'}
      />
      <DropDownMenuItem
        justify="space-between"
        align="center"
        onClick={() => navigateTo(SettingsPages.CHANGE_PASSWORD)}
      >
        <Typography>Change password</Typography>
        <CaretIcon
          color={theme.colors.icon1}
          height="14px"
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
          color={theme.colors.icon1}
          height="14px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>

      <HorizontalFlex width="100%" margin="12px 0" padding="0 16px">
        <HorizontalSeparator />
      </HorizontalFlex>

      <DropDownMenuItem
        justify="space-between"
        align="center"
        padding="12px 16px"
        onClick={() => onLogoutClick()}
      >
        <Typography color={theme.colors.error}>Sign out</Typography>
      </DropDownMenuItem>
    </VerticalFlex>
  );
}
