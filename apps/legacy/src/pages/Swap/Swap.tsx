import { FunctionIsOffline } from '@/components/common/FunctionIsOffline';
import { FunctionIsUnavailable } from '@/components/common/FunctionIsUnavailable';
import { PageTitle } from '@/components/common/PageTitle';
import { TokenSelect } from '@/components/common/TokenSelect';
import {
  calculateRate,
  isJupiterQuote,
  isParaswapQuote,
  SwapQuote,
  useAccountsContext,
} from '@core/ui';
import { useAnalyticsContext } from '@core/ui';
import { useNetworkFeeContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { useSwapContext } from '@core/ui';
import { useErrorMessage } from '@core/ui';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { useLiveBalance } from '@core/ui';
import {
  Button,
  IconButton,
  Scrollbars,
  Stack,
  styled,
  SwapIcon,
  toast,
  ToastCard,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import {
  isGasEstimationError,
  isSolanaNetwork,
  isSwapTxBuildError,
  isUserRejectionError,
  Monitoring,
  resolve,
} from '@core/common';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SwapError } from './components/SwapError';
import { TransactionDetails } from './components/TransactionDetails';
import { useSwapStateFunctions } from './hooks/useSwapStateFunctions';
import { SwappableToken } from './models';
import { isSlippageValid } from './utils';
import { useHistory } from 'react-router-dom';
import { useSwappableTokens } from './hooks/useSwapTokens';
import { SwapEngineNotice } from './components/SwapEngineNotice';
import { SwapProviders } from '@core/ui/src/contexts/SwapProvider/types';

const ReviewOrderButtonContainer = styled('div')<{
  isTransactionDetailsOpen: boolean;
}>`
  position: ${({ isTransactionDetailsOpen }) =>
    isTransactionDetailsOpen ? 'static' : 'absolute'};
  bottom: 0;
  left: 0;
  width: 100%;
`;
const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export function Swap() {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();
  const { capture, captureEncrypted } = useAnalyticsContext();
  const { network } = useNetworkContext();
  const { swap } = useSwapContext();
  const { networkFee } = useNetworkFeeContext();
  const getTranslatedError = useErrorMessage();

  const {
    isFunctionAvailable: isSwapAvailable,
    isFunctionSupported: isSwapSupported,
  } = useIsFunctionAvailable({ functionName: FunctionNames.SWAP });
  const history = useHistory();
  const theme = useTheme();
  const { sourceTokens, targetTokens } = useSwappableTokens();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const [isFromTokenSelectOpen, setIsFromTokenSelectOpen] = useState(false);
  const [isToTokenSelectOpen, setIsToTokenSelectOpen] = useState(false);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] =
    useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    calculateTokenValueToInput,
    reverseTokens,
    onTokenChange,
    onFromInputAmountChange,
    onToInputAmountChange,
    getSwapValues,
    selectedFromToken,
    selectedToToken,
    destinationInputField,
    fromTokenValue,
    swapError,
    isLoading,
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
    resetValues,
    slippageTolerance,
    updateSlippage,
  } = useSwapStateFunctions();

  const toTokensList = useMemo(
    () =>
      targetTokens.filter(
        (token) =>
          token.name !== selectedFromToken?.name ||
          token.symbol !== selectedFromToken?.symbol,
      ),
    [targetTokens, selectedFromToken?.name, selectedFromToken?.symbol],
  );

  const quote = useMemo(() => quotes?.selected?.quote ?? null, [quotes]);

  const isFromTokenKnown = useMemo(
    () =>
      selectedFromToken
        ? sourceTokens.some(getTokenFinder(selectedFromToken))
        : true,
    [sourceTokens, selectedFromToken],
  );

  const isToTokenKnown = useMemo(
    () =>
      selectedToToken
        ? targetTokens.some(getTokenFinder(selectedToToken))
        : true,
    [targetTokens, selectedToToken],
  );

  // If we detect the form has tokens that do not belong to the newly selected network,
  // we reset the values to avoid any potential issues with the swap.
  useEffect(() => {
    if (!network) {
      return;
    }

    if (!isToTokenKnown || !isFromTokenKnown) {
      resetValues(true);
    }
  }, [network, isToTokenKnown, isFromTokenKnown, resetValues]);

  const activeAddress = useMemo(
    () =>
      network
        ? isSolanaNetwork(network)
          ? activeAccount?.addressSVM
          : activeAccount?.addressC
        : undefined,
    [activeAccount?.addressSVM, activeAccount?.addressC, network],
  );

  const fromAmount = useMemo(() => {
    const result =
      destinationInputField === 'from'
        ? BigInt(srcAmount || '0')
        : defaultFromValue;

    return result;
  }, [srcAmount, defaultFromValue, destinationInputField]);

  const toAmount = useMemo(() => {
    const result =
      destinationInputField === 'to'
        ? BigInt(destAmount || '0')
        : toTokenValue?.bigint;

    return result;
  }, [destAmount, destinationInputField, toTokenValue]);

  const fromTokensList = useMemo(
    () =>
      sourceTokens.filter(
        (token) =>
          token.name !== selectedToToken?.name ||
          token.symbol !== selectedToToken?.symbol,
      ),
    [selectedToToken?.name, selectedToToken?.symbol, sourceTokens],
  );

  async function performSwap(
    specificProvider?: SwapProviders,
    specificQuote?: SwapQuote,
  ) {
    const {
      amount,
      fromTokenAddress,
      toTokenAddress,
      toTokenDecimals,
      fromTokenDecimals,
    } = getSwapValues();
    if (!amount) {
      return;
    }

    const amountIn =
      destinationInputField === 'from' ? srcAmount : amount.toString();
    const amountOut =
      destinationInputField === 'to' ? destAmount : amount.toString();

    if (
      !networkFee ||
      !toTokenDecimals ||
      !toTokenAddress ||
      !fromTokenAddress ||
      !fromTokenDecimals ||
      !quotes ||
      !quote ||
      !amountIn ||
      !amountOut
    ) {
      return;
    }

    const quoteToUse = specificQuote ?? quote;
    const providerToUse = specificProvider ?? quotes.provider;

    setIsConfirming(true);

    const slippage = slippageTolerance || '0';

    const [, error] = await resolve(
      swap({
        srcToken: fromTokenAddress,
        destToken: toTokenAddress,
        srcDecimals: fromTokenDecimals,
        destDecimals: toTokenDecimals,
        quote: quoteToUse,
        slippage: parseFloat(slippage),
        swapProvider: providerToUse,
        amountIn,
        amountOut,
      }),
    );

    setIsConfirming(false);

    // If there is no error or it wasn't the user rejecting the transaction,
    // we can report that swap operation was confirmed.
    if (!error || !isUserRejectionError(error)) {
      captureEncrypted('SwapConfirmed', {
        address: activeAddress,
        chainId: network?.chainId,
      });
    }

    if (
      !manuallySelected &&
      (isSwapTxBuildError(error) || isGasEstimationError(error))
    ) {
      // Check if there are more quotes available to try
      if (quotes.quotes.length > 1) {
        const currentQuoteIndex = quotes.quotes.findIndex(
          (q) => q.quote === quoteToUse,
        );
        const nextQuoteIndex = currentQuoteIndex + 1;

        if (nextQuoteIndex < quotes.quotes.length) {
          // Try the next quote automatically
          const nextQuote = quotes.quotes[nextQuoteIndex];
          const swapProvider = quotes.provider;
          if (nextQuote) {
            setQuotes({
              ...quotes,
              selected: nextQuote,
            });

            // Retry swap with next quote without showing error
            performSwap(swapProvider, nextQuote.quote);
            return; // Don't handle error since we're retrying
          }
        }
      }
    }

    if (error && !isUserRejectionError(error)) {
      console.error(error);
      Monitoring.sentryCaptureException(
        error,
        Monitoring.SentryExceptionTypes.SWAP,
      );

      const { title, hint } = getTranslatedError(error);
      toast.custom(
        <ToastCard variant="error">
          <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold' }}>
            {title}
          </Typography>
          {hint && (
            <Typography variant="caption" color="text.primary">
              {hint}
            </Typography>
          )}
        </ToastCard>,
        { duration: 5000 },
      );
      captureEncrypted('SwapFailed', {
        address: activeAddress,
        chainId: network?.chainId,
      });
    }

    if (!error) {
      history.push('/home');
    }
  }

  if (!isSwapSupported) {
    return (
      <FunctionIsUnavailable
        functionName={FunctionNames.SWAP}
        network={network?.chainName || 'Testnet'}
      />
    );
  }

  if (!isSwapAvailable) {
    return <FunctionIsOffline functionName={FunctionNames.SWAP} />;
  }

  const canSwap =
    !swapError?.message &&
    selectedFromToken &&
    selectedToToken &&
    quote &&
    isSlippageValid(slippageTolerance) &&
    networkFee;

  const isDetailsAvailable =
    selectedFromToken && selectedToToken && quote && networkFee;

  if (!isDetailsAvailable && isTransactionDetailsOpen) {
    setIsTransactionDetailsOpen(false);
  }

  const showEngineNotice =
    quote && (isParaswapQuote(quote) || isJupiterQuote(quote));

  return (
    <Stack
      sx={{
        width: '100%',
      }}
    >
      <PageTitle>{t('Swap')}</PageTitle>
      <Stack
        sx={{
          p: 2,
          mx: 0,
          mb: 0,
          flexGrow: 1,
        }}
      >
        <Scrollbars
          style={{
            flexGrow: 1,
            maxHeight: 'unset',
            height: '100%',
          }}
        >
          <TokenSelect
            label={t('From')}
            onTokenChange={(token: SwappableToken) => {
              onTokenChange({
                fromToken: token,
              });
            }}
            onSelectToggle={() => {
              setIsFromTokenSelectOpen(!isFromTokenSelectOpen);
              setIsToTokenSelectOpen(false);
            }}
            tokensList={fromTokensList}
            skipHandleMaxAmount
            isOpen={isFromTokenSelectOpen}
            selectedToken={selectedFromToken}
            inputAmount={fromAmount}
            isValueLoading={destinationInputField === 'from' && isLoading}
            hideErrorMessage
            onInputAmountChange={(value) => {
              onFromInputAmountChange(value);
            }}
            setIsOpen={setIsFromTokenSelectOpen}
            withOnlyTokenPreselect={false}
          />

          <Stack
            sx={{
              flexDirection: 'row',
              my: 2,
              mx: 0,
              justifyContent: `${
                swapError?.message || swapWarning ? 'space-between' : 'flex-end'
              }`,
              alignItems: 'start',
            }}
          >
            {swapError?.message && (
              <SwapError
                swapError={swapError}
                destinationInputField={destinationInputField}
                fromTokenValue={fromTokenValue}
                toTokenValue={toTokenValue}
                calculateTokenValueToInput={calculateTokenValueToInput}
                selectedFromToken={selectedFromToken}
                selectedToToken={selectedToToken}
              />
            )}
            {swapWarning && (
              <Typography
                variant="caption"
                sx={{ color: theme.palette.error.main }}
              >
                {swapWarning}
              </Typography>
            )}
            <Stack
              data-testid="swap-switch-token-button"
              sx={{
                transition: 'all 0.2s',
                transform: isReversed ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            >
              <IconButton
                variant="contained"
                color="secondary"
                onClick={() => {
                  reverseTokens(selectedFromToken, selectedToToken);
                }}
                disabled={
                  !selectedFromToken ||
                  !selectedToToken ||
                  isLoading ||
                  isConfirming
                }
                sx={{
                  '&.Mui-disabled': {
                    backgroundColor: '#FFFFFF10',
                  },
                }}
              >
                <SwapIcon
                  size={20}
                  sx={{
                    transform: 'rotate(90deg)',
                  }}
                />
              </IconButton>
            </Stack>
          </Stack>
          <TokenSelect
            label={t('To')}
            onTokenChange={(token: SwappableToken) => {
              onTokenChange({
                toToken: token,
              });
            }}
            onSelectToggle={() => {
              setIsToTokenSelectOpen(!isToTokenSelectOpen);
              setIsFromTokenSelectOpen(false);
            }}
            tokensList={toTokensList}
            isOpen={isToTokenSelectOpen}
            selectedToken={selectedToToken}
            inputAmount={toAmount}
            isValueLoading={destinationInputField === 'to' && isLoading}
            hideErrorMessage
            onInputAmountChange={(value) => {
              onToInputAmountChange(value);
            }}
            setIsOpen={setIsToTokenSelectOpen}
            withMaxButton={false}
            withOnlyTokenPreselect={false}
          />

          {isDetailsAvailable && (
            <TransactionDetails
              quote={quote}
              quotes={quotes}
              setQuotes={setQuotes}
              manuallySelected={manuallySelected}
              setManuallySelected={setManuallySelected}
              fromTokenSymbol={selectedFromToken?.symbol}
              toToken={selectedToToken}
              toTokenSymbol={selectedToToken?.symbol}
              rate={calculateRate(quote, {
                srcDecimals: selectedFromToken?.decimals,
                destDecimals: selectedToToken?.decimals,
              })}
              slippage={slippageTolerance}
              setSlippage={(slippage) => updateSlippage(slippage)}
              setIsOpen={setIsTransactionDetailsOpen}
              isTransactionDetailsOpen={isTransactionDetailsOpen}
            />
          )}
          <ReviewOrderButtonContainer
            isTransactionDetailsOpen={isTransactionDetailsOpen}
          >
            {showEngineNotice && <SwapEngineNotice />}
            <Button
              data-testid="swap-review-order-button"
              sx={{
                mt: 2,
              }}
              onClick={async () => {
                capture('SwapReviewOrder', {
                  destinationInputField,
                  slippageTolerance,
                });
                await performSwap();
              }}
              fullWidth
              size="large"
              disabled={isLoading || isConfirming || !canSwap}
              isLoading={isConfirming}
            >
              {t('Review Order')}
            </Button>
          </ReviewOrderButtonContainer>
        </Scrollbars>
      </Stack>
    </Stack>
  );
}

const getTokenFinder = (selectedToken: SwappableToken) => {
  if (selectedToken.type === TokenType.NATIVE) {
    return (token: TokenWithBalance) =>
      token.type === TokenType.NATIVE && token.symbol === selectedToken.symbol;
  }

  return (token: TokenWithBalance) =>
    (token.type === TokenType.ERC20 || token.type === TokenType.SPL) &&
    token.address === selectedToken.address;
};
