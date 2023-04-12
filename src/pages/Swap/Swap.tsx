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
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useState } from 'react';

import styled, { useTheme } from 'styled-components';
import { resolve } from '@src/utils/promiseResolver';
import { TransactionDetails } from './components/TransactionDetails';
import { ReviewOrder } from './components/ReviewOrder';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { PageTitle } from '@src/components/common/PageTitle';
import { TokenSelect } from '@src/components/common/TokenSelect';
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
    let toastId = '';
    if (!isUsingLedgerWallet && !isUsingKeystoneWallet) {
      history.push('/home');
      toastId = toast.custom(
        <TransactionToast
          type={TransactionToastType.PENDING}
          text={t('Swap pending...')}
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
        <TransactionToast
          type={TransactionToastType.ERROR}
          text={t('Swap Failed')}
          startIcon={<WarningIcon height="20px" color={theme.colors.icon1} />}
        />,
        { id: toastId, duration: Infinity }
      );
      setIsReviewOrderOpen(false);

      return;
    }
    toast.custom(
      <TransactionToast
        status={t('Swap Successful')}
        type={TransactionToastType.SUCCESS}
        text={t('View in Explorer')}
        href={
          network && getExplorerAddressByNetwork(network, result.swapTxHash)
        }
      />
    );
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
          .find((t) => t.type === TokenType.NATIVE)
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
    <VerticalFlex width="100%">
      <PageTitle>{t('Swap')}</PageTitle>
      <VerticalFlex grow="1" margin="8px 0 0" padding="16px">
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
                selectedToToken,
                fromTokenValue,
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

          <HorizontalFlex
            justify={
              swapError?.message || swapWarning ? 'space-between' : 'flex-end'
            }
            margin="16px 0"
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
              <Typography size={12} color={theme.colors.error}>
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
              <SwitchIcon
                height="24px"
                direction={IconDirection.UP}
                color={theme.colors.text1}
              />
            </SwitchIconContainer>
          </HorizontalFlex>
          <TokenSelect
            label={t('To')}
            onTokenChange={(token: TokenWithBalance) => {
              onTokenChange({
                token,
                selectedFromToken,
                destination: 'from',
                fromTokenValue,
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
              walletFee={optimalRate.partnerFee}
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
            <PrimaryButton
              data-testid="swap-review-order-button"
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
              {t('Review Order')}
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
    </VerticalFlex>
  );
}
