import { AddValidatorTx } from '@src/background/services/wallet/models';

import { Card, CardContent, Stack, Typography } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { bigIntToString } from '@avalabs/utils-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { AvalancheChainStrings } from '@src/background/services/wallet/utils/parseAvalancheTx';

export function AddValidator({
  tx,
  avaxPrice,
}: {
  tx: AddValidatorTx;
  avaxPrice: number;
}) {
  const { nodeID, fee, start, end, stake, chain } = tx;
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const startDate = new Date(parseInt(start) * 1000);
  const endDate = new Date(parseInt(end) * 1000);

  return (
    <Stack>
      <Typography
        variant="h2"
        sx={{
          my: 1.5,
        }}
      >
        {t('Approve Add Validator')}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 'fontWeightSemibold',
          mt: 2,
          mb: 1,
          mx: 0,
        }}
      >
        {t('Chain')}: {AvalancheChainStrings[chain]}
      </Typography>
      <Card
        sx={{
          width: 1,
        }}
      >
        <CardContent
          sx={{
            p: 2,
          }}
        >
          <Stack>
            <Typography
              variant="body3"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Node ID')}:
            </Typography>
            <Typography variant="body3">{nodeID}</Typography>
          </Stack>
        </CardContent>
      </Card>
      <Typography
        variant="body2"
        sx={{ fontWeight: 'fontWeightSemibold', mt: 3, mb: 1, mx: 0 }}
      >
        {t('Details')}
      </Typography>
      <Card
        sx={{
          width: 1,
        }}
      >
        <CardContent
          sx={{
            p: 2,
          }}
        >
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="body3"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Stake Amount')}:
            </Typography>
            <Stack>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {Number(bigIntToString(stake, 9))} AVAX
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {currencyFormatter(
                  Number(bigIntToString(stake, 9)) * avaxPrice
                )}
              </Typography>
            </Stack>
          </Stack>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="body3"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Start Date')}:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'right',
                fontWeight: 'fontWeightSemibold',
              }}
            >
              {startDate.toLocaleString()}
            </Typography>
          </Stack>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="body3"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('End Date')}:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'right',
                fontWeight: 'fontWeightSemibold',
              }}
            >
              {endDate.toLocaleString()}
            </Typography>
          </Stack>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="body3"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Delegation Fee')}:
            </Typography>
            <Stack>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {fee / 10000} %
              </Typography>
            </Stack>
          </Stack>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="body3"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Fee')}:
            </Typography>
            <Stack>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                0 AVAX
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
