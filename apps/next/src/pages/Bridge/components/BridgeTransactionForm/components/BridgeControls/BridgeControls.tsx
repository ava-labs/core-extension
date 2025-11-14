import { Collapse, Stack } from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useBridgeState } from '../../../../contexts';
import { PairFlipper } from './components/PairFlipper';
import { SourceSelector } from './components/SourceSelector';
import { TargetSelector } from './components/TargetSelector';

export const BridgeControls: FC = () => {
  const { isBridgeSupported } = useBridgeState();
  const [sourceFocused, setSourceFocused] = useState(false);

  return (
    <Stack gap={1}>
      <Collapse in>
        <SourceSelector onFocusChanged={setSourceFocused} />
      </Collapse>
      <Collapse in={!isBridgeSupported && !sourceFocused}>
        <PairFlipper />
      </Collapse>
      <Collapse in={!isBridgeSupported}>
        <TargetSelector />
      </Collapse>
    </Stack>
  );
};
