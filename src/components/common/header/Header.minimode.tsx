import {
  ComponentSize,
  ConnectionIndicator,
  HorizontalFlex,
  HorizontalSeparator,
  QRCodeIcon,
  SecondaryButton,
  SimpleAddress,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { SettingsMenuFlow } from '@src/components/settings/SettingsMenuFlow';
import { usePermissions } from '@src/pages/Permissions/usePermissions';
import { useCurrentDomain } from '@src/pages/Permissions/useCurrentDomain';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { AccountSelector } from '../account/AccountSelector';

export function HeaderMiniMode() {
  const domain = useCurrentDomain();
  const theme = useTheme();
  const { permissions, updateAccountPermission } = usePermissions(domain);
  const { addresses } = useWalletContext();
  const isConnected = permissions && permissions.accounts[addresses.addrC];
  const history = useHistory();

  const toggleReceivePage = () => {
    if (history.location.pathname.startsWith('/receive')) {
      history.push('/');
      return;
    }
    history.push('/receive');
  };

  return (
    <HorizontalFlex
      justify="space-between"
      align="flex-start"
      padding="16px 16px 0 16px"
    >
      <SettingsMenuFlow />
      <VerticalFlex>
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
          <AccountSelector />
        </HorizontalFlex>
        {addresses.addrC && (
          <HorizontalFlex justify="center">
            <SimpleAddress
              copyIconProps={{ color: theme.colors.icon2, height: '12px' }}
              typographyProps={{ color: 'text2', size: 12 }}
              address={addresses.addrC}
            />
          </HorizontalFlex>
        )}
      </VerticalFlex>
      <TextButton onClick={toggleReceivePage}>
        <QRCodeIcon color={theme.colors.text1} />
      </TextButton>
    </HorizontalFlex>
  );
}
