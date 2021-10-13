import React from 'react';
import {
  HorizontalFlex,
  InfoIcon,
  Tooltip,
  Typography,
  VerticalFlex,
  SecondaryCard,
} from '@avalabs/react-components';
import BN from 'bn.js';
import styled, { useTheme } from 'styled-components';
import { Utils } from '@avalabs/avalanche-wallet-sdk';

interface TransactionFeeTooltipProps {
  gasLimit?: number;
  gasPrice?: BN;
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
    <SecondaryCard width="343px" padding="16px">
      <VerticalFlex width="100%">
        <HorizontalFlex width="100%" justify="space-between" margin="0 0 8px 0">
          <Typography size={12}>Gas Limit</Typography>
          <Typography size={12}>{gasLimit}</Typography>
        </HorizontalFlex>
        <HorizontalFlex width="100%" justify="space-between">
          <Typography size={12}>Gas Price</Typography>
          <Typography size={12}>
            {Utils.bnToLocaleString(new BN(gasPrice, 16), 9)} nAVAX
          </Typography>
        </HorizontalFlex>
      </VerticalFlex>
    </SecondaryCard>
  );

  return (
    <StyledTooltip content={Content} coords={{ top: '24px', right: '0px' }}>
      <InfoIcon height="16px" color={theme.colors.text2} />
    </StyledTooltip>
  );
}
