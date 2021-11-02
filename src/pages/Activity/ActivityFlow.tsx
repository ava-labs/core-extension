import { Typography, VerticalFlex } from '@avalabs/react-components';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import React from 'react';
import { ActivityMiniMode } from './Activity.minimode';

export function ActivityFlow() {
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  return isMiniMode ? (
    <ActivityMiniMode />
  ) : (
    <VerticalFlex>
      <Typography>Not started yet</Typography>
    </VerticalFlex>
  );
}

export default ActivityFlow;
