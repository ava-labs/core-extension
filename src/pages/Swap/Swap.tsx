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
  Overlay,
  PrimaryIconButton,
} from '@avalabs/react-components';
import {
  ERC20WithBalance,
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { BottomNav } from '@src/components/common/BottomNav.minimode';
import { useSwapContext } from '@src/contexts/SwapProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { OptimalRate } from 'paraswap-core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import styled, { useTheme } from 'styled-components';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { resolve } from '@src/utils/promiseResolver';
import { TokenList } from './TokenList';
import { TransactionDetails } from './TransactionDetails';
import { ReviewOrder } from './ReviewOrder';
import { CustomGasLimitAndFees } from '../SignTransaction/CustomGasLimitAndFees';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { SwapLoadingSpinnerIcon } from './SwapLoadingSpinnerIcon';
import { getMaxValue, getTokenIcon, isAPIError } from './utils';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SwapTxSuccess } from './SwapTxSucces';
import { Utils } from '@avalabs/avalanche-wallet-sdk';

export interface Token {
  icon?: JSX.Element;
  name?: string;
}

export interface SwapRate extends OptimalRate {
  status?: number;
  message?: string;
}

type ModalType = 'to' | 'from' | null;

const CustomGasAndFeeOverlay = styled(Overlay)`
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg1};
  align-items: flex-start;
  justify-content: flex-start;
  padding: 8px 16px 24px;
`;

const CustomGasAndFeeContainer = styled(HorizontalFlex)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg1};
  justify-content: center;
