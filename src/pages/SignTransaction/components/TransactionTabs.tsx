import {
  HorizontalFlex,
  HorizontalSeparator,
  Card,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { getHexStringToBytes } from '@src/utils/getHexStringToBytes';
import { Tabs } from '@src/components/common/Tabs';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import Scrollbars from 'react-custom-scrollbars-2';
import { BigNumber } from 'ethers';
import { t } from 'i18next';

interface TransactionTabsType {
  byteStr: string;
  children?: JSX.Element;
  gasPrice?: BigNumber;
  limit?: number;
  selectedGasFee: GasFeeModifier;
  onCustomFeeSet?: (values: {
    customGasLimit?: number;
    gasPrice: BigNumber;
    feeType: GasFeeModifier;
  }) => void;
}

export function TransactionTabs({
  byteStr,
  children,
  gasPrice,
  limit,
  selectedGasFee,
  onCustomFeeSet,
}: TransactionTabsType) {
  // Details Tab
  const Details = (
    <VerticalFlex margin="16px 0 0 0" width={'100%'} justify="space-between">
      <HorizontalFlex margin="0 0 8px">
        <Typography size={12} height="15px" margin="0 8px 0 0">
          {t('Network Fee')}
        </Typography>
        <TransactionFeeTooltip gasPrice={gasPrice} gasLimit={limit} />
      </HorizontalFlex>
      {gasPrice && limit && onCustomFeeSet && (
        <CustomFees
          gasPrice={gasPrice}
          limit={limit}
          onChange={onCustomFeeSet}
          selectedGasFeeModifier={selectedGasFee}
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
  const TxData = (
    <VerticalFlex margin="16px 0 0 0" width={'100%'}>
      <HorizontalFlex justify="space-between" margin="0 0 8px 0">
        <Typography size={12} height="15px">
          {t('Hex Data:')}
        </Typography>
        <Typography size={12} height="15px">
          {getHexStringToBytes(byteStr)} Bytes
        </Typography>
      </HorizontalFlex>
      <Card height="105px" padding="16px 0">
        <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
          <VerticalFlex padding="0 16px">
            <Typography size={12} height="17px" wordBreak="break-all">
              {byteStr}
            </Typography>
          </VerticalFlex>
        </Scrollbars>
      </Card>
    </VerticalFlex>
  );

  return (
    <VerticalFlex margin="24px 0 0 0" width="100%">
      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'Details', title: t('Details'), component: Details },
          { id: 'Data', title: t('Data'), component: TxData },
        ]}
      />
    </VerticalFlex>
  );
}
