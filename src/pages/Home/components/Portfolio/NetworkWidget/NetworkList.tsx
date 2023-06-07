import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkCard } from './common/NetworkCard';
import { getNetworkBalance, tokensWithBalances } from './NetworksWidget';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { NetworkLogo } from '@src/components/common/NetworkLogo';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SeeAllNetworksButton } from './SeeAllNetworksButton';
import {
  AlertTriangleIcon,
  Tooltip,
  Stack,
  Typography,
  styled,
  Skeleton,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

const LogoContainer = styled('div')`
  margin-top: 4px;
  margin-right: 16px;
`;

const NetworkListContainer = styled(Stack)`
  margin: 16px 0;
  flex-wrap: wrap;
`;

export function NetworkList() {
  const { capture } = useAnalyticsContext();
  const { network, networks, setNetwork, favoriteNetworks, isCustomNetwork } =
    useNetworkContext();
  const { tokens, isTokensCached } = useBalancesContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { currencyFormatter } = useSettingsContext();
  const { t } = useTranslation();

  function getNetworkValue(network: Network) {
    const networkAddress =
      (network.vmName === NetworkVMType.EVM
        ? activeAccount?.addressC
        : activeAccount?.addressBTC) || '';
    const networkBalances = tokens.balances?.[network.chainId];
    const networkAssetList = networkBalances
      ? tokensWithBalances(Object.values(networkBalances[networkAddress] ?? {}))
      : null;
    return networkAssetList ? getNetworkBalance(networkAssetList) : 0;
  }

  const favoriteNetworksWithoutActive = favoriteNetworks
    .filter((networkItem) => networkItem.chainId !== network?.chainId)
    .sort((a, b) => {
      const networkBalanceForA = getNetworkValue(a);
      const networkBalanceForB = getNetworkValue(b);
      return networkBalanceForB - networkBalanceForA;
    });

  // we don't know the network list yet. Lets show the placeholder tiles instead
  if (!networks.length) {
    return (
      <NetworkListContainer direction="row" justifyContent="space-between">
        <Skeleton variant="rounded" sx={{ height: 89, width: 164, mb: 2 }} />
        <Skeleton variant="rounded" sx={{ height: 89, width: 164, mb: 2 }} />
      </NetworkListContainer>
    );
  }

  return (
    <>
      <NetworkListContainer direction="row" justifyContent="space-between">
        {favoriteNetworksWithoutActive.map((network) => {
          const networkBalances = tokens.balances?.[network.chainId];
          const networkBalance = getNetworkValue(network);
          // show loading skeleton for each tile till we have the balance for them
          return !networkBalances ? (
            <Skeleton
              key={network.chainId}
              variant="rounded"
              sx={{ height: 89, width: 164, mb: 2 }}
            />
          ) : (
            <NetworkCard
              data-testid={`network-card-${network.chainId}-button`}
              key={network.chainId}
              sx={{
                width: '164px',
                display: 'inline-block',
                mb: 2,
                p: 2,
              }}
              onClick={() => {
                capture('PortfolioNetworkSelected', {
                  chainId: network.chainId,
                });
                setNetwork(network);
              }}
            >
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
              >
                <LogoContainer>
                  <NetworkLogo
                    width="40px"
                    height="40px"
                    padding="8px"
                    src={network.logoUri}
                  />
                </LogoContainer>
                <Stack
                  justifyContent="center"
                  sx={{ width: '100%', minHeight: '51px' }}
                >
                  <Typography variant="body2" fontWeight="fontWeightSemibold">
                    {network.chainName}
                  </Typography>
                  {!isCustomNetwork(network.chainId) && (
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                      {isTokensCached && (
                        <Tooltip
                          title={t('Balances loading...')}
                          placement="bottom"
                        >
                          <AlertTriangleIcon
                            size={12}
                            sx={{ color: 'warning.main', mr: 1 }}
                          />
                        </Tooltip>
                      )}
                      <Typography
                        data-testid={`network-card-${network.chainId}-balance`}
                        size={14}
                        height="17px"
                      >
                        {currencyFormatter(networkBalance)}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
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
