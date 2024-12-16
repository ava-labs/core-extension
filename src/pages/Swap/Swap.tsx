import { useSwapContext } from '@src/contexts/SwapProvider/SwapProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useMemo, useState } from 'react';
import { resolve } from '@src/utils/promiseResolver';
import { TransactionDetails } from './components/TransactionDetails';
import { PageTitle } from '@src/components/common/PageTitle';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { ParaswapNotice } from './components/ParaswapNotice';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { FunctionIsUnavailable } from '@src/components/common/FunctionIsUnavailable';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useTranslation } from 'react-i18next';
import { useSwapStateFunctions } from './hooks/useSwapStateFunctions';
import { SwapError } from './components/SwapError';
import { calculateRate } from './utils';
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
} from '@avalabs/core-k2-components';
import { TokenSelect } from '@src/components/common/TokenSelect';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { isUserRejectionError } from '@src/utils/errors';
import { DISALLOWED_SWAP_ASSETS } from '@src/contexts/SwapProvider/models';
import {
  NetworkTokenWithBalance,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';

const ReviewOrderButtonContainer = styled('div')<{
  isTransactionDetailsOpen: boolean;
}>`
  position: ${({ isTransactionDetailsOpen }) =>
    isTransactionDetailsOpen ? 'static' : 'absolute'};
  bottom: 0;
  left: 0;
  width: 100%;
`;

export function Swap() {
  const { t } = useTranslation();
  const { capture, captureEncrypted } = useAnalyticsContext();
  const { network } = useNetworkContext();
  const { swap } = useSwapContext();
  const { networkFee } = useNetworkFeeContext();

  const {
    isFunctionAvailable: isSwapAvailable,
    isFunctionSupported: isSwapSupported,
  } = useIsFunctionAvailable(FunctionNames.SWAP);
  const history = useHistory();
  const theme = useTheme();
  const tokensWBalances = useTokensWithBalances({
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
  });

  const allTokensOnNetwork = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
  });
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const [slippageTolerance, setSlippageTolerance] = useState('1');
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
    swapGasLimit,
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
    maxFromValue,
    optimalRate,
    destAmount,
  } = useSwapStateFunctions();

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
      destinationInputField === 'to' && destAmount
        ? BigInt(destAmount)
        : toTokenValue?.bigint;

    return result;
  }, [destAmount, destinationInputField, toTokenValue]);

  const maxFromAmount = useMemo(() => {
    if (isLoading || destinationInputField === 'to') return undefined;
    if (destinationInputField === 'from') return maxFromValue ?? 0n;
  }, [destinationInputField, isLoading, maxFromValue]);

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
      !optimalRate?.gasCost ||
      !toTokenDecimals ||
      !toTokenAddress ||
      !fromTokenAddress ||
      !fromTokenDecimals ||
      !amount
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
        srcAmount: optimalRate.srcAmount,
        priceRoute: optimalRate,
        destAmount: optimalRate.destAmount,
        gasLimit: swapGasLimit,
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
      toast.error(t('Swap Failed'));
      captureEncrypted('SwapFailed', {
        address: activeAddress,
        chainId: network?.chainId,
      });
    }

    if (!error) {
      toast.loading(t('Swap pending...'));
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
    optimalRate &&
    swapGasLimit &&
    networkFee;

  const isDetailsAvailable =
    selectedFromToken && selectedToToken && optimalRate && networkFee;

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
            onTokenChange={(
              token: NetworkTokenWithBalance | TokenWithBalanceERC20,
            ) => {
              onTokenChange({
                token,
                destination: 'to',
                toToken: selectedToToken,
                fromValue: fromTokenValue,
              });
            }}
            onSelectToggle={() => {
              setIsFromTokenSelectOpen(!isFromTokenSelectOpen);
              setIsToTokenSelectOpen(false);
            }}
            tokensList={tokensWBalances}
            maxAmount={maxFromAmount}
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
              onClick={() => {
                reverseTokens(
                  isReversed,
                  selectedFromToken,
                  selectedToToken,
                  undefined,
                );
              }}
              disabled={!selectedFromToken || !selectedToToken}
              sx={{
                transition: 'all 0.2s',
                transform: isReversed ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            >
              <IconButton variant="contained" color="secondary">
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
            onTokenChange={(
              token: NetworkTokenWithBalance | TokenWithBalanceERC20,
            ) => {
              onTokenChange({
                token,
                fromToken: selectedFromToken,
                destination: 'from',
                fromValue: fromTokenValue,
              });
            }}
            onSelectToggle={() => {
              setIsToTokenSelectOpen(!isToTokenSelectOpen);
              setIsFromTokenSelectOpen(false);
            }}
            tokensList={allTokensOnNetwork}
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
              rate={calculateRate(optimalRate)}
              slippage={slippageTolerance}
              setSlippage={(slippage) => setSlippageTolerance(slippage)}
              setIsOpen={setIsTransactionDetailsOpen}
              isTransactionDetailsOpen={isTransactionDetailsOpen}
            />
          )}
          <ReviewOrderButtonContainer
            isTransactionDetailsOpen={isTransactionDetailsOpen}
          >
            <ParaswapNotice />
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
