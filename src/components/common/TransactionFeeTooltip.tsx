import {
  HorizontalFlex,
  InfoIcon,
  Tooltip,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { BigNumber } from 'ethers';
import Big from 'big.js';
import { bigToLocaleString } from '@avalabs/utils-sdk';

interface TransactionFeeTooltipProps {
  gasLimit?: string | number;
  gasPrice?: BigNumber;
}

const StyledTooltip = styled(Tooltip)`
  align-items: center;
  display: flex;
`;

export function TransactionFeeTooltip({
  gasLimit,
  gasPrice,
}: TransactionFeeTooltipProps) {
  const theme = useTheme();

  if (!gasLimit || !gasPrice) {
    return null;
  }

  const Content = (
    <VerticalFlex width="330px" padding="4px">
      <HorizontalFlex width="100%" justify="space-between" margin="0 0 8px 0">
        <Typography size={12}>Gas Limit</Typography>
        <Typography size={12}>{gasLimit}</Typography>
      </HorizontalFlex>
      <HorizontalFlex width="100%" justify="space-between">
        <Typography size={12}>Gas Price</Typography>
        <Typography size={12}>
          {bigToLocaleString(new Big(gasPrice.toString()).div(10 ** 9), 0)}{' '}
          nAVAX
        </Typography>
      </HorizontalFlex>
    </VerticalFlex>
  );

  return (
    <StyledTooltip content={Content}>
      <InfoIcon height="16px" color={theme.colors.text2} />
    </StyledTooltip>
  );
}
