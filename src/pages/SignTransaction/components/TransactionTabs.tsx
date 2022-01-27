import {
  HorizontalSeparator,
  SecondaryCard,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { getHexStringToBytes } from '@src/utils/getHexStringToBytes';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { CustomFees } from '@src/components/common/CustomFees';
import { GasPrice } from '@src/background/services/gas/models';

interface TransactionTabsType {
  byteStr: string;
  children?: JSX.Element;
  gasPrice?: GasPrice;
  limit?: string;
  onCustomFeeSet?: () => void;
}

export function TransactionTabs({
  byteStr,
  children,
  gasPrice,
  limit,
  onCustomFeeSet,
}: TransactionTabsType) {
  // Summary Tab
  const showSummary = () => (
    <VerticalFlex margin="16px 0 0 0" width={'100%'} justify="space-between">
      {gasPrice && limit && onCustomFeeSet && (
        <CustomFees
          gasPrice={gasPrice}
          limit={limit}
          onChange={onCustomFeeSet}
        />
      )}

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
