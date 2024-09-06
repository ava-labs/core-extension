import {
  Button,
  Divider,
  IconButton,
  SidebarCollapseIcon,
  SidebarExpandIcon,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { SettingsMenu } from '@src/components/settings/SettingsMenu';
import { useCurrentDomain } from '@src/pages/Permissions/useCurrentDomain';
import { usePermissionContext } from '@src/contexts/PermissionsProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { SimpleAddress } from '@src/components/common/SimpleAddress';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPages } from '@src/components/settings/models';

import { ConnectionIndicatorK2 } from '../ConnectionIndicatorK2';
import { NetworkSwitcher } from './NetworkSwitcher';
import { AccountSelectorButton } from '../account/AccountSelectorButton';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { AccountType } from '@src/background/services/accounts/models';
import { WalletChip } from '../WalletChip';
import { getAddressForChain } from '@src/utils/getAddressForChain';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';

export function Header() {
  const { domain, tabId } = useCurrentDomain();
  const { updateAccountPermission, isDomainConnectedToAccount } =
    usePermissionContext();
  const isSidePanel = useIsSpecificContextContainer(ContextContainer.SIDEPANEL);
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { t } = useTranslation();
  const { walletDetails, wallets } = useWalletContext();

  const { setIsSettingsOpen, setSettingsActivePage } = useSettingsContext();

  const isConnected =
    (isDomainConnectedToAccount &&
      isDomainConnectedToAccount(domain, activeAccount?.addressC)) ||
    false;
  const { network } = useNetworkContext();
  const address =
    network && activeAccount
      ? getAddressForChain(network?.chainId, activeAccount)
      : '';
  const theme = useTheme();

  const showWalletInfo = Boolean(
    walletDetails?.name &&
      activeAccount?.type === AccountType.PRIMARY &&
      wallets.length > 1
  );

  return (
    <Stack sx={{ gap: 0.5, py: 1.5, px: isSidePanel ? 1 : 2 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SettingsMenu />
        {activeAccount ? (
          <Stack>
            <Stack
              direction="row"
              sx={{ alignItems: 'center', justifyContent: 'center', gap: 1.5 }}
            >
              <ConnectionIndicatorK2 connected={isConnected}>
                <Stack sx={{ gap: 0.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      textAlign: 'center',
                      maxWidth: 1,
                      wordWrap: 'break-word',
                    }}
                  >
                    {domain}
                  </Typography>
                  {!isConnected && (
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'To connect, locate the connect button on their site.'
                      )}
                    </Typography>
                  )}
                </Stack>
                <Stack sx={{ gap: 1 }}>
                  {isConnected && (
                    <Button
                      color="secondary"
                      fullWidth
                      sx={{
                        mt: 0.5,
                        backgroundColor: `${theme.palette.grey[700]}CC`,
                        fontSize: 'caption.fontSize',
                      }}
                      onClick={() => {
                        updateAccountPermission({
                          addressC: activeAccount?.addressC,
                          hasPermission: false,
                          domain,
                        });
                      }}
                    >
                      {t('Disconnect')}
                    </Button>
                  )}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setSettingsActivePage(SettingsPages.CONNECTED_SITES);
                    }}
                  >
                    {t('View All Connected Sites')}
                  </Button>
                </Stack>
              </ConnectionIndicatorK2>
              <AccountSelectorButton />
            </Stack>
            {address && !showWalletInfo && (
              <Stack
                direction="row"
                sx={{ pt: 0.5, justifyContent: 'center', gap: 1 }}
                data-testid="header-copy-address"
              >
                <SimpleAddress address={address} />
              </Stack>
            )}
          </Stack>
        ) : (
          <Skeleton variant="rectangular" width="102px" height="24px" />
        )}
        <NetworkSwitcher />
        {tabId && (
          <IconButton
            size="medium"
            onClick={async () => {
              if (!isSidePanel) {
                await chrome.sidePanel.open({
                  tabId,
                });
              }
              window.close();
            }}
          >
            {isSidePanel ? (
              <SidebarCollapseIcon size={24} />
            ) : (
              <SidebarExpandIcon size={24} />
            )}
          </IconButton>
        )}
      </Stack>
      {address && walletDetails && showWalletInfo && (
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}
        >
          <Stack
            direction="row"
            sx={{ pt: 0.5, justifyContent: 'center', gap: 1 }}
            data-testid="header-copy-address"
          >
            <SimpleAddress address={address} />
          </Stack>
          <Divider light orientation="vertical" sx={{ py: 1.5, pl: 0.25 }} />
          <WalletChip walletDetails={walletDetails} sx={{ maxWidth: 140 }} />
        </Stack>
      )}
    </Stack>
  );
}
