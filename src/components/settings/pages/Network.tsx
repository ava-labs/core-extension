import React from 'react';
import {
  CheckmarkIcon,
  DropDownMenuItem,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { LOCAL_NETWORK } from '@avalabs/wallet-react-components';

export function Network({ goBack, navigateTo }: SettingsPageProps) {
  const theme = useTheme();
  const { network, setNetwork, networks } = useNetworkContext();

  return (
    <VerticalFlex width="375px" background={theme.colors.bg2} height="100%">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Network'}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        {/* Filtering local network until we support this in the background */}
        {networks
          .filter((net) => {
            return net.chainId !== LOCAL_NETWORK.chainId;
          })
          .map((n) => (
            <DropDownMenuItem
              key={n.name}
              justify="space-between"
              align="center"
              onClick={() => {
                setNetwork(n);
              }}
            >
              <Typography>{n.name}</Typography>
              {network?.name === n.name && (
                <CheckmarkIcon height="16px" color={theme.colors.icon1} />
              )}
            </DropDownMenuItem>
          ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
