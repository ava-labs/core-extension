import { useNetworkContext } from '@/contexts/NetworkProvider';
import { useHistory } from 'react-router-dom';

import { ChainId } from '@avalabs/core-chains-sdk';
import {
	Button,
	BuyIcon,
	QRCodeIcon,
	Stack,
} from '@avalabs/core-k2-components';
import { getCoreWebUrl, openNewTab } from '@core/common';
import { useTranslation } from 'react-i18next';

export function ZeroWidget() {
  const { t } = useTranslation();
  const { network } = useNetworkContext();

  const history = useHistory();

  if (network?.chainId === ChainId.AVALANCHE_MAINNET_ID) {
    return (
      <Stack
        sx={{
          flexDirection: 'row',
          mt: 2,
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        <Button
          color="secondary"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            openNewTab({ url: `${getCoreWebUrl()}/buy` });
          }}
        >
          <BuyIcon size={16} sx={{ mr: 1 }} />
          {t('Buy')}
        </Button>
        <Button
          color="secondary"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            history.push('/receive');
          }}
        >
          <QRCodeIcon size={16} sx={{ mr: 1 }} />
          {t('Receive')}
        </Button>
      </Stack>
    );
  }
  return (
    <Stack sx={{ mt: 2, flexDirection: 'row' }}>
      <Button
        color="secondary"
        fullWidth
        onClick={(e) => {
          e.stopPropagation();
          history.push('/receive');
        }}
      >
        <QRCodeIcon size={16} sx={{ mr: 1 }} />
        {t('Receive')}
      </Button>
    </Stack>
  );
}
