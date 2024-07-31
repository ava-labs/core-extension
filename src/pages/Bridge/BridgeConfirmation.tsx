import {
  Button,
  Card,
  ChevronLeftIcon,
  Divider,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { NetworkLogo } from '@src/components/common/NetworkLogo';
import { useSyncBridgeConfig } from './hooks/useSyncBridgeConfig';
import { useSetBridgeChainFromNetwork } from './hooks/useSetBridgeChainFromNetwork';
import Big from 'big.js';
import { bigToLocaleString } from '@avalabs/core-utils-sdk';

type NetworkInfo = {
  logoUri?: string;
  name?: string;
};

type BridgeConfirmProps = {
  tokenAmount: string;
  currencyAmount: string;
  source: NetworkInfo;
  target: NetworkInfo;
  currentAsset?: string;
  bridgeFee?: string;
  receiveAmount?: Big;
  receiveAmountCurrency?: string;
  onSubmit: () => void;
};

export function BridgeConfirmation({
  tokenAmount,
  currencyAmount,
  source,
  target,
  currentAsset,
  bridgeFee,
  receiveAmount,
  receiveAmountCurrency,
  onSubmit,
}: BridgeConfirmProps) {
  useSyncBridgeConfig(); // keep bridge config up-to-date
  useSetBridgeChainFromNetwork();

  const history = useHistory();
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Stack
        sx={{
          width: '100%',
          rowGap: 1,
          mt: 3,
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            ml: 1,
          }}
        >
          <ChevronLeftIcon
            onClick={() => history.goBack()}
            size={30}
            sx={{ cursor: 'pointer', mr: -1 }}
          />
          <PageTitle showBackButton={false}>
            {t('Confirm Transaction')}
          </PageTitle>
        </Stack>

        <Stack sx={{ alignItems: 'center', mx: 2, rowGap: 2 }}>
          <NetworkLogo
            src={source.logoUri}
            width="48px"
            height="48px"
            zIndex={2}
            withBackground
          />
          <Card
            sx={{
              width: '100%',
              p: 2,
              pt: 5,
              mt: -5,
            }}
          >
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('Bridging Amount')}
              </Typography>
              <Stack sx={{ flexDirection: 'row' }}>
                <Typography variant="h6">{tokenAmount}</Typography>
                <Typography
                  variant="h6"
                  sx={{ ml: 1, color: 'text.secondary' }}
                >
                  {currentAsset}
                </Typography>
              </Stack>
            </Stack>

            <Stack sx={{ alignItems: 'flex-end', width: '100%' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {currencyAmount}
              </Typography>
            </Stack>
          </Card>

          <Card
            sx={{
              width: '100%',
              p: 2,
            }}
          >
            <Stack divider={<Divider />} sx={{ rowGap: 2 }}>
              <Stack
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('From')}
                </Typography>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    columnGap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2"> {source.name} </Typography>
                  <NetworkLogo
                    src={source.logoUri}
                    width="16px"
                    height="16px"
                  />
                </Stack>
              </Stack>

              <Stack
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('To')}
                </Typography>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    columnGap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2"> {target.name} </Typography>
                  <NetworkLogo
                    src={target.logoUri}
                    width="16px"
                    height="16px"
                  />
                </Stack>
              </Stack>
            </Stack>
          </Card>

          <Card
            sx={{
              width: '100%',
              p: 2,
            }}
          >
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Stack
                sx={{
                  flexDirection: 'row',
                  columnGap: 1,
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Bridging Fee')}
                </Typography>
              </Stack>

              <Typography variant="subtitle2">{bridgeFee}</Typography>
            </Stack>
          </Card>

          <Stack
            sx={{
              width: '100%',
            }}
          >
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                width: '100%',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('Receive')}
              </Typography>
              <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="h5">
                  {receiveAmount ? bigToLocaleString(receiveAmount, 9) : '-'}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: 'text.secondary', ml: 1 }}
                >
                  {currentAsset}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                width: '100%',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {receiveAmountCurrency?.replace('~', '')}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        sx={{
          alignItems: 'flex-end',
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100%',
          columnGap: 1,
          pb: 3,
          px: 2,
        }}
      >
        <Button
          size="large"
          color="secondary"
          fullWidth
          onClick={() => history.goBack()}
        >
          {t('Cancel')}
        </Button>
        <Button size="large" fullWidth onClick={onSubmit}>
          {t('Bridge Now')}
        </Button>
      </Stack>
    </Stack>
  );
}
export default BridgeConfirmation;
