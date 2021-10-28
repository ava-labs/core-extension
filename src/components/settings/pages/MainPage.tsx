import React from 'react';
import {
  CaretIcon,
  DropDownMenuItem,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  LockIcon,
  SecondaryButton,
  Toggle,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPageProps, SettingsPages } from '../models';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

export function MainPage({ navigateTo }: SettingsPageProps) {
  const theme = useTheme();
  const { network } = useNetworkContext();
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const {
    showTokensWithoutBalances,
    lockWallet,
    toggleShowTokensWithoutBalanceSetting,
    currency,
  } = useSettingsContext();

  return (
    <VerticalFlex
      width={isMiniMode ? '319px' : '375px'}
      height="100%"
      padding={isMiniMode ? '0' : '12px 0'}
      background={theme.colors.bg2}
    >
      <Typography size={24} weight={700} height="24px" margin="40px 16px 12px">
        Settings
      </Typography>
      <DropDownMenuItem
        justify="space-between"
        align="center"
        padding="12px 16px"
        onClick={() => navigateTo(SettingsPages.NETWORK)}
      >
        <Typography weight={600} height="24px">
          Network
        </Typography>
        <HorizontalFlex align="center">
          <Typography size={14} margin="0 6px" color={theme.colors.text2}>
            {network?.name?.replace('Avalanche', '')}
          </Typography>
          <CaretIcon
            color={theme.colors.icon1}
            height="14px"
            direction={IconDirection.RIGHT}
          />
        </HorizontalFlex>
      </DropDownMenuItem>
      <DropDownMenuItem
        justify="space-between"
        align="center"
        padding="12px 16px"
        onClick={() => navigateTo(SettingsPages.CURRENCIES)}
      >
        <Typography weight={600} height="24px">
          Currency
        </Typography>
        <HorizontalFlex align="center">
          <Typography size={14} margin="0 6px" color={theme.colors.text2}>
            {currency}
          </Typography>
          <CaretIcon
            color={theme.colors.icon1}
            height="14px"
            direction={IconDirection.RIGHT}
          />
        </HorizontalFlex>
      </DropDownMenuItem>
      <DropDownMenuItem
        justify="space-between"
        align="center"
        padding="12px 16px"
        onClick={() => navigateTo(SettingsPages.ADVANCED)}
      >
        <Typography weight={600} height="24px">
          Advanced
        </Typography>
        <CaretIcon
          color={theme.colors.icon1}
          height="14px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem justify="space-between" padding="12px 16px">
        <Typography weight={600} height="24px">
          Hide tokens without balance
        </Typography>
        <Toggle
          isChecked={!showTokensWithoutBalances}
          onChange={() => toggleShowTokensWithoutBalanceSetting()}
        />
      </DropDownMenuItem>

      <HorizontalFlex width="100%" margin="12px 0" padding="0 16px">
        <HorizontalSeparator />
      </HorizontalFlex>

      <DropDownMenuItem
        justify="space-between"
        align="center"
        padding="12px 16px"
        onClick={() => navigateTo(SettingsPages.SECURITY_AND_PRIVACY)}
      >
        <Typography weight={600} height="24px">
          Security &amp; Privacy
        </Typography>
        <CaretIcon
          color={theme.colors.icon1}
          height="14px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem
        justify="space-between"
        align="center"
        padding="12px 16px"
      >
        <Typography weight={600} height="24px">
          Legal
        </Typography>
      </DropDownMenuItem>

      <VerticalFlex
        grow="1"
        justify="flex-end"
        align="center"
        padding="0 16px 75px"
      >
        <SecondaryButton onClick={() => lockWallet()}>
          <LockIcon color={theme.colors.icon1} height="20px" />
          <Typography margin="0 0 0 6px" weight={600}>
            Lock wallet
          </Typography>
        </SecondaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
