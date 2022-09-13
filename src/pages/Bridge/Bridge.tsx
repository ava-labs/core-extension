import {
  BIG_ZERO,
  Blockchain,
  formatTokenAmount,
  useBridgeConfig,
  useBridgeSDK,
  WrapStatus,
  useGetTokenSymbolOnNetwork,
} from '@avalabs/bridge-sdk';
import { FeatureGates } from '@avalabs/posthog-sdk';
import {
  Card,
  ComponentSize,
  HorizontalFlex,
  HorizontalSeparator,
  LoadingSpinnerIcon,
  PrimaryButton,
  SwapArrowsIcon,
  TertiaryCard,
  Tooltip,
  Typography,
  VerticalFlex,
  WarningIcon,
} from '@avalabs/react-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { SwitchIconContainer } from '@src/components/common/SwitchIconContainer';
import { TokenSelect } from '@src/components/common/TokenSelect';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { NetworkSelector } from './components/NetworkSelector';
import { AssetBalance, SUPPORTED_CHAINS } from './models';
import { useBridge } from './hooks/useBridge';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { usePageHistory } from '@src/hooks/usePageHistory';
import {
  bigToBN,
  bigToLocaleString,
  bnToBig,
  resolve,
} from '@avalabs/utils-sdk';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';
import { useSyncBridgeConfig } from './hooks/useSyncBridgeConfig';
import BN from 'bn.js';
import Big from 'big.js';
import { TokenType } from '@src/background/services/balances/models';
import { useSetBridgeChainFromNetwork } from './hooks/useSetBridgeChainFromNetwork';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { WalletType } from '@src/background/services/wallet/models';
import { BridgeConfirmLedger } from './components/BridgeConfirm';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { BridgeSanctions } from './components/BridgeSanctions';
import { isAddressWhitelisted } from './utils/isAddressWhitelisted';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';

const ErrorSection = styled(HorizontalFlex)`
  position: relative;
  top: -25px;
`;

const StyledLoading = styled(LoadingSpinnerIcon)`
  margin-right: 10px;
`;

const SwitchButton = styled(SwitchIconContainer)<{ useHigherZIndex: boolean }>`
  z-index: ${({ useHigherZIndex }) => (useHigherZIndex ? '1' : '0')};
  background-color: ${({ theme }) => theme.buttons.primary.bg};
  &[disabled] {
    background-color: ${({ theme }) => theme.buttons.primary.bg};
  }
  &:hover {
    background-color: ${({ theme }) => theme.buttons.primary.bg};
  }
`;

const CardClearBg = styled(Card)`
  background: none;
`;

const SeparatorForToSection = styled(HorizontalSeparator)`
  color: ${({ theme }) => theme.colors.text2};
`;

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

