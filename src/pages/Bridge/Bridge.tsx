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
import { FeatureGates } from '@avalabs/posthog-sdk';
import { PageTitle } from '@src/components/common/PageTitle';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
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
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
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
  Stack,
  SwapIcon,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { TokenSelect } from '@src/components/common/TokenSelect';
import BridgeConfirmation from './BridgeConfirmation';

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
    bridgeFee,
  } = useBridge();

  const {
    bridgeConfig,
    currentAsset,
    setCurrentAsset,
    currentBlockchain,
    setCurrentBlockchain,
    targetBlockchain,
    sourceAssets,
  } = useBridgeSDK();
  const { error } = useBridgeConfig();
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlagContext();
  const availableBlockchains = useAvailableBlockchains();

  const { currencyFormatter, currency } = useSettingsContext();
  const { getTokenSymbolOnNetwork } = useGetTokenSymbolOnNetwork();
  const isUsingLedgerWallet = useIsUsingLedgerWallet();

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

  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network, setNetwork, networks } = useNetworkContext();
  const { resetKeystoneRequest } = useKeystoneContext();

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

  const denomination = sourceBalance?.asset.denomination || 0;
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
      name: sourceBalance.asset.symbol,
      symbol: getTokenSymbolOnNetwork(
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
      ? `${bigToLocaleString(receiveAmount, 9)}${unit}`
      : '-';
  }, [currentAsset, hasValidAmount, receiveAmount]);

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

  const handleAmountChanged = (value: { bn: BN; amount: string }) => {
    const bigValue = bnToBig(value.bn, denomination);
    setNavigationHistoryData({
      selectedToken: currentAsset,
      inputAmount: bigValue,
    });

    setAmount(bigValue);
    sendAmountEnteredAnalytics('Bridge');

    // When there is no balance for given token, maximum is undefined
    if (!maximum || (maximum && bigValue && !maximum.gt(bigValue))) {
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

    if (!hasEnoughForNetworkFee) {
      capture('BridgeTokenSelectError', {
        errorMessage: 'Insufficent balance to cover gas costs.',
      });
    }
  };

  const onNextClicked = () => {
    history.push('/bridge/confirm');
  };

  const onSubmitClicked = () => {
    if (isUsingLedgerWallet) {
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
    const [hash, transferError] = await resolve(transfer());
    setTransferWithLedger(false);
    setIsPending(false);

    if (transferError) {
      console.error(transferError);
      // do not show the error when the user denied the transfer
      if (transferError === 'User declined the transaction') {
        capture('BridgeTransferRequestUserRejectedError', {
          sourceBlockchain: currentBlockchain,
          targetBlockchain,
          fee: bridgeFee?.toNumber(),
        });
        return;
      }

      setBridgeError(t('There was a problem with the transfer'));
      capture('BridgeTransferRequestError', {
        sourceBlockchain: currentBlockchain,
        targetBlockchain,
      });
      return;
    }

    capture('BridgeTransferRequestSucceeded', {
      sourceBlockchain: currentBlockchain,
      targetBlockchain,
    });

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
                ? `${bigToLocaleString(bridgeFee, 9)} ${currentAsset}`
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
              amount={bigToLocaleString(amount)}
              symbol={currentAsset}
              onReject={() => {
                setTransferWithLedger(false);
                resetKeystoneRequest();
                setIsPending(false);
              }}
            />
          )}
        </>
      </Route>
      <Route path="/bridge">
        <Stack sx={{ height: '100%', width: '100%' }}>
          <PageTitle>{t('Bridge')}</PageTitle>
          <Stack sx={{ flex: 1, px: 2 }}>
            <Stack sx={{ flex: 1 }}>
              <Card sx={{ p: 0, overflow: 'unset' }}>
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
                        sx={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
                      >
                        <TokenSelect
                          maxAmount={maximum && bigToBN(maximum, denomination)}
                          bridgeTokensList={assetsWithBalances}
                          selectedToken={selectedTokenForTokenSelect}
                          onTokenChange={(token: AssetBalance) => {
                            handleSelect(token.symbol);
                          }}
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
                    <Tooltip
                      placement="auto"
                      content={<Typography>{t('Switch')}</Typography>}
                    >
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
                    <Stack sx={{ width: '100%', p: 2, rowGap: 2 }}>
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
                          <Typography color={theme.palette.text.secondary}>
                            {t('Estimated')}
                          </Typography>

                          <Typography color={theme.palette.text.secondary}>
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

            <Button
              data-testid="bridger-transfer-button"
              fullWidth
              disabled={disableTransfer}
              onClick={onNextClicked}
              sx={{
                mt: 2,
                mb: 3,
              }}
            >
              {isPending && <CircularProgress height="16px" sx={{ mr: 1 }} />}
              {t('Next')}
            </Button>
          </Stack>
        </Stack>
      </Route>
    </Switch>
  );
}

export default Bridge;
