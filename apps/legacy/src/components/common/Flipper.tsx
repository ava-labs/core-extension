import { Box, BoxProps, IconBaseProps } from '@avalabs/core-k2-components';
import { cloneElement } from 'react';

type IconProps = IconBaseProps & { sx?: BoxProps['sx'] };
type FlipperProps = {
  size: number;
  isFlipped: boolean;
  children: [React.ReactElement<IconProps>, React.ReactElement<IconProps>];
};

export const Flipper = ({ children, size, isFlipped }: FlipperProps) => {
  if (children.length !== 2) {
    throw new Error('Flipper expects 2 icons as children');
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        backgroundColor: 'inherit',
        transform: isFlipped ? 'rotateX(0)' : 'rotateX(180deg)',
        transition: 'transform .2s ease-in-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {cloneElement(children[0], {
        size,
        sx: {
          backgroundColor: 'inherit',
          transform: 'rotateX(180deg)',
          position: 'absolute',
          backfaceVisibility: 'hidden',
          zIndex: -1,
        },
      })}

      {cloneElement(children[1], {
        size,
        sx: {
          background: 'inherit',
          position: 'absolute',
          backfaceVisibility: 'hidden',
          zIndex: 1,
        },
      })}
    </Box>
  );
};
