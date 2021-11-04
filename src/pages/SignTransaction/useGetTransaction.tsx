import { useMemo } from 'react';
import { useState } from 'react';
import { Transaction } from '@src/background/services/transactions/models';
import { useEffect } from 'react';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { filter, map, take } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/models';
import { gasPriceTransactionUpdateListener } from '@src/background/services/transactions/events/gasPriceTransactionUpdateListener';
import { transactionFinalizedUpdateListener } from '@src/background/services/transactions/events/transactionFinalizedUpdateListener';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { GasPrice } from '@src/background/services/gas/models';

export function useGetTransaction(requestId: string) {
  const { request, events } = useConnectionContext();
  const { avaxPrice } = useWalletContext();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [hash, setHash] = useState('');
  const [showCustomFees, setShowCustomFees] = useState(false);

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

  useEffect(() => {
    request({
      method: ExtensionRequest.TRANSACTIONS_GET,
      params: [requestId],
    }).then((tx) => {
      setTransaction(tx);
    });
  }, []);

  useEffect(() => {
    const subscription = events!()
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

    const finalizedSubscription = events!()
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

    return () => {
      subscription.unsubscribe();
      finalizedSubscription.unsubscribe();
    };
  }, [transaction]);

  return useMemo(() => {
    function updateTransaction(update) {
      return request({
        method: ExtensionRequest.TRANSACTIONS_UPDATE,
        params: [update],
      });
    }

    return {
      ...transaction?.displayValues,
      id: transaction?.id,
      ...(transaction?.txParams ? { txParams: transaction?.txParams } : {}),
      updateTransaction,
      hash,
      showCustomFees,
      setShowCustomFees,
      setCustomFee,
    };
  }, [requestId, transaction, hash, showCustomFees]);
}
