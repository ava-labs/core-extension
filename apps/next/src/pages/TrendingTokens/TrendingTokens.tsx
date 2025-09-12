import { Page } from '@/components/Page';
import { Button, Stack, useTheme } from '@avalabs/k2-alpine';
import { useTrendingTokens } from './hooks/useTrendingTokens';
import { TokenCard } from './components/tokens/TokenCard';
import { TrendingTokensNetwork } from '@core/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const TrendingTokens = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { updateTrendingTokens, trendingTokens } = useTrendingTokens();
  const [network, setNetwork] = useState<TrendingTokensNetwork>('avalanche');
  useEffect(() => {
    // Just run it once for the initial render
    updateTrendingTokens(network);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNetworkChange = (newNetwork: TrendingTokensNetwork) => {
    setNetwork(newNetwork);
    updateTrendingTokens(newNetwork);
  };

  return (
    <Page
      title="Trending Tokens"
      contentProps={{
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: 0,
      }}
    >
      <Stack
        direction="row"
        gap={1}
        justifyContent="flex-start"
        width="100%"
        position="sticky"
        top={0}
        zIndex={1000}
        pt={1}
        pb={3}
        bgcolor={theme.palette.background.backdrop}
      >
        <Button
          size="xsmall"
          variant="contained"
          color={network == 'avalanche' ? 'primary' : 'secondary'}
          onClick={() => handleNetworkChange('avalanche')}
        >
          {t('Avalanche')}
        </Button>
        <Button
          size="xsmall"
          variant="contained"
          color={network == 'solana' ? 'primary' : 'secondary'}
          onClick={() => handleNetworkChange('solana')}
        >
          {t('Solana')}
        </Button>
      </Stack>

      <Stack width="100%" flexGrow={1}>
        {trendingTokens[network].map((token, index) => (
          <TokenCard
            key={token.address}
            token={token}
            last={index === trendingTokens[network].length - 1}
            network={network}
          />
        ))}
      </Stack>
    </Page>
  );
};
