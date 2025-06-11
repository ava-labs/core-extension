import QRCode from 'qrcode.react';
import { PropsWithChildren } from 'react';
import { Stack, useTheme } from '@avalabs/core-k2-components';

export function QRCodeWithLogo({
  value,
  size = 182,
  className,
  children,
}: PropsWithChildren<{
  value: string;
  className?: string;
  size?: number;
}>) {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        width: 'fit-content',
        position: 'relative',
        p: 2,
        background: theme.palette.common.white,
        borderRadius: `${theme.shape.borderRadius}px`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={className}
    >
      <QRCode
        renderAs="svg"
        fgColor={theme.palette.common.black}
        bgColor={theme.palette.common.white}
        value={value}
        level="H"
        size={size - 32}
      />
      {children}
    </Stack>
  );
}
