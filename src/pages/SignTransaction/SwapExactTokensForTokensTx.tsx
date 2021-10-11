import {
  Arrow,
  HorizontalFlex,
  IconDirection,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { SwapExactTokensForTokenDisplayValues } from '@src/abi/contractParsers/models';
import { TokenImg } from '@src/components/common/TokenImage';
import React from 'react';

export function SwapExactTokensForTokenTx({
  fee,
  feeUSD,
  path,
}: SwapExactTokensForTokenDisplayValues) {
  const [sentToken] = path;
  const receivingToken = path[path.length - 1];
  return (
    <VerticalFlex>
      {/* <VerticalFlex>
        <HorizontalFlex width={'100%'} justify={'space-between'}>
          <Typography>from:</Typography>
          <Typography>{truncateAddress(fromAddress)}</Typography>
        </HorizontalFlex>
        <br />
        <HorizontalFlex width={'100%'} justify={'space-between'}>
          <Typography>to:</Typography>
          <Typography>{truncateAddress(toAddress)}</Typography>
        </HorizontalFlex>
      </VerticalFlex> */}
      <br />
      <VerticalFlex>
        <HorizontalFlex
          align={'center'}
          justify={'space-between'}
          width={'100%'}
        >
          <HorizontalFlex align={'center'}>
            <TokenImg src={sentToken.logoURI} />
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
            <TokenImg src={receivingToken.logoURI} />
            <Typography margin={'0 5px'}>
              {receivingToken.name} ({receivingToken.symbol})
            </Typography>
          </HorizontalFlex>
          <Typography>{receivingToken.amountOut?.value}</Typography>
        </HorizontalFlex>
        <br />
        <br />
        <br />
        <VerticalFlex width={'100%'} align={'center'}>
          <Typography>Fee</Typography>
          <br />
          <Typography> {fee} (AVAX)</Typography>
          <SubTextTypography>${feeUSD}</SubTextTypography>
        </VerticalFlex>
        {/* <br />
        <HorizontalFlex width={'100%'} justify={'space-between'}>
          <Typography>gas price:</Typography>
          <Typography> {gasPrice.value}</Typography>
        </HorizontalFlex>
        <br />
        <HorizontalFlex width={'100%'} justify={'space-between'}>
          <Typography>gas limit:</Typography>
          <Typography> {gasLimit}</Typography>
        </HorizontalFlex> */}
        {/* <br />
        <HorizontalFlex width={'100%'} justify={'space-between'}>
          <Typography>total (avax): </Typography>
          <Typography>{total}</Typography>
        </HorizontalFlex> */}
      </VerticalFlex>
    </VerticalFlex>
  );
}
