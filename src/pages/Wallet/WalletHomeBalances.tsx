import React from 'react';
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
import { useWalletContext } from '@src/contexts/WalletProvider';
import { BN } from '@avalabs/avalanche-wallet-sdk';

/**
 * In order to display the graph, allocation and total balance. We will need to
 * have the usd price for ERC20 tokens. Otherwise we will cant normalize the sums
 * being as one allocation might be PNG, one a random token and one AVAX we cant
 * simply sum the amount of each token and then show allocation. These tokens vary
 * with decimals/precision.
 *
 * If I am wrong correct me -Danny
 */
export function WalletHomeBalances() {
  const { avaxToken } = useWalletContext();
  const tokensWBalances = useTokensWithBalances();
  const theme = useTheme();

  const tokenColors = [
    theme.colors.pink['500'],
    theme.colors.green['500'],
    theme.colors.orange['500'],
    theme.colors.turquoise['500'],
    '#2196F3', // blue 500
  ];

  const top5Tokens = useMemo(() => {
    return tokensWBalances
      .sort((tokenA: any, tokenB: any) =>
        (tokenA.balance as BN).gt(tokenB.balance as BN) ? 1 : -1
      )
      .slice(0, 5)
      .map((token, idx) => {
        return { ...token, color: tokenColors[idx] };
      });
  }, [tokensWBalances]);

  return (
    <Card>
      <HorizontalFlex justify={'space-between'} align={'center'} width={'100%'}>
        <VerticalFlex flex={2}>
          <SubTextTypography margin={'0 0 5px 0'}>Balance</SubTextTypography>
          <Typography size={36}>
            ~{avaxToken?.balanceUsdDisplayValue} USD
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
