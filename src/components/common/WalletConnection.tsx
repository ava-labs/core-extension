import {
  SecondaryDropDownMenu,
  Card,
  HorizontalFlex,
  Typography,
  VerticalFlex,
  CheckmarkIcon,
  SecondaryDropDownMenuItem,
} from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import styled, { useTheme } from 'styled-components';
import { ChainId } from '@avalabs/chains-sdk';
import { t } from 'i18next';

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

export function WalletConnection() {
  const { network, setNetwork, networks } = useNetworkContext();
  const theme = useTheme();

  const getNetworkColor = (networkId?: number) => {
    switch (networkId) {
      case ChainId.AVALANCHE_MAINNET_ID:
        return theme.palette.secondary[400];
      case ChainId.AVALANCHE_TESTNET_ID:
        return theme.palette.orange[400];
      default:
        return theme.palette.grey[400];
    }
  };

  return (
    <SecondaryDropDownMenu
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
            <ConnectedDot color={getNetworkColor(network?.chainId)} />
            <Typography
              margin="0 0 0 8px"
              height="24px"
              wrap="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {network?.chainName}
            </Typography>
          </HorizontalFlex>
        </Card>
      }
    >
      <VerticalFlex width="260px" padding="12px 0">
        <Typography margin="12px 24px" size={18} weight={700}>
          {t('Networks')}
        </Typography>
        {/* Filtering local network until we support this in the background */}
        {networks
          .filter((net) => {
            return net.chainId !== ChainId.AVALANCHE_LOCAL_ID;
          })
          .map((n) => (
            <SecondaryDropDownMenuItem
              key={n.chainName}
              onClick={() => setNetwork(n)}
              align="center"
              justify="space-between"
              width="100%"
            >
              <HorizontalFlex align="center">
                <ConnectedDot color={getNetworkColor(n.chainId)} />
                <Typography height="24px">{n.chainName}</Typography>
              </HorizontalFlex>
              {network?.chainName === n.chainName && (
                <CheckmarkIcon height="16px" color={theme.colors.primary1} />
              )}
            </SecondaryDropDownMenuItem>
          ))}
      </VerticalFlex>
    </SecondaryDropDownMenu>
  );
}
