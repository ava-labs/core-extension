import React from 'react';
import { transparentize } from 'polished';
import { ArrowIcon, HorizontalFlex } from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

const IconCircle = styled(HorizontalFlex)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => transparentize(0.9, theme.colors.text2)};
  justify-content: center;
  align-items: center;
`;

export function HistorySentIndicator() {
  const theme = useTheme();
  return (
    <IconCircle>
      <ArrowIcon
        height={'30px'}
        color={theme.colors.primary1}
        style={{
          transform: `rotate(320deg)`,
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
        height={'30px'}
        color={theme.colors.success}
        style={{
          transform: `rotate(140deg)`,
        }}
      />
    </IconCircle>
  );
}
