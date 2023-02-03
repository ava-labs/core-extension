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
import { GasFeeModifier } from '@src/components/common/CustomFees';
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
    networkFee?.low
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
      const selectedFromToken = pageHistory.selectedFromToken
        ? {
            ...pageHistory.selectedFromToken,
            balance: pageHistory.selectedFromToken.balance,
          }
        : undefined;
      setSelectedFromToken(selectedFromToken);
      setMaxFromValue(selectedFromToken?.balance);
      const selectedToToken = pageHistory.selectedToToken
        ? {
            ...pageHistory.selectedToToken,
            balance: pageHistory.selectedToToken.balance,
          }
        : undefined;
      setSelectedToToken(selectedToToken);
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
        selectedFromToken,
        selectedToToken
      );
      isHistoryLoaded.current = true;
    }
  }, [calculateTokenValueToInput, pageHistory]);

  const onGasChange = useCallback(
    (values: {
      customGasLimit?: number;
      gasPrice: BigNumber;
      feeType: GasFeeModifier;
      error?: boolean;
    }) => {
      if (values.customGasLimit) {
        setGasLimit(values.customGasLimit);
      }
      setCustomGasPrice(values.gasPrice);
      setSelectedGasFee(values.feeType);
      if (!selectedFromToken) {
        return;
      }

      const max = getMaxValueWithGas({
        customGasPrice: values.gasPrice,
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
    selectedFromToken,
    selectedToToken,
    fromTokenValue,
  }: {
    selectedFromToken?: TokenWithBalance;
    selectedToToken?: TokenWithBalance;
    fromTokenValue?: Amount;
  }) => {
    if (!selectedFromToken || !selectedToToken) {
      return;
    }
    const amount = {
      amount: fromTokenValue?.amount || '0',
      bn: stringToBN(
        fromTokenValue?.amount || '0',
        selectedFromToken.decimals || 18
      ),
    };
    calculateTokenValueToInput(
      amount,
      'to',
      selectedFromToken,
      selectedToToken
    );
  };

  const reverseTokens = (
    isReversed: boolean,
    selectedFromToken?: TokenWithBalance,
    selectedToToken?: TokenWithBalance,
    fromTokenValue?: Amount
  ) => {
    if (
      !tokensWBalances.some(
        (token) =>
          token.name === selectedToToken?.name &&
          token.symbol === selectedToToken?.symbol
      )
    ) {
      setSwapWarning(
        t(`You don't have any {{symbol}} token for swap`, {
          symbol: selectedToToken?.symbol,
        })
      );
      return;
    }
    const [to, from] = [selectedFromToken, selectedToToken];
    setSelectedFromToken(from);
    setSelectedToToken(to);
    setIsReversed(!isReversed);
    calculateSwapValue({
      selectedFromToken: from,
      selectedToToken: to,
      fromTokenValue,
    });
  };

  const onTokenChange = ({
    token,
    destination,
    selectedToToken,
    selectedFromToken,
    fromTokenValue,
  }: {
    token: TokenWithBalance;
    destination: 'from' | 'to';
    selectedToToken?: TokenWithBalance;
    selectedFromToken?: TokenWithBalance;
    fromTokenValue?: Amount;
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
        ? { selectedFromToken: token, selectedToToken, fromTokenValue }
        : { selectedFromToken, selectedToToken: token, fromTokenValue };
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
