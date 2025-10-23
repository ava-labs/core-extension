import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { useBridgeState } from '@/pages/Bridge/contexts';

import { getUniqueTokenId } from '@core/types';
import { noop } from 'lodash';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from '../../../../Styled';
import { NetworkSelect } from './NetworkSelect';

type Props = {
  // TODO: Add props if needed
  fakeProps?: unknown;
};

export const TargetSelector: FC<Props> = () => {
  const { t } = useTranslation();

  const { targetNetworkId, targetNetworks, targetToken, amountAfterFee } =
    useBridgeState();

  const { tokenId, tokens } = useMemo(() => {
    if (!targetToken) {
      return { tokenId: '', tokens: [] };
    }
    return {
      tokenId: getUniqueTokenId(targetToken),
      tokens: [targetToken],
    };
  }, [targetToken]);

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
        tokenId={tokenId}
        tokensForAccount={tokens}
        onTokenChange={noop}
        tokenQuery={''}
        onQueryChange={noop}
        amount={amountAfterFee ?? ''}
        onAmountChange={noop}
        withPresetButtons={false}
        tokenBalance={false}
      />
    </Card>
  );
};
