import { FC } from 'react';
import {
  NetworkContractToken,
  NetworkToken,
  TokenDiffItem,
} from '@avalabs/vm-module-types';
import { Stack, Typography } from '@avalabs/k2-alpine';

import { useConvertedCurrencyFormatter } from '@core/ui';

import * as Styled from './Styled';
import { TokenLogo } from './TokenLogo';

type SingleTokenBalanceChangeProps = {
  token: NetworkToken | NetworkContractToken;
  item: TokenDiffItem;
  direction: 'loss' | 'gain';
};

export const SingleTokenBalanceChange: FC<SingleTokenBalanceChangeProps> = ({
  token,
  item,
  direction,
}) => {
  const currencyFormatter = useConvertedCurrencyFormatter();

  if (!item || !token) {
    return null;
  }

  return (
    <Styled.TokenBalanceChangeWrapper>
      <Stack direction="row" gap={1} alignItems="center" flexShrink={0}>
        <TokenLogo logoUri={token.logoUri} size={36} />
        <Styled.TokenSymbol>{token.symbol}</Styled.TokenSymbol>
      </Stack>
      <Stack
        textAlign="end"
        color={direction === 'loss' ? 'error.main' : 'text.primary'}
        overflow="hidden"
        flexGrow={1}
      >
        <Styled.ResponsiveTokenAmount
          amount={item.displayValue}
          negate={direction === 'loss'}
        />
        {typeof item.usdPrice === 'string' && currencyFormatter && (
          <Typography variant="caption">
            {currencyFormatter(Number(item.usdPrice))}
          </Typography>
        )}
      </Stack>
    </Styled.TokenBalanceChangeWrapper>
  );
};
