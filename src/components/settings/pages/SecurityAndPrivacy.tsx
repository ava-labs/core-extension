import {
  CaretIcon,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  SecondaryDropDownMenuItem,
  Toggle,
  Typography,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps, SettingsPages } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { WalletType } from '@src/background/services/wallet/models';
import { ResetExtensionStateHandler } from '@src/background/services/storage/handlers/resetExtensionState';

export function SecurityAndPrivacy({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const theme = useTheme();
  const { showDialog, clearDialog } = useDialog();
  const { walletType } = useWalletContext();
  const { analyticsConsent, setAnalyticsConsent } = useSettingsContext();
  const { stopDataCollection, initAnalyticsIds } = useAnalyticsContext();
  const { request } = useConnectionContext();

  const onLogoutClick = () => {
    showDialog({
      title: 'Have you recorded your recovery phrase?',
      body: 'Without it you will not be able to sign back in to your account.',
      confirmText: 'Yes',
      width: '343px',
      onConfirm: () => {
        clearDialog();
        stopDataCollection();
        request<ResetExtensionStateHandler>({
          method: ExtensionRequest.RESET_EXTENSION_STATE,
          params: [true],
        });
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

      <SecondaryDropDownMenuItem
        data-testid="connected-sites-menu-item"
        justify="space-between"
        align="center"
        onClick={() => navigateTo(SettingsPages.CONNECTED_SITES)}
        padding="10px 16px"
        margin="16px 0 0"
      >
        <Typography size={14} height="17px">
          Connected Sites
        </Typography>
        <CaretIcon
          color={theme.colors.icon1}
          height="14px"
          direction={IconDirection.RIGHT}
        />
      </SecondaryDropDownMenuItem>

      <SecondaryDropDownMenuItem
        data-testid="change-password-menu-item"
        justify="space-between"
        align="center"
        onClick={() => navigateTo(SettingsPages.CHANGE_PASSWORD)}
        padding="10px 16px"
      >
        <Typography size={14} height="17px">
          Change Password
        </Typography>
        <CaretIcon
          color={theme.colors.icon1}
          height="14px"
          direction={IconDirection.RIGHT}
        />
      </SecondaryDropDownMenuItem>

      {walletType === WalletType.MNEMONIC && (
        <SecondaryDropDownMenuItem
          data-testid="show-recovery-phrase-menu-item"
          justify="space-between"
          align="center"
          onClick={() => navigateTo(SettingsPages.RECOVERY_PHRASE)}
          padding="10px 16px"
        >
          <Typography size={14} height="17px">
            Show Recovery Phrase
          </Typography>
          <CaretIcon
            color={theme.colors.icon1}
            height="14px"
            direction={IconDirection.RIGHT}
          />
        </SecondaryDropDownMenuItem>
      )}

      <SecondaryDropDownMenuItem
        data-testid="participate-core-analytics-menu-item"
        justify="space-between"
        align="center"
        padding="10px 16px"
      >
        <Typography size={14} height="17px">
          Participate in CoreAnalytics
        </Typography>
        <Toggle
          isChecked={analyticsConsent}
          onChange={() => {
            setAnalyticsConsent(!analyticsConsent);
            if (analyticsConsent) {
              stopDataCollection();
            } else {
              initAnalyticsIds(true);
            }
          }}
        />
      </SecondaryDropDownMenuItem>

      <HorizontalFlex width="100%" margin="12px 0" padding="0 16px">
        <HorizontalSeparator />
      </HorizontalFlex>

      <SecondaryDropDownMenuItem
        data-testid="reset-recovery-phrase-menu-item"
        justify="space-between"
        align="center"
        padding="10px 16px"
        onClick={() => onLogoutClick()}
      >
        <Typography color={theme.colors.primary1} size={14} height="17px">
          Reset Secret Recovery Phrase
        </Typography>
      </SecondaryDropDownMenuItem>
    </VerticalFlex>
  );
}
