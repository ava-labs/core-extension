import React from 'react';
import { VerticalFlex } from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import QRCode from 'qrcode.react';

export function StyledQRCode({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const theme = useTheme();
  return (
    <VerticalFlex
      padding="10px"
      background={theme.colors.grey[800]}
      radius="4px"
      className={className}
    >
      <QRCode
        renderAs="svg"
        fgColor={theme.colors.text}
        bgColor={theme.colors.grey[800]}
        value={value}
      />
    </VerticalFlex>
  );
}
