import React from 'react';
import {
  ArrowIcon,
  Card,
  GridContainer,
  GridContainerItems,
  HorizontalFlex,
  SubTextTypography,
  TextButton,
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
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import styled from 'styled-components';
import { transparentize } from 'polished';
import { useHistory } from 'react-router';

const IconCircle = styled(HorizontalFlex)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => transparentize(0.8, theme.palette.white)};
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) =>
      transparentize(0.9, theme.palette.white)};
  }
`;
function SendReceiveButton({
  label,
  angle,
  onClick,
}: {
  label: string;
  angle: number;
  onClick(): void;
}) {
  const theme = useTheme();
  return (
    <TextButton margin={'0 0 0 10px'} onClick={() => onClick && onClick()}>
      <VerticalFlex>
        <IconCircle>
          <ArrowIcon
            height={'40px'}
            color={theme.palette.white}
            style={{
              transform: `rotate(${angle}deg)`,
            }}
          />
        </IconCircle>
        <Typography>{label}</Typography>
      </VerticalFlex>
    </TextButton>
  );
}

export function WalletBalances() {
  const { avaxToken, currencyFormatter } = useWalletContext();
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const tokensWBalances = useTokensWithBalances();
  const theme = useTheme();
  const history = useHistory();

  const tokenColors = [
    theme.palette.pink['500'],
    theme.palette.green['500'],
    theme.palette.orange['500'],
    theme.palette.turquoise['500'],
    '#2196F3', // blue 500
  ];

  const balanceTotalUSD =
    (avaxToken?.balanceUSD || 0) +
    tokensWBalances.reduce((acc, token) => (acc += token?.balanceUSD || 0), 0);

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

  if (isMiniMode) {
    return (
      <VerticalFlex>
        <HorizontalFlex justify={'center'} align={'center'} width={'100%'}>
          <Typography size={36}>
            ~{currencyFormatter(balanceTotalUSD)}
            <Typography margin={'0 0 0 8px'}>USD</Typography>
          </Typography>
        </HorizontalFlex>
        <br />
        <br />
        <br />
        <HorizontalFlex width={'100%'} justify={'center'} align={'center'}>
          <SendReceiveButton
            label={'Send'}
            angle={320}
            onClick={() => history.push('/send')}
          />
          <SendReceiveButton
            label={'Receive'}
            angle={140}
            onClick={() => history.push('/receive')}
          />
        </HorizontalFlex>
        <br />
      </VerticalFlex>
    );
  }

  return (
    <Card>
      <HorizontalFlex justify={'space-between'} align={'center'} width={'100%'}>
        <VerticalFlex flex={2}>
          <SubTextTypography margin={'0 0 5px 0'}>Balance</SubTextTypography>
          <Typography size={36}>
            ~{currencyFormatter(balanceTotalUSD)} USD
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
