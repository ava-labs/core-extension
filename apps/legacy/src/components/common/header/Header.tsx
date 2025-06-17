import {
  Button,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { SettingsMenu } from '@/components/settings/SettingsMenu';
import { useCurrentDomain } from '@/pages/Permissions/useCurrentDomain';
import { SettingsPages, usePermissionContext } from '@core/ui';
import { useAccountsContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { SimpleAddress } from '@/components/common/SimpleAddress';
import { useSettingsContext } from '@core/ui';

import { ConnectionIndicatorK2 } from '../ConnectionIndicatorK2';
import { NetworkSwitcher } from './NetworkSwitcher';
import { AccountSelectorButton } from '../account/AccountSelectorButton';
import { useWalletContext } from '@core/ui';
import { AccountType } from '@core/types';
import { WalletChip } from '../WalletChip';
import { getAddressForChain } from '@core/common';
import { getAllAddressesForAccount } from '@core/common';

export function Header() {
  const domain = useCurrentDomain();
  const { revokeAddressPermisson, isDomainConnectedToAccount } =
    usePermissionContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { t } = useTranslation();
  const { walletDetails, wallets } = useWalletContext();

  const { setIsSettingsOpen, setSettingsActivePage } = useSettingsContext();

  const isConnected =
    (isDomainConnectedToAccount &&
      isDomainConnectedToAccount(
        domain,
        getAllAddressesForAccount(activeAccount ?? {}),
      )) ||
    false;
  const { network } = useNetworkContext();
  const address = getAddressForChain(network, activeAccount);
  const theme = useTheme();

  const showWalletInfo = Boolean(
    walletDetails?.name &&
      activeAccount?.type === AccountType.PRIMARY &&
      wallets.length > 1,
  );

  return (
    <Stack sx={{ gap: 0.5, py: 1.5, px: 2 }}>
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
                        'To connect, locate the connect button on their site.',
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
                        if (domain && activeAccount) {
                          revokeAddressPermisson(
                            domain,
                            getAllAddressesForAccount(activeAccount),
                          );
                        }
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
