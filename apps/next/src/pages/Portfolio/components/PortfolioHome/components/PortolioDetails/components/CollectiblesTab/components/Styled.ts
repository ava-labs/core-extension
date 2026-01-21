import { Divider, styled } from '@avalabs/k2-alpine';

export const NetworkDivider = styled(Divider)(({ theme }) => ({
  marginBlock: theme.spacing(1.5),
  marginLeft: theme.spacing(-1.5),
  marginRight: theme.spacing(-1.5),
}));
