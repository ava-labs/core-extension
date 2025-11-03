import { Card } from '@/components/Card';
import { BridgeTokenCard } from '@/pages/Bridge/components/BridgeTokenCard';
import { useBridgeState } from '@/pages/Bridge/contexts';
import { noop } from 'lodash';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from '../../../../Styled';
import { NetworkSelect } from './NetworkSelect';

export const TargetSelector: FC = () => {
  const { t } = useTranslation();

  const { targetNetworkId, targetNetworks, targetToken, amountAfterFee } =
    useBridgeState();

  return (
    <Card noPadding>
      <NetworkSelect
        label={t('To')}
        chains={targetNetworks}
        selected={targetNetworkId}
        onSelect={noop}
        disabled
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
