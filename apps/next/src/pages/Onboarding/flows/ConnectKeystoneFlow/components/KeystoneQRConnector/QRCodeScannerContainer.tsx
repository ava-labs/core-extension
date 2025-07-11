import { Stack, styled } from '@avalabs/k2-alpine';

export const QRCodeScannerContainer = styled(Stack)(({ theme }) => ({
  borderRadius: theme.shape.largeBorderRadius,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: 1,
  backgroundColor: theme.palette.common.black,
  maxHeight: 340,
}));
