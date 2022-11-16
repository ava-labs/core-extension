import {
  HorizontalFlex,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
  ComponentSize,
  LoadingSpinnerIcon,
  Typography,
} from '@avalabs/react-components';
import {
  AddLiquidityDisplayData,
  ContractCall,
  SwapExactTokensForTokenDisplayValues,
  ApproveTransactionData,
} from '@src/contracts/contractParsers/models';
import {
  TransactionDisplayValues,
  TxStatus,
} from '@src/background/services/transactions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useCallback, useMemo, useState } from 'react';
import { ApproveTx } from './ApproveTx';
import { SwapTx } from './SwapTx';
import { UnknownTx } from './UnknownTx';
import { useGetTransaction } from './hooks/useGetTransaction';
import { AddLiquidityTx } from './AddLiquidityTx';
import { LedgerApprovalOverlay } from './LedgerApprovalOverlay';
import { CustomSpendLimit } from './CustomSpendLimit';
import { useTheme } from 'styled-components';
import { SignTxRenderErrorBoundary } from './components/SignTxRenderErrorBoundary';
import { useLedgerDisconnectedDialog } from './hooks/useLedgerDisconnectedDialog';
import { TransactionProgressState } from './models';
import { useWindowGetsClosedOrHidden } from '@src/utils/useWindowGetsClosedOrHidden';
import { TransactionTabs } from './components/TransactionTabs';
import { BigNumber } from 'ethers';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenType } from '@src/background/services/balances/models';
import { ethersBigNumberToBN } from '@avalabs/utils-sdk';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { WalletType } from '@src/background/services/wallet/models';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

export function SignTransactionPage() {
  const requestId = useGetRequestId();
  const onTxError = useCallback(() => {
    window.close();
  }, []);
  const {
    updateTransaction,
    id,
    hash,
    contractType,
    setCustomFee,
    showCustomSpendLimit,
    setShowCustomSpendLimit,
    setSpendLimit,
    displaySpendLimit,
    customSpendLimit,
    selectedGasFee,
    network,
    ...params
  } = useGetTransaction(requestId, onTxError);
  const [transactionProgressState, setTransactionProgressState] = useState(
    TransactionProgressState.NOT_APPROVED
  );
  const theme = useTheme();
  const tokens = useTokensWithBalances(false, network?.chainId);
  const { walletType } = useWalletContext();

  useLedgerDisconnectedDialog(window.close, undefined, network);

  const hasEnoughForNetworkFee = useMemo(() => {
    return tokens
      .find((t) => t.type === TokenType.NATIVE)
      ?.balance.gte(
        ethersBigNumberToBN(
          params.gasPrice?.mul(params.gasLimit || BigNumber.from(0)) ??
            BigNumber.from(0)
        )
      );
  }, [tokens, params.gasPrice, params.gasLimit]);

  const cancelHandler = useCallback(() => {
    updateTransaction({
      status: TxStatus.ERROR_USER_CANCELED,
      id: id,
    });
  }, [id, updateTransaction]);

  useWindowGetsClosedOrHidden(cancelHandler);

  const displayData: TransactionDisplayValues = {
    ...params,
    contractType,
  };

  const onApproveClick = () => {
    setTransactionProgressState(TransactionProgressState.PENDING);
    id &&
      updateTransaction({
        status: TxStatus.SUBMITTING,
        id: id,
      }).finally(() => window.close());

    /*
		When wallet type is ledger, we need to show to the user that the interaction with ledger is needed. 
		In this case, the popup will stay open until the promise from updateTransaction is resolved. 
     */
    if (walletType !== WalletType.LEDGER) {
      window.close();
    }
  };

  if (!Object.keys(displayData).length) {
    return (
      <HorizontalFlex
        width={'100%'}
        height={'100%'}
        justify={'center'}
        align={'center'}
      >
        <LoadingSpinnerIcon color={theme.colors.icon1} />
      </HorizontalFlex>
    );
  }

  if (showCustomSpendLimit) {
    return (
      <CustomSpendLimit
        site={displayData.site || { domain: 'unkown' }}
        spendLimit={customSpendLimit}
        token={displayData.tokenToBeApproved}
        onClose={() => setShowCustomSpendLimit(false)}
        setSpendLimit={setSpendLimit}
      />
    );
  }

  return (
    <>
      {transactionProgressState === TransactionProgressState.PENDING && (
        <LedgerApprovalOverlay displayData={displayData} />
      )}
      <VerticalFlex width="100%" padding="0 16px" align="center">
        {/* Actions  */}
        <SignTxRenderErrorBoundary>
          {
            {
              [ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS]: (
                <SwapTx
                  {...(displayData as SwapExactTokensForTokenDisplayValues)}
                  hash={hash}
                  onCustomFeeSet={setCustomFee}
                  selectedGasFee={selectedGasFee}
                />
              ),
              [ContractCall.APPROVE]: (
                <ApproveTx
                  {...(displayData as ApproveTransactionData)}
                  setShowCustomSpendLimit={setShowCustomSpendLimit}
                  displaySpendLimit={displaySpendLimit}
                />
              ),
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
          {transactionProgressState ===
            TransactionProgressState.NOT_APPROVED && (
            <TransactionTabs
              byteStr={displayData.txParams?.data}
              gasPrice={displayData.gasPrice}
              limit={displayData.gasLimit ?? 0}
              onCustomFeeSet={setCustomFee}
              selectedGasFee={selectedGasFee}
            />
          )}
          {!hasEnoughForNetworkFee && (
            <VerticalFlex padding="16px 0" width="100%" align="flex-start">
              <Typography color="error" size={12}>
                <Trans
                  i18nKey="Insufficient balance to cover gas costs. <br /> Please add {{symbol}}."
                  values={{ symbol: network?.networkToken.symbol }}
                />
              </Typography>
            </VerticalFlex>
          )}
        </SignTxRenderErrorBoundary>

        {/* Action Buttons */}
        <HorizontalFlex
          flex={1}
          align="flex-end"
          width="100%"
          justify="space-between"
          padding="0 0 8px"
        >
          {transactionProgressState ===
            TransactionProgressState.NOT_APPROVED && (
            <>
              <SecondaryButton
                data-testid="transaction-reject-btn"
                size={ComponentSize.LARGE}
                width="168px"
                onClick={() => {
                  id &&
                    updateTransaction({
                      status: TxStatus.ERROR_USER_CANCELED,
                      id: id,
                    });
                  window.close();
                }}
              >
                {t('Reject')}
              </SecondaryButton>
              <PrimaryButton
                data-testid="transaction-approve-btn"
                disabled={!hasEnoughForNetworkFee}
                width="168px"
                size={ComponentSize.LARGE}
                onClick={onApproveClick}
              >
                {t('Approve')}
              </PrimaryButton>
            </>
          )}
        </HorizontalFlex>
      </VerticalFlex>
    </>
  );
}
