import { LinearProgress, Stack, styled } from '@avalabs/k2-alpine';

export * from '../../Styled';

export const RowItem = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingBlock: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
}));

export const ProgressItem = styled(LinearProgress)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
}));
