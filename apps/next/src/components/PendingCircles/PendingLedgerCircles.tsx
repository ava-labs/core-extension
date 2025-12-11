import { LedgerIcon } from '@avalabs/k2-alpine';
import { PendingCircles } from './PendingCircles';
import { ComponentProps } from 'react';

export const PendingLedgerCircles = (
  props: Omit<ComponentProps<typeof PendingCircles>, 'Icon'>,
) => <PendingCircles Icon={LedgerIcon} {...props} />;
