import { t } from 'i18next';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Amount, DestinationInput, getTokenAddress } from '../utils';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';
import { useSwap } from './useSwap';
import { DISALLOWED_SWAP_ASSETS } from '@src/contexts/SwapProvider/models';
import {
  NetworkTokenWithBalance,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';
import { stringToBigint } from '@src/utils/stringToBigint';
import { TokenUnit } from '@avalabs/core-utils-sdk';

export function useSwapStateFunctions({
  defaultFromToken,
  defaultToToken,
}: {
  defaultFromToken: NetworkTokenWithBalance | TokenWithBalanceERC20;
  defaultToToken: NetworkTokenWithBalance | TokenWithBalanceERC20;
}) {
  const tokensWBalances = useTokensWithBalances({
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
  });
  const { setNavigationHistoryData } = usePageHistory();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();
  const { getPageHistoryData } = usePageHistory();
  const pageHistory: {
    selectedFromToken?: NetworkTokenWithBalance | TokenWithBalanceERC20;
    selectedToToken?: NetworkTokenWithBalance | TokenWithBalanceERC20;
    destinationInputField?: DestinationInput;
    tokenValue?: Amount;
    isLoading: boolean;
  } = getPageHistoryData();

  const [destinationInputField, setDestinationInputField] =
    useState<DestinationInput>('');

  const [selectedFromToken, setSelectedFromToken] = useState<
    NetworkTokenWithBalance | TokenWithBalanceERC20
  >();

  const [selectedToToken, setSelectedToToken] = useState<
    NetworkTokenWithBalance | TokenWithBalanceERC20
  >();
  const [isReversed, setIsReversed] = useState(false);
  const [swapWarning, setSwapWarning] = useState('');
  const [defaultFromValue, setFromDefaultValue] = useState<bigint>();
  const [fromTokenValue, setFromTokenValue] = useState<Amount>();
  const [toTokenValue, setToTokenValue] = useState<Amount>();
  const [maxFromValue, setMaxFromValue] = useState<bigint | undefined>();
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
      sourceToken?: NetworkTokenWithBalance | TokenWithBalanceERC20,
      destinationToken?: NetworkTokenWithBalance | TokenWithBalanceERC20,
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
    [selectedFromToken?.balance, setValuesDebouncedSubject],
  );

  // reload and recalculate the data from the history
  useEffect(() => {
    if (
      Object.keys(pageHistory).length > 1 &&
      !pageHistory.isLoading &&
      !isHistoryLoaded.current
    ) {
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
      const tokenValueBigint =
        pageHistory.tokenValue && pageHistory.tokenValue.bigint
          ? pageHistory.tokenValue.bigint
          : 0n;
      if (pageHistory.destinationInputField === 'from') {
        setToTokenValue({
          bigint: tokenValueBigint,
          amount: new TokenUnit(
            tokenValueBigint,
            pageHistory.selectedToToken?.decimals ?? 18,
            '',
          ).toDisplay(),
        });
      } else {
        setFromDefaultValue(tokenValueBigint);
      }
      calculateTokenValueToInput(
        {
          bigint: tokenValueBigint,
          amount: new TokenUnit(
            tokenValueBigint,
            pageHistory.selectedToToken?.decimals ?? 18,
            '',
          ).toDisplay(),
        },
        pageHistory.destinationInputField || 'to',
        historyFromToken,
        historyToToken,
      );

      isHistoryLoaded.current = true;
    }

    if (
      !pageHistory.selectedFromToken &&
      !pageHistory.selectedToToken &&
      !pageHistory.isLoading &&
      !isHistoryLoaded.current &&
      defaultFromToken &&
      defaultFromToken
    ) {
      setSelectedFromToken(defaultFromToken);
      setSelectedToToken(defaultToToken);
      isHistoryLoaded.current = true;
    }
  }, [
    calculateTokenValueToInput,
    defaultFromToken,
    defaultToToken,
    pageHistory,
  ]);

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
    fromToken?: NetworkTokenWithBalance | TokenWithBalanceERC20;
    toToken?: NetworkTokenWithBalance | TokenWithBalanceERC20;
    fromValue?: Amount;
  }) => {
    if (!fromToken || !toToken) {
      return;
    }
    const amount = fromValue
      ? ({
          amount: fromValue.amount || '0',
          bigint: stringToBigint(
            fromValue.amount || '0',
            fromToken.decimals || 18,
          ),
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
    fromToken?: NetworkTokenWithBalance | TokenWithBalanceERC20,
    toToken?: NetworkTokenWithBalance | TokenWithBalanceERC20,
    fromValue?: Amount,
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
    token: NetworkTokenWithBalance | TokenWithBalanceERC20;
    destination: 'from' | 'to';
    toToken?: NetworkTokenWithBalance | TokenWithBalanceERC20;
    fromToken?: NetworkTokenWithBalance | TokenWithBalanceERC20;
    fromValue?: Amount;
  }) => {
    setSwapWarning('');
    if (destination === 'to') {
      setSelectedFromToken(token);
      setMaxFromValue(token?.balance);
      if (!toToken) {
        return;
      }
      setSelectedToToken(toToken);
    } else {
      setSelectedToToken(token);
    }
    const data =
      destination === 'to'
        ? { selectedFromToken: token, selectedToToken: toToken, fromValue }
        : { selectedFromToken: fromToken, selectedToToken: token, fromValue };
    calculateSwapValue(data);
    setNavigationHistoryData({
      ...data,
      destination,
    });
    sendTokenSelectedAnalytics('Swap');
  };

  const onFromInputAmountChange = (value: Amount) => {
    setFromDefaultValue(value.bigint);
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
      selectedToToken,
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
