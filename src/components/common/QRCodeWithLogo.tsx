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
      padding="10px"
      background={theme.colors.grey[800]}
      radius="4px"
      className={className}
      align="center"
      justify="center"
    >
      <QRCode
        renderAs="svg"
        fgColor={theme.colors.text}
        bgColor={theme.colors.grey[800]}
        value={value}
        level="H"
      />
      {logoText && <StyledQRCodeLogo text={logoText} />}
    </VerticalFlex>
  );
}
