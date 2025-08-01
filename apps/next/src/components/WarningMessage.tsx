import { Stack, StackProps, styled, Typography } from '@avalabs/k2-alpine';
import { FC, PropsWithChildren } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';

const UnshrinkableIcon = styled(MdOutlineErrorOutline)({
  flexShrink: 0,
});

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
      columnGap={1}
    >
      <UnshrinkableIcon size={24} />
      <Typography variant="caption">{children}</Typography>
    </Stack>
  );
};
