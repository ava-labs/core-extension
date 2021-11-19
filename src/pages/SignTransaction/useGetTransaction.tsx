import { useCallback, useMemo } from 'react';
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
import Web3 from 'web3';
import ERC20_ABI from '../../contracts/erc20.abi.json';
import { CustomSpendLimitBN, Limit, SpendLimitType } from './CustomSpendLimit';

export function useGetTransaction(requestId: string) {
  const { request, events } = useConnectionContext();
  const { avaxPrice } = useWalletContext();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [hash, setHash] = useState('');
  const [showCustomFees, setShowCustomFees] = useState(false);
  const [showCustomSpendLimit, setShowCustomSpendLimit] = useState(false);
  const [displaySpendLimit, setDisplaySpendLimit] =
    useState<string>('Unlimited');
  const [customSpendLimit, setCustonSpendLimit] = useState<SpendLimitType>({
    checked: Limit.UNLIMITED,
  } as SpendLimitType);
  const [isRevokeApproval, setIsRevokeApproval] = useState(false);

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

  function onRadioChange(e: any) {
    setCustonSpendLimit({
      ...customSpendLimit,
      checked: e.target.value,
    });
  }

  function setCustomSpendLimit(customSpendData: SpendLimitType) {
    const srcToken: string =
      transaction?.displayValues.tokenToBeApproved.address;
    const spenderAddress: string =
      transaction?.displayValues.approveData.spender;
    let limitAmount = '';

    setCustonSpendLimit(customSpendData);
    // Sets the string to be displayed in AmountTx
    const spendAmountToDisplay =
      customSpendData.checked === Limit.UNLIMITED
        ? 'Unlimited'
        : customSpendData.spendLimitBN.amount;
    setDisplaySpendLimit(spendAmountToDisplay);

    if (customSpendData.checked === Limit.UNLIMITED) {
      setCustonSpendLimit({
        ...customSpendData,
        spendLimitBN: {} as CustomSpendLimitBN,
      });
      limitAmount = transaction?.displayValues.approveData.limit;
    }

    if (customSpendData.checked === Limit.CUSTOM) {
      limitAmount = customSpendData.spendLimitBN.bn.toString();
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
  }, []);

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

    // Handle transaction Approval for REVOKING spend limit
    if (transaction?.displayValues.approveData.limit === '0') {
      setDisplaySpendLimit('0');
      setIsRevokeApproval(true);
    }

    return () => {
      subscription.unsubscribe();
      finalizedSubscription.unsubscribe();
    };
  }, [transaction]);

  return useMemo(() => {
    return {
      ...transaction?.displayValues,
      id: transaction?.id,
      ...(transaction?.txParams ? { txParams: transaction?.txParams } : {}),
      updateTransaction,
      hash,
      showCustomFees,
      setShowCustomFees,
      setCustomFee,
      showCustomSpendLimit,
      setShowCustomSpendLimit,
      setCustomSpendLimit,
      displaySpendLimit,
      customSpendLimit,
      onRadioChange,
      isRevokeApproval,
    };
  }, [
    requestId,
    transaction,
    hash,
    showCustomFees,
    showCustomSpendLimit,
    customSpendLimit,
    updateTransaction,
    displaySpendLimit,
  ]);
}
