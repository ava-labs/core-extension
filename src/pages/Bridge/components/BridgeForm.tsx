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
import { TokenUnit } from '@avalabs/core-utils-sdk';
import {
  NftTokenWithBalance,
  TokenWithBalance,
} from '@avalabs/vm-module-types';

import { TokenSelect } from '@src/components/common/TokenSelect';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { NetworkWithCaipId } from '@src/background/services/network/models';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';
import { NavigationHistoryDataState } from '@src/background/services/navigationHistory/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

import { useBridge } from '../hooks/useBridge';
import { useHasEnoughForGas } from '../hooks/useHasEnoughtForGas';

import { NetworkSelector } from './NetworkSelector';
import { findMatchingBridgeAsset } from '../utils/findMatchingBridgeAsset';
import { BridgeTypeFootnote } from './BridgeTypeFootnote';

export type BridgeFormProps = ReturnType<typeof useBridge> & {
  isPending: boolean;

  // Generic props
  isAmountTooLow: boolean;
  setIsAmountTooLow: Dispatch<SetStateAction<boolean>>;

  price?: number;
  loading: boolean;

  sourceBalance?: Exclude<TokenWithBalance, NftTokenWithBalance>;
  bridgeError: string;
  setBridgeError: (err: string) => void;

  setNavigationHistoryData: (data: NavigationHistoryDataState) => void;
  onTransfer: () => void;

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
  sourceBalance,
  targetChain,
  setTargetChain,
  price,
  loading,
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

  const hasEnoughForNetworkFee = useHasEnoughForGas(neededGas);

  const errorTooltipContent = useMemo(() => {
    if (!hasEnoughForNetworkFee) {
      return t(
        'Insufficient balance to cover gas costs. <br />Please add {{token}}.',
        {
          token: gasToken,
        }
      );
    }

    if (amount && minimum && isAmountTooLow) {
      return t(`Amount too low -- minimum is {{minimum}}`, {
        minimum: new TokenUnit(minimum, denomination, '').toDisplay(),
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
    [currency, currencyFormatter]
  );

  const formattedReceiveAmount = useMemo(() => {
    if (typeof receiveAmount !== 'bigint' || !asset) {
      return '-';
    }

    const unit = new TokenUnit(receiveAmount, asset.decimals, asset.symbol);

    return `${unit.toDisplay()} ${unit.getSymbol()}`;
  }, [receiveAmount, asset]);

  const formattedReceiveAmountCurrency = useMemo(() => {
    if (!price || typeof receiveAmount !== 'bigint' || !asset) {
      return '-';
    }

    const unit = new TokenUnit(receiveAmount, asset.decimals, asset.symbol);

    return `~${formatCurrency(price * unit.toDisplay({ asNumber: true }))}`;
  }, [formatCurrency, price, receiveAmount, asset]);

  const handleAmountChanged = useCallback(
    (value: { bigint: bigint; amount: string }) => {
      setNavigationHistoryData({
        selectedToken: asset ? asset.symbol : undefined,
        inputAmount: String(value.bigint),
      });

      setAmount(value.bigint);
      sendAmountEnteredAnalytics('Bridge');

      // When there is no balance for given token, maximum is undefined
      if (!maximum || (maximum && value.bigint && value.bigint > maximum)) {
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
      asset,
      bridgeError,
      capture,
      setBridgeError,
      maximum,
      sendAmountEnteredAnalytics,
      setAmount,
      setNavigationHistoryData,
      t,
    ]
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
    ]
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
      loading ||
      isPending ||
      isAmountTooLow ||
      !amount ||
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

  if (!network) {
    return null; // TODO: loading screen
  }

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
            <Stack ref={cardRef} sx={{ p: 0, overflow: 'unset' }}>
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
                        isValueLoading={loading}
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
                {/* TODO: this chain swap sometimes breaks and we end up with Avalanche -> Avalanche o.O */}
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
            </Stack>
          </Stack>
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
        {asset && targetChain && (
          <BridgeTypeFootnote asset={asset} targetChain={targetChain} />
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
