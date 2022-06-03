import { useCallback, useMemo, useEffect, useState } from 'react';
import { Transaction } from '@src/background/services/transactions/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { filter, map, Subscription, take } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { transactionFinalizedUpdateListener } from '@src/background/services/transactions/events/transactionFinalizedUpdateListener';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import Web3 from 'web3';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { Limit, SpendLimit } from '../CustomSpendLimit';
import { hexToBN } from '@src/utils/hexToBN';
import { GasFeeModifier } from '@src/components/common/CustomFees';
import * as ethers from 'ethers';
import { bnToLocaleString } from '@avalabs/utils-sdk';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

const UNLIMITED_SPEND_LIMIT_LABEL = 'Unlimited';

export function useGetTransaction(requestId: string) {
  const { request, events } = useConnectionContext();
  const tokenPrice = useNativeTokenPrice();
  const { networkFee } = useNetworkFeeContext();
  const { network } = useNetworkContext();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [customGas, setCustomGas] = useState<{
    gasLimit: number;
    gasPrice: ethers.BigNumber;
  } | null>(null);
  const [hash, setHash] = useState<string>('');
  const [showCustomSpendLimit, setShowCustomSpendLimit] =
    useState<boolean>(false);
  const [displaySpendLimit, setDisplaySpendLimit] = useState<string>(
    UNLIMITED_SPEND_LIMIT_LABEL
  );
  const [customSpendLimit, setCustomSpendLimit] = useState<SpendLimit>({
    limitType: Limit.DEFAULT,
  });
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.INSTANT
  );

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
    (
      gasLimit: number,
      gasPrice: ethers.BigNumber,
      modifier: GasFeeModifier
    ) => {
      setCustomGas({ gasLimit, gasPrice });
      setSelectedGasFee(modifier);

      const feeDisplayValues = calculateGasAndFees(
        gasPrice,
        gasLimit,
        tokenPrice
      );
      updateTransaction({
        id: transaction?.id,
        params: {
          gas: feeDisplayValues.gasLimit.toString(),
          gasPrice: feeDisplayValues.gasPrice,
        },
      });
    },
    [tokenPrice, transaction?.id, updateTransaction]
  );

  const setSpendLimit = useCallback(
    (customSpendData: SpendLimit) => {
      const srcToken: string =
        transaction?.displayValues.tokenToBeApproved.address;
      const spenderAddress: string =
        transaction?.displayValues.approveData.spender;
      let limitAmount = '';

      if (customSpendData.limitType === Limit.UNLIMITED) {
        setCustomSpendLimit({
          ...customSpendData,
          value: undefined,
        });
        limitAmount = ethers.constants.MaxUint256.toHexString();
        setDisplaySpendLimit(UNLIMITED_SPEND_LIMIT_LABEL);
      } else {
        setCustomSpendLimit(customSpendData);
        setDisplaySpendLimit(
          customSpendData.limitType === Limit.CUSTOM
            ? customSpendData.value?.amount || ''
            : bnToLocaleString(
                hexToBN(transaction?.displayValues.approveData.limit),
                transaction?.displayValues.tokenToBeApproved.decimals
              )
        );
        limitAmount =
          customSpendData.limitType === Limit.CUSTOM
            ? customSpendData.value?.bn.toString()
            : transaction?.displayValues?.approveData?.limit;
      }

      // create hex string for approval amount
      const web3 = new Web3();
      const contract = new web3.eth.Contract(ERC20.abi as any, srcToken);

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
    }).then((tx: Transaction) => {
      setTransaction({
        ...tx,
        displayValues: {
          ...tx.displayValues,
          gasPrice: ethers.BigNumber.from(tx.displayValues.gasPrice),
        },
      });
    });
    const subscriptions = new Subscription();

    subscriptions.add(
      events?.()
        .pipe(
          filter(transactionFinalizedUpdateListener),
          map(({ value }) => value),
          filter((tx) => tx.id === Number(requestId)),
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
    if (transaction?.displayValues?.approveData?.limit) {
      setDisplaySpendLimit(
        ethers.constants.MaxUint256.eq(
          transaction.displayValues.approveData.limit
        )
          ? UNLIMITED_SPEND_LIMIT_LABEL
          : bnToLocaleString(
              hexToBN(transaction.displayValues.approveData.limit),
              transaction.displayValues.tokenToBeApproved.decimals
            )
      );
    }
  }, [transaction]);

  return useMemo(() => {
    const feeDisplayValues =
      networkFee &&
      transaction?.displayValues.gasLimit &&
      calculateGasAndFees(
        customGas?.gasPrice ?? networkFee.low,
        customGas?.gasLimit ?? transaction.displayValues.gasLimit,
        tokenPrice
      );

    return {
      ...transaction?.displayValues,
      id: transaction?.id,
      ...(transaction?.txParams ? { txParams: transaction?.txParams } : {}),
      ...feeDisplayValues,
      feeSymbol: network?.networkToken.symbol,
      updateTransaction,
      hash,
      setCustomFee,
      showCustomSpendLimit,
      setShowCustomSpendLimit,
      setSpendLimit,
      displaySpendLimit,
      customSpendLimit,
      selectedGasFee,
    };
  }, [
    networkFee,
    network,
    transaction,
    customGas,
    tokenPrice,
    updateTransaction,
    hash,
    setCustomFee,
    showCustomSpendLimit,
    setSpendLimit,
    displaySpendLimit,
    customSpendLimit,
    selectedGasFee,
  ]);
}
