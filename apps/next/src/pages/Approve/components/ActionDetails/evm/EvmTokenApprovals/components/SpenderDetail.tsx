import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, OutboundIcon, Stack, Tooltip } from '@avalabs/k2-alpine';

import { getExplorerAddressByNetwork } from '@core/common';
import { NetworkWithCaipId } from '@core/types';

import { TruncatedAddress } from '@/components/Address';

import { TxDetailsRow } from '../../../generic/DetailsItem/items/DetailRow';

type SpenderDetailProps = {
  spenderAddress: string;
  network: NetworkWithCaipId;
};

export const SpenderDetail: FC<SpenderDetailProps> = ({
  spenderAddress,
  network,
}) => {
  const { t } = useTranslation();
  const explorerLink = getExplorerAddressByNetwork(
    network,
    spenderAddress,
    'address',
  );

  return (
    <TxDetailsRow label={t('Spender')}>
      <Stack direction="row" alignItems="center" gap={0.5}>
        <TruncatedAddress address={spenderAddress} />
        <Tooltip title={t('View in Explorer')} arrow>
          <IconButton
            sx={{ padding: 0.25 }}
            size="small"
            onClick={async () => {
              window.open(explorerLink, '_blank', 'noreferrer');
            }}
            data-testid="spender-explorer-link"
          >
            <OutboundIcon size={16} viewBox="0 0 24 24" />
          </IconButton>
        </Tooltip>
      </Stack>
    </TxDetailsRow>
  );
};
