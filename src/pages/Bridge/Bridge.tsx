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
import { AssetBalance } from './models';
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
import { isAddressBlocklisted } from './utils/isAddressBlocklisted';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import {
  blockchainToNetwork,
  networkToBlockchain,
} from './utils/blockchainConversion';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { BridgeUnknownNetwork } from './components/BridgeUnknownNetwork';
import { useAvailableBlockchains } from './hooks/useAvailableBlockchains';
import { Trans, useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlagContext();
  const availableBlockchains = useAvailableBlockchains();

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
  const { network, setNetwork, networks } = useNetworkContext();

  const denomination = sourceBalance?.asset.denomination || 0;
  const amountBN = useMemo(
    () => bigToBN(amount, denomination),
    [amount, denomination]
  );

  const bridgePageHistoryData: {
    selectedToken?: string;
    inputAmount?: Big;
  } = getPageHistoryData();

  // derive blockchain/network from network
  useEffect(() => {
    const networkBlockchain = networkToBlockchain(network);
    if (currentBlockchain !== networkBlockchain) {
      setCurrentBlockchain(networkBlockchain);
    }
  }, [network, currentBlockchain, setCurrentBlockchain]);

  // Set source blockchain & amount from page storage
  useEffect(() => {
    if (bridgePageHistoryData.inputAmount) {
      setAmount(new Big(bridgePageHistoryData.inputAmount));
    }
  }, [bridgePageHistoryData.inputAmount, setAmount, networks, setNetwork]);

  // Set token from page storage
  useEffect(() => {
    const sourceSymbols = Object.keys(sourceAssets);
    const symbol = bridgePageHistoryData.selectedToken;
    if (
      symbol &&
      !currentAsset &&
      sourceSymbols.length &&
      sourceSymbols.includes(symbol) // make sure we have the selected token available on the network to prevent an infinite loop
    ) {
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
        selectedToken: currentAsset,
        inputAmount: amount,
      });
      const blockChainNetwork = blockchainToNetwork(
        blockchain,
        networks,
        bridgeConfig
      );
      blockChainNetwork && setNetwork(blockChainNetwork);
      // Reset because a denomination change will change its value
      setAmount(BIG_ZERO);
    },
    [
      amount,
      bridgeConfig,
      currentAsset,
      networks,
      setAmount,
      setNavigationHistoryData,
      setNetwork,
    ]
  );

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
      selectedToken: currentAsset,
      inputAmount: bigValue,
    });
    setAmount(bigValue);
    sendAmountEnteredAnalytics('Bridge');
  };

  const handleBlockchainToggle = () => {
    if (targetBlockchain) {
      setNavigationHistoryData({
        selectedToken: currentAsset,
        inputAmount: undefined,
      });
      // convert blockChain to Network
      const blockChainNetwork = blockchainToNetwork(
        targetBlockchain,
        networks,
        bridgeConfig
      );
      setAmount(BIG_ZERO);
      blockChainNetwork && setNetwork(blockChainNetwork);
      setIsSwitched(!isSwitched);
    }
  };

  const handleSelect = (symbol: string) => {
    setNavigationHistoryData({
      selectedToken: symbol,
      inputAmount: undefined,
    });
    setAmount(BIG_ZERO);
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

      setBridgeError(t('The was a problem with the transfer'));
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
          {t('Go to the status page')}
        </PrimaryButton>
      </FunctionIsOffline>
    );
  }

  if (
    currentBlockchain === Blockchain.UNKNOWN ||
    !availableBlockchains.includes(currentBlockchain)
  ) {
    return <BridgeUnknownNetwork onSelect={handleBlockchainSwitchFrom} />;
  }

  if (activeAccount && isAddressBlocklisted(activeAccount, bridgeConfig)) {
    return <BridgeSanctions />;
  }

  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitle>{t('Bridge')}</PageTitle>
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
                    <Typography>{t('From')}</Typography>
                    <VerticalFlex align="flex-end" width="100%">
                      <NetworkSelector
                        testId="bridge-from-chain-selector"
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
                      selectorLabel={t('Select Token')}
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
                            <Typography size={12}>
                              <Trans
                                i18nKey="Insufficient balance to cover gas costs. <br />Please add {{token}}."
                                values={{
                                  token:
                                    currentBlockchain === Blockchain.AVALANCHE
                                      ? 'AVAX'
                                      : 'ETH',
                                }}
                              />
                            </Typography>
                            {isAmountTooLow && (
                              <Typography size={12}>
                                {t(`Amount too low -- minimum is {{minimum}}`, {
                                  minimum: minimum?.toFixed(9) ?? 0,
                                })}
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
                            {t('Error')}
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
                  content={<Typography size={12}>{t('Switch')}</Typography>}
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
                    <Typography>{t('To')}</Typography>
                    <NetworkSelector
                      testId="bridge-to-chain-selector"
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
                    <Typography size={14}>{t('Receive')}</Typography>

                    <Typography size={14}>{formattedReceiveAmount}</Typography>
                  </HorizontalFlex>
                  <HorizontalFlex justify="space-between" align="center">
                    <Typography color={theme.colors.text2} size={12}>
                      {t('Estimated')}
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
            {t('Waiting for deposit confirmation')}
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
          {t('Transfer')}
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
          address={t('Avalanche Bridge')}
          amount={bigToLocaleString(amount)}
          symbol={currentAsset}
        />
      )}
    </VerticalFlex>
  );
}

export default Bridge;
