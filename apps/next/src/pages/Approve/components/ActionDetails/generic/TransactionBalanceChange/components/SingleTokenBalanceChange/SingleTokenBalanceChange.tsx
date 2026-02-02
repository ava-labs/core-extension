import { Stack } from '@avalabs/k2-alpine';
import {
  NetworkContractToken,
  NetworkToken,
  TokenDiffItem,
} from '@avalabs/vm-module-types';
import { FC } from 'react';

import { TokenLogo } from '../TokenLogo';
import { NoBalanceChange, TokenBalanceChange } from './components';

import * as Styled from '../Styled';

type SingleTokenBalanceChangeProps = {
  token: NetworkToken | NetworkContractToken;
  item: TokenDiffItem | undefined;
  direction: 'loss' | 'gain';
};

export const SingleTokenBalanceChange: FC<SingleTokenBalanceChangeProps> = ({
  token,
  item,
  direction,
}) => {
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
        {item ? (
          <TokenBalanceChange diffItem={item} direction={direction} />
        ) : (
          <NoBalanceChange />
        )}
      </Stack>
    </Styled.TokenBalanceChangeWrapper>
  );
};
