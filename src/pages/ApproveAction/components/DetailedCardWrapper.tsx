import type { PropsWithChildren } from 'react';
import { Card, Stack } from '@avalabs/core-k2-components';

export const DetailedCardWrapper = ({
  onClick,
  children,
  isFirst,
  isLast,
}: PropsWithChildren<{
  onClick?: () => void;
  isLast: boolean;
  isFirst: boolean;
}>) => {
  return (
    <Card
      sx={{
        display: 'flex',
        width: 320,
        flex: '0 0 auto',
        backgroundColor: 'grey.850',
        ml: isFirst ? 3.5 : 0,
        mr: isLast ? 3.5 : 0,
        position: 'relative',
      }}
    >
      <Stack
        sx={{
          width: 1,
          flexGrow: 1,
          backgroundColor: '#00000000', // background completely transparent
          transition: 'background-color .15s ease-in-out',
          ':hover': onClick
            ? { backgroundColor: '#ffffff19', cursor: 'pointer' }
            : undefined, // a bit ligher background on hover if clickable
        }}
        role={onClick ? 'button' : undefined}
        onClick={onClick}
      >
        {children}
      </Stack>
    </Card>
  );
};
