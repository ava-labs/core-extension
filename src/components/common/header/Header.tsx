import {
  ConnectionIndicator,
  HorizontalFlex,
  HorizontalSeparator,
  SecondaryButton,
  SimpleAddress,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { SettingsMenu } from '@src/components/settings/SettingsMenu';
import { useCurrentDomain } from '@src/pages/Permissions/useCurrentDomain';
import { useTheme } from 'styled-components';
import { usePermissionContext } from '@src/contexts/PermissionsProvider';
import { AccountSelector } from '../account/AccountSelector';
import { NetworkSwitcher } from './NetworkSwitcher';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

export function Header() {
  const domain = useCurrentDomain();
  const theme = useTheme();
  const { updateAccountPermission, isDomainConnectedToAccount } =
    usePermissionContext();
  const { activeAccount } = useAccountsContext();
  const isConnected =
    (isDomainConnectedToAccount &&
      isDomainConnectedToAccount(domain, activeAccount?.addressC)) ||
    false;

  return (
    <HorizontalFlex
      justify="space-between"
      align="flex-start"
      padding="16px 16px 0 16px"
    >
      <SettingsMenu />
      <VerticalFlex>
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
                  Disconnect
                </SecondaryButton>
              </>
            ) : (
              <Typography
                weight={500}
                size={12}
                height="15px"
                margin="0 16px 8px"
              >
                To connect, locate the connect button on their site.
              </Typography>
            )}
          </ConnectionIndicator>
          <AccountSelector />
        </HorizontalFlex>
        {activeAccount?.addressC && (
          <HorizontalFlex justify="center">
            <SimpleAddress
              copyIconProps={{ color: theme.colors.icon2, height: '12px' }}
              typographyProps={{ color: 'text2', size: 12 }}
              address={activeAccount.addressC}
            />
          </HorizontalFlex>
        )}
      </VerticalFlex>

      <NetworkSwitcher />
    </HorizontalFlex>
  );
}
