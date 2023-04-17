import { Card, CardContent, Stack, Typography } from '@avalabs/k2-components';
import { AddSubnetValidatorTx } from '@src/background/services/wallet/models';
import { useTranslation } from 'react-i18next';
import { bigIntToString } from '@avalabs/utils-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { AvalancheChainStrings } from '@src/background/services/wallet/utils/parseAvalancheTx';

export function AddSubnetValidatorView({
  tx,
  avaxPrice,
}: {
  tx: AddSubnetValidatorTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const { chain, txFee, nodeID, start, end, subnetID } = tx;
  const startDate = new Date(parseInt(start) * 1000);
  const endDate = new Date(parseInt(end) * 1000);

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
          {t('Approve Add Subnet Validator')}
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
            <Stack>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Subnet ID')}:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {subnetID}
              </Typography>
            </Stack>
            <Stack>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Node ID')}:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {nodeID}
              </Typography>
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
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography
                variant="caption"
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
