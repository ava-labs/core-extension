import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import {
  NetworkTokenWithBalance,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';

import { USDC_ADDRESS_C_CHAIN } from '@src/utils/constants';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';
import { useSwap } from './useSwap';
import { DISALLOWED_SWAP_ASSETS } from '@src/contexts/SwapProvider/models';
import { Amount, DestinationInput, getTokenAddress } from '../utils';
import { useTokensBySymbols } from './useTokensBySymbols';

export function useSwapStateFunctions() {
  const tokensWBalances = useTokensWithBalances({
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
  });
  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();
  const pageHistory: {
    selectedFromToken?: NetworkTokenWithBalance | TokenWithBalanceERC20;
    selectedToToken?: NetworkTokenWithBalance | TokenWithBalanceERC20;
    destinationInputField?: DestinationInput;
    tokenValue?: bigint;
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
      amount: bigint,
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

  const { AVAX, USDC } = useTokensBySymbols({
    AVAX: true,
    USDC: USDC_ADDRESS_C_CHAIN,
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
        : AVAX;
      setSelectedFromToken(historyFromToken);
      setMaxFromValue(historyFromToken?.balance);
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
            historyToToken?.decimals ?? 18
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
    AVAX,
    USDC,
    selectedFromToken,
    selectedToToken,
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
    if (fromValue) {
      calculateTokenValueToInput(fromValue.bigint, 'to', fromToken, toToken);
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
        ? { fromToken: token, toToken, fromValue }
        : { fromToken, toToken: token, fromValue };
    calculateSwapValue(data);
    setNavigationHistoryData({
      selectedFromToken: data.fromToken,
      selectedToToken: data.toToken,
      tokenValue: data.fromValue?.bigint,
      destination,
    });
    sendTokenSelectedAnalytics('Swap');
  };

  const onFromInputAmountChange = (value: Amount) => {
    setFromDefaultValue(value.bigint);
    setFromTokenValue(value);
    calculateTokenValueToInput(
      value.bigint,
      'to',
      selectedFromToken,
      selectedToToken
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
