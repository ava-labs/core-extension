import { StackProps } from '@avalabs/k2-alpine';
import { memoize } from 'lodash';

export const getPageContentProps = memoize(
  (isConfirming: boolean): StackProps => ({
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: 1,
    height: 1,
    gap: isConfirming ? 1 : 0.5,
  }),
);
