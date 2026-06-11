import { getHexAlpha, Stack, styled } from '@avalabs/k2-alpine';

// Small pill-styled number input. Matches the soft surface treatment of the
// frequency-unit dropdown so the two controls feel like one row.
export const InputPill = styled('input')(({ theme }) => ({
  appearance: 'textfield',
  background: theme.palette.surface.secondary,
  border: 'none',
  outline: 'none',
  borderRadius: theme.shape.borderRadius,
  paddingInline: theme.spacing(1),
  paddingBlock: theme.spacing(0.5),
  fontFamily: 'inherit',
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.text.primary,
  textAlign: 'right',
  // Hide native number-input spin buttons cross-browser.
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '&[type=number]': {
    MozAppearance: 'textfield',
  },
  // Keyboard-only focus ring with a soft, low-contrast outline; mouse clicks
  // don't trigger this, so the input stays visually quiet during typical use.
  '&:focus-visible': {
    boxShadow: `0 0 0 1px ${getHexAlpha(theme.palette.primary.main, 40)}`,
  },
}));

// Rounded info banner used by `RecurringRateNotice` (and reusable for any
// future recurring-swap inline notices that follow the same template).
export const NoticeContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingInline: theme.spacing(1.5),
  paddingBlock: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.surface.secondary,
  color: theme.palette.text.secondary,
}));

export const NoticeIconWrapper = styled(Stack)({
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
  flexShrink: 0,
});
