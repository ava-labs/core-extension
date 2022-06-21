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
  IconDirection,
  LoadingSpinnerIcon,
  PrimaryButton,
  SwitchIcon,
  TextButton,
  Tooltip,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { SwitchIconContainer } from '@src/components/common/SwitchIconContainer';
import { TokenSelect } from '@src/components/common/TokenSelect';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { AddBtcPopup } from './components/AddBtcPopup';
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

const StyledLoading = styled(LoadingSpinnerIcon)`
  margin-right: 10px;
`;

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

export function Bridge() {
  useSyncBridgeConfig(); // keep bridge config up-to-date
  useSetBridgeChainFromNetwork();
  const {
    address,
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
    currentAsset,
    setCurrentAsset,
    currentBlockchain,
    setCurrentBlockchain,
    targetBlockchain,
    targetChains,
    sourceAssets,
  } = useBridgeSDK();
  const { error } = useBridgeConfig();

  const { flags } = useAnalyticsContext();
  const { currencyFormatter } = useSettingsContext();
  const { getTokenSymbolOnNetwork } = useGetTokenSymbolOnNetwork();
  const { walletType } = useWalletContext();

  const theme = useTheme();
  const [bridgeError, setBridgeError] = useState<string>('');

  const [isPending, setIsPending] = useState<boolean>(false);
  const [transferWithLedger, setTransferWithLedger] = useState<boolean>(false);
  const [addBitcoinModalOpen, setAddBitcoinModalOpen] =
    useState<boolean>(false);
  const history = useHistory();
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [isSwitched, setIsSwitched] = useState(false);
  const { capture } = useAnalyticsContext();
  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();

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

  const isAmountTooLow =
    amount && !amount.eq(BIG_ZERO) && amount.lt(minimum || BIG_ZERO);
  const hasValidAmount = !isAmountTooLow && amount.gt(BIG_ZERO);

  const formattedReceiveAmount =
    hasValidAmount && receiveAmount
      ? `~${receiveAmount.toFixed(9)} ${currentAsset}`
      : '-';
  const formattedReceiveAmountCurrency =
    hasValidAmount && price && receiveAmount
      ? `~${currencyFormatter(price * receiveAmount.toNumber())}`
      : '-';

  const handleAmountChanged = (value: { bn: BN; amount: string }) => {
    const bigValue = bnToBig(value.bn, denomination);
    setNavigationHistoryData({
      currentBlockchain,
      selectedToken: currentAsset,
      inputAmount: bigValue,
    });
    setAmount(bigValue);
    sendAmountEnteredAnalytics(value.amount);
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

  const handleBlockchainSwitchFrom = (blockchain: Blockchain) => {
    setNavigationHistoryData({
      currentBlockchain: blockchain,
      selectedToken: currentAsset,
      inputAmount: amount,
    });
    setCurrentBlockchain(blockchain);
    // Reset because a denomination change will change its value
    setAmount(BIG_ZERO);
  };

  const handleSelect = (symbol: string) => {
    setNavigationHistoryData({
      currentBlockchain,
      selectedToken: symbol,
      inputAmount: amount,
    });
    setCurrentAsset(symbol);
    sendTokenSelectedAnalytics(symbol);
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

  if (error || !flags[FeatureGates.BRIDGE]) {
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

  // Remove chains turned off by the feature flags
  const filterChains = (chains: Blockchain[]) =>
    chains.filter((chain) => {
      switch (chain) {
        case Blockchain.BITCOIN:
          return flags[FeatureGates.BRIDGE_BTC];
        case Blockchain.ETHEREUM:
          return flags[FeatureGates.BRIDGE_ETH];
        default:
          return true;
      }
    });

  const sourceChains = [
    Blockchain.AVALANCHE,
    Blockchain.ETHEREUM,
    Blockchain.BITCOIN,
  ];

  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitle>Bridge</PageTitle>
      <VerticalFlex padding="0 16px 0 16px" style={{ flex: 1 }}>
        <VerticalFlex style={{ flex: 1 }}>
          <Card padding="0">
            <VerticalFlex width="100%">
              <HorizontalFlex
                justify="space-between"
                align="center"
                padding="16px 16px 0 16px"
              >
                <Typography>From</Typography>
                <VerticalFlex align="flex-end">
                  <NetworkSelector
                    selected={currentBlockchain}
                    onSelect={handleBlockchainSwitchFrom}
                    chains={filterChains(sourceChains)}
                  />
                  {currentBlockchain === Blockchain.BITCOIN && (
                    <TextButton
                      margin="8px 0 0"
                      size={ComponentSize.SMALL}
                      onClick={() => {
                        setAddBitcoinModalOpen(true);
                      }}
                    >
                      Add bitcoin
                    </TextButton>
                  )}
                </VerticalFlex>
              </HorizontalFlex>
              <HorizontalSeparator margin="16px 0 16px 0" />
              <HorizontalFlex padding="0">
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
                    !sourceBalance || amountBN.isZero() ? undefined : amountBN
                  }
                  setIsOpen={setIsTokenSelectOpen}
                />
              </HorizontalFlex>
            </VerticalFlex>
          </Card>

          <HorizontalFlex
            justify={
              bridgeError || isAmountTooLow || !hasEnoughForNetworkFee
                ? 'space-between'
                : 'flex-end'
            }
            align="center"
            margin="8px 0 8px 0"
          >
            {!hasEnoughForNetworkFee && (
              <Typography size={12} color={theme.colors.error}>
                Insufficient balance to cover gas costs. <br />
                Please add{' '}
                {currentBlockchain === Blockchain.AVALANCHE ? 'AVAX' : 'ETH'}.
              </Typography>
            )}
            {isAmountTooLow && (
              <Typography size={12} color={theme.colors.error}>
                {`Amount too low -- minimum is ${minimum?.toFixed(9)}`}
              </Typography>
            )}
            {bridgeError && (
              <Typography size={12} color={theme.colors.error}>
                {bridgeError}
              </Typography>
            )}

            <Tooltip
              placement="left"
              content={<Typography size={12}>Switch</Typography>}
            >
              <SwitchIconContainer
                onClick={handleBlockchainToggle}
                disabled={false}
                isSwapped={isSwitched}
              >
                <SwitchIcon
                  direction={IconDirection.UP}
                  height="20px"
                  color={theme.colors.text1}
                />
              </SwitchIconContainer>
            </Tooltip>
          </HorizontalFlex>

          <Card>
            <VerticalFlex width="100%">
              <HorizontalFlex justify="space-between" align="center">
                <Typography>To</Typography>
                <NetworkSelector
                  selected={targetBlockchain}
                  disabled={true}
                  chains={filterChains(targetChains)}
                />
              </HorizontalFlex>
              <HorizontalSeparator margin="16px 0 16px 0" />
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
          </Card>
        </VerticalFlex>

        {wrapStatus === WrapStatus.WAITING_FOR_DEPOSIT && (
          <Typography size={14} align="center">
            Waiting for deposit confirmation
          </Typography>
        )}

        <PrimaryButton
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
      {addBitcoinModalOpen &&
        address &&
        currentBlockchain === Blockchain.BITCOIN && (
          <AddBtcPopup
            address={address}
            onClose={() => setAddBitcoinModalOpen(false)}
          />
        )}
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
