import { NetworkVMType } from '@avalabs/chains-sdk';
import {
  HorizontalFlex,
  Skeleton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import styled, { useTheme } from 'styled-components';
import { NetworkCard } from './common/NetworkCard';
import { getNetworkBalance, tokensWithBalances } from './NetworksWidget';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { NetworkLogo } from '@src/components/common/NetworkLogo';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SeeAllNetworksButton } from './SeeAllNetworksButton';

const LogoContainer = styled.div`
  margin-top: 4px;
  margin-right: 16px;
`;

const NetworkListContainer = styled(HorizontalFlex)`
  margin: 16px 0;
  flex-wrap: wrap;
`;

export function NetworkList() {
  const { capture } = useAnalyticsContext();
  const { network, networks, setNetwork, favoriteNetworks } =
    useNetworkContext();
  const theme = useTheme();
  const { tokens } = useBalancesContext();
  const { activeAccount } = useAccountsContext();
  const { currencyFormatter } = useSettingsContext();
  const favoriteNetworksWithoutActive = favoriteNetworks.filter(
    (networkItem) => networkItem.chainId !== network?.chainId
  );

  // we don't know the network list yet. Lets show the placeholder tiles instead
  if (!networks.length) {
    return (
      <NetworkListContainer justify="space-between">
        <Skeleton height="83px" width="164px" margin="0 0 16px 0" delay={250} />
        <Skeleton height="83px" width="164px" margin="0 0 16px 0" delay={250} />
      </NetworkListContainer>
    );
  }

  return (
    <>
      <NetworkListContainer justify="space-between">
        {favoriteNetworksWithoutActive.map((network) => {
          const networkAddress =
            (network?.vmName === NetworkVMType.EVM
              ? activeAccount?.addressC
              : activeAccount?.addressBTC) || '';
          const networkBalances = tokens.balances?.[network.chainId];
          const networkAssetList = networkBalances
            ? tokensWithBalances(networkBalances[networkAddress])
            : null;
          const networkBalance = networkAssetList
            ? getNetworkBalance(networkAssetList)
            : 0;
          // show loading skeleton for each tile till we have the balance for them
          return !networkBalances ? (
            <Skeleton
              key={network.chainId}
              height="83px"
              width="164px"
              margin="0 0 16px 0"
              delay={250}
            />
          ) : (
            <NetworkCard
              data-testid={`network-card-${network.chainId}-button`}
              width="164px"
              display="inline-block"
              key={network.chainId}
              margin="0 0 16px 0"
              padding="16px"
              onClick={() => {
                capture('PortfolioNetworkSelected', {
                  chainId: network.chainId,
                });
                setNetwork(network);
              }}
            >
              <HorizontalFlex justify="center" align="flex-start">
                <LogoContainer>
                  <NetworkLogo
                    width="40px"
                    height="40px"
                    padding="8px"
                    src={network.logoUri}
                  />
                </LogoContainer>
                <VerticalFlex width="100%">
                  <Typography
                    size={14}
                    color={theme.colors.text2}
                    weight="bold"
                    height="17px"
                  >
                    {network.chainName}
                  </Typography>
                  <Typography
                    data-testid={`network-card-${network.chainId}-balance`}
                    size={14}
                    color={theme.colors.text2}
                    height="17px"
                  >
                    {currencyFormatter(networkBalance)}
                  </Typography>
                </VerticalFlex>
              </HorizontalFlex>
            </NetworkCard>
          );
        })}
        {networks.length && (
          <SeeAllNetworksButton
            isFullWidth={favoriteNetworksWithoutActive.length % 2 === 0}
          />
        )}
      </NetworkListContainer>
    </>
  );
}
