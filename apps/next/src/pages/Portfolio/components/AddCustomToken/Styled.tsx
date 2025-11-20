import {
  Avatar as K2Avatar,
  OutlinedInput,
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

export const Avatar = styled(K2Avatar)({
  width: 20,
  height: 20,
  backgroundColor: 'transparent',
});
