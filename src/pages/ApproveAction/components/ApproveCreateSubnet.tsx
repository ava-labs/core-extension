import { Card, CardContent, Stack, Typography } from '@avalabs/k2-components';
import { CreateSubnetTx } from '@src/background/services/wallet/models';
import { useTranslation } from 'react-i18next';
import { bigIntToString } from '@avalabs/utils-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { AvalancheChainStrings } from '@src/background/services/wallet/utils/parseAvalancheTx';

export function CreateSubnetView({
  tx,
  avaxPrice,
}: {
  tx: CreateSubnetTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const { chain, txFee, threshold, controlKeys } = tx;

  return (
    <Stack>
      {/* source chain */}
      <Stack>
        <Typography
          variant="h4"
          sx={{
            my: 1.5,
          }}
        >
          {t('Approve Create Subnet')}
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
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Source Chain')}
              </Typography>
              <Typography variant="caption">
                {AvalancheChainStrings[chain]}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* details */}
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
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Threshold')}:
              </Typography>
              <Stack>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'right',
                    fontWeight: 'fontWeightSemibold',
                  }}
                >
                  {threshold}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Control Keys')}:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {controlKeys.length}
              </Typography>
            </Stack>
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography
                variant="caption"
                sx={{
                  textAlign: 'left',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                <ul>
                  {controlKeys.map((addr) => {
                    return <li key={addr}>{addr}</li>;
                  })}
                </ul>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* network fee */}
      <Stack>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'fontWeightSemibold',
            mt: 1,
            mb: 1,
            mx: 0,
          }}
        >
          {t('Network Fee')}
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
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Fee Amount')}
              </Typography>
              <Stack>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'right',
                    fontWeight: 'fontWeightSemibold',
                  }}
                >
                  {Number(bigIntToString(txFee, 9))} AVAX
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'right',
                    color: 'text.secondary',
                  }}
                >
                  {currencyFormatter(
                    Number(bigIntToString(txFee, 9)) * avaxPrice
                  )}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}