export function Bridge() {
  useSyncBridgeConfig(); // keep bridge config up-to-date
  useSetBridgeChainFromNetwork();
  const {
    sourceBalance,
    amount,
    setAmount,
    assetsWithBalances,
    hasEnoughForNetworkFee,
    loading,
    price,
    maximum,
    minimum,
    receiveAmount,
    wrapStatus,
    transfer,
  } = useBridge();
  const {
    bridgeConfig,
    currentAsset,
    setCurrentAsset,
    currentBlockchain,
    setCurrentBlockchain,
    targetBlockchain,
    targetChains,
    sourceAssets,
  } = useBridgeSDK();
  const { error } = useBridgeConfig();
  const { featureFlags } = useFeatureFlagContext();
  const [availableBlockchains, setAvailableBlockchains] =
    useState<Blockchain[]>(SUPPORTED_CHAINS);

  const { currencyFormatter, currency } = useSettingsContext();
  const { getTokenSymbolOnNetwork } = useGetTokenSymbolOnNetwork();
  const { walletType } = useWalletContext();

  const theme = useTheme();
  const [bridgeError, setBridgeError] = useState<string>('');

  const [isPending, setIsPending] = useState<boolean>(false);
  const [transferWithLedger, setTransferWithLedger] = useState<boolean>(false);
  const history = useHistory();
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [isSwitched, setIsSwitched] = useState(false);
  const { capture } = useAnalyticsContext();
  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();

  const { activeAccount } = useAccountsContext();

  const denomination = sourceBalance?.asset.denomination || 0;
  const amountBN = useMemo(
    () => bigToBN(amount, denomination),
    [amount, denomination]
  );

  const bridgePageHistoryData: {
    currentBlockchain?: Blockchain;
    selectedToken?: string;
    inputAmount?: Big;
  } = getPageHistoryData();

  // Set source blockchain & amount from page storage
  useEffect(() => {
    if (bridgePageHistoryData.currentBlockchain) {
      setCurrentBlockchain(bridgePageHistoryData.currentBlockchain);
    }
    if (bridgePageHistoryData.inputAmount) {
      setAmount(new Big(bridgePageHistoryData.inputAmount));
    }
  }, [
    bridgePageHistoryData.currentBlockchain,
    bridgePageHistoryData.inputAmount,
    setAmount,
    setCurrentBlockchain,
  ]);

  // Set token from page storage
  useEffect(() => {
    if (
      bridgePageHistoryData.selectedToken &&
      !currentAsset &&
      Object.keys(sourceAssets).length
    ) {
      const symbol = bridgePageHistoryData.selectedToken;
      // Workaround for a race condition with useEffect in BridgeSDKProvider
      // that also calls setCurrentAsset :(
      setTimeout(() => setCurrentAsset(symbol), 1);
    }
  }, [
    bridgePageHistoryData.selectedToken,
    currentAsset,
    setCurrentAsset,
    sourceAssets,
  ]);

  const handleBlockchainSwitchFrom = useCallback(
    (blockchain: Blockchain) => {
      setNavigationHistoryData({
        currentBlockchain: blockchain,
        selectedToken: currentAsset,
        inputAmount: amount,
      });
      setCurrentBlockchain(blockchain);
      // Reset because a denomination change will change its value
      setAmount(BIG_ZERO);
    },
    [
      amount,
      currentAsset,
      setAmount,
      setCurrentBlockchain,
      setNavigationHistoryData,
    ]
  );

  // Remove chains turned off by the feature flags and
  // switch chain in case the selected one is not available
  useEffect(() => {
    const availableChains = SUPPORTED_CHAINS.filter((chain) => {
      switch (chain) {
        case Blockchain.BITCOIN:
          return featureFlags[FeatureGates.BRIDGE_BTC];
        case Blockchain.ETHEREUM:
          return featureFlags[FeatureGates.BRIDGE_ETH];
        default:
          return true;
      }
    });

    setAvailableBlockchains(availableChains);

    if (!availableChains.includes(currentBlockchain) && availableChains[0]) {
      handleBlockchainSwitchFrom(availableChains[0]);
    }
  }, [currentBlockchain, featureFlags, handleBlockchainSwitchFrom]);

  const isAmountTooLow =
    amount && !amount.eq(BIG_ZERO) && amount.lt(minimum || BIG_ZERO);
  const hasValidAmount = !isAmountTooLow && amount.gt(BIG_ZERO);

  const formattedReceiveAmount =
    hasValidAmount && receiveAmount
      ? `${receiveAmount.toFixed(9)} ${currentAsset}`
      : '-';
  const formattedReceiveAmountCurrency =
    hasValidAmount && price && receiveAmount
      ? `~${currencyFormatter(price * receiveAmount.toNumber()).replace(
          currency,
          ''
        )} ${currency}`
      : '-';

  const handleAmountChanged = (value: { bn: BN; amount: string }) => {
    const bigValue = bnToBig(value.bn, denomination);
    setNavigationHistoryData({
      currentBlockchain,
      selectedToken: currentAsset,
      inputAmount: bigValue,
    });
    setAmount(bigValue);
    sendAmountEnteredAnalytics('Bridge');
  };

  const handleBlockchainToggle = () => {
    if (targetBlockchain) {
      setNavigationHistoryData({
        currentBlockchain: targetBlockchain,
        selectedToken: currentAsset,
        inputAmount: amount,
      });
      setCurrentBlockchain(targetBlockchain);
      setIsSwitched(!isSwitched);
    }
  };

  const handleSelect = (symbol: string) => {
    setNavigationHistoryData({
      currentBlockchain,
      selectedToken: symbol,
      inputAmount: amount,
    });
    setCurrentAsset(symbol);
    sendTokenSelectedAnalytics('Bridge');
  };

  const onTransferClicked = () => {
    if (walletType === WalletType.LEDGER) {
      setTransferWithLedger(true);
    } else {
      handleTransfer();
    }
  };

  const handleTransfer = async () => {
    if (BIG_ZERO.eq(amount)) return;

    capture('BridgeTransferStarted', {
      sourceBlockchain: currentBlockchain,
      targetBlockchain,
    });

    setIsPending(true);
    const [hash, error] = await resolve(transfer());
    setTransferWithLedger(false);
    setIsPending(false);

    if (error) {
      console.error(error);
      // do not show the error when the user denied the transfer
      if (error === 'User declined the transaction') {
        return;
      }

      setBridgeError('The was a problem with the transfer');
      return;
    }

    const timestamp = Date.now();

    // Navigate to transaction status page
    history.push(
      `/bridge/transaction-status/${currentBlockchain}/${hash}/${timestamp}`
    );
  };

  if (
    error ||
    !featureFlags[FeatureGates.BRIDGE] ||
    availableBlockchains.length < 2 // we need at least to blockchains to bridge between
  ) {
    return (
      <FunctionIsOffline functionName="Bridge">
        <PrimaryButton
          size={ComponentSize.LARGE}
          margin="24px 0 0 0"
          as="a"
          href="https://status.avax.network/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to the status page
        </PrimaryButton>
      </FunctionIsOffline>
    );
  }

  if (activeAccount && isAddressWhitelisted(activeAccount, bridgeConfig)) {
    return <BridgeSanctions />;
  }

  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitle>Bridge</PageTitle>
      <VerticalFlex padding="0 16px 0 16px" style={{ flex: 1 }}>
        <VerticalFlex style={{ flex: 1 }}>
          <TertiaryCard padding="0">
            <VerticalFlex width="100%">
              {/* From section */}
              <Card padding="0">
                <VerticalFlex width="100%">
                  <HorizontalFlex
                    justify="space-between"
                    align="center"
                    padding="16px 16px 0 16px"
                  >
                    <Typography>From</Typography>
                    <VerticalFlex align="flex-end" width="100%">
                      <NetworkSelector
                        selected={currentBlockchain}
                        onSelect={handleBlockchainSwitchFrom}
                        chains={availableBlockchains}
                      />
                    </VerticalFlex>
                  </HorizontalFlex>
                  <HorizontalSeparator margin="16px" width="100%" />
                  <HorizontalFlex>
                    <TokenSelect
                      onSelectToggle={() => {
                        setIsTokenSelectOpen(!isTokenSelectOpen);
                      }}
                      bridgeTokensList={assetsWithBalances}
                      maxAmount={maximum && bigToBN(maximum, denomination)}
                      onTokenChange={(token: AssetBalance) => {
                        handleSelect(token.symbol);
                      }}
                      isOpen={isTokenSelectOpen}
                      isValueLoading={loading}
                      selectedToken={
                        currentAsset && sourceBalance
                          ? {
                              type: TokenType.ERC20,
                              balanceDisplayValue: formatBalance(
                                sourceBalance.balance
                              ),
                              balance: bigToBN(
                                sourceBalance.balance || BIG_ZERO,
                                denomination
                              ),
                              decimals: denomination,
                              priceUSD: price,
                              logoUri: sourceBalance.logoUri,
                              name: sourceBalance.asset.symbol,
                              symbol: getTokenSymbolOnNetwork(
                                sourceBalance.asset.symbol,
                                currentBlockchain
                              ),
                              address: sourceBalance.asset.symbol,
                              contractType: 'ERC-20',
                              description: '',
                            }
                          : undefined
                      }
                      onInputAmountChange={handleAmountChanged}
                      padding="8px 16px"
                      onError={(errorMessage) => {
                        capture('BridgeTokenSelectError', {
                          errorMessage,
                        });
                        setBridgeError(errorMessage);
                      }}
                      skipHandleMaxAmount
                      inputAmount={
                        // Reset BNInput when programmatically setting the amount to zero
                        !sourceBalance || amountBN.isZero()
                          ? undefined
                          : amountBN
                      }
                      setIsOpen={setIsTokenSelectOpen}
                      label=""
                      selectorLabel="Select Token"
                    />
                  </HorizontalFlex>
                  <ErrorSection height="28px">
                    {(bridgeError ||
                      isAmountTooLow ||
                      !hasEnoughForNetworkFee) && (
                      <Tooltip
                        placement="bottom-start"
                        content={
                          <VerticalFlex rowGap="16px" padding="8px">
                            {!hasEnoughForNetworkFee && (
                              <Typography size={12}>
                                Insufficient balance to cover gas costs. <br />
                                Please add{' '}
                                {currentBlockchain === Blockchain.AVALANCHE
                                  ? 'AVAX'
                                  : 'ETH'}
                                .
                              </Typography>
                            )}
                            {isAmountTooLow && (
                              <Typography size={12}>
                                {`Amount too low -- minimum is ${minimum?.toFixed(
                                  9
                                )}`}
                              </Typography>
                            )}
                            {bridgeError && (
                              <Typography size={12}>{bridgeError}</Typography>
                            )}
                          </VerticalFlex>
                        }
                      >
                        <HorizontalFlex align="center">
                          <Typography
                            size={12}
                            padding="0 5px 0 16px"
                            color={theme.colors.error}
                          >
                            Error
                          </Typography>
                          <WarningIcon
                            height="12px"
                            color={theme.colors.error}
                          />
                        </HorizontalFlex>
                      </Tooltip>
                    )}
                  </ErrorSection>
                </VerticalFlex>
              </Card>

              {/* Switch to swap from and to */}
              <VerticalFlex
                align="center"
                margin="-20px 0 0 0"
                paddingBottom="8px"
              >
                <Tooltip
                  placement="auto"
                  content={<Typography size={12}>Switch</Typography>}
                >
                  <SwitchButton
                    data-testid="bridge-switch-button"
                    useHigherZIndex={!isTokenSelectOpen}
                    onClick={handleBlockchainToggle}
                    isSwapped={isSwitched}
                    disabled={!targetBlockchain}
                  >
                    <SwapArrowsIcon height="18px" color={theme.colors.bg1} />
                  </SwitchButton>
                </Tooltip>
              </VerticalFlex>

              {/* To section */}
              <CardClearBg>
                <VerticalFlex width="100%">
                  <HorizontalFlex justify="space-between" align="center">
                    <Typography>To</Typography>
                    <NetworkSelector
                      selected={targetBlockchain}
                      disabled={true}
                      chains={targetChains}
                    />
                  </HorizontalFlex>
                  <SeparatorForToSection margin="16px 0 16px 0" />
                  <HorizontalFlex
                    justify="space-between"
                    align="center"
                    margin="0 0 8px 0"
                  >
                    <Typography size={14}>Receive</Typography>

                    <Typography size={14}>{formattedReceiveAmount}</Typography>
                  </HorizontalFlex>
                  <HorizontalFlex justify="space-between" align="center">
                    <Typography color={theme.colors.text2} size={12}>
                      Estimated
                    </Typography>

                    <Typography color={theme.colors.text2} size={12}>
                      {formattedReceiveAmountCurrency}
                    </Typography>
                  </HorizontalFlex>
                </VerticalFlex>
              </CardClearBg>
            </VerticalFlex>
          </TertiaryCard>
        </VerticalFlex>

        {wrapStatus === WrapStatus.WAITING_FOR_DEPOSIT && (
          <Typography size={14} align="center">
            Waiting for deposit confirmation
          </Typography>
        )}

        <PrimaryButton
          data-testid="bridger-transfer-button"
          width="100%"
          margin="16px 0 24px 0"
          size={ComponentSize.LARGE}
          disabled={
            bridgeError.length > 0 ||
            loading ||
            transferWithLedger ||
            isPending ||
            isAmountTooLow ||
            BIG_ZERO.eq(amount) ||
            !hasEnoughForNetworkFee
          }
          onClick={onTransferClicked}
        >
          {isPending && (
            <StyledLoading height="16px" color={theme.colors.stroke2} />
          )}
          Transfer
        </PrimaryButton>
      </VerticalFlex>
      {transferWithLedger && (
        <BridgeConfirmLedger
          blockchain={currentBlockchain}
          isTransactionPending={isPending}
          onCancel={() => {
            setTransferWithLedger(false);
          }}
          startTransfer={() => {
            setTransferWithLedger(false);
            handleTransfer();
          }}
        />
      )}
      {isPending && (
        <TxInProgress
          address={'Avalanche Bridge'}
          amount={bigToLocaleString(amount)}
          symbol={currentAsset}
        />
      )}
    </VerticalFlex>
  );
}

export default Bridge;
