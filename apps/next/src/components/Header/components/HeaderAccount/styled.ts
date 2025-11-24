import { styled, Typography } from '@avalabs/k2-alpine';
const HOVER_EXPANSION = 20;

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  width: '128px',
  minWidth: 0,
  overflow: 'visible',
}));

export const WalletSectionContainer = styled('div')<{
  showIcon: boolean;
  shouldTruncate: boolean;
  maxWidth?: number;
  shouldExpand: boolean;
}>(({ theme, showIcon, shouldTruncate, maxWidth, shouldExpand }) => {
  // Determine maxWidth based on display mode
  let computedMaxWidth = 'none';
  if (!showIcon && shouldTruncate) {
    if (maxWidth) {
      const expandedWidth = maxWidth + (shouldExpand ? HOVER_EXPANSION : 0);
      computedMaxWidth = `${expandedWidth}px`;
    } else {
      computedMaxWidth = '45%'; // Fallback
    }
  }

  return {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    width: 'fit-content',
    maxWidth: computedMaxWidth,
    flexShrink: shouldTruncate ? 1 : 0,
    flexGrow: 0,
    cursor: 'pointer',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'visible',
    transition: theme.transitions.create(['max-width'], {
      duration: theme.transitions.duration.short,
    }),
  };
});

// Tooltip showing wallet balance, fixed to top of screen
export const BalanceTooltip = styled('div')<{
  isVisible: boolean;
  leftPosition: number;
}>(({ theme, isVisible, leftPosition }) => ({
  position: 'fixed',
  top: 0,
  left: `${leftPosition - 6}px`,
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1.5),
  backgroundColor: theme.palette.grey[700],
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  fontSize: '10px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  opacity: isVisible ? 1 : 0,
  pointerEvents: isVisible ? 'auto' : 'none',
  transition: theme.transitions.create(['opacity'], {
    duration: theme.transitions.duration.shorter,
  }),
  zIndex: theme.zIndex.tooltip,
  boxShadow: theme.shadows[4],
}));

export const IconWrapper = styled('div')<{ shouldShift: boolean }>(
  ({ theme, shouldShift }) => ({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    transition: theme.transitions.create(['transform'], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }),
    transform: shouldShift ? 'translateX(8px)' : 'translateX(0)',
  }),
);

export const AccountSectionContainer = styled('div')<{ shouldShift: boolean }>(
  ({ theme, shouldShift }) => ({
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
    cursor: 'pointer',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'visible',
    transition: theme.transitions.create(['transform'], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }),
    transform: shouldShift ? 'translateX(8px)' : 'translateX(0)',
  }),
);

// Small label shown below sections on hover
export const Label = styled(Typography)(({ theme }) => ({
  fontSize: '10px',
  opacity: 0.6,
  position: 'absolute',
  top: '100%',
  left: 0,
  whiteSpace: 'nowrap',
  marginTop: theme.spacing(0.25),
  zIndex: 10,
}));
