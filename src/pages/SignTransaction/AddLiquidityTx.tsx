import {
  HorizontalFlex,
  PlusIcon,
  SecondaryCard,
  SubTextTypography,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { AddLiquidityDisplayData } from '@src/contracts/contractParsers/models';
import { getHexStringToBytes } from '@src/utils/getHexStringToBytes';
import React from 'react';
import { useTheme } from 'styled-components';
import { AddressPaths } from './components/AddressPaths';
import { TokenCard } from './components/TokenCard';

export function AddLiquidityTx({
  poolTokens,
  toAddress,
  fromAddress,
  setShowCustomFees,
  fee,
  feeUSD,
  txParams,
}: AddLiquidityDisplayData) {
  const { currencyFormatter, currency } = useSettingsContext();

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

  const plusIcon = (
    <HorizontalFlex width={'100%'} justify={'center'} margin="8px 0">
      <PlusIcon color={theme.colors.icon1} height="16px" />
    </HorizontalFlex>
  );

  return (
    <VerticalFlex width={'100%'}>
      {/* Header */}
      <HorizontalFlex margin="8px 0 32px 0" width={'100%'} justify={'center'}>
        <Typography as="h1" size={24} weight={700}>
          Adding Liquidity to Pool
        </Typography>
      </HorizontalFlex>

      {/* Account */}
      <AddressPaths toAddress={toAddress} fromAddress={fromAddress} />

      {/* Tokens */}
      {poolTokens.map((token, index) => (
        <>
          <TokenCard
            key={token.symbol}
            token={token}
            margin={`${!index && '16px 0 0 0'}`}
            displayValue={token.amountDepositedDisplayValue}
            amount={token.amountUSDValue}
          />
          {!index && plusIcon}
        </>
      ))}

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
  );
}
