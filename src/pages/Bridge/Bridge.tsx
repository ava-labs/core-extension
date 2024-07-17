import {
  BIG_ZERO,
  Blockchain,
  formatTokenAmount,
  useBridgeConfig,
  useBridgeSDK,
  WrapStatus,
  useGetTokenSymbolOnNetwork,
  isAddressBlocklisted,
} from '@avalabs/bridge-sdk';
import { PageTitle } from '@src/components/common/PageTitle';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { NetworkSelector } from './components/NetworkSelector';
import { AssetBalance } from './models';
import { BridgeProviders, useBridge } from './hooks/useBridge';
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
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { useSetBridgeChainFromNetwork } from './hooks/useSetBridgeChainFromNetwork';
import { BridgeConfirmLedger } from './components/BridgeConfirm';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { BridgeSanctions } from './components/BridgeSanctions';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import {
  blockchainToNetwork,
  networkToBlockchain,
} from './utils/blockchainConversion';
import { BridgeUnknownNetwork } from './components/BridgeUnknownNetwork';
import { useAvailableBlockchains } from './hooks/useAvailableBlockchains';
import { Trans, useTranslation } from 'react-i18next';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { useKeystoneContext } from '@src/contexts/KeystoneProvider';
import {
  AlertCircleIcon,
  Button,
  Card,
  CircularProgress,
  Divider,
  InfoCircleIcon,
  Link,
  Scrollbars,
  Stack,
  SwapIcon,
  ToastCard,
  Tooltip,
  Typography,
  toast,
  useTheme,
} from '@avalabs/k2-components';
import { TokenSelect } from '@src/components/common/TokenSelect';
import BridgeConfirmation from './BridgeConfirmation';
import useIsUsingWalletConnectAccount from '@src/hooks/useIsUsingWalletConnectAccount';
import useIsUsingFireblocksAccount from '@src/hooks/useIsUsingFireblocksAccount';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { useErrorMessage } from '@src/hooks/useErrorMessage';
import { isUnifiedBridgeAsset } from './utils/isUnifiedBridgeAsset';
import { getTokenAddress } from './utils/getTokenAddress';
import { useUnifiedBridgeContext } from '@src/contexts/UnifiedBridgeProvider';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
import { CustomGasSettings } from '@src/background/services/bridge/models';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

