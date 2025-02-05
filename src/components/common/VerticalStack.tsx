import type { StackProps } from '@avalabs/core-k2-components';
import { Stack } from '@avalabs/core-k2-components';

export const VerticalStack = (props: Exclude<StackProps, 'direction'>) => (
  <Stack {...props} direction="column" />
);
