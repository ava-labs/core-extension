import { useEffect, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { useTrendingTokens } from '../../hooks/useTrendingTokens';
import { useSettingsContext } from '@core/ui';
import { ArrowRightIcon, Stack, Typography } from '@avalabs/k2-alpine';
import { Card } from '@/components/Card';
import { useHistory } from 'react-router-dom';
import { TopThreeLogos } from './TopThreeLogos';

export const TrendingTokenBanner = () => {
  const { push } = useHistory();

  const { getTrendingTokens, trendingTokens } = useTrendingTokens();
  const { showTrendingTokens } = useSettingsContext();
  const firstToken = trendingTokens?.[0];
  const secondToken = trendingTokens?.[1];
  const thirdToken = trendingTokens?.[2];

  getTrendingTokens();

  // const trendingTokens = useMemo(async () => {
  //   return await getTrendingTokens();
  // }, [getTrendingTokens]);

  const top3Tokens = useMemo(() => {
    return !trendingTokens ? [] : trendingTokens.slice(0, 3);
  }, [trendingTokens]);

  useEffect(() => {
    console.log(top3Tokens);
  }, [top3Tokens]);

  useEffect(() => {
    console.log(trendingTokens);
  }, [trendingTokens]);

  return (
    firstToken &&
    secondToken &&
    thirdToken &&
    showTrendingTokens && (
      <Card onClick={() => push(`/trending`)} sx={{ py: 0, height: '40px' }}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
          width="100%"
          height="100%"
        >
          <TopThreeLogos
            first={firstToken}
            second={secondToken}
            third={thirdToken}
          />

          <Typography
            variant="subtitle3"
            width="165px"
            ml={2}
            sx={{ fontWeight: 400 }}
          >
            <Trans
              i18nKey="<Bold>{{firstToken}}</Bold>, <Bold>{{secondToken}}</Bold>, <Bold>{{thirdToken}}</Bold> are trending today"
              values={{
                firstToken: top3Tokens[0]?.name,
                secondToken: top3Tokens[1]?.name,
                thirdToken: top3Tokens[2]?.name,
              }}
              components={{
                Bold: <span style={{ fontWeight: 600 }} />,
              }}
            />
          </Typography>
          <ArrowRightIcon size={22} />
        </Stack>
      </Card>
    )
  );
};
