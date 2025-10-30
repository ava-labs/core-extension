import { LinearProgress, Stack, styled } from '@avalabs/k2-alpine';

export * from '../../Styled';

export const RowItem = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingBlock: theme.spacing(1),
  paddingInline: theme.spacing(2),
}));

export const ProgressItem = styled(LinearProgress)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  flexBasis: '100%',
  marginBlockEnd: theme.spacing(0.5),
}));

export const NetworkLogo = styled('img')({
  width: 24,
  height: 24,
  position: 'absolute',
  bottom: 0,
  right: 0,
  transform: 'translateY(50%)',
});
