import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  PrimaryButton,
  SwapCard,
  SelectTokenModal,
  SearchInput,
  SwitchIcon,
  ComponentSize,
  PrimaryIconButton,
  IconDirection,
} from '@avalabs/react-components';
import {
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { useSwapContext } from '@src/contexts/SwapProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { OptimalRate, SwapSide } from 'paraswap-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import styled, { useTheme } from 'styled-components';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { resolve } from '@src/utils/promiseResolver';
import { TokenList } from './components/TokenList';
import { TransactionDetails } from './components/TransactionDetails';
import { ReviewOrder } from './components/ReviewOrder';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { SwapLoadingSpinnerIcon } from './components/SwapLoadingSpinnerIcon';
import {
  getMaxValue,
  getTokenAddress,
  getTokenIcon,
  isAPIError,
} from './utils';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SwapTxSuccess } from './components/SwapTxSucces';
import { Utils } from '@avalabs/avalanche-wallet-sdk';
import { TxInProgress } from '../../components/common/TxInProgress';
import { useHistory } from 'react-router-dom';
import { GasPrice } from '@src/background/services/gas/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { PageTitleMiniMode } from '@src/components/common/PageTitle';

export interface Token {
  icon?: JSX.Element;
  name?: string;
}

export interface SwapRate extends OptimalRate {
  status?: number;
  message?: string;
}

type ModalType = 'to' | 'from' | null;

const SwitchIconContainer = styled(PrimaryIconButton)`
  background-color: ${({ theme }) => theme.swapCard.swapIconBg};
  &[disabled] {
    background-color: ${({ theme }) => theme.swapCard.swapIconBg};
  }
`;

