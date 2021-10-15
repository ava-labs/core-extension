import {
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { isAvaxToken } from '@avalabs/wallet-react-components';
import { TokenImg } from '@src/components/common/TokenImage';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { AddLiquidityDisplayData } from '@src/contracts/contractParsers/models';
import React from 'react';

export function AddLiquidityTx({ poolTokens }: AddLiquidityDisplayData) {
  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <Typography>Adding Liquidity to pool</Typography>
      <br />
      <br />
      {poolTokens.map((token) => (
        <HorizontalFlex
          key={token.symbol}
          align={'center'}
          justify={'space-between'}
          margin={'10px 0'}
        >
          <HorizontalFlex align={'center'}>
            <HorizontalFlex margin={'0 8px 0 0'}>
              {isAvaxToken(token) ? (
                <AvaxTokenIcon />
              ) : (
                <TokenImg src={token.logoURI} />
              )}
            </HorizontalFlex>
            <VerticalFlex>
              <Typography margin={'0 0 4px 0'}>
                {token.name} {token.symbol}
              </Typography>
              <Typography>
                <SubTextTypography>Depositing:</SubTextTypography>{' '}
                {token.amountDepositedDisplayValue}
              </Typography>
            </VerticalFlex>
          </HorizontalFlex>
        </HorizontalFlex>
      ))}
    </VerticalFlex>
  );
}
