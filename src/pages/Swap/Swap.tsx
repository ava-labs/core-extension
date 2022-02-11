import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  PrimaryButton,
  SwitchIcon,
  ComponentSize,
  PrimaryIconButton,
  IconDirection,
  LoadingSpinnerIcon,
  TransactionToastType,
  TransactionToast,
  toast,
  WarningIcon,
} from '@avalabs/react-components';
import {
  getTransactionLink,
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { useSwapContext } from '@src/contexts/SwapProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { OptimalRate, SwapSide } from 'paraswap-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BN,
  stringToBN,
  bnToLocaleString,
  isMainnetNetwork,
} from '@avalabs/avalanche-wallet-sdk';
import styled, { useTheme } from 'styled-components';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { resolve } from '@src/utils/promiseResolver';
import { TransactionDetails } from './components/TransactionDetails';
import { ReviewOrder } from './components/ReviewOrder';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { getMaxValue, getTokenAddress, isAPIError } from './utils';
import { TxInProgress } from '../../components/common/TxInProgress';
import { GasPrice } from '@src/background/services/gas/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { PageTitleMiniMode } from '@src/components/common/PageTitle';
import { TokenSelect } from '@src/pages/Send/components/TokenSelect';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useHistory } from 'react-router-dom';

export interface Token {
  icon?: JSX.Element;
  name?: string;
}

export interface SwapRate extends OptimalRate {
  status?: number;
  message?: string;
}

const SwitchIconContainer = styled(PrimaryIconButton)<{ isSwapped: boolean }>`
  background-color: ${({ theme }) => theme.swapCard.swapIconBg};
  &[disabled] {
    background-color: ${({ theme }) => theme.swapCard.swapIconBg};
  }
  transition: all 0.2s;
  transform: ${({ isSwapped }) =>
    isSwapped ? 'rotate(0deg)' : 'rotate(180deg)'};
`;

const ReviewOrderButtonContainer = styled.div<{
  isTransactionDetailsOpen: boolean;
}>`
  position: ${({ isTransactionDetailsOpen }) =>
    isTransactionDetailsOpen ? 'static' : 'absolute'};
  bottom: 0;
  left: 0;
  width: 100%;
`;

