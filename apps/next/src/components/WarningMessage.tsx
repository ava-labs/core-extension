import { Box, Stack, StackProps, Typography } from '@avalabs/k2-alpine';
import { FC, PropsWithChildren } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';

export const WarningMessage: FC<PropsWithChildren<StackProps>> = ({
  children,
  ...props
}) => {
  return (
    <Stack
      {...props}
      direction="row"
      color="error.main"
      alignItems="center"
      columnGap="8px"
    >
      <Box flexShrink={0}>
        <MdOutlineErrorOutline size={24} />
      </Box>
      <Typography variant="caption">{children}</Typography>
    </Stack>
  );
};
