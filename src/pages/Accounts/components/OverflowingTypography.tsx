import type { TypographyProps } from '@avalabs/core-k2-components';
import { Tooltip, Typography } from '@avalabs/core-k2-components';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

type OverflowingTypographyProps = Omit<TypographyProps, 'children'> & {
  children?: ReactNode;
  disableInteractive?: boolean;
};

export const OverflowingTypography = ({
  children,
  disableInteractive,
  sx,
  ...props
}: OverflowingTypographyProps) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const onTypographyMounted = useCallback((node: HTMLSpanElement) => {
    if (node) {
      setIsOverflowing(node.scrollWidth > node.offsetWidth);
    }
  }, []);

  return (
    <Tooltip
      title={isOverflowing ? children : ''}
      placement="top"
      wrapWithSpan={false}
      disableInteractive={disableInteractive ?? true}
    >
      <Typography
        ref={onTypographyMounted}
        {...props}
        sx={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          ...sx,
        }}
      >
        {children}
      </Typography>
    </Tooltip>
  );
};
