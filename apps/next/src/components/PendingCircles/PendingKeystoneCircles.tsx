import { KeystoneIcon } from '@avalabs/k2-alpine';
import { PendingCircles } from './PendingCircles';
import { ComponentProps } from 'react';

export const PendingKeystoneCircles = (
  props: Omit<ComponentProps<typeof PendingCircles>, 'Icon'>,
) => <PendingCircles Icon={KeystoneIcon} {...props} />;
