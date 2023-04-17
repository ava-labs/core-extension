import { Card, CardContent, Stack, Typography } from '@avalabs/k2-components';
import { CreateChainTx } from '@src/background/services/wallet/models';
import { useTranslation } from 'react-i18next';
import { bigIntToString } from '@avalabs/utils-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { AvalancheChainStrings } from '@src/background/services/wallet/utils/parseAvalancheTx';

export function CreateChainView({
  tx,
  avaxPrice,
}: {
  tx: CreateChainTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const { chain, txFee, subnetID, chainName, vmID, fxIDs, genesisData } = tx;

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
          {t('Approve Create Chain')}
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
              <Stack>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 'fontWeightSemibold',
                  }}
                >
                  {subnetID}
                </Typography>
              </Stack>
            </Stack>
            <Stack>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Chain Name')}:
              </Typography>
              <Stack>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 'fontWeightSemibold',
                  }}
                >
                  {chainName}
                </Typography>
              </Stack>
            </Stack>
            <Stack>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('VM ID')}:
              </Typography>
              <Stack>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 'fontWeightSemibold',
                  }}
                >
                  {vmID}
                </Typography>
              </Stack>
            </Stack>
            <Stack>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Control Keys')}:
              </Typography>
            </Stack>
            <Stack>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                <ul>
                  {fxIDs.map((fxID) => {
                    return <li key={fxID}>{fxID}</li>;
                  })}
                </ul>
              </Typography>
            </Stack>
            <Stack>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Genesis Data')}:
              </Typography>
              <Stack>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 'fontWeightSemibold',
                  }}
                >
                  {genesisData}
                </Typography>
              </Stack>
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
