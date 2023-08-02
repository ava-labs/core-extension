import { useSwapContext } from '@src/contexts/SwapProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useState } from 'react';
import { resolve } from '@src/utils/promiseResolver';
import { TransactionDetails } from './components/TransactionDetails';
import { ReviewOrder } from './components/ReviewOrder';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { PageTitle } from '@src/components/common/PageTitle';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useHistory } from 'react-router-dom';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SwitchIconContainer } from '@src/components/common/SwitchIconContainer';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { ParaswapNotice } from './components/ParaswapNotice';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';
import { FunctionIsUnavailable } from '@src/components/common/FunctionIsUnavailable';
import { BigNumber } from 'ethers';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import BN from 'bn.js';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { useTranslation } from 'react-i18next';
import { useSwapStateFunctions } from './hooks/useSwapStateFunctions';
import { SwapError } from './components/SwapError';
import { calculateRate } from './utils';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import { useKeystoneContext } from '@src/contexts/KeystoneProvider';
import { toastCardWithLink } from '@src/utils/toastCardWithLink';
import {
  Stack,
  toast,
  Scrollbars,
  Typography,
  SwapIcon,
  useTheme,
  Button,
  styled,
  ToastCard,
  IconButton,
} from '@avalabs/k2-components';
import { TokenSelect } from '@src/components/common/TokenSelect';

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
  const { featureFlags } = useFeatureFlagContext();
  const { capture } = useAnalyticsContext();
  const { network } = useNetworkContext();
  const { swap } = useSwapContext();
  const { networkFee } = useNetworkFeeContext();

  const { isFunctionAvailable: isSwapAvailable } =
    useIsFunctionAvailable('Swap');
  const history = useHistory();
  const theme = useTheme();
  const tokensWBalances = useTokensWithBalances();
  const allTokensOnNetwork = useTokensWithBalances(true);
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const { resetKeystoneRequest } = useKeystoneContext();

  const [txInProgress, setTxInProgress] = useState<boolean>(false);
  const [isReviewOrderOpen, setIsReviewOrderOpen] = useState<boolean>(false);
  const [slippageTolerance, setSlippageTolerance] = useState('1');
  const [isFromTokenSelectOpen, setIsFromTokenSelectOpen] = useState(false);
  const [isToTokenSelectOpen, setIsToTokenSelectOpen] = useState(false);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] =
    useState(false);

  const {
    calculateTokenValueToInput,
    onGasChange,
    reverseTokens,
    onTokenChange,
    onFromInputAmountChange,
    onToInputAmountChange,
    getSwapValues,
    customGasPrice,
    gasLimit,
    selectedFromToken,
    selectedToToken,
    destinationInputField,
    fromTokenValue,
    swapError,
    isLoading,
    defaultFromValue,
    swapWarning,
    isReversed,
    selectedGasFee,
    toTokenValue,
    maxFromValue,
    optimalRate,
    destAmount,
  } = useSwapStateFunctions();

  async function onHandleSwap() {
    let pendingToastId = '';

    if (!isUsingLedgerWallet && !isUsingKeystoneWallet) {
      history.push('/home');
      pendingToastId = toast.loading(t('Swap pending...'));
    }
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
    setTxInProgress(true);

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
        customGasPrice || networkFee.low.maxFee,
        parseFloat(slippage)
      )
    );
    setTxInProgress(false);
    if (error) {
      toast.custom(
        <ToastCard
          onDismiss={() => toast.remove(pendingToastId)}
          variant="error"
        >
          {t('Swap Failed')}
        </ToastCard>,
        {
          id: pendingToastId,
          duration: Infinity,
        }
      );
      setIsReviewOrderOpen(false);

      return;
    }
    toastCardWithLink({
      title: t('Swap Successful'),
      url: network && getExplorerAddressByNetwork(network, result.swapTxHash),
      label: t('View in Explorer'),
      id: pendingToastId,
    });
    history.push('/home');
  }

  if (!isSwapAvailable) {
    return (
      <FunctionIsUnavailable
        functionName="Swap"
        network={network?.chainName || 'Testnet'}
      />
    );
  }

  if (!featureFlags[FeatureGates.SWAP]) {
    return <FunctionIsOffline functionName="Swap" />;
  }

  const maxGasPrice =
    selectedFromToken?.type === TokenType.NATIVE && fromTokenValue
      ? selectedFromToken.balance.sub(fromTokenValue.bn).toString()
      : tokensWBalances
          .find(({ type }) => type === TokenType.NATIVE)
          ?.balance.toString() || '0';

  const canSwap =
    !swapError.message &&
    selectedFromToken &&
    selectedToToken &&
    optimalRate &&
    gasLimit &&
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
          mt: 1,
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
            onTokenChange={(token: TokenWithBalance) => {
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
            onInputAmountChange={(value) => {
              onFromInputAmountChange(value);
            }}
            setIsOpen={setIsFromTokenSelectOpen}
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
            <SwitchIconContainer
              data-testid="swap-switch-token-button"
              onClick={() =>
                reverseTokens(
                  isReversed,
                  selectedFromToken,
                  selectedToToken,
                  fromTokenValue
                )
              }
              disabled={!selectedFromToken || !selectedToToken}
              isSwapped={isReversed}
            >
              <IconButton variant="contained" color="secondary">
                <SwapIcon
                  size={20}
                  sx={{
                    transform: 'rotate(90deg)',
                  }}
                />
              </IconButton>
            </SwitchIconContainer>
          </Stack>
          <TokenSelect
            label={t('To')}
            onTokenChange={(token: TokenWithBalance) => {
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
            inputAmount={
              destinationInputField === 'to' && destAmount
                ? new BN(destAmount)
                : toTokenValue?.bn || new BN(0)
            }
            isValueLoading={destinationInputField === 'to' && isLoading}
            hideErrorMessage
            onInputAmountChange={(value) => {
              onToInputAmountChange(value);
            }}
            setIsOpen={setIsToTokenSelectOpen}
          />

          {isDetailsAvailable && (
            <TransactionDetails
              fromTokenSymbol={selectedFromToken?.symbol}
              toTokenSymbol={selectedToToken?.symbol}
              rate={calculateRate(optimalRate)}
              onGasChange={onGasChange}
              gasLimit={gasLimit}
              gasPrice={customGasPrice || networkFee.low.maxFee}
              maxGasPrice={maxGasPrice}
              slippage={slippageTolerance}
              setSlippage={(slippage) => setSlippageTolerance(slippage)}
              setIsOpen={setIsTransactionDetailsOpen}
              selectedGasFee={selectedGasFee}
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
              onClick={() => {
                capture('SwapReviewOrder', {
                  destinationInputField,
                  slippageTolerance,
                  customGasPrice: customGasPrice?.toString(),
                });
                setIsReviewOrderOpen(true);
              }}
              fullWidth
              size="large"
              disabled={isLoading || !canSwap}
            >
              {t('Review Order')}
            </Button>
          </ReviewOrderButtonContainer>
        </Scrollbars>
      </Stack>

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
          gasPrice={customGasPrice || networkFee.low.maxFee}
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
          selectedGasFee={selectedGasFee}
        />
      )}

      {txInProgress && (
        <TxInProgress
          fee={(customGasPrice || networkFee?.low.maxFee || BigNumber.from(0))
            .mul(gasLimit)
            .div((10 ** (network?.networkToken.decimals ?? 18)).toString())
            .toString()}
          feeSymbol={network?.networkToken.symbol}
          amount={fromTokenValue?.amount}
          symbol={selectedFromToken?.symbol}
          onReject={() => {
            resetKeystoneRequest();
            setTxInProgress(false);
          }}
        />
      )}
    </Stack>
  );
}
