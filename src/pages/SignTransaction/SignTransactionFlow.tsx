import {
  HorizontalFlex,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
  Typography,
  SubTextTypography,
  TextButton,
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
import { SendInProgress } from '../Send/SendInProgress';
import { SendConfirmation } from '../Send/SendConfirmation';
import { TokenIcon } from '@src/components/common/TokenImage';
import { CustomGasLimitAndFees } from './CustomGasLimitAndFees';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

export function SignTransactionPage() {
  const requestId = useGetRequestId();
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
  const { currencyFormatter } = useSettingsContext();

  const displayData: TransactionDisplayValues = { ...params } as any;

  if (showTxInProgress) {
    return <SendInProgress isOpen={true} />;
  }

  if (hash) {
    return (
      <SendConfirmation
        isOpen={true}
        txId={hash}
        onClose={() => window.close()}
      />
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

  return (
    <VerticalFlex>
      <HorizontalFlex>
        <TokenIcon src={displayData.site.icon} />
        <Typography>{displayData.site.domain}</Typography>
      </HorizontalFlex>
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
          ['unknown']: <UnknownTx />,
        }[contractType || 'unknown']
      }
      <br />
      <br />
      <br />
      <VerticalFlex width={'100%'} align={'center'}>
        <HorizontalFlex>
          <Typography>Fee</Typography>
          <TextButton onClick={() => setShowCustomFees(true)}>edit</TextButton>
        </HorizontalFlex>
        <br />
        <Typography> {displayData.fee} (AVAX)</Typography>
        <SubTextTypography>
          {currencyFormatter(Number(displayData.feeUSD))}
        </SubTextTypography>
      </VerticalFlex>
      <br />
      <br />
      <HorizontalFlex width={'100%'} justify={'space-between'}>
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
          Cancel
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
