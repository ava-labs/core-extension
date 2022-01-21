import { VerticalFlex } from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import QRCode from 'qrcode.react';
import { QRCodeLogo } from '../icons/QRCodeLogo';

const StyledQRCodeLogo = styled(QRCodeLogo)`
  position: absolute;
`;

export function QRCodeWithLogo({
  value,
  size = 182,
  className,
  logoText,
}: {
  value: string;
  className?: string;
  logoText?: string;
  size?: number;
}) {
  const theme = useTheme();
  return (
    <VerticalFlex
      position="relative"
      padding={`${Math.ceil(size * 0.06)}px`}
      background={theme.colors.bg1}
      radius={theme.borderRadius}
      className={className}
      align="center"
      justify="center"
    >
      <QRCode
        renderAs="svg"
        fgColor={theme.colors.icon1}
        bgColor={theme.colors.bg1}
        value={value}
        level="H"
        size={size}
      />
      {logoText && <StyledQRCodeLogo text={logoText} size={size / 2} />}
    </VerticalFlex>
  );
}
