import { useEffect, useRef } from 'react';
import { Trans } from 'react-i18next';
import { useTrendingTokens } from '@/pages/TrendingTokens/hooks/useTrendingTokens';
import { ArrowRightIcon, Stack, Typography } from '@avalabs/k2-alpine';
import { Card } from '@/components/Card';
import { useHistory } from 'react-router-dom';
import { TopThreeLogos } from './TopThreeLogos';
import { TrendingTokensSkeleton } from '@/pages/Portfolio/components/PortfolioHome/components/LoadingState';

const MAX_NAME_LENGTH = 12; // use the symbol if the name is too long which would make the banner too high

const getDisplayName = (token: { name: string; symbol: string }) => {
  return token.name.length > MAX_NAME_LENGTH ? token.symbol : token.name;
};

export const TrendingTokenSlide = () => {
  const { push } = useHistory();

  const { updateTrendingTokens, trendingTokens, isLoading } =
    useTrendingTokens();
  const [firstToken, secondToken, thirdToken] = trendingTokens.avalanche;

  const updateRef = useRef(updateTrendingTokens);
  updateRef.current = updateTrendingTokens;

  useEffect(() => {
    // Just run it once for the initial render
    updateRef.current(`avalanche`);
  }, []);

  // Show skeleton while loading or when data isn't ready yet
  if (isLoading || !firstToken || !secondToken || !thirdToken) {
    return <TrendingTokensSkeleton />;
  }

  return (
    <Card
      onClick={() => push(`/trending`)}
      sx={{
        cursor: 'pointer',
        backgroundColor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        width="100%"
        gap={1.5}
      >
        <TopThreeLogos
          first={firstToken}
          second={secondToken}
          third={thirdToken}
        />
        <Typography
          variant="subtitle3"
          flex={1}
          minWidth={0}
          sx={{ fontWeight: 400 }}
        >
          <Trans
            i18nKey="<Bold>{{firstToken}}</Bold>, <Bold>{{secondToken}}</Bold>, <Bold>{{thirdToken}}</Bold> are trending today"
            values={{
              firstToken: getDisplayName(firstToken),
              secondToken: getDisplayName(secondToken),
              thirdToken: getDisplayName(thirdToken),
            }}
            components={{
              Bold: <span style={{ fontWeight: 600 }} />,
            }}
          />
        </Typography>
        <ArrowRightIcon size={22} />
      </Stack>
    </Card>
  );
};
