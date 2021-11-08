import React from 'react';
import { ArrowIcon, HorizontalFlex } from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

const IconCircle = styled(HorizontalFlex)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.bg3};
  justify-content: center;
  align-items: center;
`;

export function HistorySentIndicator() {
  const theme = useTheme();
  return (
    <IconCircle>
      <ArrowIcon
        height="16px"
        color={theme.colors.primary1}
        style={{
          transform: `rotate(-45deg)`,
        }}
      />
    </IconCircle>
  );
}

export function HistoryReceivedIndicator() {
  const theme = useTheme();
  return (
    <IconCircle>
      <ArrowIcon
        height="16px"
        color={theme.colors.success}
        style={{
          transform: `rotate(135deg)`,
        }}
      />
    </IconCircle>
  );
}
