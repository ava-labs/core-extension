import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  OutboundIcon,
  Stack,
  Tooltip,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';

import { getExplorerAddressByNetwork } from '@core/common';
import { NetworkWithCaipId } from '@core/types';

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
        <Typography variant="mono" color="text.secondary">
          {truncateAddress(spenderAddress, 10)}
        </Typography>
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
