import { useCallback, useMemo, useEffect, useState } from 'react';
import { Transaction } from '@src/background/services/transactions/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { filter, map, take } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/models';
import { gasPriceTransactionUpdateListener } from '@src/background/services/transactions/events/gasPriceTransactionUpdateListener';
import { transactionFinalizedUpdateListener } from '@src/background/services/transactions/events/transactionFinalizedUpdateListener';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { GasPrice } from '@src/background/services/gas/models';
import Web3 from 'web3';
import ERC20_ABI from '../../../contracts/erc20.abi.json';
import { Limit, SpendLimit } from '../CustomSpendLimit';

const UNLIMITED_SPEND_LIMIT_LABEL = 'Unlimited';

export function useGetTransaction(requestId: string) {
  const { request, events } = useConnectionContext();
  const { avaxPrice } = useWalletContext();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [hash, setHash] = useState<string>('');
  const [showCustomSpendLimit, setShowCustomSpendLimit] =
    useState<boolean>(false);
  const [displaySpendLimit, setDisplaySpendLimit] = useState<string>(
    UNLIMITED_SPEND_LIMIT_LABEL
  );
  const [customSpendLimit, setCustomSpendLimit] = useState<SpendLimit>({
    limitType: Limit.UNLIMITED,
  });
  const [isRevokeApproval, setIsRevokeApproval] = useState<boolean>(false);

  function setCustomFee(gasLimit: string, gasPrice: GasPrice) {
    const feeDisplayValues = calculateGasAndFees(gasPrice, gasLimit, avaxPrice);

    setTransaction({
      ...transaction,
      displayValues: {
        ...transaction?.displayValues,
        ...feeDisplayValues,
      },
    } as any);
  }

  function setSpendLimit(customSpendData: SpendLimit) {
    const srcToken: string =
      transaction?.displayValues.tokenToBeApproved.address;
    const spenderAddress: string =
      transaction?.displayValues.approveData.spender;
    let limitAmount = '';

    setCustomSpendLimit(customSpendData);
    // Sets the string to be displayed in AmountTx
    const spendAmountToDisplay =
      customSpendData.limitType === Limit.UNLIMITED || !customSpendData.value
        ? UNLIMITED_SPEND_LIMIT_LABEL
        : customSpendData.value.amount;
    setDisplaySpendLimit(spendAmountToDisplay);

    if (customSpendData.limitType === Limit.UNLIMITED) {
      setCustomSpendLimit({
        ...customSpendData,
        value: undefined,
      });
      limitAmount = transaction?.displayValues.approveData.limit;
    }

    if (customSpendData.limitType === Limit.CUSTOM && customSpendData.value) {
      limitAmount = customSpendData.value.bn.toString();
    }

    // create hex string for approval amount
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(ERC20_ABI as any, srcToken);

    const hashedCustomSpend =
      limitAmount &&
      contract.methods.approve(spenderAddress, limitAmount).encodeABI();

    updateTransaction({
      id: transaction?.id,
      params: { data: hashedCustomSpend },
    });
  }

  const updateTransaction = useCallback((update) => {
    return request({
      method: ExtensionRequest.TRANSACTIONS_UPDATE,
      params: [update],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    request({
      method: ExtensionRequest.TRANSACTIONS_GET,
      params: [requestId],
    }).then((tx) => {
      // the gasPrice.bn on the tx is a hex
      // we convert it here to a BN
      const updatedTx = {
        ...tx,
        displayValues: {
          ...tx.displayValues,
          gasPrice: {
            ...tx.displayValues.gasPrice,
            bn: new BN(tx.displayValues.gasPrice.bn, 'hex'),
          },
        },
      };
      setTransaction(updatedTx);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = events?.()
      .pipe(filter(gasPriceTransactionUpdateListener))
      .subscribe(function (evt) {
        const gasPrice = {
          ...evt.value,
          bn: new BN(evt.value.bn, 'hex'),
        } as any;
        setCustomFee(
          transaction?.displayValues.gasLimit?.toString() as string,
          gasPrice
        );
      });

    const finalizedSubscription = events?.()
      .pipe(
        filter(transactionFinalizedUpdateListener),
        map(({ value }) => {
          return value.find((tx) => tx.id === Number(requestId));
        }),
        filter((tx) => !!tx),
        take(1)
      )
      .subscribe({
        next(tx) {
          setHash(tx?.txHash || '');
        },
      });

    // Handle transaction Approval for REVOKING spend limit
    if (transaction?.displayValues?.approveData?.limit === '0') {
      setDisplaySpendLimit('0');
      setIsRevokeApproval(true);
    }

    return () => {
      subscription?.unsubscribe();
      finalizedSubscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction]);

  return useMemo(() => {
    return {
      ...transaction?.displayValues,
      id: transaction?.id,
      ...(transaction?.txParams ? { txParams: transaction?.txParams } : {}),
      updateTransaction,
      hash,
      setCustomFee,
      showCustomSpendLimit,
      setShowCustomSpendLimit,
      setSpendLimit,
      displaySpendLimit,
      customSpendLimit,
      isRevokeApproval,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    requestId,
    transaction,
    hash,
    customSpendLimit,
    updateTransaction,
    displaySpendLimit,
  ]);
}