export function Swap() {
  const { erc20Tokens, avaxToken, avaxPrice, walletType } = useWalletContext();
  const { network } = useNetworkContext();
  const { getRate, swap, gasPrice } = useSwapContext();
  const history = useHistory();
  const theme = useTheme();
  const tokensWBalances = useTokensWithBalances();
  const [swapError, setSwapError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txInProgress, setTxInProgress] = useState<boolean>(false);
  const [isReviewOrderOpen, setIsReviewOrderOpen] = useState<boolean>(false);
  const [selectedToToken, setSelectedToToken] = useState<TokenWithBalance>();
  const [optimalRate, setOptimalRate] = useState<OptimalRate>();
  const [selectedFromToken, setSelectedFromToken] =
    useState<TokenWithBalance>();
  const [gasLimit, setGasLimit] = useState('');
  const [customGasPrice, setCustomGasPrice] = useState<GasPrice | undefined>(
    gasPrice
  );
  const [gasCost, setGasCost] = useState('');
  const [destAmount, setDestAmount] = useState('');
  const [destinationInputField, setDestinationInputField] = useState<
    'from' | 'to' | ''
  >('');

  const [fromTokenValue, setFromTokenValue] =
    useState<{ bn: BN; amount: string }>();
  const [toTokenValue, setToTokenValue] =
    useState<{ bn: BN; amount: string }>();
  const [maxFromValue, setMaxFromValue] = useState<BN | undefined>();
  const [slippageTolerance, setSlippageTolerance] = useState('1');

  const [defaultFromValue, setFromDefaultValue] = useState<BN>();
  const [isCalculateAvaxMax, setIsCalculateAvaxMax] = useState(false);

  const [isFromTokenSelectOpen, setIsFromTokenSelectOpen] = useState(false);
  const [isToTokenSelectOpen, setIsToTokenSelectOpen] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] =
    useState(false);

  const setValuesDebouncedSubject = useMemo(() => {
    return new BehaviorSubject<{
      amount?: { bn: BN; amount: string };
      toTokenAddress?: string;
      fromTokenAddress?: string;
      toTokenDecimals?: number;
      fromTokenDecimals?: number;
    }>({});
  }, []);

  const calculateTokenValueToInput = useCallback(
    (
      amount: { bn: BN; amount: string },
      destinationInput: 'from' | 'to' | '',
      sourceToken?: TokenWithBalance,
      destinationToken?: TokenWithBalance
    ) => {
      if (!sourceToken || !destinationToken) {
        return;
      }
      setDestinationInputField(destinationInput);
      setIsLoading(true);
      setValuesDebouncedSubject.next({
        ...setValuesDebouncedSubject.getValue(),
        fromTokenAddress: getTokenAddress(sourceToken),
        toTokenAddress: getTokenAddress(destinationToken),
        fromTokenDecimals: sourceToken.denomination,
        toTokenDecimals: destinationToken.denomination,
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

  useEffect(() => {
    if (
      gasPrice &&
      gasLimit &&
      selectedFromToken &&
      isAvaxToken(selectedFromToken)
    ) {
      const newFees = calculateGasAndFees(gasPrice, gasLimit, avaxPrice);

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
    gasPrice,
    selectedFromToken,
    selectedToToken,
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
              setSwapError('Please enter an amount');
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
                  setGasLimit(result.optimalRate?.gasCost);
                  const resultAmount =
                    destinationInputField === 'to'
                      ? result.optimalRate.destAmount
                      : result.optimalRate.srcAmount;

                  setDestAmount(resultAmount);
                }
              })
              .catch(() => {
                setOptimalRate(undefined);
                setSwapError('Something went wrong, please try again');
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
        selectedFromToken.denomination || 18
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
      setSwapError(
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
    if (walletType !== 'ledger') {
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
      !gasPrice ||
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
        customGasPrice || gasPrice,
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
        href={getTransactionLink(
          result.swapTxHash,
          network ? isMainnetNetwork(network.config) : true
        )}
      />
    );
  }

  const canSwap =
    !swapError &&
    selectedFromToken &&
    selectedToToken &&
    optimalRate &&
    gasLimit &&
    gasPrice;

  return (
    <VerticalFlex width="100%">
      <PageTitleMiniMode>Swap</PageTitleMiniMode>
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
              calculateSwapValue({
                selectedFromToken: token,
                selectedToToken,
              });
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
              setSwapError(errorMessage);
            }}
            onInputAmountChange={(value) => {
              if (value.bn.toString() === '0') {
                setSwapError('Please enter an amount');
                return;
              }
              if (
                maxFromValue &&
                value.bn.eq(maxFromValue) &&
                selectedFromToken &&
                isAvaxToken(selectedFromToken)
              ) {
                setIsCalculateAvaxMax(true);
              }
              setSwapError('');
              setFromTokenValue(value as any);
              calculateTokenValueToInput(
                value as any,
                'to',
                selectedFromToken,
                selectedToToken
              );
            }}
          />

          <HorizontalFlex
            justify={swapError ? 'space-between' : 'flex-end'}
            margin="16px 0"
          >
            {swapError && (
              <Typography size={12} color={theme.colors.error}>
                {swapError}
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
              calculateSwapValue({
                selectedFromToken,
                selectedToToken: token,
              });
            }}
            onSelectToggle={() => {
              setIsToTokenSelectOpen(!isToTokenSelectOpen);
              setIsFromTokenSelectOpen(false);
            }}
            tokensList={[...erc20Tokens, avaxToken]}
            isOpen={isToTokenSelectOpen}
            selectedToken={selectedToToken}
            inputAmount={
              destinationInputField === 'to' && destAmount
                ? new BN(destAmount)
                : new BN(0)
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
            }}
          />

          {!isLoading && canSwap && (
            <TransactionDetails
              fromTokenSymbol={selectedFromToken?.symbol}
              toTokenSymbol={selectedToToken?.symbol}
              rate={calculateRate(optimalRate)}
              walletFee={optimalRate.partnerFee}
              onGasChange={(limit, price) => {
                setGasLimit(limit);
                setCustomGasPrice(price);
              }}
              gasLimit={gasLimit}
              gasPrice={gasPrice as any}
              slippage={slippageTolerance}
              setSlippage={(slippage) => setSlippageTolerance(slippage)}
              setIsOpen={setIsTransactionDetailsOpen}
            />
          )}
          <ReviewOrderButtonContainer
            isTransactionDetailsOpen={isTransactionDetailsOpen}
          >
            <PrimaryButton
              width="100%"
              margin="16px 0 0 0"
              onClick={() => setIsReviewOrderOpen(true)}
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
          onClose={() => setIsReviewOrderOpen(false)}
          onConfirm={() => onHandleSwap()}
          optimalRate={optimalRate}
          gasLimit={gasLimit}
          gasPrice={customGasPrice || gasPrice}
          slippage={slippageTolerance}
          onTimerExpire={() => {
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
          fee={bnToLocaleString(
            (customGasPrice || gasPrice)?.bn.mul(new BN(gasLimit)) || new BN(0),
            18
          )}
          amount={fromTokenValue?.amount}
          symbol={selectedFromToken?.symbol}
        />
      )}
    </VerticalFlex>
  );
}
