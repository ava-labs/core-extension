import React from 'react';
import {
  Card,
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { getAvaxBalanceTotal, getAvaxBalanceUSD } from './utils/balanceHelpers';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { BeadIcon } from '@src/components/icons/BeadIcon';

export function WalletHomeBalances() {
  const { balances, avaxPrice } = useWalletContext();
  return (
    <Card>
      <HorizontalFlex justify={'space-between'} align={'center'} width={'100%'}>
        <VerticalFlex flex={2}>
          <SubTextTypography margin={'0 0 5px 0'}>Balance</SubTextTypography>
          <Typography size={36}>
            $
            {parseFloat(
              getAvaxBalanceUSD(balances.balanceAvaxTotal, avaxPrice)
            ).toFixed(3)}{' '}
            USD
          </Typography>
        </VerticalFlex>

        <VerticalFlex flex={1}>
          <Typography size={14} margin={'0 0 10px 0'}>
            Asset Allocation
          </Typography>
          <HorizontalFlex align={'center'}>
            <BeadIcon />
            <Typography margin={'0 0 0 5px'} size={14}>
              {parseFloat(
                getAvaxBalanceTotal(balances.balanceAvaxTotal)
              ).toFixed(3)}{' '}
              AVAX
            </Typography>
          </HorizontalFlex>
        </VerticalFlex>
        <HorizontalFlex flex={1}>
          <svg
            width="87"
            height="87"
            viewBox="0 0 87 87"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.45362 58.0102C2.86871 48.8568 2.79947 38.7003 6.25927 29.4988C9.71907 20.2974 16.4629 12.7026 25.1905 8.17879C33.9182 3.65496 44.0116 2.52243 53.5248 4.99955C63.038 7.47667 71.2973 13.388 76.7102 21.5939"
              stroke="#FFA425"
              strokeWidth="6.12087"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M74.918 67.908C71.1179 72.7995 66.2281 76.7362 60.638 79.4046C55.0479 82.0729 48.9121 83.3991 42.719 83.2776C36.5259 83.1561 30.4468 81.5902 24.9657 78.7047C19.4846 75.8192 14.753 71.6937 11.1476 66.6568"
              stroke="#F21B91"
              strokeWidth="6.12087"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M81.3947 31.3805C84.2605 40.3411 83.8583 50.0273 80.2595 58.7194"
              stroke="#53C26E"
              strokeWidth="6.12087"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </HorizontalFlex>
      </HorizontalFlex>
    </Card>
  );
}
