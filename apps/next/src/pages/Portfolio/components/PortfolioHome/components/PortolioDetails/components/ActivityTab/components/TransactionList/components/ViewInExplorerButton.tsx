import { OutboundIcon, Tooltip } from '@avalabs/k2-alpine';
import { TxHistoryItem } from '@core/types';
import { useAnalyticsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import * as Styled from './Styled';

type Props = {
  txType: TxHistoryItem['txType'];
  explorerLink: TxHistoryItem['explorerLink'];
  chainId: TxHistoryItem['chainId'];
};

export const ViewInExplorerButton: FC<Props> = ({
  txType,
  explorerLink,
  chainId,
}) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  return (
    <Tooltip title={t('View in Explorer')} arrow>
      <Styled.SecondaryActionButton
        size="small"
        onClick={async () => {
          await capture('ActivityCardLinkClicked', {
            chainId,
            type: txType,
          });
          window.open(explorerLink, '_blank', 'noreferrer');
        }}
        data-testid="explorer-link"
      >
        <OutboundIcon size={16} viewBox="0 0 24 24" />
      </Styled.SecondaryActionButton>
    </Tooltip>
  );
};
