import {
  StubbyArrowIcon,
  HorizontalFlex,
  IconDirection,
  Typography,
  VerticalFlex,
  SecondaryCard,
  TextButton,
  SubTextTypography,
} from '@avalabs/react-components';
import { SwapExactTokensForTokenDisplayValues } from '@src/contracts/contractParsers/models';
import React from 'react';
import { useTheme } from 'styled-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { getHexStringToBytes } from '@src/utils/getHexStringToBytes';
import { AddressPaths } from './components/AddressPaths';
import { TokenCard } from './components/TokenCard';

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
        <TokenCard
          token={sentToken}
          margin={'16px 0 0 0'}
          displayValue={sentToken.amountIn?.value}
          amount={sentToken.amountUSDValue}
        />

        {/* arrow */}
        <HorizontalFlex width={'100%'} justify={'center'} padding={'8px 0'}>
          <StubbyArrowIcon
            color={theme.colors.icon1}
            direction={IconDirection.DOWN}
          />
        </HorizontalFlex>

        {/* Bottom token */}
        <TokenCard
          token={receivingToken}
          displayValue={receivingToken.amountOut?.value}
          amount={receivingToken.amountUSDValue}
        />

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
