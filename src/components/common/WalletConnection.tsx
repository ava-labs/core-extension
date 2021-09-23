import React from 'react';
import {
  DropDownMenu,
  Card,
  HorizontalFlex,
  Typography,
  VerticalFlex,
  CheckmarkIcon,
} from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import styled, { useTheme } from 'styled-components';
import {
  MAINNET_NETWORK,
  FUJI_NETWORK,
} from '@src/background/services/network/models';

const ConnectedDot = styled.div<{
  color: string;
}>`
  width: 12px;
  height: 12px;
  background-color: ${({ color }) => color};
  margin: 0 8px 0 0;
  border-radius: 50%;
  flex-grow: 0;
  flex-shrink: 0;
`;

const CardWithBorder = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.grey[800]};
`;

const Row = styled(HorizontalFlex)`
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.grey[800]};
  }
`;

export function WalletConnection() {
  const { network, setNetwork, networks } = useNetworkContext();
  const theme = useTheme();

  const getNetworkColor = (networkName?: string) => {
    switch (networkName) {
      case MAINNET_NETWORK.name:
        return theme.colors.secondary[400];
      case FUJI_NETWORK.name:
        return theme.colors.orange[400];
      default:
        return theme.colors.grey[400];
    }
  };

  return (
    <DropDownMenu
      style={{ marginLeft: '42px' }}
      coords={{
        top: '48px',
        right: '0px',
      }}
      icon={
        <Card padding="8px" width="220px">
          <HorizontalFlex
            width="100%"
            align="center"
            justify="center"
            overflow="hidden"
          >
            <ConnectedDot color={getNetworkColor(network?.name)} />
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
      <CardWithBorder width="260px" padding="12px 0">
        <VerticalFlex grow="1">
          <Typography margin="12px 24px" size={18} weight={700}>
            Networks
          </Typography>
          {networks.map((n) => (
            <Row
              key={n.name}
              onClick={() => setNetwork(n)}
              padding="12px 24px"
              align="center"
              justify="space-between"
              width="100%"
            >
              <HorizontalFlex align="center">
                <ConnectedDot color={getNetworkColor(n.name)} />
                <Typography height="24px">{n.name}</Typography>
              </HorizontalFlex>
              {network?.name === n.name && (
                <CheckmarkIcon size="16px" color={theme.colors.primary[400]} />
              )}
            </Row>
          ))}
        </VerticalFlex>
      </CardWithBorder>
    </DropDownMenu>
  );
}
