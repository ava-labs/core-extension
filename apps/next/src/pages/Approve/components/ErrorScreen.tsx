import { Stack, StackProps, Typography } from '@avalabs/k2-alpine';

import { ApprovalScreenPage } from './Styled';

type ErrorScreenProps = StackProps & {
  message: string;
};

export const ErrorScreen = ({
  message,
  children,
  ...props
}: ErrorScreenProps) => (
  <ApprovalScreenPage {...props}>
    <Stack
      px={4}
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Typography color="error">{message}</Typography>
    </Stack>
    {children}
  </ApprovalScreenPage>
);
