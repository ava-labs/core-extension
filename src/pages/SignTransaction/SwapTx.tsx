import {
  Arrow,
  HorizontalFlex,
  IconDirection,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { SwapExactTokensForTokenDisplayValues } from '@src/contracts/contractParsers/models';
import { TokenImg } from '@src/components/common/TokenImage';
import React from 'react';
import { isAvaxToken } from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';

export function SwapTx({ path }: SwapExactTokensForTokenDisplayValues) {
  const [sentToken] = path;
  const receivingToken = path[path.length - 1];
  return (
    <VerticalFlex>
      <br />
      <VerticalFlex>
        <HorizontalFlex
          align={'center'}
          justify={'space-between'}
          width={'100%'}
        >
          <HorizontalFlex align={'center'}>
            {isAvaxToken(sentToken) ? (
              <AvaxTokenIcon />
            ) : (
              <TokenImg src={sentToken.logoURI} />
            )}

            <Typography margin={'0 5px'}>
              {sentToken.name} ({sentToken.symbol})
            </Typography>
          </HorizontalFlex>
          <Typography>{sentToken.amountIn?.value}</Typography>
        </HorizontalFlex>

        <HorizontalFlex
          width={'100%'}
          justify={'flex-end'}
          padding={'0 15px 0 0'}
        >
          <Arrow color={'white'} direction={IconDirection.DOWN} />
        </HorizontalFlex>

        <HorizontalFlex
          align={'center'}
          justify={'space-between'}
          width={'100%'}
        >
          <HorizontalFlex align={'center'}>
            {isAvaxToken(receivingToken) ? (
              <AvaxTokenIcon />
            ) : (
              <TokenImg src={receivingToken.logoURI} />
            )}
            <Typography margin={'0 5px'}>
              {receivingToken.name} ({receivingToken.symbol})
            </Typography>
          </HorizontalFlex>
          <Typography>{receivingToken.amountOut?.value}</Typography>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
