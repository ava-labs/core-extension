import {
  ArrowIcon,
  HorizontalFlex,
  IconDirection,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import {
  erc20PathToken,
  SwapExactTokensForTokenDisplayValues,
} from '@src/contracts/contractParsers/models';
import { TokenImg } from '@src/components/common/TokenImage';
import React from 'react';
import { isAvaxToken } from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useWalletContext } from '@src/contexts/WalletProvider';

export function SwapTx({ path }: SwapExactTokensForTokenDisplayValues) {
  const { currencyFormatter } = useWalletContext();
  const [sentToken] = path;
  const receivingToken = path[path.length - 1];
  return (
    <VerticalFlex>
      <br />
      <HorizontalFlex width={'100%'} justify={'center'}>
        <Typography>Swap</Typography>
      </HorizontalFlex>
      <br />
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
              <TokenImg src={(sentToken as erc20PathToken).logoURI} />
            )}

            <Typography margin={'0 5px'}>
              {sentToken.name} ({sentToken.symbol})
            </Typography>
          </HorizontalFlex>
          <VerticalFlex>
            <Typography>{sentToken.amountIn?.value}</Typography>
            <SubTextTypography>
              {currencyFormatter(Number(sentToken.amountUSDValue))}
            </SubTextTypography>
          </VerticalFlex>
        </HorizontalFlex>

        <HorizontalFlex
          width={'100%'}
          justify={'flex-end'}
          padding={'0 15px 0 0'}
        >
          <ArrowIcon color={'white'} direction={IconDirection.DOWN} />
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
              <TokenImg src={(receivingToken as erc20PathToken).logoURI} />
            )}
            <Typography margin={'0 5px'}>
              {receivingToken.name} ({receivingToken.symbol})
            </Typography>
          </HorizontalFlex>
          <VerticalFlex>
            <Typography>{receivingToken.amountOut?.value}</Typography>
            <SubTextTypography>
              {currencyFormatter(Number(receivingToken.amountUSDValue))}
            </SubTextTypography>
          </VerticalFlex>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
