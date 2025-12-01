import { useHistory, useParams } from 'react-router-dom';
import { AssetsErrorState } from '../AssetsErrorState';
import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { useMemo } from 'react';
import { PortfolioActionButtons } from '../PortfolioActionButtons';
import { TokenAvatar } from '@/components/TokenAvatar';
import { useTokenDetails } from './hooks/useTokenDetails';
import { PageTopBar } from '@/components/PageTopBar';
import { GeneralTokenDetails } from './components/GeneralTokenDetails';
import { isPchainNetworkId, isXchainNetworkId } from '@core/common';
import { PchainDetails } from './components/PChain/PchainDetails';
import { XchainDetails } from './components/XchainDetails';

export const TokenDetails = () => {
  const { push } = useHistory();

  const { networkId, tokenAddress } = useParams<{
    networkId: string;
    tokenAddress: string;
  }>();

  const preppedNetworkId = useMemo(() => Number(networkId), [networkId]);

  const { token, tokenBalance, tokenBalanceInCurrency, currency } =
    useTokenDetails({ networkId, tokenAddress });

  if (!token || !tokenBalance) {
    return <AssetsErrorState />;
  }

  const isPChain = isPchainNetworkId(preppedNetworkId);
  const isXChain = isXchainNetworkId(preppedNetworkId);

  return (
    <>
      <PageTopBar
        showBack={true}
        showViewSwitcher={true}
        onBackClicked={() => {
          push('/portfolio');
        }}
      />
      <Stack pt={2} px={1.5}>
        <Box flexShrink={0} mb={0.5}>
          <TokenAvatar token={token} size={32} badgeSize={16} />
        </Box>
        <Typography variant="h2" color="text.secondary">
          {token.name}
        </Typography>
        <Stack
          direction="row"
          alignItems="flex-end"
          gap={0.5}
          color="text.primary"
        >
          <Typography variant="h2">
            {tokenBalance.balanceDisplayValue}
          </Typography>
          <Typography variant="h7">{token.symbol}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={0.5} my={0.5} mb={2}>
          <Typography variant="body1" fontWeight={500} color="text.primary">
            {tokenBalanceInCurrency} {currency}
          </Typography>
        </Stack>
        <PortfolioActionButtons />

        {isPChain ? (
          <PchainDetails networkId={preppedNetworkId} />
        ) : isXChain ? (
          <XchainDetails />
        ) : (
          <GeneralTokenDetails
            networkId={preppedNetworkId}
            tokenAddress={tokenAddress}
          />
        )}
      </Stack>
    </>
  );
};
