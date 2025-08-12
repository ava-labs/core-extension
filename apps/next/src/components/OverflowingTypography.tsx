import {
  styled,
  Tooltip,
  TooltipProps,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { useCallback, useState } from 'react';

const slotProps: TooltipProps['slotProps'] = {
  popper: {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, -10],
        },
      },
    ],
  },
};

export const OverflowingTypography = ({
  children,
  ...props
}: TypographyProps) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const onTypographyMounted = useCallback(
    (node: HTMLSpanElement) => {
      if (node) {
        setIsOverflowing(node.scrollWidth > node.offsetWidth);
      }
    },
    // We want to re-run the callback when the children change
    // so the tooltip hides if it's not necessary anymore.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children],
  );

  return (
    <Tooltip
      title={isOverflowing ? children : ''}
      slotProps={slotProps}
      disableInteractive
      arrow
    >
      <StyledTypography ref={onTypographyMounted} {...props}>
        {children}
      </StyledTypography>
    </Tooltip>
  );
};

const StyledTypography = styled(Typography)({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});
