import { useTheme } from 'styled-components';
import {
  ConfigureIcon,
  ConnectionIndicator,
  HorizontalFlex,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import React from 'react';
import { HeaderProps } from './HeaderFlow';
import { SettingsMenuFlow } from '@src/components/settings/SettingsMenuFlow';
import { usePermissions } from '@src/pages/Permissions/usePermissions';
import { useCurrentDomain } from '@src/pages/Permissions/useCurrentDomain';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { AccountSelectorFlow } from '../account/AccountSelectorFlow';

function HeaderMiniMode({ onDrawerStateChanged }: HeaderProps) {
  const theme = useTheme();
  const domain = useCurrentDomain();
  const { permissions } = usePermissions(domain);
  const { addresses } = useWalletContext();
  // TODO: Use current account from account context ones multiple account support is added
  const isConnected = permissions && permissions.accounts[addresses.addrC];

  return (
    <HorizontalFlex justify="space-between" align="center" padding="16px">
      <SettingsMenuFlow />
      <HorizontalFlex align="center">
        <ConnectionIndicator connected={isConnected}>
          <Typography weight={600} size={14} height="24px" margin="0 16px">
            {domain}
          </Typography>
          {!isConnected && (
            <Typography
              weight={500}
              size={12}
              height="15px"
              margin="8px 16px 0"
            >
              To connect, locate the connect button on their site.
            </Typography>
          )}
        </ConnectionIndicator>
        <AccountSelectorFlow />
      </HorizontalFlex>
      <TextButton disabled={true}>
        <ConfigureIcon color={theme.colors.disabled} />
      </TextButton>
    </HorizontalFlex>
  );
}

export default HeaderMiniMode;
