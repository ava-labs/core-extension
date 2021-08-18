import { KnownContractABIs } from '@src/abi';
import { truncateAddress } from '@src/utils/addressUtils';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import { useMemo } from 'react';
import { useState } from 'react';
import { Transaction } from '@src/background/services/transactions/models';
import { useEffect } from 'react';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { filter, merge, map, tap } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/models';
import { gasPriceTransactionUpdateListener } from '@src/background/services/transactions/events/gasPriceTransactionUpdateListener';
import { transactionFinalizedUpdateListener } from '@src/background/services/transactions/events/transactionFinalizedUpdateListener';

function convertAmountToAvax(hex: string) {
  return Utils.bnToLocaleString(new BN(hex), 18);
}

export function useGetTransaction(requestId: string) {
  const { request, events } = useConnectionContext();
  const [transaction, setTransaction] = useState<Transaction>();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const subscription = merge(
      request({
        method: ExtensionRequest.TRANSACTIONS_GET,
        params: [requestId],
      }),
      events!().pipe(
        filter(gasPriceTransactionUpdateListener),
        map((txs) => txs[requestId])
      )
    ).subscribe((tx) => setTransaction(tx));

    subscription.add(
      events!()
        .pipe(
          transactionFinalizedUpdateListener(requestId),
          tap((tx) => setHash(tx.txHash ?? ''))
        )
        .subscribe((tx) => setTransaction(tx))
    );

    return () => subscription.unsubscribe();
  }, []);

  return useMemo(() => {
    function updateTransaction(update) {
      return request({
        method: ExtensionRequest.TRANSACTIONS_UPDATE,
        params: [update],
      });
    }

    const fromAddress =
      transaction?.txParams?.from &&
      truncateAddress(transaction?.txParams?.from);

    const toAddress =
      transaction?.txParams?.to && truncateAddress(transaction?.txParams?.to);

    const knownContract = transaction?.txParams?.to
      ? KnownContractABIs.get(transaction?.txParams?.to)
      : undefined;

    const data = knownContract?.parser(
      knownContract?.decoder(transaction?.txParams.data)
    );

    const amount =
      transaction?.txParams?.value &&
      convertAmountToAvax(transaction?.txParams?.value);

    const estimate =
      transaction?.txParams?.gas &&
      new BN(transaction?.txParams?.gas).toNumber();

    const gasEstimate = new BN(estimate as number).mul(
      transaction?.txParams?.gasPrice
        ? new BN(transaction?.txParams?.gasPrice)
        : new BN(0)
    );

    const gasAvax = Utils.bnToAvaxX(gasEstimate);

    const total = Utils.avaxXtoC(gasEstimate).add(new BN(amount as string));

    return {
      transaction,
      txParams: transaction?.txParams,
      fromAddress,
      toAddress,
      amount,
      data,
      gasEstimate:
        transaction?.txParams?.gas &&
        new BN(transaction?.txParams?.gas).toNumber(),
      gasPrice: transaction?.txParams?.gasPrice,
      gasAvax,
      total: Utils.bnToLocaleString(total, 18),
      updateTransaction,
      hash,
    };
  }, [requestId, transaction]);
}
