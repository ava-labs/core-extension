import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { Styled } from '@/pages/Bridge/components';
import { useBridgeState } from '@/pages/Bridge/contexts';
import { FC, FocusEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkSelect } from './NetworkSelect';
import { UseCrossChainTransferInfo } from './UseCrossChainTransferInfo';

type Props = {
  onFocusChanged: (focused: boolean) => void;
};

export const SourceSelector: FC<Props> = ({ onFocusChanged }) => {
  const { t } = useTranslation();
  const {
    sourceChainIds,
    sourceTokens,
    isBridgeSupported,
    query,
    minTransferAmount,
    sourceToken,
    requiredNetworkFee,
  } = useBridgeState();
  const { updateQuery } = query;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocusChange: FocusEventHandler = (event) => {
    const isFocusEvent = event.type === 'focus';
    setIsFocused(isFocusEvent);
    onFocusChanged(isFocusEvent);
  };

  return (
    <Card noPadding>
      <NetworkSelect
        label={t('From')}
        chains={sourceChainIds}
        selected={query.sourceNetwork}
        onSelect={(sourceNetwork) => {
          updateQuery({
            sourceNetwork,
            sourceToken: '',
            sourceTokenQuery: '',
          });
        }}
      />
      <Styled.Divider />
      {isBridgeSupported ? (
        <UseCrossChainTransferInfo networkId={query.sourceNetwork} />
      ) : (
        <TokenAmountInput
          id="bridge-from-amount"
          tokenId={query.sourceToken}
          tokensForAccount={sourceTokens}
          minAmount={minTransferAmount}
          maxAmount={sourceToken?.balance}
          estimatedFee={requiredNetworkFee}
          onTokenChange={(token) =>
            updateQuery({
              sourceToken: token,
              sourceTokenQuery: '',
            })
          }
          amount={query.amount}
          onAmountChange={(amount) => updateQuery({ amount })}
          onQueryChange={(q) => updateQuery({ sourceTokenQuery: q })}
          tokenQuery={query.sourceTokenQuery}
          withPresetButtons={isFocused}
          onFocus={handleFocusChange}
          onBlur={handleFocusChange}
        />
      )}
    </Card>
  );
};
