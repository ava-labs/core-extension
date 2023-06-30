import { Stack, StackProps } from '@avalabs/k2-components';

export const VerticalStack = (props: Exclude<StackProps, 'direction'>) => (
  <Stack {...props} direction="column" />
);
