import {
  StubbyArrowIcon,
  HorizontalFlex,
  IconDirection,
  Typography,
  VerticalFlex,
  SecondaryCard,
  TextButton,
  SubTextTypography,
  Card,
} from '@avalabs/react-components';
import {
  erc20PathToken,
  SwapExactTokensForTokenDisplayValues,
} from '@src/contracts/contractParsers/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import React from 'react';
import {
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useTheme } from 'styled-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { getHexStringToBytes } from '@src/utils/getHexStringToBytes';
import { AddressPaths } from './components/AddressPaths';

export function SwapTx({
  path,
  fee,
  feeUSD,
  toAddress,
  fromAddress,
  setShowCustomFees,
  txParams,
}: SwapExactTokensForTokenDisplayValues) {
  const { currencyFormatter, currency } = useSettingsContext();
  const [sentToken] = path;
  const receivingToken = path[path.length - 1];

  const theme = useTheme();

  // Summary Tab
  const showSummary = () => (
    <VerticalFlex margin="16px 0 0 0" width={'100%'} justify="space-between">
      <HorizontalFlex justify="space-between">
        <Typography padding="0 0 4px 0" height="24px" weight={600}>
          Network Fee
        </Typography>
        <Typography padding="0 0 4px 0" weight={600} height="24px">
          {fee}
          <Typography
            padding="0 0 0 4px"
            weight={600}
            color={theme.colors.text2}
          >
            AVAX
          </Typography>
        </Typography>
      </HorizontalFlex>

      <HorizontalFlex justify="space-between">
        <TextButton onClick={() => setShowCustomFees(true)}>
          <Typography size={12} color={theme.colors.primary1} weight={600}>
            Edit
          </Typography>
        </TextButton>
        <SubTextTypography size={12}>
          ~{currencyFormatter(Number(feeUSD))} {currency}
        </SubTextTypography>
      </HorizontalFlex>
    </VerticalFlex>
  );

  // Data Tab
  const showTxData = (byteStr) => (
    <VerticalFlex margin="16px 0 0 0" width={'100%'}>
      <Typography margin="0 0 8px 0" height="24px">
        Hex Data: {getHexStringToBytes(byteStr)} Bytes
      </Typography>
      <SecondaryCard padding="16px">
        <Typography size={14} overflow="scroll">
          {byteStr}
        </Typography>
      </SecondaryCard>
    </VerticalFlex>
  );

  return (
    <VerticalFlex width="100%">
      {/* Header */}
      <HorizontalFlex margin="8px 0 32px 0" width={'100%'} justify={'center'}>
        <Typography as="h1" size={24} weight={700}>
          Approve Swap
        </Typography>
      </HorizontalFlex>

      <VerticalFlex>
        <AddressPaths toAddress={toAddress} fromAddress={fromAddress} />
        {/* Top Token */}
        <SecondaryCard padding="16px" margin="16px 0 0 0">
          <HorizontalFlex
            align={'center'}
            justify={'space-between'}
            width={'100%'}
          >
            <HorizontalFlex align={'center'} height="100%">
              {isAvaxToken(sentToken) ? (
                <AvaxTokenIcon height="40px" />
              ) : (
                <TokenIcon
                  height="40px"
                  width="40px"
                  src={(sentToken as erc20PathToken).logoURI}
                  name={(sentToken as TokenWithBalance).name}
                />
              )}
              <VerticalFlex
                height="100%"
                padding="0 16px"
                justify="space-between"
              >
                <Typography weight={600} margin="0 0 4px 0">
                  {sentToken.amountIn?.value}
                </Typography>
                <Typography size={14}>{sentToken.symbol}</Typography>
              </VerticalFlex>
            </HorizontalFlex>
            <VerticalFlex height="100%">
              <Typography weight={600}>
                {currencyFormatter(Number(sentToken.amountUSDValue))}
                <Typography
                  margin="0 0 0 4px"
                  weight={600}
                  color={theme.colors.text2}
                >
                  {currency}
                </Typography>
              </Typography>
            </VerticalFlex>
          </HorizontalFlex>
        </SecondaryCard>

        {/* arrow */}
        <HorizontalFlex width={'100%'} justify={'center'} padding={'8px 0'}>
          <StubbyArrowIcon
            color={theme.colors.icon1}
            direction={IconDirection.DOWN}
          />
        </HorizontalFlex>

        {/* Bottom token */}
        <SecondaryCard padding="16px">
          <HorizontalFlex
            align={'center'}
            justify={'space-between'}
            width={'100%'}
          >
            <HorizontalFlex align={'center'} height="100%">
              {isAvaxToken(receivingToken) ? (
                <AvaxTokenIcon height="40px" />
              ) : (
                <TokenIcon
                  height="40px"
                  width="40px"
                  src={(receivingToken as erc20PathToken).logoURI}
                  name={(sentToken as TokenWithBalance).name}
                />
              )}
              <VerticalFlex
                height="100%"
                padding="0 16px"
                justify="space-between"
              >
                <Typography weight={600} margin="0 0 4px 0">
                  {receivingToken.amountOut?.value}
                </Typography>
                <Typography size={14}>{receivingToken.symbol}</Typography>
              </VerticalFlex>
            </HorizontalFlex>
            <VerticalFlex height="100%">
              <Typography weight={600}>
                {currencyFormatter(Number(receivingToken.amountUSDValue))}
                <Typography
                  margin="0 0 0 4px"
                  weight={600}
                  color={theme.colors.text2}
                >
                  {currency}
                </Typography>
              </Typography>
            </VerticalFlex>
          </HorizontalFlex>
        </SecondaryCard>

        {/* Tabs */}
        <VerticalFlex margin="32px 0 0 0" width="100%">
          <Tabs defaultIndex={0}>
            <TabList $border={false}>
              <Tab margin="0 32px 8px 0">
                <Typography>Summary</Typography>
              </Tab>
              <Tab>
                <Typography>Data</Typography>
              </Tab>
            </TabList>

            <TabPanel>{showSummary()}</TabPanel>
            <TabPanel>{showTxData(txParams?.data)}</TabPanel>
          </Tabs>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
