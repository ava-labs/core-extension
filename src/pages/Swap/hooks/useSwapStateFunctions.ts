import { TokenWithBalance } from '@src/background/services/balances/models';
import { t } from 'i18next';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Amount,
  DestinationInput,
  getMaxValueWithGas,
  getTokenAddress,
} from '../utils';
import { stringToBN } from '@avalabs/utils-sdk';
import { BigNumber } from 'ethers';
import { GasFeeModifier } from '@src/components/common/CustomFeesK2';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import BN from 'bn.js';
import { bnToLocaleString } from '@avalabs/utils-sdk';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { SwapError, useSwap } from './useSwap';

export function useSwapStateFunctions() {
  const { networkFee } = useNetworkFeeContext();

  const { network } = useNetworkContext();
  const tokensWBalances = useTokensWithBalances();
  const { setNavigationHistoryData } = usePageHistory();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();
  const { getPageHistoryData } = usePageHistory();
  const pageHistory: {
    selectedFromToken?: TokenWithBalance;
    selectedToToken?: TokenWithBalance;
    destinationInputField?: DestinationInput;
    tokenValue?: Amount;
  } = getPageHistoryData();

  const [destinationInputField, setDestinationInputField] =
    useState<DestinationInput>('');
  const [customGasPrice, setCustomGasPrice] = useState<BigNumber | undefined>(
    networkFee?.low.maxFee
  );

  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.NORMAL
  );
  const [gasLimit, setGasLimit] = useState<number>(0);

  const [selectedFromToken, setSelectedFromToken] =
    useState<TokenWithBalance>();
  const [selectedToToken, setSelectedToToken] = useState<TokenWithBalance>();
  const [isReversed, setIsReversed] = useState(false);
  const [swapWarning, setSwapWarning] = useState('');
  const [defaultFromValue, setFromDefaultValue] = useState<BN>();
  const [error, setError] = useState<SwapError>({ message: '' });
  const [fromTokenValue, setFromTokenValue] = useState<Amount>();
  const [toTokenValue, setToTokenValue] = useState<Amount>();
  const [maxFromValue, setMaxFromValue] = useState<BN | undefined>();
  const isHistoryLoaded = useRef<boolean>(false);

  const avaxPrice = useNativeTokenPrice(network);
  const {
    setValuesDebouncedSubject,
    swapError,
    isSwapLoading,
    optimalRate,
    swapGasLimit,
    destAmount,
  } = useSwap();

  const calculateTokenValueToInput = useCallback(
    (
      amount: Amount,
      destinationInput: DestinationInput,
      sourceToken?: TokenWithBalance,
      destinationToken?: TokenWithBalance
    ) => {
      if (!sourceToken || !destinationToken) {
        return;
      }

      setSwapWarning('');
      setDestinationInputField(destinationInput);
      setValuesDebouncedSubject.next({
        ...setValuesDebouncedSubject.getValue(),
        fromTokenAddress: getTokenAddress(sourceToken),
        toTokenAddress: getTokenAddress(destinationToken),
        fromTokenDecimals: sourceToken.decimals,
        toTokenDecimals: destinationToken.decimals,
        amount,
        destinationInputField: destinationInput,
        fromTokenBalance: selectedFromToken?.balance,
      });
    },
    [selectedFromToken?.balance, setValuesDebouncedSubject]
  );

  // reload and recalculate the data from the history
  useEffect(() => {
    if (Object.keys(pageHistory).length && !isHistoryLoaded.current) {
      const historyFromToken = pageHistory.selectedFromToken
        ? {
            ...pageHistory.selectedFromToken,
            balance: pageHistory.selectedFromToken.balance,
          }
        : undefined;
      setSelectedFromToken(historyFromToken);
      setMaxFromValue(historyFromToken?.balance);
      const historyToToken = pageHistory.selectedToToken
        ? {
            ...pageHistory.selectedToToken,
            balance: pageHistory.selectedToToken.balance,
          }
        : undefined;
      setSelectedToToken(historyToToken);
      const tokenValueBN =
        pageHistory.tokenValue && pageHistory.tokenValue.bn
          ? pageHistory.tokenValue.bn
          : new BN(0);
      if (pageHistory.destinationInputField === 'from') {
        setToTokenValue({
          bn: tokenValueBN,
          amount: bnToLocaleString(tokenValueBN),
        });
      } else {
        setFromDefaultValue(tokenValueBN);
      }
      calculateTokenValueToInput(
        {
          bn: tokenValueBN,
          amount: bnToLocaleString(tokenValueBN),
        },
        pageHistory.destinationInputField || 'to',
        historyFromToken,
        historyToToken
      );
      isHistoryLoaded.current = true;
    }
  }, [calculateTokenValueToInput, pageHistory]);

  const onGasChange = useCallback(
    (values: {
      customGasLimit?: number | undefined;
      maxFeePerGas: BigNumber;
      maxPriorityFeePerGas?: BigNumber | undefined;
      feeType: GasFeeModifier;
      error?: boolean;
    }) => {
      if (values.customGasLimit) {
        setGasLimit(values.customGasLimit);
      }
      setCustomGasPrice(values.maxFeePerGas);
      setSelectedGasFee(values.feeType);
      if (!selectedFromToken) {
        return;
      }

      const max = getMaxValueWithGas({
        customGasPrice: values.maxFeePerGas,
        gasLimit: values.customGasLimit || swapGasLimit,
        avaxPrice,
        tokenDecimals: network?.networkToken.decimals,
        selectedFromToken,
      });

      max && setMaxFromValue(max);
      if (values.error) {
        setError({ message: t('Insufficient balance to cover gas costs') });
        return;
      }
      setError({ message: '' });
    },
    [avaxPrice, network?.networkToken.decimals, selectedFromToken, swapGasLimit]
  );

  const calculateSwapValue = ({
    fromToken,
    toToken,
    fromValue,
  }: {
    fromToken?: TokenWithBalance;
    toToken?: TokenWithBalance;
    fromValue?: Amount;
  }) => {
    if (!fromToken || !toToken) {
      return;
    }
    const amount = {
      amount: fromValue?.amount || '0',
      bn: stringToBN(fromValue?.amount || '0', fromToken.decimals || 18),
    };
    calculateTokenValueToInput(amount, 'to', fromToken, toToken);
  };

  const reverseTokens = (
    reversed: boolean,
    fromToken?: TokenWithBalance,
    toToken?: TokenWithBalance,
    fromValue?: Amount
  ) => {
    if (
      !tokensWBalances.some(
        (token) =>
          token.name === toToken?.name && token.symbol === toToken?.symbol
      )
    ) {
      setSwapWarning(
        t(`You don't have any {{symbol}} token for swap`, {
          symbol: toToken?.symbol,
        })
      );
      return;
    }
    setSelectedFromToken(fromToken);
    setSelectedToToken(toToken);
    setIsReversed(!reversed);
    calculateSwapValue({
      fromToken,
      toToken,
      fromValue,
    });
  };

  const onTokenChange = ({
    token,
    destination,
    toToken,
    fromToken,
    fromValue,
  }: {
    token: TokenWithBalance;
    destination: 'from' | 'to';
    toToken?: TokenWithBalance;
    fromToken?: TokenWithBalance;
    fromValue?: Amount;
  }) => {
    setSwapWarning('');
    if (destination === 'to') {
      setSelectedFromToken(token);
      setMaxFromValue(token?.balance);
    } else {
      setSelectedToToken(token);
    }
    const data =
      destination === 'to'
        ? { fromToken: token, toToken, fromValue }
        : { fromToken, toToken: token, fromValue };
    calculateSwapValue(data);
    setNavigationHistoryData({
      ...data,
      destination,
    });
    sendTokenSelectedAnalytics('Swap');
  };

  const onFromInputAmountChange = (value: Amount) => {
    setFromDefaultValue(value.bn);
    setFromTokenValue(value as any);
    calculateTokenValueToInput(value, 'to', selectedFromToken, selectedToToken);
    setNavigationHistoryData({
      selectedFromToken,
      selectedToToken,
      tokenValue: value,
      destinationInputField: 'to',
    });
    sendAmountEnteredAnalytics('Swap');
  };

  const onToInputAmountChange = (value: Amount) => {
    setToTokenValue(value as any);
    calculateTokenValueToInput(
      value as any,
      'from',
      selectedFromToken,
      selectedToToken
    );
    setNavigationHistoryData({
      selectedFromToken,
      selectedToToken,
      tokenValue: value,
      destinationInputField: 'from',
    });
    sendAmountEnteredAnalytics('Swap');
  };

  const getSwapValues = () => setValuesDebouncedSubject.getValue();

  return {
    calculateTokenValueToInput,
    onGasChange,
    reverseTokens,
    onTokenChange,
    onFromInputAmountChange,
    onToInputAmountChange,
    setValuesDebouncedSubject,
    customGasPrice,
    gasLimit: swapGasLimit || gasLimit,
    selectedFromToken,
    selectedToToken,
    destinationInputField,
    fromTokenValue,
    swapError: swapError.message ? swapError : error,
    isLoading: isSwapLoading,
    defaultFromValue,
    swapWarning,
    isReversed,
    selectedGasFee,
    toTokenValue,
    maxFromValue,
    optimalRate,
    destAmount,
    getSwapValues,
  };
}
