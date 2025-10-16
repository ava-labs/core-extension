import { Stack, StackProps, Typography } from '@avalabs/k2-alpine';

import { ApprovalScreenPage } from './Styled';

export const UnsupportedNetworkScreen = ({
  children,
  ...props
}: StackProps) => (
  <ApprovalScreenPage {...props}>
    <Stack
      px={4}
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Typography>Unsupported Network</Typography>
    </Stack>
    {children}
  </ApprovalScreenPage>
);
