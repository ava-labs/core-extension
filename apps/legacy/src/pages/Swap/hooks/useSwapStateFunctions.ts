import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { bigIntToString } from '@avalabs/core-utils-sdk';

import { USDC_ADDRESSES } from '@core/common';
import { DestinationInput, useTokensWithBalances } from '@core/ui';
import { usePageHistory } from '@core/ui';
import { useSendAnalyticsData } from '@core/ui';
import { DISALLOWED_SWAP_ASSETS } from '@core/ui';
import { stringToBigint } from '@core/common';

import { Amount, getTokenAddress } from '../utils';
import { useTokensBySymbols } from './useTokensBySymbols';
import { SwappableToken } from '../models';
import { useSwapContext } from '@core/ui';

export const DEFAULT_SLIPPAGE = '0.2';

export function useSwapStateFunctions() {
  const {
    setError,
    srcAmount,
    setSrcAmount,
    destAmount,
    setDestAmount,
    swapFormValuesStream,
    error,
    isSwapLoading,
    setIsSwapLoading,
    quotes,
    setQuotes,
    manuallySelected,
    setManuallySelected,
  } = useSwapContext();
  const tokensWBalances = useTokensWithBalances({
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
  });
  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();
  const pageHistory: {
    selectedFromToken?: SwappableToken;
    selectedToToken?: SwappableToken;
    destinationInputField?: DestinationInput;
    tokenValue?: bigint;
    isLoading: boolean;
  } = getPageHistoryData();

  const [destinationInputField, setDestinationInputField] =
    useState<DestinationInput>('');

  const [selectedFromToken, setSelectedFromToken] = useState<SwappableToken>();
  const [selectedToToken, setSelectedToToken] = useState<SwappableToken>();
  const [isReversed, setIsReversed] = useState(false);
  const [swapWarning, setSwapWarning] = useState('');
  const [defaultFromValue, setFromDefaultValue] = useState<bigint>();
  const [fromTokenValue, setFromTokenValue] = useState<Amount>();
  const [toTokenValue, setToTokenValue] = useState<Amount>();
  const [slippageTolerance, setSlippageTolerance] = useState(DEFAULT_SLIPPAGE);

  const updateSlippage = useCallback(
    (value: string) => {
      const sanitizedValue = value.trim() === '' ? '0' : value;

      setSlippageTolerance(sanitizedValue);
      swapFormValuesStream.next({
        ...swapFormValuesStream.getValue(),
        slippageTolerance: sanitizedValue,
      });
    },
    [swapFormValuesStream],
  );

  const calculateTokenValueToInput = useCallback(
    (
      amount: bigint,
      destinationInput: DestinationInput,
      sourceToken?: SwappableToken,
      destinationToken?: SwappableToken,
    ) => {
      if (!sourceToken || !destinationToken) {
        return;
      }

      setSwapWarning('');
      setDestinationInputField(destinationInput);
      swapFormValuesStream.next({
        ...swapFormValuesStream.getValue(),
        fromTokenAddress: getTokenAddress(sourceToken),
        toTokenAddress: getTokenAddress(destinationToken),
        fromTokenDecimals: sourceToken.decimals,
        toTokenDecimals: destinationToken.decimals,
        amount,
        destinationInputField: destinationInput,
        fromTokenBalance: sourceToken?.balance,
        slippageTolerance,
      });
    },
    [swapFormValuesStream, slippageTolerance],
  );

  const { $NATIVE, USDC } = useTokensBySymbols({
    $NATIVE: true,
    USDC: USDC_ADDRESSES,
  });

  // reload and recalculate the data from the history
  useEffect(() => {
    if (
      pageHistory &&
      !pageHistory.isLoading &&
      !selectedFromToken &&
      !selectedToToken
    ) {
      const historyFromToken = pageHistory.selectedFromToken
        ? {
            ...pageHistory.selectedFromToken,
            balance: pageHistory.selectedFromToken.balance,
          }
        : $NATIVE;
      setSelectedFromToken(historyFromToken);
      const historyToToken = pageHistory.selectedToToken
        ? {
            ...pageHistory.selectedToToken,
            balance: pageHistory.selectedToToken.balance,
          }
        : USDC;
      setSelectedToToken(historyToToken);
      const tokenValueBigint = pageHistory.tokenValue ?? 0n;
      if (pageHistory.destinationInputField === 'from') {
        setToTokenValue({
          bigint: tokenValueBigint,
          amount: bigIntToString(
            tokenValueBigint,
            historyToToken?.decimals ?? 18,
          ),
        });
      } else {
        setFromDefaultValue(tokenValueBigint);
      }
      calculateTokenValueToInput(
        tokenValueBigint,
        pageHistory.destinationInputField || 'to',
        historyFromToken,
        historyToToken,
      );
    }
  }, [
    calculateTokenValueToInput,
    pageHistory,
    USDC,
    $NATIVE,
    selectedFromToken,
    selectedToToken,
  ]);

  const resetValues = useCallback(
    (clearTokens?: boolean) => {
      setFromTokenValue(undefined);
      setFromDefaultValue(undefined);
      setToTokenValue(undefined);
      setSwapWarning('');
      setDestinationInputField('');

      if (clearTokens) {
        setSelectedFromToken($NATIVE);
        setSelectedToToken(USDC);
      }

      swapFormValuesStream.next({
        ...swapFormValuesStream.getValue(),
        amount: undefined,
        destinationInputField: undefined,
      });
    },
    [swapFormValuesStream, $NATIVE, USDC],
  );

  const calculateSwapValue = ({
    fromToken,
    toToken,
    fromValue,
    toValue,
  }: {
    fromToken?: SwappableToken;
    toToken?: SwappableToken;
    fromValue?: Amount;
    toValue?: Amount;
  }) => {
    if (!fromToken || !toToken) {
      return;
    }
    if (fromValue) {
      calculateTokenValueToInput(fromValue.bigint, 'to', fromToken, toToken);
    } else if (toValue) {
      calculateTokenValueToInput(toValue.bigint, 'from', fromToken, toToken);
    } else {
      resetValues();
    }
  };

  const reverseTokens = (
    fromToken?: SwappableToken,
    toToken?: SwappableToken,
  ) => {
    if (
      !tokensWBalances.some(
        (token) =>
          token.name === toToken?.name && token.symbol === toToken?.symbol,
      )
    ) {
      setSwapWarning(
        t(`You don't have any {{symbol}} token for swap`, {
          symbol: toToken?.symbol,
        }),
      );
      return;
    }
    setError({ message: '' });
    setSelectedFromToken(toToken);
    setSelectedToToken(fromToken);
    setIsReversed((reversed) => reversed);

    if (!toToken || !fromToken || !destAmount) {
      return;
    }

    const fromValue =
      destinationInputField === 'to'
        ? {
            amount: bigIntToString(BigInt(destAmount), fromToken.decimals),
            bigint: BigInt(destAmount),
          }
        : toTokenValue;
    setSrcAmount(undefined);
    setDestAmount(undefined);
    setFromTokenValue(fromValue);
    setToTokenValue(undefined);

    if (fromValue) {
      setFromDefaultValue(fromValue.bigint);
      setIsSwapLoading(true);
      calculateTokenValueToInput(fromValue.bigint, 'to', toToken, fromToken);
    }
  };

  const onTokenChange = ({
    fromToken,
    toToken,
  }:
    | {
        fromToken: SwappableToken;
        toToken?: never;
      }
    | {
        toToken: SwappableToken;
        fromToken?: never;
      }) => {
    sendTokenSelectedAnalytics('Swap');
    setSwapWarning('');

    if (fromToken) {
      setSelectedFromToken(fromToken);
    } else if (toToken) {
      setSelectedToToken(toToken);
    }

    const data = {
      toToken: toToken ?? selectedToToken,
      fromToken: fromToken ?? selectedFromToken,
      fromValue: destinationInputField === 'to' ? fromTokenValue : undefined,
      toValue: destinationInputField === 'to' ? undefined : toTokenValue,
    };

    const newTokenDecimals = (toToken ?? fromToken).decimals;
    const prevTokenDecimals = (toToken ? selectedToToken : selectedFromToken)
      ?.decimals;
    const decimalsDiff =
      typeof prevTokenDecimals === 'number'
        ? newTokenDecimals - prevTokenDecimals
        : 0;

    // If previous and new token have different denominations,
    // we need to recalculate the amount.
    const currentAmount =
      destinationInputField === 'to' && fromToken
        ? fromTokenValue
        : destinationInputField === 'from' && toToken
          ? toTokenValue
          : undefined;

    if (decimalsDiff && currentAmount) {
      const amount = {
        amount: currentAmount.amount,
        bigint: stringToBigint(currentAmount.amount, newTokenDecimals),
      };

      if (fromToken) {
        setFromDefaultValue(amount.bigint);
        setFromTokenValue(amount);
        calculateTokenValueToInput(
          amount.bigint,
          destinationInputField,
          fromToken,
          selectedToToken,
        );
      } else if (toToken) {
        setToTokenValue(amount);
        calculateTokenValueToInput(
          amount.bigint,
          destinationInputField,
          selectedToToken,
          toToken,
        );
      }
    } else {
      calculateSwapValue(data);
    }
    setNavigationHistoryData({
      selectedFromToken: data.fromToken,
      selectedToToken: data.toToken,
      tokenValue: (data.fromValue ?? data.toValue)?.bigint,
      destinationInputField,
    });
  };

  const onFromInputAmountChange = (value: Amount) => {
    setSrcAmount(undefined);
    setDestAmount(undefined);
    setFromDefaultValue(value.bigint);
    setFromTokenValue(value);
    calculateTokenValueToInput(
      value.bigint,
      'to',
      selectedFromToken,
      selectedToToken,
    );
    setNavigationHistoryData({
      selectedFromToken,
      selectedToToken,
      tokenValue: value.bigint,
      destinationInputField: 'to',
    });
    sendAmountEnteredAnalytics('Swap');
  };

  const onToInputAmountChange = (value: Amount) => {
    setSrcAmount(undefined);
    setDestAmount(undefined);
    setToTokenValue(value);
    calculateTokenValueToInput(
      value.bigint,
      'from',
      selectedFromToken,
      selectedToToken,
    );
    setNavigationHistoryData({
      selectedFromToken,
      selectedToToken,
      tokenValue: value.bigint,
      destinationInputField: 'from',
    });
    sendAmountEnteredAnalytics('Swap');
  };

  const getSwapValues = () => swapFormValuesStream.getValue();

  return {
    calculateTokenValueToInput,
    reverseTokens,
    onTokenChange,
    onFromInputAmountChange,
    onToInputAmountChange,
    swapFormValuesStream,
    selectedFromToken,
    selectedToToken,
    destinationInputField,
    fromTokenValue,
    swapError: error.message ? error : null,
    isLoading: isSwapLoading,
    defaultFromValue,
    swapWarning,
    isReversed,
    toTokenValue,
    quotes,
    setQuotes,
    manuallySelected,
    setManuallySelected,
    srcAmount,
    destAmount,
    slippageTolerance,
    updateSlippage,
    getSwapValues,
    resetValues,
  };
}
