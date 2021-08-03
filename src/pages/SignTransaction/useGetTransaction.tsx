import { KnownContractABIs } from '@src/abi';
import { transactionService } from '@src/background/services';
import { truncateAddress } from '@src/utils/addressUtils';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import { useMemo } from 'react';
import { useGetGasPrice } from '@src/hooks/useGas';

function convertAmountToAvax(hex: string) {
  return Utils.bnToLocaleString(new BN(hex), 18);
}

export function useGetTransaction(requestId: string) {
  const transaction = transactionService.getById(requestId);
  const { gasPrice } = useGetGasPrice();

  return useMemo(() => {
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
      gasPrice ? new BN(gasPrice?.value) : new BN(0)
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
      gasPrice: gasPrice?.value,
      gasAvax,
      total: Utils.bnToLocaleString(total, 18),
    };
  }, [requestId, gasPrice?.hex]);
}
