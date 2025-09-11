import { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { useTrendingTokens } from '../../hooks/useTrendingTokens';
import { useSettingsContext } from '@core/ui';
import { ArrowRightIcon, Stack, Typography } from '@avalabs/k2-alpine';
import { Card } from '@/components/Card';
import { useHistory } from 'react-router-dom';
import { TopThreeLogos } from './TopThreeLogos';

export const TrendingTokenBanner = () => {
  const { push } = useHistory();

  const { updateTrendingTokens, trendingTokens } = useTrendingTokens();
  const { showTrendingTokens } = useSettingsContext();

  const avalancheTrendingTokens = trendingTokens.avalanche;
  const firstToken = avalancheTrendingTokens?.find((token) => token.rank === 1);
  const secondToken = avalancheTrendingTokens?.find(
    (token) => token.rank === 2,
  );
  const thirdToken = avalancheTrendingTokens?.find((token) => token.rank === 3);

  updateTrendingTokens(`avalanche`);

  const top3Tokens = useMemo(() => {
    return !avalancheTrendingTokens ? [] : avalancheTrendingTokens.slice(0, 3);
  }, [avalancheTrendingTokens]);

  return (
    firstToken &&
    secondToken &&
    thirdToken &&
    showTrendingTokens && (
      <Card onClick={() => push(`/trending`)} sx={{ py: 0 }}>
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
