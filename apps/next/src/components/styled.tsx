import { Divider, dividerClasses, styled } from '@avalabs/k2-alpine';

export const StyledDivider = styled(Divider)(({ theme }) => ({
  [`&.${dividerClasses.inset}`]: {
    marginInlineStart: theme.spacing(5.5),
  },
}));
