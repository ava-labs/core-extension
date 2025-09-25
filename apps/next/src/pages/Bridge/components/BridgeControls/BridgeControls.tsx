import { BridgeQueryTokens } from '@/config/routes';
import { Stack, toast } from '@avalabs/k2-alpine';
import { FC, useCallback } from 'react';
import { QueryUpdateFn } from '../../hooks/useBridgeQuery';
import { PairFlipper } from './components/PairFlipper';
import { SourceSelector } from './components/SourceSelector';
import { TargetSelector } from './components/TargetSelector';

type Props = {
  query: BridgeQueryTokens;
  onQueryChange: QueryUpdateFn;
};

export const BridgeControls: FC<Props> = ({ query, onQueryChange }) => {
  const handleFlip = useCallback(() => {
    toast.info('IMPLEMENT ME');
  }, []);

  return (
    <Stack gap={1}>
      <SourceSelector
        loading={false}
        query={query}
        onQueryChange={onQueryChange}
      />
      <PairFlipper disabled={false} onClick={handleFlip} />
      <TargetSelector query={query} onQueryChange={onQueryChange} />
    </Stack>
  );
};