`;

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
  const [searchQuery, setSearchQuery] = useState('');
  const [swapError, setSwapError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [txInProgress, setTxInProgress] = useState(false);
  const [txHash, setTxHash] =
    useState<{ swapTxHash: string; approveTxHash?: string }>();

  const [canSwap, setCanSwap] = useState(false);
  const [isReviewOrderOpen, setIsReviewOrderOpen] = useState(false);
  const [selectedToToken, setSelectedToToken] = useState<TokenWithBalance>();
  const [optimalRate, setOptimalRate] = useState<OptimalRate>();

  const [selectedFromToken, setSelectedFromToken] =
    useState<TokenWithBalance>();

  const [gasLimit, setGasLimit] = useState('');
  const [gasCost, setGasCost] = useState('');
  const [destAmount, setDestAmount] = useState('');

  const [showCustomGasLimitAndFees, setShowCustomGasLimitAndFees] =
    useState(false);
  const [rateValueInput, setRateValueInput] = useState('');
  const [fromTokenValue, setFromTokenValue] =
    useState<{ bn: BN; amount: string }>();
  const [maxFromValue, setMaxFromValue] = useState<BN | undefined>();
  const [slippageTolerance, setSlippageTolerance] = useState<string>();

  useEffect(() => {
    setMaxFromValue(getMaxValue(selectedFromToken, gasLimit, gasPrice));
  }, [selectedFromToken, gasPrice, gasLimit]);

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
      destination: string,
      sourceToken?: TokenWithBalance,
      destinationToken?: TokenWithBalance
    ) => {
      if (!sourceToken || !destinationToken) {
        return;
      }
      setRateValueInput(destination);
      setIsLoading(true);
      setValuesDebouncedSubject.next({
        ...setValuesDebouncedSubject.getValue(),
        fromTokenAddress: isAvaxToken(sourceToken)
          ? sourceToken.symbol
          : (sourceToken as ERC20WithBalance).address,
        toTokenAddress: isAvaxToken(destinationToken)
          ? destinationToken.symbol
          : (destinationToken as ERC20WithBalance).address,
        fromTokenDecimals: sourceToken.denomination,
        toTokenDecimals: destinationToken.denomination,
        amount,
      });
      setIsLoading(false);
    },
    [setValuesDebouncedSubject]
  );

  useEffect(() => {
    if (selectedFromToken && selectedToToken) {
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
    }
  }, [
    selectedFromToken,
    selectedToToken,
    calculateTokenValueToInput,
    fromTokenValue,
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
            setIsLoading(true);
            setOptimalRate(undefined);
            const amountString = amount.bn.toString();
            getRate(
              fromTokenAddress,
              fromTokenDecimals,
              toTokenAddress,
              toTokenDecimals,
              amountString
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
                  setDestAmount(result.destAmount ?? '');
                }
              })
              .catch(() => {
                setSwapError('Something went wrong, please try again');
              })
              .finally(() => {
                setIsLoading(false);
              });
          } else {
            setOptimalRate(undefined);
          }
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, [getRate, setValuesDebouncedSubject]);

  useEffect(() => {
    if (!selectedFromToken || !selectedToToken || swapError) {
      setCanSwap(false);
      return;
    } else {
      setSwapError('');
      setCanSwap(true);
    }
  }, [selectedToToken, selectedFromToken, tokensWBalances, swapError]);

  useEffect(() => {
    if (gasPrice && gasLimit) {
      const newFees = calculateGasAndFees(gasPrice, gasLimit, avaxPrice);

      setGasCost(newFees.fee);
    }
  }, [avaxPrice, gasCost, gasLimit, gasPrice]);

  const swapTokens = () => {
    if (!canSwap) {
      return;
    }
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
        amount.bn.toString(),
        optimalRate,
        optimalRate.destAmount,
        gasLimit,
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

  if (txInProgress) {
    return <SwapLoadingSpinnerIcon />;
  }

  if (txHash) {
    return <SwapTxSuccess swapTxHash={txHash.swapTxHash} />;
  }

  return (
    <>
      <VerticalFlex margin="0 0 80px 0">
        <Typography margin="16px 0" size={24} height="29px" weight="bold">
          Swap
        </Typography>
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
          defaultValue={rateValueInput === 'from' ? destAmount : ''}
          onChange={(value) => {
            setFromTokenValue(value);
            calculateTokenValueToInput(
              value,
              'to',
              selectedFromToken,
              selectedToToken
            );
          }}
          isValueLoading={rateValueInput === 'from' && isLoading}
          isInputDisabled={!selectedFromToken}
          max={
            rateValueInput === 'from' && isLoading ? undefined : maxFromValue
          }
          hideErrorMessage={true}
          onError={(errorMessage) => setSwapError(errorMessage)}
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
          <SwitchIconContainer onClick={swapTokens} disabled={!canSwap}>
            <SwitchIcon height="24px" color={theme.colors.text1} />
          </SwitchIconContainer>
        </HorizontalFlex>

        <SwapCard
          title="To"
          denomination={selectedToToken?.denomination}
          onSelectClick={() => {
            setModalOpen('to');
          }}
          token={selectedToTokenFormat}
          defaultValue={rateValueInput === 'to' ? destAmount : ''}
          onChange={(value) => {
            calculateTokenValueToInput(
              value,
              'from',
              selectedToToken,
              selectedFromToken
            );
          }}
          isValueLoading={rateValueInput === 'to' && isLoading}
          isInputDisabled={!selectedToToken}
        />

        {isLoading && <SwapLoadingSpinnerIcon />}
        {canSwap && optimalRate ? (
          <>
            <TransactionDetails
              fromTokenSymbol={selectedFromToken?.symbol}
              toTokenSymbol={selectedToToken?.symbol}
              rate={
                parseInt(destAmount, 10) / parseInt(optimalRate.srcAmount, 10)
              }
              fee={gasCost}
              walletFee={optimalRate.partnerFee}
              onEdit={() => setShowCustomGasLimitAndFees(true)}
              gasLimit={parseInt(gasLimit, 10)}
              gasPrice={gasPrice?.bn}
              slippage={slippageTolerance}
              setSlippage={(slippage) => setSlippageTolerance(slippage)}
            />
            <PrimaryButton
              width="100%"
              onClick={() => setIsReviewOrderOpen(true)}
              size={ComponentSize.LARGE}
            >
              Review Order
            </PrimaryButton>
          </>
        ) : null}
      </VerticalFlex>
      <BottomNav />

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
                return;
              }
              setSelectedToToken(token);
            }}
            onClose={() => setModalOpen(null)}
          />
        </>
      </SelectTokenModal>

      {isReviewOrderOpen && optimalRate && (
        <ReviewOrder
          fromToken={selectedFromToken}
          toToken={selectedToToken}
          destAmount={destAmount}
          onClose={() => setIsReviewOrderOpen(false)}
          onConfirm={() => onHandleSwap()}
          optimalRate={optimalRate}
          fee={gasCost}
          onEdit={() => setShowCustomGasLimitAndFees(true)}
          slippage={slippageTolerance}
        />
      )}

      {showCustomGasLimitAndFees && gasPrice && (
        <CustomGasAndFeeOverlay>
          <CustomGasAndFeeContainer>
            <CustomGasLimitAndFees
              limit={gasLimit.toString()}
              gasPrice={gasPrice}
              onCancel={() => setShowCustomGasLimitAndFees(false)}
              onSave={(_, gasLimit) => {
                setShowCustomGasLimitAndFees(false);
                setGasLimit(gasLimit);
              }}
              gasPriceEditDisabled
            />
          </CustomGasAndFeeContainer>
        </CustomGasAndFeeOverlay>
      )}
    </>
  );
}

export default Swap;
