import {
  ComponentSize,
  ConfigureIcon,
  ConnectionIndicator,
  HorizontalFlex,
  HorizontalSeparator,
  SecondaryButton,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import { SettingsMenuFlow } from '@src/components/settings/SettingsMenuFlow';
import { usePermissions } from '@src/pages/Permissions/usePermissions';
import { useCurrentDomain } from '@src/pages/Permissions/useCurrentDomain';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { AccountSelectorFlow } from '../account/AccountSelectorFlow';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';

export function HeaderMiniMode() {
  const domain = useCurrentDomain();
  const theme = useTheme();
  const { permissions, updateAccountPermission } = usePermissions(domain);
  const { addresses } = useWalletContext();
  const isConnected = permissions && permissions.accounts[addresses.addrC];
  const history = useHistory();

  const toggleManageTokensPage = () => {
    if (history.location.pathname.startsWith('/manage-tokens')) {
      history.push('/');
      return;
    }
    history.push('/manage-tokens');
  };

  return (
    <HorizontalFlex justify="space-between" align="center" padding="16px">
      <SettingsMenuFlow />
      <HorizontalFlex align="center">
        <ConnectionIndicator connected={isConnected}>
          <Typography
            weight={600}
            size={14}
            height="24px"
            margin="5px 16px 8px"
          >
            {domain}
          </Typography>
          {isConnected ? (
            <>
              <HorizontalSeparator margin="0" />
              <SecondaryButton
                margin="8px auto 0"
                width="208px"
                size={ComponentSize.SMALL}
                onClick={() => {
                  updateAccountPermission(addresses.addrC, false);
                }}
              >
                Disconnect
              </SecondaryButton>
            </>
          ) : (
            <Typography weight={500} size={12} height="15px" margin="0 16px">
              To connect, locate the connect button on their site.
            </Typography>
          )}
        </ConnectionIndicator>
        <AccountSelectorFlow />
      </HorizontalFlex>
      <TextButton onClick={toggleManageTokensPage}>
        <ConfigureIcon color={theme.colors.text1} />
      </TextButton>
    </HorizontalFlex>
  );
}
