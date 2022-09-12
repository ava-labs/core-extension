import { NetworkVMType } from '@avalabs/chains-sdk';
import {
  HorizontalFlex,
  SecondaryButton,
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
import { useHistory } from 'react-router-dom';
import { NetworkLogo } from '@src/components/common/NetworkLogo';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

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
  const { network, setNetwork, favoriteNetworks } = useNetworkContext();
  const theme = useTheme();
  const { tokens } = useBalancesContext();
  const { activeAccount } = useAccountsContext();
  const { currencyFormatter } = useSettingsContext();
  const history = useHistory();
  const networkList = favoriteNetworks.filter(
    (networkItem) => networkItem.chainId !== network?.chainId
  );
  const isAllNetworksLinkFullWidth = networkList.length % 2 === 0;

  return (
    <>
      <NetworkListContainer justify="space-between">
        {networkList.map((network) => {
          const networkAddress =
            (network?.vmName === NetworkVMType.EVM
              ? activeAccount?.addressC
              : activeAccount?.addressBTC) || '';
          const networkBalances = tokens.balances?.[network.chainId];
          const networkAssetList = networkBalances
            ? tokensWithBalances(networkBalances[networkAddress])
            : [];
          const networkBalance = networkAssetList
            ? getNetworkBalance(networkAssetList)
            : 0;
          return (
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
        {!isAllNetworksLinkFullWidth ? (
          <NetworkCard
            data-testid="see-all-networks-button"
            width="164px"
            display="inline-block"
            margin="0 0 16px 0"
            padding="16px"
            onClick={() => history.push('/networks?activeTab=NETWORKS')}
          >
            <VerticalFlex justify="center" align="center" height="100%">
              <Typography color={theme.colors.text1} size={14} weight="bold">
                See all networks
              </Typography>
            </VerticalFlex>
          </NetworkCard>
        ) : (
          <SecondaryButton
            data-testid="see-all-networks-button"
            width={'100%'}
            onClick={(e) => {
              e.stopPropagation();
              history.push('/networks?activeTab=NETWORKS');
            }}
          >
            See all networks
          </SecondaryButton>
        )}
      </NetworkListContainer>
    </>
  );
}
