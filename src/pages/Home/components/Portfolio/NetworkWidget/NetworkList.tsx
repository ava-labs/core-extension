import { ChainId, NetworkVMType } from '@avalabs/chains-sdk';
import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import styled, { useTheme } from 'styled-components';
import { NetworkCard } from './common/NetworkCard';
import { getNetworkBalance, tokensWithBalances } from './NetworksWidget';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

const LogoContainer = styled.div`
  margin-top: 4px;
  margin-right: 16px;
`;

const NetworkListContainer = styled(HorizontalFlex)`
  margin: 16px 0;
  flex-wrap: wrap;
`;

export function NetworkList() {
  const { network, setNetwork, networks } = useNetworkContext();
  const theme = useTheme();
  const { balances } = useBalancesContext();
  const { activeAccount } = useAccountsContext();
  const { currencyFormatter } = useSettingsContext();

  return (
    <>
      <NetworkListContainer justify="space-between">
        {networks &&
          networks
            .filter(
              (networkItem) =>
                networkItem.chainId !== network?.chainId &&
                networkItem.chainId !== ChainId.AVALANCHE_LOCAL_ID
            )
            .map((network) => {
              const networkAddress =
                (network?.vmName === NetworkVMType.EVM
                  ? activeAccount?.addressC
                  : activeAccount?.addressBTC) || '';
              const networkBalances = balances[network.chainId];
              const networkAssetList = networkBalances
                ? tokensWithBalances(networkBalances[networkAddress])
                : [];
              const networkBalance = networkAssetList
                ? getNetworkBalance(networkAssetList)
                : 0;
              return (
                <NetworkCard
                  width="164px"
                  display="inline-block"
                  key={network.chainId}
                  margin="0 0 16px 0"
                  padding="16px"
                  onClick={() => {
                    setNetwork(network);
                  }}
                >
                  <HorizontalFlex justify="center" align="flex-start">
                    <LogoContainer>
                      <TokenIcon
                        width="40px"
                        height="40px"
                        src={network.logoUri}
                        name={network.chainName}
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
      </NetworkListContainer>
    </>
  );
}
