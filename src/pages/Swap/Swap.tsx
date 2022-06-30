import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  PrimaryButton,
  SwitchIcon,
  ComponentSize,
  IconDirection,
  LoadingSpinnerIcon,
  TransactionToastType,
  TransactionToast,
  toast,
  WarningIcon,
} from '@avalabs/react-components';
import { useSwapContext } from '@src/contexts/SwapProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { OptimalRate, SwapSide } from 'paraswap-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { stringToBN, bnToLocaleString, hexToBN } from '@avalabs/utils-sdk';
import styled, { useTheme } from 'styled-components';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { resolve } from '@src/utils/promiseResolver';
import { TransactionDetails } from './components/TransactionDetails';
import { ReviewOrder } from './components/ReviewOrder';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { getMaxValue, getTokenAddress, isAPIError } from './utils';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { PageTitle } from '@src/components/common/PageTitle';
import { TokenSelect } from '@src/components/common/TokenSelect';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useHistory } from 'react-router-dom';
import { GasFeeModifier } from '@src/components/common/CustomFees';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SwitchIconContainer } from '@src/components/common/SwitchIconContainer';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { ParaswapNotice } from './components/ParaswapNotice';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';
import { FunctionIsUnavailable } from '@src/components/common/FunctionIsUnavailable';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';
import { BigNumber } from 'ethers';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import BN from 'bn.js';
import { WalletType } from '@src/background/services/wallet/models';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';

export interface Token {
  icon?: JSX.Element;
  name?: string;
}

export interface SwapRate extends OptimalRate {
  status?: number;
  message?: string;
}

interface Amount {
  bn: BN;
  amount: string;
}

const ReviewOrderButtonContainer = styled.div<{
  isTransactionDetailsOpen: boolean;
}>`
  position: ${({ isTransactionDetailsOpen }) =>
    isTransactionDetailsOpen ? 'static' : 'absolute'};
  bottom: 0;
  left: 0;
  width: 100%;
`;

const TryAgainButton = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

