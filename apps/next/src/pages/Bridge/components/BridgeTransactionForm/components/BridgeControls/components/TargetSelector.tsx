import { Card } from '@/components/Card';
import { BridgeTokenCard } from '@/pages/Bridge/components/BridgeTokenCard';
import { useBridgeState } from '@/pages/Bridge/contexts';
import { NetworkWithCaipId } from '@core/types';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from '../../../../Styled';
import { NetworkSelect } from './NetworkSelect';

export const TargetSelector: FC = () => {
  const { t } = useTranslation();

  const {
    query: { targetNetwork, updateQuery },
    asset,
    targetToken,
    amountAfterFee,
  } = useBridgeState();

  const targetNetworkIds = useMemo(
    () => (asset?.destinations ? Object.keys(asset.destinations) : []),
    [asset?.destinations],
  );

  const onSelect = useCallback(
    (selected: NetworkWithCaipId['caipId']) => {
      updateQuery({
        targetNetwork: selected,
      });
    },
    [updateQuery],
  );

  return (
    <Card noPadding>
      <NetworkSelect
        label={t('To')}
        chains={targetNetworkIds}
        selected={targetNetwork}
        onSelect={onSelect}
      />
      <Styled.Divider />
      <BridgeTokenCard
        token={targetToken}
        amount={amountAfterFee ?? 0n}
        size={32}
        badgeSize={14}
      />
    </Card>
  );
};
