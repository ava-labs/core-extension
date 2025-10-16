import { styled } from '@avalabs/k2-alpine';

export const AmountInput = styled('input')(({ theme }) => ({
  background: 'transparent',
  border: 0,
  paddingInline: theme.spacing(0),
  lineHeight: 1,
  outline: 'none',
  color: theme.palette.text.primary,
  textAlign: 'end',
  textOverflow: 'ellipsis',
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  'input[type=number]': {
    '-moz-appearance': 'textfield',
  },
}));
