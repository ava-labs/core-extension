import {
  CaretIcon,
  CloseIcon,
  ComponentSize,
  ConnectionIndicator,
  DropDownMenuItem,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  SecondaryButton,
  TextButton,
  Toggle,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPageProps, SettingsPages } from '../models';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { Logo } from '@src/components/icons/Logo';
import { BrandName } from '@src/components/icons/BrandName';
import { BetaLabel } from '@src/components/icons/BetaLabel';

export function MainPage({ navigateTo, width, onClose }: SettingsPageProps) {
  const theme = useTheme();
  const { isWalletReady, walletType } = useWalletContext();
  const { network } = useNetworkContext();
  const {
    showTokensWithoutBalances,
    lockWallet,
    toggleShowTokensWithoutBalanceSetting,
    currency,
    isDefaultExtension,
    toggleIsDefaultExtension,
  } = useSettingsContext();

  return (
    <VerticalFlex
      width={width}
      height="100%"
      padding="16px 0 24px"
      background={theme.colors.bg2}
    >
      <HorizontalFlex
        margin="0 0 16px"
        padding="0 16px"
        height="53px"
        justify="space-between"
        align="center"
      >
        <HorizontalFlex align="center">
          <Logo height={29} />
          <BrandName height={15} margin="0 0 0 8px" />
          <HorizontalFlex width="auto" margin="0 0 0 16px">
            <BetaLabel />
          </HorizontalFlex>
        </HorizontalFlex>
        <TextButton onClick={onClose}>
          <CloseIcon height="16px" color={theme.colors.icon1} />
        </TextButton>
      </HorizontalFlex>
      <DropDownMenuItem
        justify="space-between"
        align="center"
        padding="10px 16px"
        onClick={() => navigateTo(SettingsPages.NETWORK)}
      >
        <Typography size={14} height="17px">
          Network
        </Typography>
        <HorizontalFlex align="center">
          <ConnectionIndicator
            disableTooltip={true}
            size={8}
            connected={isWalletReady}
          />
          <Typography
            size={14}
            height="17px"
            margin="0 8px"
            color={theme.colors.text2}
          >
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
        padding="10px 16px"
        onClick={() => navigateTo(SettingsPages.CONTACT_LIST)}
      >
        <Typography size={14} height="17px">
          Address Book
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
        padding="10px 16px"
        onClick={() => navigateTo(SettingsPages.CURRENCIES)}
      >
        <Typography size={14} height="17px">
          Currency
        </Typography>
        <HorizontalFlex align="center">
          <Typography
            size={14}
            height="17px"
            margin="0 8px"
            color={theme.colors.text2}
          >
            {currency}
          </Typography>
          <CaretIcon
            color={theme.colors.icon1}
            height="14px"
            direction={IconDirection.RIGHT}
          />
        </HorizontalFlex>
      </DropDownMenuItem>
      {walletType === 'ledger' && (
        <DropDownMenuItem
          justify="space-between"
          align="center"
          padding="10px 16px"
          onClick={() => navigateTo(SettingsPages.LEDGER)}
        >
          <Typography size={14} height="17px">
            Ledger
          </Typography>
          <CaretIcon
            color={theme.colors.icon1}
            height="14px"
            direction={IconDirection.RIGHT}
          />
        </DropDownMenuItem>
      )}
      <DropDownMenuItem justify="space-between" padding="10px 16px">
        <Typography size={14} height="17px">
          Show Tokens Without Balance
        </Typography>
        <Toggle
          isChecked={showTokensWithoutBalances}
          onChange={() => toggleShowTokensWithoutBalanceSetting()}
        />
      </DropDownMenuItem>

      <DropDownMenuItem justify="space-between" padding="12px 16px">
        <Typography size={14} height="17px">
          Set as Default Extension
        </Typography>
        <Toggle
          isChecked={isDefaultExtension}
          onChange={() => toggleIsDefaultExtension()}
        />
      </DropDownMenuItem>

      <HorizontalFlex width="100%" margin="16px 0" padding="0 16px">
        <HorizontalSeparator />
      </HorizontalFlex>

      <DropDownMenuItem
        justify="space-between"
        align="center"
        padding="10px 16px"
        onClick={() => navigateTo(SettingsPages.SECURITY_AND_PRIVACY)}
      >
        <Typography size={14} height="17px">
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
        padding="10px 16px"
        as="a"
        target="_blank"
        onClick={() => navigateTo(SettingsPages.LEGAL)}
      >
        <Typography size={14} height="17px">
          Legal
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
        padding="10px 16px"
        as="a"
        target="_blank"
        onClick={() =>
          window.open('https://support.avax.network/en/', '_blank')
        }
      >
        <Typography size={14} height="17px">
          Help Center
        </Typography>
      </DropDownMenuItem>

      <VerticalFlex grow="1" justify="flex-end" align="center" padding="0 16px">
        <SecondaryButton
          width="100%"
          size={ComponentSize.LARGE}
          onClick={lockWallet}
        >
          Lock Account
        </SecondaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
