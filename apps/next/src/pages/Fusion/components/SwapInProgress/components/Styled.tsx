import {
  Divider as K2Divider,
  LinearProgress,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';

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

export const Divider = styled(K2Divider)(({ theme }) => ({
  marginInline: theme.spacing(1.5),
}));

type StatusDetailRowProps = {
  label: string;
  children: React.ReactNode;
};
export const StatusDetailRow = ({ label, children }: StatusDetailRowProps) => (
  <Stack
    width="100%"
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    gap={1}
    px={1.5}
    py={1}
  >
    <Typography variant="body3" color="text.primary">
      {label}
    </Typography>

    <Stack direction="row" alignItems="center" gap={1}>
      {children}
    </Stack>
  </Stack>
);
