import {
  AlertCircleIcon,
  Button,
  Card,
  Divider,
  InfoCircleIcon,
  Link,
  Scrollbars,
  Stack,
  SwapIcon,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Asset,
  BIG_ZERO,
  Blockchain,
  WrapStatus,
  formatTokenAmount,
  useBridgeSDK,
  useGetTokenSymbolOnNetwork,
} from '@avalabs/core-bridge-sdk';
import { bigToBN, bigToLocaleString, bnToBig } from '@avalabs/core-utils-sdk';
import Big from 'big.js';
import BN from 'bn.js';

import { TokenSelect } from '@src/components/common/TokenSelect';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { Network } from '@src/background/services/network/models';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';
import { NavigationHistoryDataState } from '@src/background/services/navigationHistory/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useUnifiedBridgeContext } from '@src/contexts/UnifiedBridgeProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

import { AssetBalance } from '../models';
import { BridgeProviders } from '../hooks/useBridge';
import { getTokenAddress } from '../utils/getTokenAddress';
import { blockchainToNetwork } from '../utils/blockchainConversion';
import { isUnifiedBridgeAsset } from '../utils/isUnifiedBridgeAsset';

import { NetworkSelector } from './NetworkSelector';
import { useHasEnoughForGas } from '../hooks/useHasEnoughtForGas';

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

export type BridgeFormProps = {
  // VM-specific props
  minimum?: Big;
  maximum?: Big;
  receiveAmount?: Big;
  sourceBalance?: AssetBalance;
  assetsWithBalances?: AssetBalance[];
  price?: number;
  loading?: boolean;
  wrapStatus?: WrapStatus;
  estimateGas(amount: Big, asset?: Asset): Promise<bigint | undefined>;

  isPending: boolean;

  // Generic props
  currentAssetAddress?: string;
  provider: BridgeProviders;
  amount: Big;
  isAmountTooLow: boolean;
  availableBlockchains: Blockchain[];
  targetNetwork?: Network;
  bridgeError: string;
  setBridgeError: (err: string) => void;
  setCurrentAssetAddress: (assetAddress?: string) => void;
  setNavigationHistoryData: (data: NavigationHistoryDataState) => void;
  setAmount: (amount: Big) => void;
  onTransfer: () => void;
  handleBlockchainChange: (blockchain: Blockchain) => void;
};

export const BridgeForm = ({
  currentAssetAddress,
  provider,
  amount,
  isAmountTooLow,
  availableBlockchains,
  minimum,
  maximum,
  receiveAmount,
  sourceBalance,
  assetsWithBalances,
  targetNetwork,
  price,
  loading,
  estimateGas,
  bridgeError,
  setBridgeError,
  setCurrentAssetAddress,
  setNavigationHistoryData,
  setAmount,
  onTransfer,
  handleBlockchainChange,
  isPending,
}: BridgeFormProps) => {
  const {
    bridgeConfig,
    currentAsset,
    currentAssetData,
    setCurrentAsset,
    currentBlockchain,
    targetBlockchain,
  } = useBridgeSDK();

  const { t } = useTranslation();
  const theme = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  const { setNetwork, networks } = useNetworkContext();
  const { currencyFormatter, currency } = useSettingsContext();
  const { getAssetAddressOnTargetChain } = useUnifiedBridgeContext();
  const { getTokenSymbolOnNetwork } = useGetTokenSymbolOnNetwork();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();

  const { capture } = useAnalyticsContext();

  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);

  const hasValidAmount = !isAmountTooLow && amount.gt(BIG_ZERO);

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

  const gasToken = useMemo(
    () =>
      currentBlockchain === Blockchain.AVALANCHE
        ? 'AVAX'
        : currentBlockchain === Blockchain.BITCOIN
        ? 'BTC'
        : 'ETH',
    [currentBlockchain]
  );

  const [neededGas, setNeededGas] = useState(0n);

  useEffect(() => {
    let isMounted = true;

    if (amount && amount.gt(BIG_ZERO)) {
      estimateGas(amount, currentAssetData).then((limit) => {
        if (isMounted && typeof limit === 'bigint') {
          setNeededGas(limit);
        }
      });

      return () => {
        isMounted = false;
      };
    }
  }, [estimateGas, amount, currentAssetData]);

  const hasEnoughForNetworkFee = useHasEnoughForGas(neededGas);

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

  const formatCurrency = useCallback(
    (targetAmount?: number) => {
      return targetAmount
        ? `${currencyFormatter(targetAmount).replace(currency, '')} ${currency}`
        : '-';
    },
    [currency, currencyFormatter]
  );

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
      setBridgeError,
      denomination,
      maximum,
      sendAmountEnteredAnalytics,
      setAmount,
      setNavigationHistoryData,
      t,
    ]
  );

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
      setCurrentAssetAddress,
      setNavigationHistoryData,
    ]
  );

  const handleBlockchainSwap = useCallback(() => {
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
        setBridgeError('');
      }
    }
  }, [
    bridgeConfig,
    getAssetAddressOnTargetChain,
    networks,
    setNetwork,
    setBridgeError,
    setCurrentAssetAddress,
    currentAsset,
    setAmount,
    setNavigationHistoryData,
    targetBlockchain,
  ]);

  const disableTransfer = useMemo(
    () =>
      bridgeError.length > 0 ||
      loading ||
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
    ]
  );

  return (
    <>
      <Scrollbars>
        <Stack
          sx={{
            flex: 1,
            px: 2,
            pb: provider === BridgeProviders.Unified ? 14 : 10,
          }}
        >
          <Stack
            sx={{
              flex: 1,
              opacity: isPending ? 0.6 : 1,
              pointerEvents: isPending ? 'none' : 'auto',
            }}
          >
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
                        onSelect={handleBlockchainChange}
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
                        maxAmount={maximum && bigToBN(maximum, denomination)}
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
                      onClick={handleBlockchainSwap}
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
          onClick={onTransfer}
          isLoading={loading || isPending}
        >
          {isPending ? t('Bridging...') : t('Bridge')}
        </Button>
      </Stack>
    </>
  );
};
