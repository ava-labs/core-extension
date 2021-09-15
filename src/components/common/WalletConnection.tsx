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
`;

export function WalletConnection() {
  const { network, setNetwork, networks } = useNetworkContext();

  return (
    <DropDownMenu
      style={{ marginLeft: '30px' }}
      coords={{
        left: '0px',
        top: '61px',
        right: '0px',
      }}
      icon={
        <Card padding="20px" width="210px">
          <ConnectedDot />
          <HorizontalFlex align="center">
            <Typography margin="0 auto 0 5px">{network?.name}</Typography>
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
