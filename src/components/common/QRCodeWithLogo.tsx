import { VerticalFlex } from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import QRCode from 'qrcode.react';
import { PropsWithChildren } from 'react';

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
    <VerticalFlex
      width="fit-content"
      position="relative"
      padding="16px"
      background={theme.colors.icon1}
      radius={theme.borderRadius}
      className={className}
      align="center"
      justify="center"
    >
      <QRCode
        renderAs="svg"
        fgColor={theme.colors.bg1}
        bgColor={theme.colors.icon1}
        value={value}
        level="H"
        size={size - 32}
      />
      {children}
    </VerticalFlex>
  );
}
