import { Typography } from '@avalabs/k2-alpine';
import { useConvertedCurrencyFormatter } from '@core/ui';
import { FC } from 'react';

import { TokenDiffItem } from '@avalabs/vm-module-types';
import { ResponsiveTokenAmount } from '../../Styled';

type TokenBalanceChangeProps = {
  diffItem: TokenDiffItem;
  direction: 'loss' | 'gain';
};

export const TokenBalanceChange: FC<TokenBalanceChangeProps> = ({
  diffItem,
  direction,
}) => {
  const currencyFormatter = useConvertedCurrencyFormatter();
  const { displayValue, usdPrice } = diffItem;
  return (
    <>
      <ResponsiveTokenAmount
        amount={displayValue}
        negate={direction === 'loss'}
      />
      {typeof usdPrice === 'string' && currencyFormatter && (
        <Typography variant="caption">
          {currencyFormatter(Number(usdPrice))}
        </Typography>
      )}
    </>
  );
};
