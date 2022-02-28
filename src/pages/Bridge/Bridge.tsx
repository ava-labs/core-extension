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
  PrimaryIconButton,
  SearchInput,
  SelectTokenModal,
  AvaxTokenIcon,
  SwapCard,
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
import { TokenList } from './components/TokenList';
import { TokenIcon } from '@src/components/common/TokenImage';
import EthLogo from './../../images/tokens/eth.png';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

const StyledLoading = styled(LoadingSpinnerIcon)`
  margin-right: 10px;
`;

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

export function Bridge() {
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
  const assetPrice = usePrice(currentAsset, currency.toLowerCase());
  const [amount, setAmount] = useState<Big>(BIG_ZERO);
  const [amountTooLowError, setAmountTooLowError] = useState<string>('');
  const [bridgeError, setBridgeError] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);
  const [wrapStatus, setWrapStatus] = useState<WrapStatus>(WrapStatus.INITIAL);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [txHash, setTxHash] = useState<string>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const assets = useAssets(currentBlockchain);
  const tokenInfoData = useTokenInfoContext();
  const asset = assets[currentAsset || ''];
  const destinationBlockchain =
    currentBlockchain === Blockchain.AVALANCHE
      ? Blockchain.ETHEREUM
      : Blockchain.AVALANCHE;
  const [maxValue, setMaxValue] = useState<BN>(new BN(0));
  const history = useHistory();
  const sourceBalance = useAssetBalance(currentAsset, currentBlockchain);
  const transferCost = useTransactionFee(currentBlockchain);
  const minimumTransferAmount = transferCost ? transferCost.mul(3) : BIG_ZERO;
  const tooLowAmount =
    !!transferCost && amount.gt(0) && amount.lt(minimumTransferAmount);
  const txFee = useTransactionFee(currentBlockchain);

  const handleAmountChanged = (value: { bn: BN; amount: string }) => {
    setAmount(bnToBig(value.bn, asset.denomination));
  };

  const handleBlockchainToggle = () => {
    setCurrentBlockchain(destinationBlockchain);
  };

  const handleSelect = (symbol: string) => {
    setCurrentAsset(symbol);
  };

  const EthereumLogo = () => (
    <TokenIcon
      width="24px"
      height="24px"
      src={EthLogo}
      name={Blockchain.ETHEREUM}
    />
  );

  const handleTransfer = async () => {
    if (BIG_ZERO.eq(amount)) {
      return;
    }

    setPending(true);
    const result = await transferAsset(amount, asset, setWrapStatus, setTxHash);
    setPending(false);

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

  if (error) {
    return (
      <VerticalFlex height="100%" width="100%">
        <PageTitleMiniMode>Bridge</PageTitleMiniMode>
        <VerticalFlex
          padding="16px 16px 0 16px"
          style={{ flex: 1 }}
          align="center"
        >
          <Typography size={24} weight="bold" margin="0 0 16px 0">
            Sorry
          </Typography>
          <Typography size={14} color={theme.colors.text2} margin="0 0 8px 0">
            Sorry, the Bridge is currently unavailable.
          </Typography>
          <Typography size={14} color={theme.colors.text2} margin="0 0 8px 0">
            Please check back later.
          </Typography>
          <Typography size={14} color={theme.colors.text2} margin="0 0 8px 0">
            Thanks.
          </Typography>
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
        </VerticalFlex>
      </VerticalFlex>
    );
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitleMiniMode>Bridge</PageTitleMiniMode>
      <VerticalFlex padding="0 16px 0 16px" style={{ flex: 1 }}>
        <VerticalFlex style={{ flex: 1 }}>
          <Card padding="16px">
            <VerticalFlex width="100%">
              <HorizontalFlex justify="space-between" align="center">
                <Typography>From</Typography>

                <SecondaryDropDownMenu
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
                        <EthereumLogo />
                      )}
                      <Typography margin={'0 16px 0 8px'}>
                        {capitalize(currentBlockchain)}
                      </Typography>
                      <CaretIcon height={'12px'} color={theme.colors.text1} />
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
                    <EthereumLogo />
                    <Typography margin="0 16px 0 8px">Ethereum</Typography>
                    {currentBlockchain === Blockchain.ETHEREUM && (
                      <CheckmarkIcon height="16px" color={theme.colors.text1} />
                    )}
                  </SecondaryDropDownMenuItem>
                </SecondaryDropDownMenu>
              </HorizontalFlex>
              <HorizontalSeparator margin="16px 0 16px 0" />
              <HorizontalFlex justify="space-between">
                <SwapCard
                  variant="dense"
                  onChange={handleAmountChanged}
                  denomination={asset?.denomination}
                  onSelectClick={() => {
                    if (!loading) {
                      setModalOpen(true);
                      setSearchQuery('');
                    }
                  }}
                  token={
                    currentAsset
                      ? {
                          icon: (
                            <TokenIcon
                              width="32px"
                              height="32px"
                              src={
                                currentAsset === 'ETH'
                                  ? EthLogo
                                  : tokenInfoData?.[currentAsset]?.logo
                              }
                              name={currentAsset}
                            />
                          ),
                          name: currentAsset,
                        }
                      : undefined
                  }
                  balanceDisplayValue={formatBalance(sourceBalance?.balance)}
                  currencyValue={
                    !amount.eq(BIG_ZERO)
                      ? `~${currencyFormatter(
                          assetPrice.mul(amount).toNumber()
                        )}`
                      : ''
                  }
                  isValueLoading={loading}
                  isInputDisabled={!currentAsset}
                  max={asset ? maxValue : undefined}
                  hideErrorMessage
                  onError={(errorMessage) => {
                    setBridgeError(errorMessage);
                  }}
                />
              </HorizontalFlex>
            </VerticalFlex>
          </Card>

          <SelectTokenModal
            open={!!modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSearchQuery('');
            }}
            title="Select Token"
          >
            <>
              <HorizontalFlex padding="0 16px">
                <SearchInput
                  searchTerm={searchQuery}
                  placeholder="Search"
                  width="343px"
                  onSearch={(term) => setSearchQuery(term)}
                  autoFocus={true}
                />
              </HorizontalFlex>
              <TokenList
                tokenList={assetsWithBalances}
                searchQuery={searchQuery}
                onClick={(tokenSymbol) => {
                  handleSelect(tokenSymbol);
                  return;
                }}
                onClose={() => setModalOpen(false)}
              />
            </>
          </SelectTokenModal>

          <HorizontalFlex
            justify={
              bridgeError || amountTooLowError ? 'space-between' : 'flex-end'
            }
            margin="8px 0 8px 0"
          >
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
              <PrimaryIconButton onClick={handleBlockchainToggle}>
                <SwitchIcon
                  direction={IconDirection.DOWN}
                  height="24px"
                  color={theme.colors.text1}
                />
              </PrimaryIconButton>
            </Tooltip>
          </HorizontalFlex>

          <Card>
            <VerticalFlex width="100%">
              <HorizontalFlex justify="space-between" align="center">
                <Typography>To</Typography>

                <SecondaryDropDownMenu
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
                        <EthereumLogo />
                      )}
                      <Typography margin={'0 16px 0 8px'}>
                        {capitalize(destinationBlockchain)}
                      </Typography>
                      <CaretIcon height={'12px'} color={theme.colors.text1} />
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
                    <EthereumLogo />
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
            pending ||
            tooLowAmount ||
            BIG_ZERO.eq(amount)
          }
          onClick={handleTransfer}
        >
          {pending && (
            <StyledLoading height="16px" color={theme.colors.stroke2} />
          )}
          Transfer
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}

export default Bridge;
