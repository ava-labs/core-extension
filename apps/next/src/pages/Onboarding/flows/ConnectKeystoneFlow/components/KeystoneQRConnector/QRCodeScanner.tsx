import { ComponentProps, FC } from 'react';
import { Stack, StackProps, styled } from '@avalabs/k2-alpine';
import { AnimatedQRScanner, Purpose, URType } from '@keystonehq/animated-qr';

const CameraFeedWrapper = styled(Stack)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.shape.largeBorderRadius,
  overflow: 'hidden',
  width: '100%',
  height: '100%',
}));

type QRCodeScannerProps = ComponentProps<typeof AnimatedQRScanner> & {
  wrapperProps?: StackProps;
};

export const QRCodeScanner: FC<QRCodeScannerProps> = ({
  wrapperProps,
  options = {
    width: '100%',
    height: '100%',
  },
  purpose = Purpose.SYNC,
  urTypes = [URType.CRYPTO_MULTI_ACCOUNTS],
  ...scannerProps
}) => (
  <CameraFeedWrapper>
    <AnimatedQRScanner
      purpose={purpose}
      urTypes={urTypes}
      options={options}
      {...scannerProps}
    />
  </CameraFeedWrapper>
);
