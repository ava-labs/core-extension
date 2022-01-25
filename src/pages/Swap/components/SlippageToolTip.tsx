import {
  InfoIcon,
  Tooltip,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';

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
    <Tooltip content={Content}>
      <InfoIcon height="16px" color={theme.colors.text2} />
    </Tooltip>
  );
}
