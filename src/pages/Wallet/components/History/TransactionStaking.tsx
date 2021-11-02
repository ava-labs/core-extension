import React from 'react';
import {
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TransactionStaking } from '@avalabs/wallet-react-components';

export function TransactionStaking({ item }: { item: TransactionStaking }) {
  return (
    <HorizontalFlex width={'100'} justify={'space-between'}>
      <Typography>{item.type}</Typography>
      <VerticalFlex>
        <SubTextTypography>Stake Amount</SubTextTypography>
        <Typography>{item.amountDisplayValue} AVAX</Typography>
        {item.isRewarded && (
          <>
            <SubTextTypography>Reward Amount</SubTextTypography>
            <Typography>{item.rewardAmountDisplayValue} AVAX</Typography>
          </>
        )}
      </VerticalFlex>
      <a href={item.explorerLink}>Link</a>
    </HorizontalFlex>
  );
}
