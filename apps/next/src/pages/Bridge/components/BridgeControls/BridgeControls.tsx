import { Collapse, Stack } from '@avalabs/k2-alpine';
import { FC, useCallback, useState } from 'react';
import { QueryUpdateFn, useBridgeState } from '../../contexts';
import { PairFlipper } from './components/PairFlipper';
import { SourceSelector } from './components/SourceSelector';
import { TargetSelector } from './components/TargetSelector';

type Props = {
  onQueryChange: QueryUpdateFn;
};

export const BridgeControls: FC<Props> = () => {
  const {
    shouldUseCrossChainTransfer,
    query,
    targetNetworkId,
    getAssetIdentifierOnTargetChain,
  } = useBridgeState();
  const [sourceFocused, setSourceFocused] = useState(false);

  const handleFlip = useCallback(() => {
    query.updateQuery({
      sourceNetwork: targetNetworkId,
      sourceToken: getAssetIdentifierOnTargetChain(
        query.sourceToken,
        targetNetworkId,
      ),
      sourceTokenQuery: '',
      amount: '',
    });
  }, [getAssetIdentifierOnTargetChain, query, targetNetworkId]);

  return (
    <Stack gap={1}>
      <Collapse in>
        <SourceSelector onFocusChanged={setSourceFocused} />
      </Collapse>
      <Collapse in={!shouldUseCrossChainTransfer && !sourceFocused}>
        <PairFlipper onClick={handleFlip} />
      </Collapse>
      <Collapse in={!shouldUseCrossChainTransfer}>
        <TargetSelector />
      </Collapse>
    </Stack>
  );
};