export function Swap() {
  const { flags, capture } = useAnalyticsContext();
  const { walletType } = useWalletContext();
  const { network } = useNetworkContext();
  const { getRate, swap } = useSwapContext();
  const { networkFee } = useNetworkFeeContext();

  const { isFunctionAvailable: isSwapAvailable } =
    useIsFunctionAvailable('Swap');

  const history = useHistory();
  const theme = useTheme();
  const tokensWBalances = useTokensWithBalances();
  const allTokensOnNetwork = useTokensWithBalances(true);
  const avaxPrice = useNativeTokenPrice();
  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const pageHistory: {
    selectedFromToken?: TokenWithBalance;
    selectedToToken?: TokenWithBalance;
    destinationInputField?: 'from' | 'to' | '';
    tokenValue?: Amount;
  } = getPageHistoryData();

  const [swapError, setSwapError] = useState<{
    message: string;
    hasTryAgain?: boolean;
  }>({ message: '' });
  const [swapWarning, setSwapWarning] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txInProgress, setTxInProgress] = useState<boolean>(false);
  const [isReviewOrderOpen, setIsReviewOrderOpen] = useState<boolean>(false);
  const [selectedToToken, setSelectedToToken] = useState<TokenWithBalance>();
  const [optimalRate, setOptimalRate] = useState<OptimalRate>();
  const [selectedFromToken, setSelectedFromToken] =
    useState<TokenWithBalance>();

  const [gasLimit, setGasLimit] = useState<number>(0);
  const [customGasPrice, setCustomGasPrice] = useState<BigNumber | undefined>(
    networkFee?.low
  );

  const [gasCost, setGasCost] = useState('');
  const [destAmount, setDestAmount] = useState('');
  const [destinationInputField, setDestinationInputField] = useState<
    'from' | 'to' | ''
  >('');

  const [fromTokenValue, setFromTokenValue] = useState<Amount>();
  const [toTokenValue, setToTokenValue] = useState<Amount>();
  const [maxFromValue, setMaxFromValue] = useState<BN | undefined>();
  const [slippageTolerance, setSlippageTolerance] = useState('1');

  const [defaultFromValue, setFromDefaultValue] = useState<BN>();
  const [isCalculateAvaxMax, setIsCalculateAvaxMax] = useState(false);

  const [isFromTokenSelectOpen, setIsFromTokenSelectOpen] = useState(false);
  const [isToTokenSelectOpen, setIsToTokenSelectOpen] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] =
    useState(false);
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.INSTANT
  );
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();

  const setValuesDebouncedSubject = useMemo(() => {
    return new BehaviorSubject<{
      amount?: Amount;
      toTokenAddress?: string;
      fromTokenAddress?: string;
      toTokenDecimals?: number;
      fromTokenDecimals?: number;
    }>({});
  }, []);

  const calculateTokenValueToInput = useCallback(
    (
      amount: Amount,
      destinationInput: 'from' | 'to' | '',
      sourceToken?: TokenWithBalance,
      destinationToken?: TokenWithBalance
    ) => {
      if (!sourceToken || !destinationToken) {
        return;
      }
      setDestinationInputField(destinationInput);
      setIsLoading(true);
      setIsTransactionDetailsOpen(false);
      setValuesDebouncedSubject.next({
        ...setValuesDebouncedSubject.getValue(),
        fromTokenAddress: getTokenAddress(sourceToken),
        toTokenAddress: getTokenAddress(destinationToken),
        fromTokenDecimals: sourceToken.decimals,
        toTokenDecimals: destinationToken.decimals,
        amount,
      });
    },
    [setValuesDebouncedSubject]
  );

  const calculateRate = (optimalRate: OptimalRate) => {
    const { destAmount, destDecimals, srcAmount, srcDecimals } = optimalRate;
    const destAmountNumber =
      parseInt(destAmount, 10) / Math.pow(10, destDecimals);
    const sourceAmountNumber =
      parseInt(srcAmount, 10) / Math.pow(10, srcDecimals);
    return destAmountNumber / sourceAmountNumber;
  };

  // reload and recalculate the data from the history
  useEffect(() => {
    if (pageHistory) {
      const selectedFromToken = pageHistory.selectedFromToken
        ? {
            ...pageHistory.selectedFromToken,
            balance: hexToBN(pageHistory.selectedFromToken.balance.toString()),
          }
        : undefined;
      setSelectedFromToken(selectedFromToken);
      const selectedToToken = pageHistory.selectedToToken
        ? {
            ...pageHistory.selectedToToken,
            balance: hexToBN(pageHistory.selectedToToken.balance.toString()),
          }
        : undefined;
      setSelectedToToken(selectedToToken);
      const tokenValueBN =
        pageHistory.tokenValue && pageHistory.tokenValue.bn
          ? hexToBN(pageHistory.tokenValue.bn.toString())
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
    }
  }, [calculateTokenValueToInput, pageHistory]);

  useEffect(() => {
    if (
      customGasPrice &&
      gasLimit &&
      selectedFromToken?.type === TokenType.NATIVE
    ) {
      const newFees = calculateGasAndFees({
        gasPrice: customGasPrice,
        gasLimit,
        tokenPrice: avaxPrice,
        tokenDecimals: network?.networkToken.decimals,
      });

      setGasCost(newFees.fee);
      const max = getMaxValue(selectedFromToken, newFees.fee);

      setMaxFromValue(max);
      if (!max) {
        return;
      }
      if (isCalculateAvaxMax) {
        setFromDefaultValue(max);
        calculateTokenValueToInput(
          {
            bn: max,
            amount: max.toString(),
          },
          'to',
          selectedFromToken,
          selectedToToken
        );
      }
      return;
    }
    setMaxFromValue(selectedFromToken?.balance);
  }, [
    avaxPrice,
    calculateTokenValueToInput,
    isCalculateAvaxMax,
    gasCost,
    gasLimit,
    selectedFromToken,
    selectedToToken,
    customGasPrice,
    network,
  ]);

  useEffect(() => {
    const subscription = setValuesDebouncedSubject
      .pipe(debounceTime(500))
      .subscribe(
        ({
          amount,
          toTokenAddress,
          fromTokenAddress,
          toTokenDecimals,
          fromTokenDecimals,
        }) => {
          if (
            amount &&
            toTokenAddress &&
            fromTokenAddress &&
            fromTokenDecimals &&
            toTokenDecimals
          ) {
            const amountString = amount.bn.toString();
            if (amountString === '0') {
              setSwapError({ message: 'Please enter an amount' });
              setIsLoading(false);
              return;
            }
            const swapSide =
              destinationInputField === 'to' ? SwapSide.SELL : SwapSide.BUY;
            setIsLoading(true);
            getRate(
              fromTokenAddress,
              fromTokenDecimals,
              toTokenAddress,
              toTokenDecimals,
              amountString,
              swapSide
            )
              .then((result) => {
                /**
                 * This can be an error, the bacground tries 10x but if the
                 * server is still "busy" it sends the error
                 */
                if (isAPIError(result.optimalRate)) {
                  throw new Error(
                    `paraswap error message while get rate: ${result.optimalRate.message}`
                  );
                } else {
                  // Never modify the properies of the optimalRate since the swap API needs it unchanged
                  setOptimalRate(result.optimalRate);
                  setGasLimit(Number(result.optimalRate?.gasCost || 0));
                  const resultAmount =
                    destinationInputField === 'to'
                      ? result.optimalRate.destAmount
                      : result.optimalRate.srcAmount;

                  setDestAmount(resultAmount);
                }
              })
              .catch(() => {
                setOptimalRate(undefined);
                setSwapError({
                  message: 'Something went wrong, ',
                  hasTryAgain: true,
                });
              })
              .finally(() => {
                if (!isCalculateAvaxMax) {
                  setIsLoading(false);
                  return;
                }
                setIsCalculateAvaxMax(false);
              });
          } else {
            setOptimalRate(undefined);
          }
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, [
    destinationInputField,
    getRate,
    setValuesDebouncedSubject,
    isCalculateAvaxMax,
  ]);

  const calculateSwapValue = ({
    selectedFromToken,
    selectedToToken,
  }: {
    selectedFromToken?: TokenWithBalance;
    selectedToToken?: TokenWithBalance;
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

  const swapTokens = () => {
    if (
      !tokensWBalances.some(
        (token) =>
          token.name === selectedToToken?.name &&
          token.symbol === selectedToToken?.symbol
      )
    ) {
      setSwapWarning(
        `You don't have any ${selectedToToken?.symbol} token for swap`
      );
      return;
    }
    const [to, from] = [selectedFromToken, selectedToToken];
    setSelectedFromToken(from);
    setSelectedToToken(to);
    setIsSwapped(!isSwapped);
    calculateSwapValue({ selectedFromToken: from, selectedToToken: to });
  };

  async function onHandleSwap() {
    let toastId = '';
    if (walletType !== WalletType.LEDGER) {
      history.push('/home');
      toastId = toast.custom(
        <TransactionToast
          type={TransactionToastType.PENDING}
          text="Swap pending..."
          startIcon={
            <LoadingSpinnerIcon height="16px" color={theme.colors.icon1} />
          }
        />
      );
    }
    const {
      amount,
      fromTokenAddress,
      toTokenAddress,
      toTokenDecimals,
      fromTokenDecimals,
    } = setValuesDebouncedSubject.getValue();
    if (
      !networkFee ||
      !optimalRate?.gasCost ||
      !toTokenDecimals ||
      !toTokenAddress ||
      !fromTokenAddress ||
      !fromTokenDecimals ||
      !amount
    ) {
      return;
    }
    const slippage = slippageTolerance || '0';
    const [result, error] = await resolve(
      swap(
        fromTokenAddress,
        toTokenAddress,
        toTokenDecimals,
        fromTokenDecimals,
        optimalRate.srcAmount,
        optimalRate,
        optimalRate.destAmount,
        gasLimit,
        customGasPrice || networkFee.low,
        parseFloat(slippage)
      )
    );
    setTxInProgress(false);
    if (error) {
      toast.custom(
        <TransactionToast
          type={TransactionToastType.ERROR}
          text="Swap Failed"
          startIcon={<WarningIcon height="20px" color={theme.colors.icon1} />}
        />,
        { id: toastId, duration: Infinity }
      );
      setIsReviewOrderOpen(false);

      return;
    }
    toast.custom(
      <TransactionToast
        status="Swap Successful"
        type={TransactionToastType.SUCCESS}
        text="View in Explorer"
        href={
          network && getExplorerAddressByNetwork(network, result.swapTxHash)
        }
      />
    );
  }

  const onGasChange = useCallback(
    (limit: number, price: BigNumber, feeType: GasFeeModifier) => {
      setGasLimit(limit);
      setCustomGasPrice(price);
      setSelectedGasFee(feeType);
    },
    []
  );

  if (!isSwapAvailable) {
    return (
      <FunctionIsUnavailable
        functionName="Swap"
        network={network?.chainName || 'Testnet'}
      />
    );
  }

  if (!flags[FeatureGates.SWAP]) {
    return <FunctionIsOffline functionName="Swap" />;
  }

  const maxGasPrice =
    selectedFromToken?.type === TokenType.NATIVE && fromTokenValue
      ? selectedFromToken.balance.sub(fromTokenValue.bn).toString()
      : tokensWBalances
          .find((t) => t.type === TokenType.NATIVE)
          ?.balance.toString() || '0';

  const canSwap =
    !swapError.message &&
    selectedFromToken &&
    selectedToToken &&
    optimalRate &&
    gasLimit &&
    networkFee;

  return (
    <VerticalFlex width="100%">
      <PageTitle>Swap</PageTitle>
      <VerticalFlex grow="1" margin="8px 0 0" padding="16px">
        <Scrollbars
          style={{
            flexGrow: 1,
            maxHeight: 'unset',
            height: '100%',
          }}
        >
          <TokenSelect
            label="From"
            onTokenChange={(token: TokenWithBalance) => {
              setSelectedFromToken(token);
              setSwapWarning('');
              calculateSwapValue({
                selectedFromToken: token,
                selectedToToken,
              });
              setNavigationHistoryData({
                selectedFromToken: token,
                selectedToToken,
                tokenValue: fromTokenValue,
                destinationInputField,
              });
              sendTokenSelectedAnalytics('Swap');
            }}
            onSelectToggle={() => {
              setIsFromTokenSelectOpen(!isFromTokenSelectOpen);
              setIsToTokenSelectOpen(false);
            }}
            tokensList={tokensWBalances}
            maxAmount={
              destinationInputField === 'from' && isLoading
                ? undefined
                : maxFromValue ?? new BN(0)
            }
            skipHandleMaxAmount
            isOpen={isFromTokenSelectOpen}
            selectedToken={selectedFromToken}
            inputAmount={
              destinationInputField === 'from'
                ? new BN(destAmount)
                : defaultFromValue || new BN(0)
            }
            isValueLoading={destinationInputField === 'from' && isLoading}
            hideErrorMessage
            onError={(errorMessage) => {
              setSwapError({ message: errorMessage });
            }}
            onInputAmountChange={(value) => {
              if (value.bn.toString() === '0') {
                setSwapError({ message: 'Please enter an amount' });
                return;
              }
              if (
                maxFromValue &&
                value.bn.eq(maxFromValue) &&
                selectedFromToken?.type === TokenType.NATIVE
              ) {
                setIsCalculateAvaxMax(true);
              } else {
                setIsCalculateAvaxMax(false);
              }
              setSwapError({ message: '' });
              setSwapWarning('');
              setFromTokenValue(value as any);
              calculateTokenValueToInput(
                value,
                'to',
                selectedFromToken,
                selectedToToken
              );
              setNavigationHistoryData({
                selectedFromToken,
                selectedToToken,
                tokenValue: value,
                destinationInputField: 'to',
              });
              sendAmountEnteredAnalytics('Swap');
            }}
            setIsOpen={setIsFromTokenSelectOpen}
          />

          <HorizontalFlex
            justify={
              swapError?.message || swapWarning ? 'space-between' : 'flex-end'
            }
            margin="16px 0"
          >
            {swapError?.message && (
              <div>
                <Typography size={12} color={theme.colors.error}>
                  {swapError.message ?? ''}
                </Typography>
                {swapError.hasTryAgain && (
                  <Typography
                    size={12}
                    color={theme.colors.error}
                    onClick={() => {
                      const value =
                        destinationInputField === 'to'
                          ? fromTokenValue || { bn: new BN(0), amount: '0' }
                          : toTokenValue || { bn: new BN(0), amount: '0' };
                      calculateTokenValueToInput(
                        value,
                        destinationInputField || 'to',
                        selectedFromToken,
                        selectedToToken
                      );
                    }}
                  >
                    <TryAgainButton>try again</TryAgainButton>
                  </Typography>
                )}
              </div>
            )}
            {swapWarning && (
              <Typography size={12} color={theme.colors.error}>
                {swapWarning}
              </Typography>
            )}
            <SwitchIconContainer
              onClick={swapTokens}
              disabled={!selectedFromToken || !selectedToToken}
              isSwapped={isSwapped}
            >
              <SwitchIcon
                height="24px"
                direction={IconDirection.UP}
                color={theme.colors.text1}
              />
            </SwitchIconContainer>
          </HorizontalFlex>
          <TokenSelect
            label="To"
            onTokenChange={(token: TokenWithBalance) => {
              setSelectedToToken(token);
              setSwapWarning('');
              calculateSwapValue({
                selectedFromToken,
                selectedToToken: token,
              });
              setNavigationHistoryData({
                selectedFromToken,
                selectedToToken: token,
                tokenValue: fromTokenValue,
                destinationInputField,
              });
              sendTokenSelectedAnalytics('Swap');
            }}
            onSelectToggle={() => {
              setIsToTokenSelectOpen(!isToTokenSelectOpen);
              setIsFromTokenSelectOpen(false);
            }}
            tokensList={allTokensOnNetwork}
            isOpen={isToTokenSelectOpen}
            selectedToken={selectedToToken}
            inputAmount={
              destinationInputField === 'to' && destAmount
                ? new BN(destAmount)
                : toTokenValue?.bn || new BN(0)
            }
            isValueLoading={destinationInputField === 'to' && isLoading}
            hideErrorMessage
            onInputAmountChange={(value) => {
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
            }}
            setIsOpen={setIsToTokenSelectOpen}
          />

          {!isLoading && canSwap && (
            <TransactionDetails
              fromTokenSymbol={selectedFromToken?.symbol}
              toTokenSymbol={selectedToToken?.symbol}
              rate={calculateRate(optimalRate)}
              walletFee={optimalRate.partnerFee}
              onGasChange={onGasChange}
              gasLimit={gasLimit}
              gasPrice={customGasPrice || networkFee.low}
              maxGasPrice={maxGasPrice}
              slippage={slippageTolerance}
              setSlippage={(slippage) => setSlippageTolerance(slippage)}
              setIsOpen={setIsTransactionDetailsOpen}
              selectedGasFee={selectedGasFee}
            />
          )}
          <ReviewOrderButtonContainer
            isTransactionDetailsOpen={isTransactionDetailsOpen}
          >
            <ParaswapNotice />
            <PrimaryButton
              width="100%"
              margin="16px 0 0 0"
              onClick={() => {
                capture('SwapReviewOrder', {
                  destinationInputField,
                  slippageTolerance,
                  customGasPrice: customGasPrice?.toString(),
                });
                setIsReviewOrderOpen(true);
              }}
              size={ComponentSize.LARGE}
              disabled={isLoading || !canSwap}
            >
              Review Order
            </PrimaryButton>
          </ReviewOrderButtonContainer>
        </Scrollbars>
      </VerticalFlex>

      {isReviewOrderOpen && canSwap && (
        <ReviewOrder
          fromToken={selectedFromToken}
          toToken={selectedToToken}
          onClose={() => {
            capture('SwapCancelled');
            setIsReviewOrderOpen(false);
          }}
          onConfirm={() => {
            capture('SwapConfirmed');
            onHandleSwap();
          }}
          optimalRate={optimalRate}
          gasLimit={gasLimit}
          gasPrice={customGasPrice || networkFee.low}
          slippage={slippageTolerance}
          onTimerExpire={() => {
            capture('SwapReviewTimerRestarted');
            if (fromTokenValue) {
              const srcToken =
                destinationInputField === 'to'
                  ? selectedFromToken
                  : selectedToToken;
              const destToken =
                destinationInputField === 'to'
                  ? selectedToToken
                  : selectedFromToken;
              const amount =
                destinationInputField === 'to'
                  ? fromTokenValue
                  : toTokenValue || { bn: new BN(0), amount: '0' };
              calculateTokenValueToInput(
                amount,
                destinationInputField,
                srcToken,
                destToken
              );
            }
          }}
          isLoading={isLoading}
          rateValueInput={destinationInputField}
          rate={calculateRate(optimalRate)}
        />
      )}

      {txInProgress && (
        <TxInProgress
          fee={(
            (customGasPrice || networkFee?.low)?.mul(gasLimit) ||
            BigNumber.from(0)
          )
            .div(10 ** (network?.networkToken.decimals ?? 18))
            .toString()}
          feeSymbol={network?.networkToken.symbol}
          amount={fromTokenValue?.amount}
          symbol={selectedFromToken?.symbol}
        />
      )}
    </VerticalFlex>
  );
}
