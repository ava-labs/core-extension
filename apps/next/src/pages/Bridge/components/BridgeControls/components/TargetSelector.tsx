import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { useBridgeState } from '@/pages/Bridge/contexts';

import { getUniqueTokenId } from '@core/types';
import { noop } from 'lodash';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkSelect } from './NetworkSelect';
import * as Styled from './Styled';

type Props = {
  // TODO: Add props if needed
  fakeProps?: unknown;
};

export const TargetSelector: FC<Props> = () => {
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
      <TokenAmountInput
        autoFocus={false}
        disabled
        id="bridge-to-amount"
        tokenId={(targetToken && getUniqueTokenId(targetToken)) || ''}
        tokensForAccount={targetToken ? [targetToken] : []}
        onTokenChange={noop}
        tokenQuery={''}
        onQueryChange={noop}
        amount={amountAfterFee ?? ''}
        onAmountChange={noop}
        withPresetButtons={false}
      />
    </Card>
  );
};
