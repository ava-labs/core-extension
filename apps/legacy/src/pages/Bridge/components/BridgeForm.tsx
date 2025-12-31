import { isNativeAsset } from '@avalabs/bridge-unified';
import {
  AlertCircleIcon,
  Button,
  Card,
  Divider,
  Grow,
  Scrollbars,
  Slide,
  Stack,
  SwapIcon,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { TokenUnit, bigIntToString } from '@avalabs/core-utils-sdk';
import {
  NftTokenWithBalance,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { TokenSelect } from '@/components/common/TokenSelect';
import { useAnalyticsContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { useSettingsContext } from '@core/ui';
import { useSendAnalyticsData } from '@core/ui';
import {
  BridgeOptions,
  NavigationHistoryDataState,
  NetworkWithCaipId,
} from '@core/types';

import { useBridge } from '@core/ui';
import { useHasEnoughForGas } from '@core/ui';

import { CustomFees } from '@/components/common/CustomFees';
import { NetworkFee } from '@core/types';
import { findMatchingBridgeAsset, isBitcoinNetwork } from '@core/common';
import { BridgeTypeFootnote } from './BridgeTypeFootnote';
import { NetworkSelector } from './NetworkSelector';
import { BridgeEstimatedTimeWarning } from './BridgeEstimatedTimeWarning';

export type BridgeFormProps = ReturnType<typeof useBridge> & {
  isPending: boolean;

  // Generic props
  isAmountTooLow: boolean;
  setIsAmountTooLow: Dispatch<SetStateAction<boolean>>;
  networkFee: NetworkFee;

  sourceBalance?: Exclude<TokenWithBalance, NftTokenWithBalance>;
  bridgeError: string;
  setBridgeError: Dispatch<SetStateAction<string>>;

  setNavigationHistoryData: (data: NavigationHistoryDataState) => void;
  onTransfer: (bridgeOptions: BridgeOptions) => void;

  handleSourceChainChange: (network: NetworkWithCaipId) => void;
};

export const BridgeForm = ({
  amount,
  asset,
  setAsset,
  isAmountTooLow,
  setIsAmountTooLow,
  minimum,
  maximum,
  receiveAmount,
  networkFee,
  sourceBalance,
  targetChain,
  setTargetChain,
  estimateGas,
  bridgeError,
  setBridgeError,
  setNavigationHistoryData,
  setAmount,
  onTransfer,
  isPending,
  handleSourceChainChange,
  availableChainIds,
  possibleTargetChains,
  bridgableTokens,
  transferableAssets,
}: BridgeFormProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const { setNetwork, network } = useNetworkContext();
  const { currencyFormatter, currency } = useSettingsContext();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();

  const { capture } = useAnalyticsContext();

  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [feeRate, setFeeRate] = useState(networkFee.low.maxFeePerGas);

  const denomination = useMemo(() => {
    if (!sourceBalance) {
      return 0;
    }

    return sourceBalance.decimals;
  }, [sourceBalance]);

  const gasToken = network?.networkToken.symbol ?? '';

  const [neededGas, setNeededGas] = useState(0n);

  useEffect(() => {
    if (minimum && amount && amount < minimum) {
      setIsAmountTooLow(true);
    } else {
      setIsAmountTooLow(false);
    }
  }, [minimum, amount, setIsAmountTooLow]);

  useEffect(() => {
    let isMounted = true;

    if (amount && !isAmountTooLow) {
      estimateGas().then((limit) => {
        if (isMounted && typeof limit === 'bigint') {
          setNeededGas(limit);
        }
      });

      return () => {
        isMounted = false;
      };
    }
  }, [estimateGas, amount, isAmountTooLow]);

  useEffect(() => {
    const balanceErrorMessage = t('Insufficient balance');
    if (typeof maximum === 'bigint' && amount && amount > maximum) {
      setBridgeError((prevError) => {
        if (prevError === balanceErrorMessage) {
          return prevError;
        }

        capture('BridgeTokenSelectError', {
          errorMessage: balanceErrorMessage,
        });

        return balanceErrorMessage;
      });
    } else {
      setBridgeError((prevError) => {
        if (prevError === balanceErrorMessage) {
          return '';
        }
        return prevError;
      });
    }
  }, [amount, capture, maximum, setBridgeError, t]);

  const hasEnoughForNetworkFee = useHasEnoughForGas(
    asset && isNativeAsset(asset) ? amount : 0n, // Bridge amount does not matter if we're not bridging the native token
    feeRate,
    neededGas,
  );

  const errorTooltipContent = useMemo(() => {
    if (!hasEnoughForNetworkFee) {
      return t(
        'Insufficient balance to cover gas costs. Please add {{token}} or slightly lower the amount.',
        {
          token: gasToken,
        },
      );
    }

    if (amount && minimum && isAmountTooLow) {
      return t(`Amount too low -- minimum is {{minimum}}`, {
        minimum: bigIntToString(minimum, denomination),
      });
    }

    return bridgeError ?? '';
  }, [
    bridgeError,
    gasToken,
    hasEnoughForNetworkFee,
    isAmountTooLow,
    minimum,
    amount,
    denomination,
    t,
  ]);

  const formatCurrency = useCallback(
    (targetAmount?: number) => {
      return targetAmount
        ? `${currencyFormatter(targetAmount).replace(currency, '')} ${currency}`
        : '-';
    },
    [currency, currencyFormatter],
  );

  const formattedReceiveAmount = useMemo(() => {
    if (typeof receiveAmount !== 'bigint' || !asset) {
      return '-';
    }

    return `${bigIntToString(receiveAmount, asset.decimals)} ${asset.symbol}`;
  }, [receiveAmount, asset]);

  const formattedReceiveAmountCurrency = useMemo(() => {
    if (
      !sourceBalance?.priceInCurrency ||
      typeof receiveAmount !== 'bigint' ||
      !asset
    ) {
      return '-';
    }

    const unit = new TokenUnit(receiveAmount, asset.decimals, asset.symbol);

    return `~${formatCurrency(sourceBalance.priceInCurrency * unit.toDisplay({ asNumber: true }))}`;
  }, [formatCurrency, sourceBalance?.priceInCurrency, receiveAmount, asset]);

  const handleAmountChanged = useCallback(
    (value: { bigint: bigint; amount: string }) => {
      setNavigationHistoryData({
        selectedToken: asset ? asset.symbol : undefined,
        inputAmount: String(value.bigint),
      });

      setAmount(value.bigint);
      sendAmountEnteredAnalytics('Bridge');
    },
    [asset, sendAmountEnteredAnalytics, setAmount, setNavigationHistoryData],
  );

  const handleSelect = useCallback(
    (token: Exclude<TokenWithBalance, NftTokenWithBalance>) => {
      const foundAsset = findMatchingBridgeAsset(transferableAssets, token);

      if (!foundAsset) {
        return;
      }

      setNavigationHistoryData({
        selectedToken: foundAsset.symbol,
        inputAmount: undefined,
      });
      setAmount(0n);
      setAsset(foundAsset);
      sendTokenSelectedAnalytics('Bridge');
    },
    [
      setAsset,
      sendTokenSelectedAnalytics,
      setAmount,
      setNavigationHistoryData,
      transferableAssets,
    ],
  );

  const handleBlockchainSwap = useCallback(() => {
    if (targetChain && network) {
      setNavigationHistoryData({
        selectedToken: asset ? asset.symbol : undefined,
        inputAmount: undefined,
      });
      setAmount(0n);
      setTargetChain(network);
      setNetwork(targetChain);
      setBridgeError('');
    }
  }, [
    setNetwork,
    setBridgeError,
    setAmount,
    setNavigationHistoryData,
    targetChain,
    asset,
    network,
    setTargetChain,
  ]);

  const disableTransfer = useMemo(
    () =>
      bridgeError.length > 0 ||
      isPending ||
      isAmountTooLow ||
      !amount ||
      !hasEnoughForNetworkFee ||
      !networkFee,
    [
      amount,
      bridgeError.length,
      hasEnoughForNetworkFee,
      isAmountTooLow,
      isPending,
      networkFee,
    ],
  );
  // NOTE: we operate on the assumption that UnifiedBridge SDK will
  // use the first matching bridge from the `destinations` array
  const [bridgeType] = asset?.destinations[targetChain?.caipId ?? ''] ?? [];
  const withFeeBox = network ? isBitcoinNetwork(network) : false;

  return (
    <>
      <Stack
        sx={{
          flex: 1,
          flexGrow: 1,
          px: 2,
          height: 1,
          mb: isTokenSelectOpen ? 2 : 0,
        }}
        ref={formRef}
      >
        <Scrollbars>
          <Stack
            sx={{
              flex: 1,
              opacity: isPending ? 0.6 : 1,
              pointerEvents: isPending ? 'none' : 'auto',
            }}
          >
            <Stack ref={cardRef} sx={{ p: 0, overflow: 'unset', gap: 1 }}>
              <Stack sx={{ width: '100%' }}>
                {/* From section */}
                <Card
                  sx={{
                    p: 0,
                    backgroundColor: 'grey.850',
                    overflow: 'unset',
                    zIndex: 1,
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
                        selected={network}
                        onSelect={handleSourceChainChange}
                        chainIds={availableChainIds}
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
                        maxAmount={maximum}
                        tokensList={bridgableTokens}
                        selectedToken={sourceBalance}
                        onTokenChange={handleSelect}
                        inputAmount={
                          // Reset BNInput when programmatically setting the amount to zero
                          !sourceBalance || amount === 0n ? undefined : amount
                        }
                        onInputAmountChange={handleAmountChanged}
                        onSelectToggle={() => {
                          setIsTokenSelectOpen(!isTokenSelectOpen);
                        }}
                        isOpen={isTokenSelectOpen}
                        setIsOpen={setIsTokenSelectOpen}
                        padding="0 16px 8px"
                        skipHandleMaxAmount
                        label=""
                        containerRef={
                          possibleTargetChains.length > 0 ? cardRef : formRef
                        }
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
                      {errorTooltipContent && (
                        <Tooltip placement="bottom" title={errorTooltipContent}>
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
                <Grow
                  in={!isTokenSelectOpen && possibleTargetChains.length > 0}
                  unmountOnExit
                  mountOnEnter
                >
                  <Stack
                    sx={{ alignItems: 'center', mt: -2.5, pb: 1, zIndex: 1 }}
                  >
                    <Tooltip title={<Typography>{t('Switch')}</Typography>}>
                      <Button
                        data-testid="bridge-switch-button"
                        usehigherzindex={isTokenSelectOpen ? '0' : '1'}
                        onClick={handleBlockchainSwap}
                        disabled={!targetChain}
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
                </Grow>

                <Slide
                  in={possibleTargetChains.length > 0}
                  mountOnEnter
                  unmountOnExit
                >
                  <Card
                    sx={{
                      background: 'background.paper',
                      zIndex: 0,
                      pt: 6,
                      mt: -6,
                    }}
                  >
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
                        <NetworkSelector
                          testId="bridge-to-chain-selector"
                          selected={targetChain}
                          onSelect={setTargetChain}
                          chainIds={possibleTargetChains}
                        />
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
                </Slide>
              </Stack>

              <BridgeEstimatedTimeWarning
                bridgeType={bridgeType}
                targetChainName={targetChain?.chainName}
              />
            </Stack>
          </Stack>
          {withFeeBox && neededGas && (
            <Stack sx={{ pt: 2 }}>
              <CustomFees
                maxFeePerGas={networkFee.low.maxFeePerGas}
                limit={Number(neededGas)}
                networkFee={networkFee}
                network={network}
                isLimitReadonly
                onChange={({ maxFeePerGas }) => {
                  setFeeRate(maxFeePerGas);
                }}
              />
            </Stack>
          )}
        </Scrollbars>
      </Stack>

      <Stack
        sx={{
          display: isTokenSelectOpen ? 'none' : 'flex',
          bottom: 0,
          width: 1,
          maxWidth: 375,
          px: 2,
          pt: 1.5,
          pb: 2,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          gap: 1,
        }}
      >
        {asset && targetChain && bridgeType && (
          <BridgeTypeFootnote bridgeType={bridgeType} />
        )}
        <Button
          data-testid="bridger-transfer-button"
          fullWidth
          size="large"
          disabled={disableTransfer}
          onClick={() =>
            onTransfer({
              bridgeType,
              gasSettings:
                withFeeBox && feeRate ? { price: feeRate } : undefined,
            })
          }
          isLoading={isPending}
        >
          {isPending ? t('Bridging...') : t('Bridge')}
        </Button>
      </Stack>
    </>
  );
};
