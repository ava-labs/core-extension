import { ArrowIcon, HorizontalFlex } from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

const IconCircle = styled(HorizontalFlex)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
`;

export function HistorySentIndicator() {
  const theme = useTheme();
  return (
    <IconCircle background={`${theme.colors.primary1}1A`}>
      <ArrowIcon
        height="14px"
        color={theme.palette.primary[900]}
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
    <IconCircle background={`${theme.colors.success}1A`}>
      <ArrowIcon
        height="14px"
        color={theme.colors.icon3}
        style={{
          transform: `rotate(135deg)`,
        }}
      />
    </IconCircle>
  );
}
