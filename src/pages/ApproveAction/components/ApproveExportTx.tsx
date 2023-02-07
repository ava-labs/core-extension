import { ExportTx } from '@src/background/services/wallet/models';

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

export function ExportTxView({
  tx,
  avaxPrice,
}: {
  tx: ExportTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const { amount, chain, destination, type, txFee } = tx;

  return (
    <Stack>
      <Typography
        variant="h2"
        sx={{
          my: 1.5,
        }}
      >
        {t('Approve Export')}
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
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="body3"
              sx={{
                color: 'text.secondary',
                mb: 1,
              }}
            >
              {t('Source Chain')}
            </Typography>
            <Typography variant="body3">
              {AvalancheChainStrings[chain]}
            </Typography>
          </Stack>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="body3"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Target Chain')}
            </Typography>
            <Typography variant="body3">
              {AvalancheChainStrings[destination]}
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
              variant="body3"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Transaction Type')}
            </Typography>
            <Typography variant="body3">
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
                variant="body3"
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
              variant="body3"
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
                variant="body3"
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
