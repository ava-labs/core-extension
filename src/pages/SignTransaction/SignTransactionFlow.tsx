import {
  HorizontalFlex,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
  Typography,
  SubTextTypography,
  TextButton,
  LoadingIcon,
  ConnectionIndicator,
  SecondaryCard,
} from '@avalabs/react-components';
import {
  AddLiquidityDisplayData,
  ContractCall,
  SwapExactTokensForTokenDisplayValues,
} from '@src/contracts/contractParsers/models';
import {
  TransactionDisplayValues,
  TxStatus,
} from '@src/background/services/transactions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import React, { useState } from 'react';
import { ApproveTx } from './ApproveTx';
import { SwapTx } from './SwapTx';
import { UnknownTx } from './UnknownTx';
import { useGetTransaction } from './useGetTransaction';
import { AddLiquidityTx } from './AddLiquidityTx';
import { TransactionInProgress } from './TransactionInProgress';
import { CustomGasLimitAndFees } from './CustomGasLimitAndFees';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { getHexStringToBytes } from '@src/utils/getHexStringToBytes';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useTheme } from 'styled-components';
import { TransactionConfirmation } from './TransactionConfirmation';
import { useWalletContext } from '@src/contexts/WalletProvider';

export function SignTransactionPage() {
  const requestId = useGetRequestId();
  const { isWalletReady } = useWalletContext();
  const {
    updateTransaction,
    id,
    contractType,
    hash,
    setCustomFee,
    showCustomFees,
    setShowCustomFees,
    ...params
  } = useGetTransaction(requestId);
  const [showTxInProgress, setShowTxInProgress] = useState(false);
  const { currencyFormatter, currency } = useSettingsContext();
  const { network } = useNetworkContext();
  const theme = useTheme();

  const displayData: TransactionDisplayValues = { ...params } as any;

  if (!Object.keys(displayData).length) {
    return (
      <HorizontalFlex
        width={'100%'}
        height={'100%'}
        justify={'center'}
        align={'center'}
      >
        <LoadingIcon color={theme.colors.icon1} />
      </HorizontalFlex>
    );
  }

  if (showTxInProgress) {
    return <TransactionInProgress isOpen={true} />;
  }

  if (hash) {
    return (
      <TransactionConfirmation txId={hash} onClose={() => window.close()} />
    );
  }

  if (showCustomFees) {
    return (
      <CustomGasLimitAndFees
        limit={displayData.gasLimit?.toString() as string}
        gasPrice={displayData.gasPrice}
        onCancel={() => setShowCustomFees(false)}
        onSave={(gas, gasLimit) => {
          setShowCustomFees(false);
          setCustomFee(gasLimit, gas);
        }}
      />
    );
  }

  const showSummary = () => (
    <VerticalFlex>
      <HorizontalFlex
        margin="16px 0 0 0"
        width={'100%'}
        justify="space-between"
      >
        <VerticalFlex>
          <Typography padding="0 0 4px 0" height="24px" weight={600}>
            Network Fee
          </Typography>
          <TextButton onClick={() => setShowCustomFees(true)}>
            <Typography size={12} color={theme.colors.primary1} weight={600}>
              Edit
            </Typography>
          </TextButton>
        </VerticalFlex>

        <VerticalFlex align="flex-end">
          <Typography padding="0 0 4px 0" weight={600} height="24px">
            {displayData.fee}
            <Typography
              padding="0 0 0 4px"
              weight={600}
              color={theme.colors.text2}
            >
              AVAX
            </Typography>
          </Typography>
          <SubTextTypography size={12}>
            ~{currencyFormatter(Number(displayData.feeUSD))} {currency}
          </SubTextTypography>
        </VerticalFlex>
      </HorizontalFlex>
    </VerticalFlex>
  );

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
    <VerticalFlex width="100%" align="center">
      <HorizontalFlex align="center">
        <ConnectionIndicator
          disableTooltip={true}
          size={8}
          connected={isWalletReady}
        />
        <SubTextTypography margin={'0 0 0 5px'} size={12}>
          {network?.name} C-Chain
        </SubTextTypography>
      </HorizontalFlex>

      {/* Actions  */}
      {
        {
          [ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS]: (
            <SwapTx
              {...(displayData as SwapExactTokensForTokenDisplayValues)}
            />
          ),
          [ContractCall.APPROVE]: <ApproveTx />,
          [ContractCall.ADD_LIQUIDITY]: (
            <AddLiquidityTx {...(displayData as AddLiquidityDisplayData)} />
          ),
          [ContractCall.ADD_LIQUIDITY_AVAX]: (
            <AddLiquidityTx {...(displayData as AddLiquidityDisplayData)} />
          ),
          ['unknown']: (
            <UnknownTx {...(displayData as TransactionDisplayValues)} />
          ),
        }[contractType || 'unknown']
      }

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
          <TabPanel>{showTxData(displayData.txParams?.data)}</TabPanel>
        </Tabs>
      </VerticalFlex>

      {/* Action Buttons */}
      <HorizontalFlex
        flex={1}
        align="flex-end"
        width={'100%'}
        justify={'space-between'}
      >
        <SecondaryButton
          onClick={() => {
            id &&
              updateTransaction({
                status: TxStatus.ERROR_USER_CANCELED,
                id: id,
              });
            window.close();
          }}
        >
          Reject
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            setShowTxInProgress(true);
            id &&
              updateTransaction({
                status: TxStatus.SUBMITTING,
                id: id,
              }).then(() => {
                setShowTxInProgress(false);
              });
          }}
        >
          Approve
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}

export default SignTransactionPage;
