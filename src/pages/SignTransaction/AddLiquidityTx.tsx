import {
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { isAvaxToken } from '@avalabs/wallet-react-components';
import { TokenImg } from '@src/components/common/TokenImage';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import {
  AddLiquidityDisplayData,
  erc20PathToken,
} from '@src/contracts/contractParsers/models';
import React from 'react';

export function AddLiquidityTx({ poolTokens }: AddLiquidityDisplayData) {
  const { currencyFormatter } = useSettingsContext();
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
                <TokenImg src={(token as erc20PathToken).logoURI} />
              )}
            </HorizontalFlex>
            <VerticalFlex>
              <Typography margin={'0 0 4px 0'}>
                {token.name} {token.symbol}
              </Typography>
              <HorizontalFlex>
                <SubTextTypography>Depositing:</SubTextTypography>
                <VerticalFlex>
                  <Typography>{token.amountDepositedDisplayValue}</Typography>
                  <SubTextTypography>
                    {currencyFormatter(Number(token.amountUSDValue))}
                  </SubTextTypography>
                </VerticalFlex>
              </HorizontalFlex>
            </VerticalFlex>
          </HorizontalFlex>
        </HorizontalFlex>
      ))}
    </VerticalFlex>
  );
}
