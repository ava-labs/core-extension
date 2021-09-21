import React from 'react';
import {
  DropDownMenu,
  DropDownMenuItem,
  Card,
  HorizontalFlex,
  Typography,
} from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import styled from 'styled-components';

const ConnectedDot = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.green['500']};
  border-radius: 50%;
  flex-grow: 0;
  flex-shrink: 0;
`;

export function WalletConnection() {
  const { network, setNetwork, networks } = useNetworkContext();

  return (
    <DropDownMenu
      style={{ marginLeft: '42px' }}
      coords={{
        left: '0px',
        top: '61px',
        right: '0px',
      }}
      icon={
        <Card padding="8px" width="180px">
          <HorizontalFlex align="center" overflow="hidden">
            <ConnectedDot />
            <Typography
              margin="0 0 0 8px"
              height="24px"
              wrap="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {network?.name}
            </Typography>
          </HorizontalFlex>
        </Card>
      }
    >
      {networks.map((network) => (
        <DropDownMenuItem
          key={network.name}
          onClick={() => setNetwork(network)}
        >
          <Typography>{network.name}</Typography>
        </DropDownMenuItem>
      ))}
    </DropDownMenu>
  );
}
