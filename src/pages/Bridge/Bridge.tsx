import { Big, bigToBN, BN, bnToBig } from '@avalabs/avalanche-wallet-sdk';
import {
  BIG_ZERO,
  Blockchain,
  formatTokenAmount,
  useBridgeConfig,
  useBridgeSDK,
  useTokenInfoContext,
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
import { useIsMainnet } from '@src/hooks/useIsMainnet';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { AddBtcPopup } from './components/AddBtcPopup';
import { NetworkSelector } from './components/NetworkSelector';
import { AssetBalance } from './models';
import { useBridge } from './useBridge';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { stringToBN } from '@avalabs/utils-sdk';

const StyledLoading = styled(LoadingSpinnerIcon)`
  margin-right: 10px;
`;

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

export function Bridge() {
  const { flags } = useAnalyticsContext();
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

  const isMainnet = useIsMainnet();
  const { currencyFormatter } = useSettingsContext();
  const { error } = useBridgeConfig();
  const {
    currentAsset,
    setCurrentAsset,
    currentBlockchain,
    setCurrentBlockchain,
    targetBlockchain,
    targetChains,
  } = useBridgeSDK();

  const { getTokenSymbolOnNetwork } = useGetTokenSymbolOnNetwork();

  const theme = useTheme();
  const [bridgeError, setBridgeError] = useState<string>('');

  const [isPending, setIsPending] = useState<boolean>(false);
  const [addBitcoinModalOpen, setAddBitcoinModalOpen] =
    useState<boolean>(false);
  const tokenInfoData = useTokenInfoContext();
  const denomination = sourceBalance?.asset.denomination || 0;
  const history = useHistory();
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [isSwitched, setIsSwitched] = useState(false);
  const { capture } = useAnalyticsContext();
  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const [defaultInputValue, setDefaultInputValue] = useState({
    bn: new BN(0),
    amount: '0',
  });

  const bridgePageHistoryData: {
    currentBlockchain?: Blockchain;
    selectedToken?: string;
    inputAmount?: {
      bn: BN;
      amount: string;
    };
  } = getPageHistoryData();

  useEffect(() => {
    if (bridgePageHistoryData.currentBlockchain) {
      setCurrentBlockchain(bridgePageHistoryData.currentBlockchain);
    }
    if (bridgePageHistoryData.inputAmount) {
      setDefaultInputValue({
        bn: stringToBN(bridgePageHistoryData.inputAmount.amount, 9),
        amount: bridgePageHistoryData.inputAmount.amount,
      });
    }
  }, [
    bridgePageHistoryData.currentBlockchain,
    bridgePageHistoryData.inputAmount,
    setCurrentBlockchain,
  ]);

  if (bridgePageHistoryData.selectedToken && !currentAsset) {
    setCurrentAsset(bridgePageHistoryData.selectedToken);
  }

  const isAmountTooLow =
    amount && !amount.eq(BIG_ZERO) && amount.lt(minimum || BIG_ZERO);
  const hasValidAmount = !isAmountTooLow && amount.gt(BIG_ZERO);

  const formattedReceiveAmount =
    hasValidAmount && receiveAmount
      ? `~${receiveAmount.toFixed(9)} ${currentAsset}`
      : '-';
  const formattedReceiveAmountCurrency =
    hasValidAmount && price && receiveAmount
      ? `~${currencyFormatter(price.mul(receiveAmount).toNumber())}`
      : '-';

  const handleAmountChanged = (value: { bn: BN; amount: string }) => {
    setNavigationHistoryData({
      currentBlockchain,
      selectedToken: currentAsset,
      inputAmount: value,
    });
    setDefaultInputValue(value);
    setAmount(bnToBig(value.bn, denomination));
  };

  const handleBlockchainToggle = () => {
    if (targetBlockchain) {
      setNavigationHistoryData({
        currentBlockchain: targetBlockchain,
        selectedToken: currentAsset,
        inputAmount: defaultInputValue,
      });
      setCurrentBlockchain(targetBlockchain);
      setIsSwitched(!isSwitched);
    }
  };

  const handleBlockchainSwitchFrom = (blockchain: Blockchain) => {
    setNavigationHistoryData({
      currentBlockchain: blockchain,
      selectedToken: currentAsset,
      inputAmount: defaultInputValue,
    });
    setCurrentBlockchain(blockchain);
  };

  const handleSelect = (symbol: string) => {
    setNavigationHistoryData({
      currentBlockchain,
      selectedToken: symbol,
      inputAmount: defaultInputValue,
    });
    setCurrentAsset(symbol);
  };

  const handleTransfer = async () => {
    if (BIG_ZERO.eq(amount)) return;

    capture('BridgeTransferStarted', {
      currentAsset,
      sourceBlockchain: currentBlockchain,
      targetBlockchain,
      amount: amount.toString(),
    });

    setIsPending(true);
    const hash = await transfer();
    setIsPending(false);

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
          // TODO remove !isMainnet check when mainnet is supported
          return !isMainnet && flags[FeatureGates.BRIDGE_BTC];
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
                    sourceBalance && {
                      balanceDisplayValue: formatBalance(sourceBalance.balance),
                      balance: bigToBN(
                        sourceBalance.balance || BIG_ZERO,
                        denomination
                      ),
                      denomination: sourceBalance.asset.denomination,
                      priceUSD: price?.toNumber(),
                      logoURI:
                        tokenInfoData?.[sourceBalance.asset.symbol]?.logo,
                      name: sourceBalance.asset.symbol,
                      symbol: getTokenSymbolOnNetwork(
                        sourceBalance.asset.symbol,
                        currentBlockchain
                      ),
                    }
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
                  inputAmount={defaultInputValue.bn}
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
                  height="24px"
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
                  Estimated (minus transfer fees)
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
            isPending ||
            isAmountTooLow ||
            BIG_ZERO.eq(amount) ||
            !hasEnoughForNetworkFee
          }
          onClick={handleTransfer}
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
    </VerticalFlex>
  );
}

export default Bridge;
