import { Stack, toast } from '@avalabs/k2-alpine';
import { FC, useCallback } from 'react';
import { QueryUpdateFn } from '../../contexts';
import { PairFlipper } from './components/PairFlipper';
import { SourceSelector } from './components/SourceSelector';
import { TargetSelector } from './components/TargetSelector';

type Props = {
  onQueryChange: QueryUpdateFn;
};

export const BridgeControls: FC<Props> = () => {
  const handleFlip = useCallback(() => {
    toast.info('IMPLEMENT ME');
  }, []);

  return (
    <Stack gap={1}>
      <SourceSelector loading={false} />
      <PairFlipper disabled={false} onClick={handleFlip} />
      <TargetSelector loading={false} />
    </Stack>
  );
};
