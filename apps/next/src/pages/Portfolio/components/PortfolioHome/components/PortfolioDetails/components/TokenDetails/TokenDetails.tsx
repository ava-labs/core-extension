import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';
import { PageTopBar } from '@/components/PageTopBar';
import { TokenAvatar } from '@/components/TokenAvatar';
import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { isPchainNetworkId, isXchainNetworkId } from '@core/common';
import { useBalancesContext, useNetworkContext } from '@core/ui';
import { useHistory, useParams } from 'react-router-dom';
import { AssetsErrorState } from '../AssetsTab';
import { PortfolioActionButtons } from '../PortfolioActionButtons';
import { GeneralTokenDetails } from './components/GeneralTokenDetails';
import { PchainDetails } from './components/PChain/PchainDetails';
import { XchainDetails } from './components/XChain/XchainDetails';
import { useTokenDetails } from './hooks/useTokenDetails';
import {
  StyledTokenDetails,
  StyledTokenDetailsContent,
  StyledTokenScrollContainer,
  StyledTokenSummary,
} from './styled';

export const TokenDetails = () => {
  const { push } = useHistory();
  const { getNetwork } = useNetworkContext();

  const { networkId, tokenAddress } = useParams<{
    networkId: string;
    tokenAddress: string;
  }>();

  const preppedNetworkId = Number(networkId);
  const network = getNetwork(preppedNetworkId);

  const { balances } = useBalancesContext();

  const { token, tokenBalance, tokenBalanceInCurrency, currency } =
    useTokenDetails({ networkId: preppedNetworkId, tokenAddress });

  // Show nothing while balances are loading
  if (balances.loading) {
    return null;
  }

  const isPChain = isPchainNetworkId(preppedNetworkId);
  const isXChain = isXchainNetworkId(preppedNetworkId);

  return (
    <StyledTokenDetails>
      <PageTopBar
        showBack
        showViewSwitcher
        onBackClicked={() => {
          push('/portfolio');
        }}
      />

      <StyledTokenScrollContainer>
        {!token || !tokenBalance || !network ? (
          <AssetsErrorState />
        ) : (
          <>
            <StyledTokenSummary>
              <Box flexShrink={0} mb={0.5}>
                <TokenAvatar token={token} size={32} badgeSize={16} />
              </Box>
              <Typography variant="h2" color="text.secondary">
                {token.name}
              </Typography>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-end"
                gap={0.5}
                width="max-content"
                color="text.primary"
              >
                <CollapsedTokenAmount
                  amount={tokenBalance.balanceDisplayValue}
                  showApproximationSign={false}
                  showTooltip={false}
                  regularProps={{ variant: 'h2' }}
                  overlineProps={{ variant: 'caption2' }}
                />
                <Typography variant="h7">{token.symbol}</Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                my={0.5}
                mb={2}
              >
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color="text.primary"
                >
                  {tokenBalanceInCurrency} {currency}
                </Typography>
              </Stack>
              <PortfolioActionButtons network={network} token={token} />
            </StyledTokenSummary>

            <StyledTokenDetailsContent>
              {isPChain ? (
                <PchainDetails networkId={preppedNetworkId} network={network} />
              ) : isXChain ? (
                <XchainDetails networkId={preppedNetworkId} network={network} />
              ) : (
                <GeneralTokenDetails
                  networkId={preppedNetworkId}
                  tokenAddress={tokenAddress}
                  network={network}
                />
              )}
            </StyledTokenDetailsContent>
          </>
        )}
      </StyledTokenScrollContainer>
    </StyledTokenDetails>
  );
};
