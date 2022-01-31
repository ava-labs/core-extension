import {
  Card,
  GridContainer,
  GridContainerItems,
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { BeadIcon } from '@src/components/icons/BeadIcon';
import { GraphRingIcon } from '@src/components/icons/GraphRingIcon';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useMemo } from 'react';
import { useTheme } from 'styled-components';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';

export function WalletBalances() {
  const tokensWBalances = useTokensWithBalances();
  const { currency, currencyFormatter } = useSettingsContext();
  const balanceTotalUSD = useBalanceTotalInCurrency();
  const theme = useTheme();

  const top5Tokens = useMemo(() => {
    const tokenColors = [
      theme.palette.pink['500'],
      theme.palette.green['500'],
      theme.palette.orange['500'],
      theme.palette.turquoise['500'],
      '#2196F3', // blue 500
    ];

    return tokensWBalances
      .sort((tokenA: any, tokenB: any) =>
        (tokenA.balance as BN).gt(tokenB.balance as BN) ? 1 : -1
      )
      .slice(0, 5)
      .map((token, idx) => {
        return { ...token, color: tokenColors[idx] };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensWBalances]);

  return (
    <Card>
      <HorizontalFlex justify={'space-between'} align={'center'} width={'100%'}>
        <VerticalFlex flex={2}>
          <SubTextTypography margin={'0 0 5px 0'}>Balance</SubTextTypography>
          <Typography size={36}>
            {balanceTotalUSD !== null &&
              `~${currencyFormatter(balanceTotalUSD)} ${currency}`}
          </Typography>
        </VerticalFlex>
        {tokensWBalances?.length ? (
          <HorizontalFlex flex={2}>
            <VerticalFlex flex={1}>
              <Typography size={14} margin={'0 0 10px 0'}>
                Asset Allocation
              </Typography>
              <HorizontalFlex align={'center'}>
                <GridContainer
                  columnGap={0}
                  columns={2}
                  rowGap={0}
                  padding={'0 0 0 0'}
                >
                  <GridContainerItems>
                    {top5Tokens.map((token) => (
                      <HorizontalFlex key={token.symbol}>
                        <BeadIcon color={token.color} height={'12px'} />
                        <Typography margin={'0 0 0 5px'} size={14}>
                          {token?.balanceDisplayValue} {token.symbol}
                        </Typography>
                      </HorizontalFlex>
                    ))}
                  </GridContainerItems>
                </GridContainer>
              </HorizontalFlex>
            </VerticalFlex>
            <HorizontalFlex flex={1} justify={'center'} align={'center'}>
              <GraphRingIcon />
            </HorizontalFlex>
          </HorizontalFlex>
        ) : (
          ''
        )}
      </HorizontalFlex>
    </Card>
  );
}
