import {
  HorizontalFlex,
  HorizontalSeparator,
  SecondaryCard,
  SubTextTypography,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import React from 'react';
import { useTheme } from 'styled-components';
import { getHexStringToBytes } from '@src/utils/getHexStringToBytes';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';

interface TransactionTabsType {
  byteStr: string;
  fee: string | undefined;
  feeUSD: number | undefined;
  setShowCustomFees: (arg0: boolean) => void;
  children?: JSX.Element;
}

export function TransactionTabs({
  byteStr,
  fee,
  feeUSD,
  setShowCustomFees,
  children,
}: TransactionTabsType) {
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

      {children && (
        <>
          <HorizontalSeparator margin="16px 0" />
          {children}
        </>
      )}
    </VerticalFlex>
  );

  // Data Tab
  const showTxData = () => (
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
    <VerticalFlex margin="32px 0 0 0" width="100%">
      {/* Tabs */}
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
        <TabPanel>{showTxData()}</TabPanel>
      </Tabs>
    </VerticalFlex>
  );
}
