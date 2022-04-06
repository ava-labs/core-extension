import { bigToBN, BN, bnToBig } from '@avalabs/avalanche-wallet-sdk';
import {
  AssetType,
  BIG_ZERO,
  Blockchain,
  formatTokenAmount,
  useAssets,
  useBridgeSDK,
  useTokenInfoContext,
  useTransactionFee,
  usePrice,
  WrapStatus,
  useBridgeConfig,
  useHasEnoughForGas,
} from '@avalabs/bridge-sdk';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CaretIcon,
  ComponentSize,
  CheckmarkIcon,
  SecondaryDropDownMenu,
  SecondaryDropDownMenuItem,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  PrimaryButton,
  AvaxTokenIcon,
  SwitchIcon,
  Tooltip,
  Typography,
  VerticalFlex,
  LoadingSpinnerIcon,
} from '@avalabs/react-components';
import capitalize from 'lodash/capitalize';
import { PageTitleMiniMode } from '@src/components/common/PageTitle';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { Big } from '@avalabs/avalanche-wallet-sdk';
import { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useAssetBalance } from './useAssetBalance';
import { useAssetBalances } from './useAssetBalances';
import { TokenIcon } from '@src/components/common/TokenImage';
import EthLogo from '@src/images/tokens/eth.png';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { TokenSelect } from '@src/components/common/TokenSelect';
import { AssetBalance } from './models';
import { SwitchIconContainer } from '@src/components/common/SwitchIconContainer';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getEthereumProvider } from '@src/background/services/bridge/getEthereumProvider';
import { getAvalancheProvider } from '@src/background/services/network/getAvalancheProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';

const StyledLoading = styled(LoadingSpinnerIcon)`
  margin-right: 10px;
`;

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

