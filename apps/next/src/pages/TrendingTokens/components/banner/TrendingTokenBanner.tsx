import { useEffect, useRef } from 'react';
import { Trans } from 'react-i18next';
import { useTrendingTokens } from '../../hooks/useTrendingTokens';
import { useSettingsContext } from '@core/ui';
import { ArrowRightIcon, Stack, Typography } from '@avalabs/k2-alpine';
import { Card } from '@/components/Card';
import { useHistory } from 'react-router-dom';
import { TopThreeLogos } from './TopThreeLogos';
import { orderBy } from 'lodash';

export const TrendingTokenBanner = () => {
  const { push } = useHistory();

  const { updateTrendingTokens, trendingTokens } = useTrendingTokens();
  const { showTrendingTokens } = useSettingsContext();

  const avalancheTrendingTokens = trendingTokens.avalanche;
  const [firstToken, secondToken, thirdToken] = orderBy(
    avalancheTrendingTokens,
    (token) => token.rank,
  );

  const updateRef = useRef(updateTrendingTokens);
  updateRef.current = updateTrendingTokens;

  useEffect(() => {
    // Just run it once for the initial render
    updateRef.current(`avalanche`);
  }, []);

  return (
    firstToken &&
    secondToken &&
    thirdToken &&
    showTrendingTokens && (
      <Card
        onClick={() => push(`/trending`)}
        sx={{
          py: 0,
          cursor: 'pointer',
          height: '40px',
          width: '100%',
          backgroundColor: 'transparent',
        }}
      >
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
            py={0.5}
            ml={2}
            sx={{ fontWeight: 400 }}
          >
            <Trans
              i18nKey="<Bold>{{firstToken}}</Bold>, <Bold>{{secondToken}}</Bold>, <Bold>{{thirdToken}}</Bold> are trending today"
              values={{
                firstToken: firstToken.name,
                secondToken: secondToken.name,
                thirdToken: thirdToken.name,
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
