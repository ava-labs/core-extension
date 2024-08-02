import {
  Card,
  CardContent,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { bigToLocaleString } from '@avalabs/core-utils-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { bigintToBig } from '@src/utils/bigintToBig';
import { AvalancheChainStrings } from '@src/background/services/wallet/handlers/eth_sendTransaction/models';

export function AddDelegator({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.AddDelegatorTx;
  avaxPrice: number;
}) {
  const { nodeID, start, end, stake, chain, txFee } = tx;
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const startDate = new Date(parseInt(start) * 1000);
  const endDate = new Date(parseInt(end) * 1000);
  const fee = bigintToBig(txFee, 9);

  return (
    <Stack>
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
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Node ID')}:
            </Typography>
            <Typography variant="caption">{nodeID}</Typography>
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
              variant="caption"
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
                {bigToLocaleString(bigintToBig(stake, 9), 4)} AVAX
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {currencyFormatter(
                  bigintToBig(stake, 9).times(avaxPrice).toNumber()
                )}
              </Typography>
            </Stack>
          </Stack>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="caption"
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
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('End Date:')}
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
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Fee Amount')}:
            </Typography>
            <Stack>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {bigToLocaleString(fee, 4)} AVAX
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {currencyFormatter(fee.times(avaxPrice).toNumber())}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
