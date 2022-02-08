import { useCallback, useMemo, useEffect, useState } from 'react';
import { Transaction } from '@src/background/services/transactions/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { filter, map, Subscription, take } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/models';
import { gasPriceTransactionUpdateListener } from '@src/background/services/transactions/events/gasPriceTransactionUpdateListener';
import { transactionFinalizedUpdateListener } from '@src/background/services/transactions/events/transactionFinalizedUpdateListener';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { GasPrice } from '@src/background/services/gas/models';
import Web3 from 'web3';
import ERC20_ABI from 'human-standard-token-abi';
import { Limit, SpendLimit } from '../CustomSpendLimit';

const UNLIMITED_SPEND_LIMIT_LABEL = 'Unlimited';

export function useGetTransaction(requestId: string) {
  const { request, events } = useConnectionContext();
  const { avaxPrice } = useWalletContext();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [defaultGasPrice, setDefaultGasPrice] = useState<GasPrice | null>(null);
  const [customGas, setCustomGas] = useState<{
    gasLimit: string;
    gasPrice: GasPrice;
  } | null>(null);
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

  const updateTransaction = useCallback(
    (update) => {
      return request({
        method: ExtensionRequest.TRANSACTIONS_UPDATE,
        params: [update],
      });
    },
    [request]
  );

  const setCustomFee = useCallback(
    (gasLimit: string, gasPrice: GasPrice) => {
      setCustomGas({ gasLimit, gasPrice });

      const feeDisplayValues = calculateGasAndFees(
        gasPrice,
        gasLimit,
        avaxPrice
      );
      updateTransaction({
        id: transaction?.id,
        params: {
          gas: feeDisplayValues.gasLimit.toString(),
          gasPrice: feeDisplayValues.gasPrice.bn,
        },
      });
    },
    [avaxPrice, transaction?.id, updateTransaction]
  );

  const setSpendLimit = useCallback(
    (customSpendData: SpendLimit) => {
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
    },
    [transaction, updateTransaction]
  );

  useEffect(() => {
    request({
      method: ExtensionRequest.TRANSACTIONS_GET,
      params: [requestId],
    }).then((tx) => {
      // the gasPrice.bn on the tx is a hex
      // we convert it here to a BN
      const gasPrice: GasPrice = {
        ...tx.displayValues.gasPrice,
        bn: new BN(tx.displayValues.gasPrice.bn, 'hex'),
      };

      setDefaultGasPrice(gasPrice);
      setTransaction({
        ...tx,
        displayValues: {
          ...tx.displayValues,
          gasPrice,
        },
      });
    });
    const subscriptions = new Subscription();
    subscriptions.add(
      events?.()
        .pipe(filter(gasPriceTransactionUpdateListener))
        .subscribe(function (evt) {
          const gasPrice = {
            ...evt.value,
            bn: new BN(evt.value.bn, 'hex'),
          } as any;
          setDefaultGasPrice(gasPrice);
        })
    );

    subscriptions.add(
      events?.()
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
        })
    );

    return () => {
      subscriptions.unsubscribe();
    };
    // only call this once, we need to get the transaction and subscriptions only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Handle transaction Approval for REVOKING spend limit
    if (transaction?.displayValues?.approveData?.limit === '0') {
      setDisplaySpendLimit('0');
      setIsRevokeApproval(true);
    }
  }, [transaction]);

  return useMemo(() => {
    const feeDisplayValues =
      defaultGasPrice &&
      transaction?.displayValues.gasLimit &&
      calculateGasAndFees(
        customGas?.gasPrice ?? defaultGasPrice,
        customGas?.gasLimit ?? transaction.displayValues.gasLimit.toString(),
        avaxPrice
      );

    return {
      ...transaction?.displayValues,
      id: transaction?.id,
      ...(transaction?.txParams ? { txParams: transaction?.txParams } : {}),
      ...feeDisplayValues,
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
  }, [
    defaultGasPrice,
    transaction,
    customGas,
    avaxPrice,
    updateTransaction,
    hash,
    setCustomFee,
    showCustomSpendLimit,
    setSpendLimit,
    displaySpendLimit,
    customSpendLimit,
    isRevokeApproval,
  ]);
}
