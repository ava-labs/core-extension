import { Stack, StackProps, styled, Typography } from '@avalabs/k2-alpine';
import { ContextContainer } from '@core/types';
import { isSpecificContextContainer } from '@core/ui';
import { FC, PropsWithChildren } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';

const UnshrinkableIcon = styled(MdOutlineErrorOutline)({
  flexShrink: 0,
});

export const WarningMessage: FC<PropsWithChildren<StackProps>> = ({
  children,
  ...props
}) => {
  const isFullscreen = isSpecificContextContainer(ContextContainer.FULLSCREEN);
  return (
    <Stack
      {...props}
      direction="row"
      color="error.main"
      alignItems="center"
      columnGap={1}
    >
      <UnshrinkableIcon size={24} />
      <Typography variant={isFullscreen ? 'body2' : 'caption'}>
        {children}
      </Typography>
    </Stack>
  );
};