export function Swap() {
  const { currencyFormatter } = useSettingsContext();
  const { erc20Tokens, avaxToken, avaxPrice } = useWalletContext();
  const { getRate, swap, gasPrice } = useSwapContext();
  const theme = useTheme();
  const tokensWBalances = useTokensWithBalances();
  const [modalOpen, setModalOpen] = useState<ModalType>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [swapError, setSwapError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txInProgress, setTxInProgress] = useState<boolean>(false);
  const [txHash, setTxHash] =
    useState<{ swapTxHash: string; approveTxHash?: string }>();
  const [isReviewOrderOpen, setIsReviewOrderOpen] = useState<boolean>(false);
  const [selectedToToken, setSelectedToToken] = useState<TokenWithBalance>();
  const [optimalRate, setOptimalRate] = useState<OptimalRate>();
  const [selectedFromToken, setSelectedFromToken] =
    useState<TokenWithBalance>();
  const history = useHistory();
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

  const [defaultFromValue, setFromDefaultValue] = useState('');
  const [isCalculateAvaxMax, setIsCalculateAvaxMax] = useState(false);

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
        setFromDefaultValue(max?.toString());
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
      bn: Utils.stringToBN(
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
    calculateSwapValue({ selectedFromToken: from, selectedToToken: to });
  };

  const getCurrencyValue = (token?: TokenWithBalance) => {
    if (!token || !token.balanceUsdDisplayValue) {
      return '';
    }
    return currencyFormatter(Number(token.balanceUsdDisplayValue));
  };

  async function onHandleSwap() {
    setTxInProgress(true);
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
      setSwapError('Something went wrong, please try again');
      setIsReviewOrderOpen(false);

      return;
    }
    setTxHash(result);
  }

  const selectedFromTokenFormat = selectedFromToken
    ? ({
        name: selectedFromToken.symbol,
        icon: getTokenIcon(selectedFromToken),
      } as Token)
    : null;

  const selectedToTokenFormat = selectedToToken
    ? ({
        name: selectedToToken.symbol,
        icon: getTokenIcon(selectedToToken),
      } as Token)
    : null;

  const canSwap =
    !swapError &&
    selectedFromToken &&
    selectedToToken &&
    optimalRate &&
    gasLimit &&
    gasPrice;

  if (txHash) {
    return <SwapTxSuccess swapTxHash={txHash.swapTxHash} />;
  }

  return (
    <VerticalFlex width="100%">
      <PageTitleMiniMode onBackClick={() => history.push('/home')}>
        Swap
      </PageTitleMiniMode>
      <VerticalFlex grow="1" margin="16px 16px 16px">
        <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
          <SwapCard
            denomination={selectedFromToken?.denomination}
            title="From"
            onSelectClick={() => {
              setModalOpen('from');
              setSearchQuery('');
            }}
            token={selectedFromTokenFormat}
            balanceDisplayValue={selectedFromToken?.balanceDisplayValue}
            currencyValue={getCurrencyValue(selectedFromToken)}
            defaultValue={
              defaultFromValue ||
              (destinationInputField === 'from' ? destAmount : '')
            }
            onChange={(value) => {
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
            isValueLoading={destinationInputField === 'from' && isLoading}
            isInputDisabled={!selectedFromToken}
            max={
              destinationInputField === 'from' && isLoading
                ? undefined
                : maxFromValue
            }
            hideErrorMessage={true}
            onError={(errorMessage) => {
              setSwapError(errorMessage);
            }}
          />

          <HorizontalFlex
            justify={swapError ? 'space-between' : 'flex-end'}
            margin="16px 0 0 0"
          >
            {swapError && (
              <Typography size={12} color={theme.colors.error}>
                {swapError}
              </Typography>
            )}
            <SwitchIconContainer
              onClick={swapTokens}
              disabled={!selectedFromToken || !selectedToToken}
            >
              <SwitchIcon
                height="24px"
                direction={IconDirection.UP}
                color={theme.colors.text1}
              />
            </SwitchIconContainer>
          </HorizontalFlex>

          <SwapCard
            title="To"
            denomination={selectedToToken?.denomination}
            onSelectClick={() => {
              setModalOpen('to');
            }}
            token={selectedToTokenFormat}
            defaultValue={destinationInputField === 'to' ? destAmount : ''}
            onChange={(value) => {
              setToTokenValue(value as any);
              calculateTokenValueToInput(
                value as any,
                'from',
                selectedFromToken,
                selectedToToken
              );
            }}
            isValueLoading={destinationInputField === 'to' && isLoading}
            isInputDisabled={!selectedToToken}
          />

          {isLoading && <SwapLoadingSpinnerIcon />}

          {!isLoading && canSwap && (
            <TransactionDetails
              fromTokenSymbol={selectedFromToken?.symbol}
              toTokenSymbol={selectedToToken?.symbol}
              rate={
                parseInt(optimalRate?.destAmount || '0', 10) /
                parseInt(optimalRate?.srcAmount || '0', 10)
              }
              walletFee={optimalRate.partnerFee}
              onGasChange={(limit, price) => {
                setGasLimit(limit);
                setCustomGasPrice(price);
              }}
              gasLimit={gasLimit}
              gasPrice={gasPrice as any}
              slippage={slippageTolerance}
              setSlippage={(slippage) => setSlippageTolerance(slippage)}
            />
          )}
        </Scrollbars>
        {!isLoading && canSwap && (
          <PrimaryButton
            width="100%"
            margin="16px 0 0 0"
            onClick={() => setIsReviewOrderOpen(true)}
            size={ComponentSize.LARGE}
          >
            Review Order
          </PrimaryButton>
        )}
      </VerticalFlex>

      <SelectTokenModal
        open={!!modalOpen}
        onClose={() => {
          setModalOpen(null);
          setSearchQuery('');
        }}
        title="Select Token"
      >
        <>
          <HorizontalFlex padding="0 16px">
            <SearchInput
              searchTerm={searchQuery}
              placeholder="Search"
              width="343px"
              onSearch={(term) => setSearchQuery(term)}
              autoFocus={true}
            />
          </HorizontalFlex>
          <TokenList
            tokenList={
              modalOpen === 'from'
                ? tokensWBalances
                : [...erc20Tokens, avaxToken]
            }
            searchQuery={searchQuery}
            onClick={(token: TokenWithBalance) => {
              if (modalOpen === 'from') {
                setSelectedFromToken(token);
                calculateSwapValue({
                  selectedFromToken: token,
                  selectedToToken,
                });
                return;
              }
              setSelectedToToken(token);
              calculateSwapValue({ selectedFromToken, selectedToToken: token });
            }}
            onClose={() => setModalOpen(null)}
          />
        </>
      </SelectTokenModal>

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
        />
      )}

      {txInProgress && (
        <TxInProgress
          fee={Utils.bnToLocaleString(
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