export function Bridge() {
  const { flags } = useAnalyticsContext();
  const { transferAsset } = useBridgeContext();
  const { currencyFormatter, currency } = useSettingsContext();
  const { error } = useBridgeConfig();
  const {
    currentAsset,
    setCurrentAsset,
    currentBlockchain,
    setCurrentBlockchain,
    setTransactionDetails,
  } = useBridgeSDK();

  const theme = useTheme();
  const { assetsWithBalances, loading } = useAssetBalances();

  const [amount, setAmount] = useState<Big>(BIG_ZERO);
  const [amountTooLowError, setAmountTooLowError] = useState<string>('');
  const [bridgeError, setBridgeError] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [wrapStatus, setWrapStatus] = useState<WrapStatus>(WrapStatus.INITIAL);
  const [, setTxHash] = useState<string>();
  const assets = useAssets(currentBlockchain);
  const tokenInfoData = useTokenInfoContext();

  const asset = assets[currentAsset || ''];
  const assetPrice = usePrice(currentAsset, currency.toLowerCase());

  const destinationBlockchain =
    currentBlockchain === Blockchain.AVALANCHE
      ? Blockchain.ETHEREUM
      : Blockchain.AVALANCHE;
  const [maxValue, setMaxValue] = useState<BN>(new BN(0));

  const history = useHistory();
  const sourceBalance = useAssetBalance(currentAsset, currentBlockchain);

  const { addresses } = useWalletContext();
  const { network } = useNetworkContext();
  const avalancheProvider = getAvalancheProvider(network);
  const ethereumProvider = getEthereumProvider(network);
  const hasEnoughEthForTransaction = useHasEnoughForGas(
    addresses.addrC,
    currentBlockchain === Blockchain.AVALANCHE
      ? avalancheProvider
      : ethereumProvider
  );
  const transferCost = useTransactionFee(currentBlockchain);
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>();
  const [isSwitched, setIsSwitched] = useState(false);
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  useEffect(() => {
    if (selectedToken && assetPrice.toNumber() !== selectedToken?.priceUSD) {
      setSelectedToken({
        ...selectedToken,
        priceUSD: assetPrice.toNumber(),
      });
    }
  }, [assetPrice, selectedToken]);

  const minimumTransferAmount = transferCost ? transferCost.mul(3) : BIG_ZERO;
  const tooLowAmount =
    !!transferCost && amount.gt(0) && amount.lt(minimumTransferAmount);
  const txFee = useTransactionFee(currentBlockchain);

  const handleAmountChanged = (value: { bn: BN; amount: string }) => {
    setAmount(bnToBig(value.bn, asset.denomination));
  };

  const handleBlockchainToggle = () => {
    setCurrentBlockchain(destinationBlockchain);
    setIsSwitched(!isSwitched);
  };

  const handleSelect = (symbol: string) => {
    setCurrentAsset(symbol);
  };

  const handleTransfer = async () => {
    if (BIG_ZERO.eq(amount)) {
      return;
    }

    setIsPending(true);
    const result = await transferAsset(amount, asset, setWrapStatus, setTxHash);
    setIsPending(false);

    const timestamp = Date.now();

    setTransactionDetails({
      tokenSymbol:
        asset.assetType === AssetType.NATIVE
          ? asset.wrappedAssetSymbol
          : currentAsset || '',
      amount,
    });

    // Navigate to transaction status page
    history.push(
      `/bridge/transaction-status/${currentBlockchain}/${result.hash}/${timestamp}`
    );
  };

  useEffect(() => {
    if (tooLowAmount) {
      setAmountTooLowError(
        `Amount too low -- minimum is ${minimumTransferAmount.toFixed(9)}`
      );
    } else {
      setAmountTooLowError('');
    }
  }, [tooLowAmount, minimumTransferAmount]);

  useEffect(() => {
    setMaxValue(new BN(0));

    if (sourceBalance?.balance && transferCost) {
      if (BIG_ZERO.eq(sourceBalance.balance)) {
        return;
      }

      const balanceMinusFees = sourceBalance.balance?.minus(transferCost);

      setMaxValue(
        bigToBN(balanceMinusFees || BIG_ZERO, sourceBalance.asset.denomination)
      );
    }
  }, [transferCost, sourceBalance]);

  const calculateEstimatedTotal = () => {
    if (!transferCost) return;

    const amountMinusTransfer = amount.minus(transferCost);

    return `~${currencyFormatter(
      assetPrice.mul(amountMinusTransfer).toNumber()
    )}`;
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

  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitleMiniMode>Bridge</PageTitleMiniMode>
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

                <SecondaryDropDownMenu
                  onMenuToggle={setIsFromOpen}
                  coords={{ top: `32px`, right: `0px` }}
                  disabled={loading}
                  icon={
                    <HorizontalFlex
                      width="100%"
                      align={'center'}
                      justify="space-between"
                    >
                      {currentBlockchain === Blockchain.AVALANCHE ? (
                        <AvaxTokenIcon />
                      ) : (
                        <TokenIcon
                          width="24px"
                          height="24px"
                          src={EthLogo}
                          name={Blockchain.ETHEREUM}
                        />
                      )}
                      <Typography margin={'0 16px 0 8px'}>
                        {capitalize(currentBlockchain)}
                      </Typography>
                      <CaretIcon
                        height={'9px'}
                        color={theme.colors.text1}
                        direction={
                          isFromOpen ? IconDirection.UP : IconDirection.DOWN
                        }
                      />
                    </HorizontalFlex>
                  }
                >
                  <SecondaryDropDownMenuItem
                    onClick={() => {
                      if (currentBlockchain === Blockchain.ETHEREUM) {
                        handleBlockchainToggle();
                      }
                    }}
                  >
                    <AvaxTokenIcon />
                    <Typography margin="0 16px 0 8px">Avalanche</Typography>
                    {currentBlockchain === Blockchain.AVALANCHE && (
                      <CheckmarkIcon height="16px" color={theme.colors.text1} />
                    )}
                  </SecondaryDropDownMenuItem>
                  <HorizontalSeparator />

                  <SecondaryDropDownMenuItem
                    onClick={() => {
                      if (currentBlockchain === Blockchain.AVALANCHE) {
                        handleBlockchainToggle();
                      }
                    }}
                  >
                    <TokenIcon
                      width="24px"
                      height="24px"
                      src={EthLogo}
                      name={Blockchain.ETHEREUM}
                    />
                    <Typography margin="0 16px 0 8px">Ethereum</Typography>
                    {currentBlockchain === Blockchain.ETHEREUM && (
                      <CheckmarkIcon height="16px" color={theme.colors.text1} />
                    )}
                  </SecondaryDropDownMenuItem>
                </SecondaryDropDownMenu>
              </HorizontalFlex>
              <HorizontalSeparator margin="16px 0 16px 0" />
              <HorizontalFlex padding="0">
                <TokenSelect
                  onSelectToggle={() => {
                    setIsTokenSelectOpen(!isTokenSelectOpen);
                  }}
                  bridgeTokensList={assetsWithBalances}
                  maxAmount={asset ? maxValue : undefined}
                  onTokenChange={(token: AssetBalance) => {
                    setSelectedToken({
                      ...token.asset,
                      balanceDisplayValue: formatBalance(token.balance),
                      balance: token.balance,
                      priceUSD: assetPrice.toNumber(),
                      logoURI: tokenInfoData?.[token.asset.symbol]?.logo,
                      name: token.asset.tokenName,
                    });
                    handleSelect(token.symbol);
                    return;
                  }}
                  isOpen={isTokenSelectOpen}
                  isValueLoading={loading}
                  selectedToken={selectedToken}
                  onInputAmountChange={handleAmountChanged}
                  padding="8px 16px"
                  onError={(errorMessage) => {
                    setBridgeError(errorMessage);
                  }}
                  skipHandleMaxAmount
                />
              </HorizontalFlex>
            </VerticalFlex>
          </Card>

          <HorizontalFlex
            justify={
              bridgeError || amountTooLowError || !hasEnoughEthForTransaction
                ? 'space-between'
                : 'flex-end'
            }
            align="center"
            margin="8px 0 8px 0"
          >
            {!hasEnoughEthForTransaction && (
              <Typography size={12} color={theme.colors.error}>
                Insufficient balance to cover gas costs. <br />
                Please add{' '}
                {currentBlockchain === Blockchain.AVALANCHE ? 'AVAX' : 'ETH'}.
              </Typography>
            )}

            {bridgeError && (
              <Typography size={12} color={theme.colors.error}>
                {bridgeError}
              </Typography>
            )}

            {amountTooLowError && (
              <Typography size={12} color={theme.colors.error}>
                {amountTooLowError}
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
                  height="24px"
                  direction={IconDirection.UP}
                  color={theme.colors.text1}
                />
              </SwitchIconContainer>
            </Tooltip>
          </HorizontalFlex>

          <Card>
            <VerticalFlex width="100%">
              <HorizontalFlex justify="space-between" align="center">
                <Typography>To</Typography>

                <SecondaryDropDownMenu
                  onMenuToggle={setIsToOpen}
                  coords={{ top: `32px`, right: `0px` }}
                  disabled={loading}
                  icon={
                    <HorizontalFlex
                      width="100%"
                      align={'center'}
                      justify="space-between"
                    >
                      {destinationBlockchain === Blockchain.AVALANCHE ? (
                        <AvaxTokenIcon />
                      ) : (
                        <TokenIcon
                          width="24px"
                          height="24px"
                          src={EthLogo}
                          name={Blockchain.ETHEREUM}
                        />
                      )}
                      <Typography margin={'0 16px 0 8px'}>
                        {capitalize(destinationBlockchain)}
                      </Typography>
                      <CaretIcon
                        height={'9px'}
                        color={theme.colors.text1}
                        direction={
                          isToOpen ? IconDirection.UP : IconDirection.DOWN
                        }
                      />
                    </HorizontalFlex>
                  }
                >
                  <SecondaryDropDownMenuItem
                    onClick={() => {
                      if (destinationBlockchain === Blockchain.ETHEREUM) {
                        handleBlockchainToggle();
                      }
                    }}
                  >
                    <AvaxTokenIcon />
                    <Typography margin="0 16px 0 8px">Avalanche</Typography>
                    {destinationBlockchain === Blockchain.AVALANCHE && (
                      <CheckmarkIcon height="16px" color={theme.colors.text1} />
                    )}
                  </SecondaryDropDownMenuItem>
                  <HorizontalSeparator />

                  <SecondaryDropDownMenuItem
                    onClick={() => {
                      if (destinationBlockchain === Blockchain.AVALANCHE) {
                        handleBlockchainToggle();
                      }
                    }}
                  >
                    <TokenIcon
                      width="24px"
                      height="24px"
                      src={EthLogo}
                      name={Blockchain.ETHEREUM}
                    />
                    <Typography margin="0 16px 0 8px">Ethereum</Typography>
                    {destinationBlockchain === Blockchain.ETHEREUM && (
                      <CheckmarkIcon height="16px" color={theme.colors.text1} />
                    )}
                  </SecondaryDropDownMenuItem>
                </SecondaryDropDownMenu>
              </HorizontalFlex>
              <HorizontalSeparator margin="16px 0 16px 0" />
              <HorizontalFlex
                justify="space-between"
                align="center"
                margin="0 0 8px 0"
              >
                <Typography size={14}>Receive</Typography>

                <Typography size={14}>
                  {txFee &&
                  amount &&
                  !BIG_ZERO.eq(amount) &&
                  !amountTooLowError ? (
                    <>
                      {amount.minus(txFee).toNumber().toFixed(9)} {currentAsset}
                    </>
                  ) : (
                    '-'
                  )}
                </Typography>
              </HorizontalFlex>
              <HorizontalFlex justify="space-between" align="center">
                <Typography color={theme.colors.text2} size={12}>
                  Estimated (minus transfer fees)
                </Typography>

                <Typography color={theme.colors.text2} size={12}>
                  {transferCost &&
                  amount &&
                  !BIG_ZERO.eq(amount) &&
                  !amountTooLowError
                    ? calculateEstimatedTotal()
                    : '-'}
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
            amountTooLowError.length > 0 ||
            loading ||
            isPending ||
            tooLowAmount ||
            BIG_ZERO.eq(amount) ||
            hasEnoughEthForTransaction
          }
          onClick={handleTransfer}
        >
          {isPending && (
            <StyledLoading height="16px" color={theme.colors.stroke2} />
          )}
          Transfer
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}

export default Bridge;
