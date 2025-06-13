import {
  dividerClasses,
  Divider as K2Divider,
  menuItemClasses,
  styled,
} from '@avalabs/k2-alpine';

export const Divider = styled(K2Divider)({
  [`.${menuItemClasses.root}+&.${dividerClasses.root}`]: {
    marginBlock: 0,
  },

  [`&.${dividerClasses.inset}`]: {
    marginInlineStart: 52,
  },

  ['&:last-child']: {
    display: 'none',
  },
}) as typeof K2Divider;
