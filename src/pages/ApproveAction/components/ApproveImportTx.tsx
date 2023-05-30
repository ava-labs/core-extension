import { ImportTx } from '@src/background/services/wallet/models';
import {
  AvalancheColorIcon,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { bigIntToString } from '@avalabs/utils-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { AvalancheChainStrings } from '@src/background/services/wallet/utils/parseAvalancheTx';

export function ImportTxView({
  tx,
  avaxPrice,
}: {
  tx: ImportTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();

  const { amount, chain, source, type, txFee } = tx;

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
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                mb: 1,
              }}
            >
              {t('Source Chain')}
            </Typography>
            <Typography variant="caption">
              {AvalancheChainStrings[source]}
            </Typography>
          </Stack>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Target Chain')}
            </Typography>
            <Typography variant="caption">
              {AvalancheChainStrings[chain]}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 'fontWeightSemibold',
          mt: 2,
          mb: 1,
          mx: 0,
        }}
      >
        {t('Token')}
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
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Transaction Type')}
            </Typography>
            <Typography variant="caption">
              {type ? (type[0] || '').toUpperCase() + type.slice(1) : ''}
            </Typography>
          </Stack>
          <Divider />
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              mt: 1.5,
            }}
          >
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <AvalancheColorIcon size={'32px'} />
              <Typography sx={{ ml: 1 }} variant="h6">
                AVAX
              </Typography>
            </Stack>
            <Stack>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {Number(bigIntToString(amount, 9))} AVAX
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  textAlign: 'right',
                  color: 'text.secondary',
                }}
              >
                {currencyFormatter(
                  Number(bigIntToString(amount, 9)) * avaxPrice
                )}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 'fontWeightSemibold',
          mt: 3,
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
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
  );
}
