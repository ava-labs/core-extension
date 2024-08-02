import React, { ForwardedRef, forwardRef } from 'react';
import { positionValues } from 'react-custom-scrollbars-2';
import { Card, Scrollbars, useTheme } from '@avalabs/core-k2-components';

type Props = {
  scrollUpdateHandler: (values: positionValues) => void;
  children: React.ReactElement | React.ReactElement[] | null;
};

export const ScrollableMessageCard = forwardRef(function ScrollableMessageCard(
  { children, scrollUpdateHandler }: Props,
  ref: ForwardedRef<HTMLDivElement | null>
) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: 250,
        pt: 2,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 1,
          bottom: 0,
          height: '20px',
          backgroundImage: `linear-gradient(0deg, ${theme.palette.background.paper}, transparent)`,
        },
      }}
    >
      <Scrollbars
        style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
        onUpdate={scrollUpdateHandler}
      >
        {children}
        {/* to give space below the shadow gradient */}
        <div style={{ height: '20px' }} />
        <div ref={ref} style={{ height: '1px' }} />
      </Scrollbars>
    </Card>
  );
});
