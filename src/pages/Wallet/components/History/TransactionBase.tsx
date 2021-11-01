import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import React from 'react';
import { TransactionBase } from '@avalabs/wallet-react-components';

export function TransactionBase({ item }: { item: TransactionBase }) {
  return (
    <HorizontalFlex width={'100%'} justify={'space-between'}>
      <Typography>AVM Tx</Typography>
      <VerticalFlex>
        {item.tokens.map((token) => {
          return (
            <Typography key={token.asset.assetID}>
              {token.amountDisplayValue} {token.asset.symbol}
            </Typography>
          );
        })}
      </VerticalFlex>
      <a target="blank" href={item.explorerLink}>
        Link
      </a>
    </HorizontalFlex>
  );
}
