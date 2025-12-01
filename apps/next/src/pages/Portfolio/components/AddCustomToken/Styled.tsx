import {
  Avatar as K2Avatar,
  OutlinedInput,
  TextField as K2TextField,
  outlinedInputClasses,
  styled,
} from '@avalabs/k2-alpine';

export const TokenAddressInput = styled(OutlinedInput)(({ theme }) => ({
  backgroundColor: theme.palette.surface.primary,
  paddingTop: theme.spacing(4),
  ...theme.typography.mono2,
  fontSize: '11px !important',
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    border: 'none',
  },
}));

export const TextField = styled(K2TextField)({
  '& .MuiInputLabel-root': {
    fontSize: '11px',
    color: 'text.secondary',
    transform: 'translate(14px, 10px) scale(1)',
    '&.Mui-focused': {
      color: 'text.secondary',
    },
  },
});

export const Avatar = styled(K2Avatar)({
  width: 20,
  height: 20,
  backgroundColor: 'transparent',
});
