import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import { useSwapContext } from '@src/contexts/SwapProvider/SwapProvider';
import { useEffect, useMemo, useState } from 'react';
import { resolve } from '@src/utils/promiseResolver';
import { TransactionDetails } from './components/TransactionDetails';
import { PageTitle } from '@src/components/common/PageTitle';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { SwapEngineNotice } from './components/SwapEngineNotice';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { FunctionIsUnavailable } from '@src/components/common/FunctionIsUnavailable';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useTranslation } from 'react-i18next';
import { useSwapStateFunctions } from './hooks/useSwapStateFunctions';
import { SwapError } from './components/SwapError';
import { calculateRate, isSlippageValid } from './utils';
import {
  Stack,
  toast,
  Scrollbars,
  Typography,
  SwapIcon,
  useTheme,
  Button,
  styled,
  IconButton,
  ToastCard,
} from '@avalabs/core-k2-components';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { TokenSelect } from '@src/components/common/TokenSelect';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { isUserRejectionError } from '@src/utils/errors';
import { useLiveBalance } from '@src/hooks/useLiveBalance';
import { useErrorMessage } from '@src/hooks/useErrorMessage';
import { SwappableToken } from './models';
import { useSwappableTokens } from './hooks/useSwapTokens';

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
  } = useIsFunctionAvailable(FunctionNames.SWAP);
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
    quote,
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
        ? isBitcoinNetwork(network)
          ? activeAccount?.addressBTC
          : activeAccount?.addressC
        : undefined,
    [activeAccount?.addressBTC, activeAccount?.addressC, network],
  );

  const fromAmount = useMemo(() => {
    const result =
      destinationInputField === 'from' ? BigInt(destAmount) : defaultFromValue;

    return result;
  }, [defaultFromValue, destAmount, destinationInputField]);

  const toAmount = useMemo(() => {
    const result =
      destinationInputField === 'to'
        ? BigInt(destAmount)
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

  async function performSwap() {
    const {
      amount,
      fromTokenAddress,
      toTokenAddress,
      toTokenDecimals,
      fromTokenDecimals,
    } = getSwapValues();
    if (
      !networkFee ||
      !toTokenDecimals ||
      !toTokenAddress ||
      !fromTokenAddress ||
      !fromTokenDecimals ||
      !amount ||
      !quote
    ) {
      return;
    }

    setIsConfirming(true);

    const slippage = slippageTolerance || '0';

    const [, error] = await resolve(
      swap({
        srcToken: fromTokenAddress,
        destToken: toTokenAddress,
        srcDecimals: fromTokenDecimals,
        destDecimals: toTokenDecimals,
        quote,
        slippage: parseFloat(slippage),
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

    if (error && !isUserRejectionError(error)) {
      console.error(error);
      sentryCaptureException(error, SentryExceptionTypes.SWAP);

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
              fromTokenSymbol={selectedFromToken?.symbol}
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
            <SwapEngineNotice />
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
