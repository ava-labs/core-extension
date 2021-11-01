import React from 'react';
import { transparentize } from 'polished';
import { ArrowIcon, HorizontalFlex } from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

const IconCircle = styled(HorizontalFlex)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => transparentize(0.8, theme.palette.white)};
  justify-content: center;
  align-items: center;
`;

export function HistorySentIndicator() {
  const theme = useTheme();
  return (
    <IconCircle>
      <ArrowIcon
        height={'40px'}
        color={theme.palette.red['500']}
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
        height={'40px'}
        color={theme.palette.green['500']}
        style={{
          transform: `rotate(140deg)`,
        }}
      />
    </IconCircle>
  );
}
