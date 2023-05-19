import {
  ConnectionIndicator,
  HorizontalFlex,
  HorizontalSeparator,
  SecondaryButton,
  Skeleton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { SettingsMenu } from '@src/components/settings/SettingsMenu';
import { useCurrentDomain } from '@src/pages/Permissions/useCurrentDomain';
import { usePermissionContext } from '@src/contexts/PermissionsProvider';
import { AccountSelector } from '../account/AccountSelector';
import { NetworkSwitcher } from './NetworkSwitcher';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkVMType } from '@avalabs/chains-sdk';
import { useTranslation } from 'react-i18next';
import { SimpleAddressK2 } from '@src/components/common/SimpleAddressK2';

export function Header() {
  const domain = useCurrentDomain();
  const { updateAccountPermission, isDomainConnectedToAccount } =
    usePermissionContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { t } = useTranslation();

  const isConnected =
    (isDomainConnectedToAccount &&
      isDomainConnectedToAccount(domain, activeAccount?.addressC)) ||
    false;
  const { network } = useNetworkContext();
  const address =
    network?.vmName === NetworkVMType.BITCOIN
      ? activeAccount?.addressBTC
      : activeAccount?.addressC;

  return (
    <HorizontalFlex
      justify="space-between"
      align="flex-start"
      padding="16px 16px 0 16px"
    >
      <SettingsMenu />
      {activeAccount ? (
        <VerticalFlex>
          <>
            <HorizontalFlex align="center" justify="center">
              <ConnectionIndicator connected={isConnected}>
                <Typography
                  weight={600}
                  size={12}
                  height="16px"
                  margin="0 16px 8px"
                >
                  {domain}
                </Typography>
                {isConnected ? (
                  <>
                    <HorizontalSeparator margin="0" />
                    <SecondaryButton
                      margin="8px auto"
                      width="210px"
                      onClick={() => {
                        updateAccountPermission({
                          addressC: activeAccount?.addressC,
                          hasPermission: false,
                          domain,
                        });
                      }}
                    >
                      {t('Disconnect')}
                    </SecondaryButton>
                  </>
                ) : (
                  <Typography
                    weight={500}
                    size={12}
                    height="15px"
                    margin="0 16px 8px"
                  >
                    {t('To connect, locate the connect button on their site.')}
                  </Typography>
                )}
              </ConnectionIndicator>
              <AccountSelector />
            </HorizontalFlex>
            {address && (
              <HorizontalFlex
                data-testid="header-copy-address"
                justify="center"
              >
                <SimpleAddressK2 address={address} />
              </HorizontalFlex>
            )}
          </>
        </VerticalFlex>
      ) : (
        <Skeleton
          width="102px"
          height="40px"
          margin="0 0 8px 30px"
          delay={250}
        />
      )}

      <NetworkSwitcher />
    </HorizontalFlex>
  );
}
