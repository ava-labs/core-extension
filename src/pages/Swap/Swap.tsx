import { useSwapContext } from '@src/contexts/SwapProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useMemo, useState } from 'react';
import { resolve } from '@src/utils/promiseResolver';
import { TransactionDetails } from './components/TransactionDetails';
import { ReviewOrder } from './components/ReviewOrder';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { PageTitle } from '@src/components/common/PageTitle';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SwitchIconContainer } from '@src/components/common/SwitchIconContainer';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { ParaswapNotice } from './components/ParaswapNotice';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { FunctionIsUnavailable } from '@src/components/common/FunctionIsUnavailable';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import BN from 'bn.js';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { useTranslation } from 'react-i18next';
import { useSwapStateFunctions } from './hooks/useSwapStateFunctions';
import { SwapError } from './components/SwapError';
import { calculateRate } from './utils';
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
  IconButton,
} from '@avalabs/k2-components';
import { TokenSelect } from '@src/components/common/TokenSelect';
import { useApprovalHelpers } from '@src/hooks/useApprovalHelpers';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';

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
  const tokensWBalances = useTokensWithBalances();
  const allTokensOnNetwork = useTokensWithBalances(true);
  const { resetKeystoneRequest } = useKeystoneContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

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

  const activeAddress = useMemo(
    () =>
      network
        ? isBitcoinNetwork(network)
          ? activeAccount?.addressBTC
          : activeAccount?.addressC
        : undefined,
    [activeAccount?.addressBTC, activeAccount?.addressC, network]
  );

  const fromAmount = useMemo(() => {
    const result =
      destinationInputField === 'from' ? new BN(destAmount) : defaultFromValue;

    return result;
  }, [defaultFromValue, destAmount, destinationInputField]);

  const toAmount = useMemo(() => {
    const result =
      destinationInputField === 'to' && destAmount
        ? new BN(destAmount)
        : toTokenValue?.bn;

    return result;
  }, [destAmount, destinationInputField, toTokenValue]);

  const maxFromAmount = useMemo(() => {
    if (isLoading || destinationInputField === 'to') return undefined;
    if (destinationInputField === 'from') return maxFromValue ?? new BN(0);
  }, [destinationInputField, isLoading, maxFromValue]);

  async function performSwap() {
    captureEncrypted('SwapConfirmed', {
      address: activeAddress,
      chainId: network?.chainId,
    });

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
    if (error) {
      toast.error(t('Swap Failed'));
      setIsReviewOrderOpen(false);
      history.push('/home');
      captureEncrypted('SwapFailed', {
        address: activeAddress,
        chainId: network?.chainId,
      });
      return;
    }

    captureEncrypted('SwapSuccessful', {
      address: activeAddress,
      txHash: result.swapTxHash,
      chainId: network?.chainId,
    });

    toastCardWithLink({
      title: t('Swap Successful'),
      url: network && getExplorerAddressByNetwork(network, result.swapTxHash),
      label: t('View in Explorer'),
    });
    history.push('/home');
  }

  const { handleApproval, handleRejection, isApprovalOverlayVisible } =
    useApprovalHelpers({
      onApprove: performSwap,
      onReject: () => {
        resetKeystoneRequest();
        capture('SwapCancelled');
        setIsReviewOrderOpen(false);
      },
      pendingMessage: t('Swap pending...'),
    });

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
              onClick={() => {
                reverseTokens(
                  isReversed,
                  selectedFromToken,
                  selectedToToken,
                  undefined
                );
              }}
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
            inputAmount={toAmount}
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
          onClose={handleRejection}
          onConfirm={handleApproval}
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

      {isApprovalOverlayVisible && (
        <TxInProgress
          fee={(
            ((customGasPrice || networkFee?.low.maxFee || 0n) *
              BigInt(gasLimit)) /
            10n ** BigInt(network?.networkToken.decimals ?? 18)
          ).toString()}
          feeSymbol={network?.networkToken.symbol}
          amount={fromTokenValue?.amount}
          symbol={selectedFromToken?.symbol}
          onReject={handleRejection}
          onSubmit={handleApproval}
        />
      )}
    </Stack>
  );
}
