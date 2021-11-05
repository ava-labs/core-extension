import {
  ArrowIcon,
  HorizontalFlex,
  SecondaryCard,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import React from 'react';
import styled, { useTheme } from 'styled-components';

interface SendReceiveButtonProps {
  label: string;
  angle: number;
  onClick(): void;
}

const IconCircle = styled(SecondaryCard)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  padding: 0;

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.bg3}CC`};
  }
`;

export function SendReceiveButton({
  label,
  angle,
  onClick,
}: SendReceiveButtonProps) {
  const theme = useTheme();
  return (
    <TextButton margin={'0 12px'} onClick={() => onClick()}>
      <VerticalFlex>
        <IconCircle>
          <ArrowIcon
            height={'40px'}
            color={theme.colors.icon1}
            style={{
              transform: `rotate(${angle}deg)`,
            }}
          />
        </IconCircle>
        <Typography margin="8px 0 0" size={12} weight={600}>
          {label}
        </Typography>
      </VerticalFlex>
    </TextButton>
  );
}
