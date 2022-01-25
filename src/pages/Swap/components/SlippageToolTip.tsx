import {
  InfoIcon,
  Tooltip,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

const StyledTooltip = styled(Tooltip)`
  align-items: center;
  display: flex;
  padding: 11px 7px;
`;

export function SlippageToolTip() {
  const theme = useTheme();

  const Content = (
    <VerticalFlex width="280px">
      <Typography size={12}>
        Suggested slippage – your transaction will fail if the price changes
        unfavorably more than this percentage
      </Typography>
    </VerticalFlex>
  );

  return (
    <StyledTooltip content={Content}>
      <InfoIcon height="16px" color={theme.colors.text2} />
    </StyledTooltip>
  );
}
