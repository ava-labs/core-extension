import {
  Button,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { NetworkVMType } from '@avalabs/chains-sdk';
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

export function Header() {
  const domain = useCurrentDomain();
  const { updateAccountPermission, isDomainConnectedToAccount } =
    usePermissionContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { t } = useTranslation();

  const { setIsSettingsOpen, setSettingsActivePage } = useSettingsContext();

  const isConnected =
    (isDomainConnectedToAccount &&
      isDomainConnectedToAccount(domain, activeAccount?.addressC)) ||
    false;
  const { network } = useNetworkContext();
  const address =
    network?.vmName === NetworkVMType.BITCOIN
      ? activeAccount?.addressBTC
      : activeAccount?.addressC;
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        py: 1.5,
        px: 2,
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
                <Typography variant="subtitle2">{domain}</Typography>
                {!isConnected && (
                  <Typography variant="body2" color="text.secondary">
                    {t('To connect, locate the connect button on their site.')}
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
          {address && (
            <Stack
              direction="row"
              sx={{ pt: 0.5, justifyContent: 'center' }}
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
  );
}
