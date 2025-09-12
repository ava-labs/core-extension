import { Button, styled } from '@avalabs/k2-alpine';

export const NAME_INPUT_HEIGHT = 32;

const NAME_INPUT_STYLES = {
  fontSize: 27,
  fontWeight: 700,
  height: NAME_INPUT_HEIGHT,
  fontFamily: 'Aeonik',
  textAlign: 'center',
} as const;

export const InvisibileInput = styled('input')(({ theme }) => ({
  background: 'transparent',
  border: 0,
  paddingInline: theme.spacing(2),
  lineHeight: 1,
  outline: 'none',
  color: theme.palette.text.primary,
  textOverflow: 'ellipsis',
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  'input[type=number]': {
    '-moz-appearance': 'textfield',
  },
}));

export const InvisibleNameInput = styled(InvisibileInput)(NAME_INPUT_STYLES);

export const InvisibleFieldInput = styled(InvisibileInput)(({ theme }) => ({
  fontSize: 12,
  paddingInline: 0,
  fontFamily: theme.typography.fontFamilyMonospace,
  transition: theme.transitions.create('font-size'),
  '&:focus': {
    fontSize: 14,
  },
  '::placeholder': {
    fontFamily: theme.typography.fontFamily,
  },
  // Hide number input spin buttons
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  '&[type=number]': {
    '-moz-appearance': 'textfield',
  },
}));

export const StyledNameButton = styled(Button)({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
});
