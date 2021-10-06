import React from 'react';
import { VerticalFlex } from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import QRCode from 'qrcode.react';
import { QRCodeLogo } from '../icons/QRCodeLogo';

const StyledQRCodeLogo = styled(QRCodeLogo)`
  position: absolute;
`;

export function QRCodeWithLogo({
  value,
  className,
  logoText,
}: {
  value: string;
  className?: string;
  logoText?: string;
}) {
  const theme = useTheme();
  return (
    <VerticalFlex
      padding="12px"
      background={theme.colors.bg1}
      radius="4px"
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
        size={200}
      />
      {logoText && <StyledQRCodeLogo text={logoText} />}
    </VerticalFlex>
  );
}
