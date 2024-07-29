import { TokenWithBalance } from '@src/background/services/balances/models';
import { t } from 'i18next';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Amount, DestinationInput, getTokenAddress } from '../utils';
import { stringToBN } from '@avalabs/utils-sdk';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';
import BN from 'bn.js';
import { bnToLocaleString } from '@avalabs/utils-sdk';
import { useSwap } from './useSwap';
import { DISALLOWED_SWAP_ASSETS } from '@src/contexts/SwapProvider/models';

export function useSwapStateFunctions() {
  const tokensWBalances = useTokensWithBalances({
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
  });
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

  const [selectedFromToken, setSelectedFromToken] =
    useState<TokenWithBalance>();
  const [selectedToToken, setSelectedToToken] = useState<TokenWithBalance>();
  const [isReversed, setIsReversed] = useState(false);
  const [swapWarning, setSwapWarning] = useState('');
  const [defaultFromValue, setFromDefaultValue] = useState<BN>();
  const [fromTokenValue, setFromTokenValue] = useState<Amount>();
  const [toTokenValue, setToTokenValue] = useState<Amount>();
  const [maxFromValue, setMaxFromValue] = useState<BN | undefined>();
  const isHistoryLoaded = useRef<boolean>(false);

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

  const resetValues = () => {
    setFromTokenValue(undefined);
    setFromDefaultValue(undefined);
    setToTokenValue(undefined);
    setSwapWarning('');
    setDestinationInputField('');

    setValuesDebouncedSubject.next({
      ...setValuesDebouncedSubject.getValue(),
      amount: undefined,
      destinationInputField: undefined,
    });
  };

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
    const amount = fromValue
      ? ({
          amount: fromValue.amount || '0',
          bn: stringToBN(fromValue.amount || '0', fromToken.decimals || 18),
        } as Amount)
      : undefined;
    if (amount) {
      calculateTokenValueToInput(amount, 'to', fromToken, toToken);
    } else {
      resetValues();
    }
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
    setSelectedFromToken(toToken);
    setSelectedToToken(fromToken);
    setIsReversed(!reversed);
    calculateSwapValue({
      fromToken: toToken,
      toToken: fromToken,
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
    reverseTokens,
    onTokenChange,
    onFromInputAmountChange,
    onToInputAmountChange,
    setValuesDebouncedSubject,
    selectedFromToken,
    swapGasLimit,
    selectedToToken,
    destinationInputField,
    fromTokenValue,
    swapError: swapError.message ? swapError : null,
    isLoading: isSwapLoading,
    defaultFromValue,
    swapWarning,
    isReversed,
    toTokenValue,
    maxFromValue,
    optimalRate,
    destAmount,
    getSwapValues,
  };
}