export function Bridge() {
  useSyncBridgeConfig(); // keep bridge config up-to-date
  useSetBridgeChainFromNetwork();
  const [currentAssetAddress, setCurrentAssetAddress] = useState<string>();
  const {
    sourceBalance,
    amount,
    setAmount,
    assetsWithBalances,
    hasEnoughForNetworkFee,
    loading,
    estimateGas,
    price,
    maximum,
    minimum,
    receiveAmount,
    wrapStatus,
    transfer,
    bridgeFee,
    provider,
    bridgeStep,
    gasSettings,
    setGasSettings,
  } = useBridge(currentAssetAddress);

  const {
    bridgeConfig,
    currentAsset,
    currentAssetData,
    setCurrentAsset,
    currentBlockchain,
    setCurrentBlockchain,
    targetBlockchain,
    sourceAssets,
  } = useBridgeSDK();
  const { error } = useBridgeConfig();
  const { getAssetAddressOnTargetChain } = useUnifiedBridgeContext();
  const { t } = useTranslation();
  const availableBlockchains = useAvailableBlockchains();

  const { currencyFormatter, currency } = useSettingsContext();
  const { getTokenSymbolOnNetwork } = useGetTokenSymbolOnNetwork();
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingWalletConnectAccount = useIsUsingWalletConnectAccount();
  const isUsingFireblocksAccount = useIsUsingFireblocksAccount();

  const { isFunctionAvailable } = useIsFunctionAvailable(FunctionNames.BRIDGE);

  const theme = useTheme();
  const [bridgeError, setBridgeError] = useState<string>('');
  const [requiredSignatures, setRequiredSignatures] = useState(1);
  const [currentSignature, setCurrentSignature] = useState(1);

  const [isPending, setIsPending] = useState<boolean>(false);
  const [transferWithLedger, setTransferWithLedger] = useState<boolean>(false);
  const history = useHistory();
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [isSwitched, setIsSwitched] = useState(false);
  const { capture, captureEncrypted } = useAnalyticsContext();
  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();
  const getTranslatedError = useErrorMessage();

  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network, setNetwork, networks } = useNetworkContext();
  const { resetKeystoneRequest } = useKeystoneContext();

  const { networkFee } = useNetworkFeeContext();

  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.INSTANT
  );

  const activeAddress = useMemo(
    () =>
      network
        ? isBitcoinNetwork(network)
          ? activeAccount?.addressBTC
          : activeAccount?.addressC
        : undefined,
    [activeAccount?.addressBTC, activeAccount?.addressC, network]
  );

  const targetNetwork = useMemo(() => {
    if (targetBlockchain) {
      return blockchainToNetwork(targetBlockchain, networks, bridgeConfig);
    }
  }, [bridgeConfig, networks, targetBlockchain]);

  const sourceNetwork = useMemo(() => {
    if (currentBlockchain) {
      return blockchainToNetwork(currentBlockchain, networks, bridgeConfig);
    }
  }, [bridgeConfig, networks, currentBlockchain]);

  const denomination = useMemo(() => {
    if (!sourceBalance) {
      return 0;
    }

    if (isUnifiedBridgeAsset(sourceBalance.asset)) {
      return sourceBalance?.asset.decimals;
    }

    return sourceBalance.asset.denomination;
  }, [sourceBalance]);

  const amountBN = useMemo(
    () => bigToBN(amount, denomination),
    [amount, denomination]
  );

  const formatCurrency = useCallback(
    (targetAmount?: number) => {
      return targetAmount
        ? `${currencyFormatter(targetAmount).replace(currency, '')} ${currency}`
        : '-';
    },
    [currency, currencyFormatter]
  );

  const selectedTokenForTokenSelect: TokenWithBalance | null = useMemo(() => {
    if (!currentAsset || !sourceBalance) {
      return null;
    }
    return {
      type: TokenType.ERC20,
      balanceDisplayValue: formatBalance(sourceBalance.balance),
      balance: bigToBN(sourceBalance.balance || BIG_ZERO, denomination),
      decimals: denomination,
      priceUSD: price,
      logoUri: sourceBalance.logoUri,
      name: isUnifiedBridgeAsset(sourceBalance.asset)
        ? sourceBalance.asset.symbol
        : getTokenSymbolOnNetwork(
            sourceBalance.asset.symbol,
            currentBlockchain
          ),
      symbol: isUnifiedBridgeAsset(sourceBalance.asset)
        ? sourceBalance.asset.symbol
        : getTokenSymbolOnNetwork(
            sourceBalance.asset.symbol,
            currentBlockchain
          ),
      address: sourceBalance.asset.symbol,
      contractType: 'ERC-20',
      unconfirmedBalanceDisplayValue: formatBalance(
        sourceBalance.unconfirmedBalance
      ),
      unconfirmedBalance: bigToBN(
        sourceBalance.unconfirmedBalance || BIG_ZERO,
        denomination
      ),
    };
  }, [
    currentAsset,
    currentBlockchain,
    denomination,
    getTokenSymbolOnNetwork,
    price,
    sourceBalance,
  ]);

  const bridgePageHistoryData: {
    selectedToken?: string;
    inputAmount?: Big;
    selectedTokenAddress?: string;
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
    if (!amount && bridgePageHistoryData.inputAmount) {
      setAmount(new Big(bridgePageHistoryData.inputAmount));
    }
  }, [
    amount,
    bridgePageHistoryData.inputAmount,
    setAmount,
    networks,
    setNetwork,
  ]);

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
      const timer = setTimeout(() => {
        setCurrentAsset(symbol);
        setCurrentAssetAddress(
          bridgePageHistoryData.selectedTokenAddress ?? ''
        );
      }, 1);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [
    bridgePageHistoryData.selectedToken,
    bridgePageHistoryData.selectedTokenAddress,
    currentAsset,
    currentAssetAddress,
    setCurrentAsset,
    sourceAssets,
    bridgeConfig,
    networks,
    targetBlockchain,
  ]);

  const handleBlockchainSwitchFrom = useCallback(
    (blockchain: Blockchain) => {
      const blockChainNetwork = blockchainToNetwork(
        blockchain,
        networks,
        bridgeConfig
      );

      if (blockChainNetwork) {
        setNetwork(blockChainNetwork);
        const assetAddressOnOppositeChain = getAssetAddressOnTargetChain(
          currentAsset,
          blockChainNetwork.chainId
        );

        setCurrentAssetAddress(assetAddressOnOppositeChain);
        setNavigationHistoryData({
          selectedTokenAddress: assetAddressOnOppositeChain,
          selectedToken: currentAsset,
          inputAmount: amount,
        });
      }

      // Reset because a denomination change will change its value
      setAmount(BIG_ZERO);
      setBridgeError('');
    },
    [
      amount,
      bridgeConfig,
      getAssetAddressOnTargetChain,
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

  const gasToken = useMemo(
    () =>
      currentBlockchain === Blockchain.AVALANCHE
        ? 'AVAX'
        : currentBlockchain === Blockchain.BITCOIN
        ? 'BTC'
        : 'ETH',
    [currentBlockchain]
  );

  const disableTransfer = useMemo(
    () =>
      bridgeError.length > 0 ||
      loading ||
      transferWithLedger ||
      isPending ||
      isAmountTooLow ||
      BIG_ZERO.eq(amount) ||
      !hasEnoughForNetworkFee,
    [
      amount,
      bridgeError.length,
      hasEnoughForNetworkFee,
      isAmountTooLow,
      isPending,
      loading,
      transferWithLedger,
    ]
  );

  const errorTooltipContent = useMemo(() => {
    return (
      <>
        {!hasEnoughForNetworkFee && (
          <Typography variant="caption">
            <Trans
              i18nKey="Insufficient balance to cover gas costs. <br />Please add {{token}}."
              values={{
                token: gasToken,
              }}
            />
          </Typography>
        )}
        {isAmountTooLow && (
          <Typography variant="caption">
            {t(`Amount too low -- minimum is {{minimum}}`, {
              minimum: minimum?.toFixed(9) ?? 0,
            })}
          </Typography>
        )}
        {bridgeError && (
          <Typography variant="caption">{bridgeError}</Typography>
        )}
      </>
    );
  }, [
    bridgeError,
    gasToken,
    hasEnoughForNetworkFee,
    isAmountTooLow,
    minimum,
    t,
  ]);

  const formattedReceiveAmount = useMemo(() => {
    const unit = currentAsset ? ` ${currentAsset}` : '';
    return hasValidAmount && receiveAmount
      ? `${bigToLocaleString(receiveAmount, denomination)}${unit}`
      : '-';
  }, [currentAsset, hasValidAmount, receiveAmount, denomination]);

  const formattedReceiveAmountCurrency = useMemo(() => {
    const result =
      hasValidAmount && price && receiveAmount
        ? `~${formatCurrency(price * receiveAmount.toNumber())}`
        : '-';

    return result;
  }, [formatCurrency, hasValidAmount, price, receiveAmount]);

  const bridgeAmountCurrency = useMemo(() => {
    return price && amount ? formatCurrency(price * amount.toNumber()) : '-';
  }, [amount, formatCurrency, price]);

  const handleAmountChanged = useCallback(
    (value: { bn: BN; amount: string }) => {
      const bigValue = bnToBig(value.bn, denomination);
      setNavigationHistoryData({
        selectedTokenAddress: currentAssetAddress,
        selectedToken: currentAsset,
        inputAmount: bigValue,
      });

      setAmount(bigValue);
      sendAmountEnteredAnalytics('Bridge');

      // When there is no balance for given token, maximum is undefined
      if (!maximum || (maximum && bigValue && maximum.lt(bigValue))) {
        const errorMessage = t('Insufficient balance');

        if (errorMessage === bridgeError) {
          return;
        }

        setBridgeError(errorMessage);
        capture('BridgeTokenSelectError', {
          errorMessage,
        });
        return;
      }
      setBridgeError('');
    },
    [
      bridgeError,
      capture,
      currentAsset,
      currentAssetAddress,
      denomination,
      maximum,
      sendAmountEnteredAnalytics,
      setAmount,
      setNavigationHistoryData,
      t,
    ]
  );

  const handleBlockchainToggle = useCallback(() => {
    if (targetBlockchain) {
      // convert blockChain to Network
      const blockChainNetwork = blockchainToNetwork(
        targetBlockchain,
        networks,
        bridgeConfig
      );

      if (blockChainNetwork) {
        const assetAddressOnOppositeChain = getAssetAddressOnTargetChain(
          currentAsset,
          blockChainNetwork.chainId
        );

        setCurrentAssetAddress(assetAddressOnOppositeChain);
        setNavigationHistoryData({
          selectedTokenAddress: assetAddressOnOppositeChain,
          selectedToken: currentAsset,
          inputAmount: undefined,
        });
        setAmount(BIG_ZERO);
        setNetwork(blockChainNetwork);
        setIsSwitched(!isSwitched);
        setBridgeError('');
      }
    }
  }, [
    bridgeConfig,
    currentAsset,
    isSwitched,
    networks,
    setAmount,
    setNetwork,
    setNavigationHistoryData,
    targetBlockchain,
    getAssetAddressOnTargetChain,
  ]);

  const handleSelect = useCallback(
    (token: AssetBalance) => {
      const symbol = token.symbol;
      const address = getTokenAddress(token);

      setCurrentAssetAddress(address);
      setNavigationHistoryData({
        selectedToken: symbol,
        selectedTokenAddress: address,
        inputAmount: undefined,
      });
      setAmount(BIG_ZERO);
      setCurrentAsset(symbol);
      sendTokenSelectedAnalytics('Bridge');

      if (!hasEnoughForNetworkFee) {
        capture('BridgeTokenSelectError', {
          errorMessage: 'Insufficent balance to cover gas costs.',
        });
      }
    },
    [
      capture,
      hasEnoughForNetworkFee,
      sendTokenSelectedAnalytics,
      setAmount,
      setCurrentAsset,
      setNavigationHistoryData,
    ]
  );

  const onNextClicked = useCallback(() => {
    history.push('/bridge/confirm');
  }, [history]);

  const handleTransfer = useCallback(async () => {
    if (BIG_ZERO.eq(amount)) return;

    captureEncrypted('BridgeTransferStarted', {
      address: activeAddress,
      sourceBlockchain: currentBlockchain,
      targetBlockchain,
    });

    setIsPending(true);
    const [hash, transferError] = await resolve(transfer(gasSettings));
    setTransferWithLedger(false);
    setIsPending(false);

    if (transferError) {
      console.error(transferError);
      // do not show the error when the user denied the transfer
      if (transferError === 'User declined the transaction') {
        captureEncrypted('BridgeTransferRequestUserRejectedError', {
          address: activeAddress,
          sourceBlockchain: currentBlockchain,
          targetBlockchain,
          fee: bridgeFee?.toNumber(),
        });
        return;
      }

      setBridgeError(t('There was a problem with the transfer'));
      captureEncrypted('BridgeTransferRequestError', {
        address: activeAddress,
        sourceBlockchain: currentBlockchain,
        targetBlockchain,
      });

      const { title, hint } = getTranslatedError(transferError);

      toast.custom(
        <ToastCard variant="error">
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption" color="text.primary">
            {hint}
          </Typography>
        </ToastCard>,
        { duration: 5000 }
      );
      return;
    }

    captureEncrypted('BridgeTransferRequestSucceeded', {
      address: activeAddress,
      txHash: hash,
      sourceBlockchain: currentBlockchain,
      targetBlockchain,
    });

    const timestamp = Date.now();

    // Navigate to transaction status page
    history.push(
      `/bridge/transaction-status/${currentBlockchain}/${hash}/${timestamp}`
    );
  }, [
    amount,
    bridgeFee,
    gasSettings,
    captureEncrypted,
    currentBlockchain,
    targetBlockchain,
    activeAddress,
    transfer,
    history,
    t,
    getTranslatedError,
  ]);

  const onSubmitClicked = useCallback(() => {
    if (isUsingLedgerWallet) {
      setTransferWithLedger(true);
    } else if (isUsingWalletConnectAccount || isUsingFireblocksAccount) {
      setIsPending(true);
    } else {
      handleTransfer();
    }
  }, [
    handleTransfer,
    isUsingFireblocksAccount,
    isUsingLedgerWallet,
    isUsingWalletConnectAccount,
  ]);

  const onGasSettingsChanged = useCallback(
    (newSettings: CustomGasSettings) => {
      setGasSettings((currSettings) => {
        const hasNewMaxFee =
          typeof newSettings.maxFeePerGas !== 'undefined' &&
          newSettings.maxFeePerGas !== currSettings.maxFeePerGas;

        const hasNewMaxTip =
          typeof newSettings.maxPriorityFeePerGas !== 'undefined' &&
          newSettings.maxPriorityFeePerGas !==
            currSettings.maxPriorityFeePerGas;

        const hasNewGasLimit =
          typeof newSettings.gasLimit !== 'undefined' &&
          newSettings.gasLimit !== currSettings.gasLimit;

        if (hasNewMaxFee || hasNewMaxTip || hasNewGasLimit) {
          return {
            ...currSettings,
            ...newSettings,
          };
        }

        return currSettings;
      });
    },
    [setGasSettings]
  );

  useEffect(() => {
    let isMounted = true;

    if (amount && amount.gt(BIG_ZERO)) {
      estimateGas(amount, currentAssetData).then((limit) => {
        if (isMounted && typeof limit === 'bigint') {
          onGasSettingsChanged({
            gasLimit: limit,
          });
        }
      });

      return () => {
        isMounted = false;
      };
    }
  }, [
    amount,
    estimateGas,
    currentAsset,
    currentAssetData,
    onGasSettingsChanged,
  ]);

  useEffect(() => {
    // If we see this status when bridging, this means we'll need two approvals
    // from the user: first to wrap the asset, 2nd to deposit it.
    if (wrapStatus === WrapStatus.WAITING_FOR_DEPOSIT_CONFIRMATION) {
      setRequiredSignatures(2);
      setCurrentSignature(1);
    }

    if (wrapStatus === WrapStatus.WAITING_FOR_CONFIRMATION) {
      setCurrentSignature(requiredSignatures);
    }
  }, [wrapStatus, requiredSignatures]);

  useEffect(() => {
    if (bridgeStep) {
      setRequiredSignatures(bridgeStep.requiredSignatures);
      setCurrentSignature(bridgeStep.currentSignature);
    }
  }, [bridgeStep]);

  const cardRef = useRef<HTMLDivElement>(null);

  if (
    error ||
    !isFunctionAvailable ||
    availableBlockchains.length < 2 // we need at least to blockchains to bridge between
  ) {
    return (
      <FunctionIsOffline functionName={FunctionNames.BRIDGE}>
        <Button
          href="https://status.avax.network/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            mt: 3,
          }}
        >
          {t('Go to the status page')}
        </Button>
      </FunctionIsOffline>
    );
  }

  if (
    currentBlockchain === Blockchain.UNKNOWN ||
    !availableBlockchains.includes(currentBlockchain)
  ) {
    return <BridgeUnknownNetwork onSelect={handleBlockchainSwitchFrom} />;
  }

  if (
    activeAccount &&
    isAddressBlocklisted({
      addressEVM: activeAccount.addressC,
      addressBTC: activeAccount.addressBTC,
      bridgeConfig,
    })
  ) {
    return <BridgeSanctions />;
  }

  return (
    <Switch>
      <Route path="/bridge/confirm">
        <>
          <BridgeConfirmation
            tokenAmount={amount.toString()}
            currencyAmount={bridgeAmountCurrency}
            source={{
              logoUri: sourceNetwork?.logoUri,
              name: sourceNetwork?.chainName,
            }}
            target={{
              logoUri: targetNetwork?.logoUri,
              name: targetNetwork?.chainName,
            }}
            currentAsset={currentAsset}
            bridgeFee={
              bridgeFee
                ? `${bigToLocaleString(
                    bridgeFee,
                    denomination
                  )} ${currentAsset}`
                : '-'
            }
            receiveAmount={receiveAmount}
            receiveAmountCurrency={formattedReceiveAmountCurrency}
            onSubmit={onSubmitClicked}
          />

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
              amount={bigToLocaleString(amount, denomination)}
              symbol={currentAsset}
              currentSignature={currentSignature}
              requiredSignatures={requiredSignatures}
              onReject={() => {
                setTransferWithLedger(false);
                resetKeystoneRequest();
                setIsPending(false);
              }}
              onSubmit={handleTransfer}
            />
          )}
        </>
      </Route>
      <Route path="/bridge">
        <Stack sx={{ height: '100%', width: '100%' }}>
          <PageTitle
            onBackClick={() => {
              // We need to reset the current asset when the user purposefully navigates away from Bridge.
              // That's because this kind of action will clear the data we saved in NavigationHistoryService,
              // therefore leaving us with no "currentAssetAddress", without which we cannot distinguish between
              // USDC and USDC.e
              // Closing & reopening of the extension will still work & load the previous form values,
              // because this action does not clear the data in NavigationHistoryService.
              setCurrentAsset('');
              history.replace('/home');
            }}
          >
            {t('Bridge')}
          </PageTitle>
          <Scrollbars>
            <Stack
              sx={{
                flex: 1,
                px: 2,
                pb: provider === BridgeProviders.Unified ? 14 : 10,
              }}
            >
              <Stack sx={{ flex: 1 }}>
                <Card ref={cardRef} sx={{ p: 0, overflow: 'unset' }}>
                  <Stack sx={{ width: '100%' }}>
                    {/* From section */}
                    <Card
                      sx={{
                        p: 0,
                        backgroundColor: 'grey.850',
                        overflow: 'unset',
                      }}
                    >
                      <Stack sx={{ width: '100%' }}>
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2,
                            pr: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'fontWeightSemibold' }}
                          >
                            {t('From')}
                          </Typography>
                          <NetworkSelector
                            testId="bridge-from-chain-selector"
                            selected={currentBlockchain}
                            onSelect={handleBlockchainSwitchFrom}
                            chains={availableBlockchains}
                          />
                        </Stack>
                        <Stack
                          sx={{
                            flexGrow: 1,
                            maxHeight: 'unset',
                            height: '100%',
                          }}
                        >
                          <TokenSelect
                            maxAmount={
                              maximum && bigToBN(maximum, denomination)
                            }
                            bridgeTokensList={assetsWithBalances}
                            selectedToken={selectedTokenForTokenSelect}
                            onTokenChange={handleSelect}
                            inputAmount={
                              // Reset BNInput when programmatically setting the amount to zero
                              !sourceBalance || amountBN.isZero()
                                ? undefined
                                : amountBN
                            }
                            onInputAmountChange={handleAmountChanged}
                            onSelectToggle={() => {
                              setIsTokenSelectOpen(!isTokenSelectOpen);
                            }}
                            isOpen={isTokenSelectOpen}
                            isValueLoading={loading}
                            setIsOpen={setIsTokenSelectOpen}
                            padding="0 16px 8px"
                            skipHandleMaxAmount
                            label=""
                            containerRef={cardRef}
                          />
                        </Stack>
                        <Stack
                          direction="row"
                          sx={{
                            height: 28,
                            position: 'relative',
                            top: -25,
                            justifyContent: 'center',
                          }}
                        >
                          {(bridgeError ||
                            isAmountTooLow ||
                            !hasEnoughForNetworkFee) && (
                            <Tooltip
                              placement="bottom"
                              title={
                                <Stack sx={{ rowGap: 2, p: 1 }}>
                                  {errorTooltipContent}
                                </Stack>
                              }
                            >
                              <Stack
                                sx={{
                                  flexDirection: 'row',
                                  columnGap: 0.5,
                                  cursor: 'pointer',
                                  mt: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color={theme.palette.error.main}
                                >
                                  {t('Error')}
                                </Typography>
                                <AlertCircleIcon
                                  size={12}
                                  color={theme.palette.error.main}
                                />
                              </Stack>
                            </Tooltip>
                          )}
                        </Stack>
                      </Stack>
                    </Card>

                    {/* Switch to swap from and to */}
                    <Stack sx={{ alignItems: 'center', mt: -2.5, pb: 1 }}>
                      <Tooltip title={<Typography>{t('Switch')}</Typography>}>
                        <Button
                          data-testid="bridge-switch-button"
                          usehigherzindex={isTokenSelectOpen ? '0' : '1'}
                          onClick={handleBlockchainToggle}
                          disabled={!targetBlockchain}
                          sx={{ width: 40, height: 40 }}
                        >
                          <SwapIcon
                            size={20}
                            sx={{
                              transform: 'rotate(90deg)',
                            }}
                          />
                        </Button>
                      </Tooltip>
                    </Stack>

                    {/* To section */}
                    <Card sx={{ background: 'none', zIndex: 1 }}>
                      <Stack sx={{ width: '100%', p: 2, pt: 1, rowGap: 2 }}>
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'fontWeightSemibold' }}
                          >
                            {t('To')}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'fontWeightSemibold' }}
                          >
                            {targetNetwork ? targetNetwork.chainName : ''}
                          </Typography>
                        </Stack>
                        <Divider divider={<Divider />} sx={{ rowGap: 2 }} />
                        <Stack>
                          <Stack
                            sx={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography>{t('Receive')}</Typography>

                            <Typography>{formattedReceiveAmount}</Typography>
                          </Stack>
                          <Stack
                            sx={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="caption"
                              color={theme.palette.text.secondary}
                            >
                              {t('Estimated')}
                            </Typography>

                            <Typography
                              variant="caption"
                              color={theme.palette.text.secondary}
                            >
                              {formattedReceiveAmountCurrency}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Card>
                  </Stack>
                </Card>
              </Stack>

              {wrapStatus === WrapStatus.WAITING_FOR_DEPOSIT && (
                <Typography size={14} sx={{ alignSelf: 'center' }}>
                  {t('Waiting for deposit confirmation')}
                </Typography>
              )}

              <Stack
                sx={{
                  mt: 1.25,
                  // hide network fees component if token list is opened (otherwise we get doubled scrollbars)
                  ...(isTokenSelectOpen ? { display: 'none' } : {}),
                }}
              >
                <CustomFees
                  isLimitReadonly
                  maxFeePerGas={gasSettings.maxFeePerGas || 0n}
                  limit={Number(gasSettings.gasLimit) || 0}
                  onChange={(settings) => {
                    onGasSettingsChanged({
                      maxFeePerGas: settings.maxFeePerGas,
                      maxPriorityFeePerGas: settings.maxPriorityFeePerGas,
                      // do not allow changing gasLimit via the UI
                    });

                    if (settings.feeType) {
                      setSelectedGasFee(settings.feeType);
                    }
                  }}
                  onModifierChangeCallback={(
                    modifier: GasFeeModifier | undefined
                  ) => {
                    if (modifier) {
                      setSelectedGasFee(modifier);
                    }
                    capture('BridgeFeeOptionChanged', { modifier });
                  }}
                  selectedGasFeeModifier={selectedGasFee}
                  network={network}
                  networkFee={networkFee}
                />
              </Stack>
            </Stack>
          </Scrollbars>

          <Stack
            sx={{
              position: 'fixed',
              display: isTokenSelectOpen ? 'none' : 'flex',
              bottom: 0,
              width: 1,
              maxWidth: 375,
              px: 2,
              pt: 1.5,
              pb: 3,
              backgroundColor: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(12px)',
              gap: 2,
            }}
          >
            {/* FIXME: Unified SDK can handle multiple bridges, but for now it's just the CCTP */}
            {provider === BridgeProviders.Unified && (
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Typography variant="caption">{t('Powered by')}</Typography>

                <img
                  src="/images/logos/circle.png"
                  style={{ height: 14 }}
                  alt="Circle"
                />
                <Tooltip
                  PopperProps={{
                    sx: { maxWidth: 188 },
                  }}
                  title={
                    <Trans
                      i18nKey="{{symbol}} is routed through {{bridgeName}}. <faqLink>Bridge FAQs</faqLink>"
                      values={{
                        symbol: currentAsset,
                        bridgeName: `Circle's Cross-Chain Transfer Protocol`,
                      }}
                      components={{
                        faqLink: (
                          <Link
                            href="https://support.avax.network/en/articles/6092559-avalanche-bridge-faq"
                            target="_blank"
                            rel="noreferrer"
                            sx={{
                              fontSize: 'caption.fontSize',
                              display: 'inline-flex',
                              color: 'secondary.dark',
                            }}
                          />
                        ),
                      }}
                    />
                  }
                >
                  <InfoCircleIcon sx={{ cursor: 'pointer' }} />
                </Tooltip>
              </Stack>
            )}
            <Button
              data-testid="bridger-transfer-button"
              fullWidth
              size="large"
              disabled={disableTransfer}
              onClick={onNextClicked}
            >
              {isPending && <CircularProgress size={16} sx={{ mr: 1 }} />}
              {t('Next')}
            </Button>
          </Stack>
        </Stack>
      </Route>
    </Switch>
  );
}

export default Bridge;
