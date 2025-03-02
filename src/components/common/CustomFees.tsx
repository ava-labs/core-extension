import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { formatUnits, parseUnits } from 'ethers';
import { useTranslation } from 'react-i18next';
import { TokenType } from '@avalabs/vm-module-types';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import {
  FeeRate,
  NetworkFee,
} from '@src/background/services/networkFee/models';
import {
  Button,
  ChevronDownIcon,
  Collapse,
  Dialog,
  DialogProps,
  GearIcon,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
} from '@avalabs/core-k2-components';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { useLiveBalance } from '@src/hooks/useLiveBalance';
import { CustomGasSettings } from './CustomGasSettings';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import GaslessFee from './GaslessFee';

export interface CustomGasFeesProps {
  maxFeePerGas: bigint;
  limit: number;
  estimatedFee?: bigint;
  onChange(values: {
    customGasLimit?: number;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas?: bigint;
    feeType: GasFeeModifier;
  }): void;
  onModifierChangeCallback?: (feeType?: GasFeeModifier) => void;
  gasPriceEditDisabled?: boolean;
  maxGasPrice?: bigint;
  selectedGasFeeModifier?: GasFeeModifier;
  network?: Network;
  networkFee: NetworkFee | null;
  isLimitReadonly?: boolean;
  isCollapsible?: boolean;
  size?: 'small' | 'normal';
  hasEnoughForFee?: boolean;
  isBatchApprovalScreen: boolean;
}

export enum GasFeeModifier {
  SLOW = 'SLOW',
  NORMAL = 'NORMAL',
  FAST = 'FAST',
  CUSTOM = 'CUSTOM',
}

const FeeButton = ({ sx = {}, ...props }) => (
  <Button
    sx={{
      width: '65px',
      maxHeight: '54px',
      height: '54px',
      py: 1.5,
      px: 1,
      display: 'inline-flex',
      flexDirection: 'column',
      gap: 0.25,
      justifyContent: 'center',
      borderRadius: 1,

      // Disable hover for selected option - looks weird with the "Custom" option.
      '&.MuiButton-containedPrimary:hover': {
        backgroundColor: 'primary.main',
      },
      ...sx,
    }}
    {...props}
  />
);

const CustomGasLimitDialog = ({ sx = {}, ...props }: DialogProps) => (
  <Dialog
    fullScreen
    PaperProps={{
      sx: (theme) => ({
        maxWidth: 375,
        maxHeight: 640,
        backgroundColor: `${theme.palette.background.default} !important`,
      }),
    }}
    sx={{
      '	.MuiDialog-container': {
        alignItems: 'flex-start',
      },
      ...sx,
    }}
    {...props}
  />
);

const CustomInput = styled('input')`
  width: 100%;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: inherit;
  line-height: 1.143;
  text-align: center;
  border: none;
  font-family: ${({ theme }) => theme.typography.caption.fontFamily};
  padding: 0 4px;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
`;

const formatGasPrice = (value: bigint, decimals: number): string => {
  const formatted = formatUnits(value, decimals);
  const [wholes, fraction] = formatted.split('.');

  // If something has changed and it's not dot-separated, just return the formatted string.
  if (!wholes || !fraction) {
    return formatted;
  }

  // Otherwise, simplify
  if (fraction === '0') {
    return wholes;
  }

  return fraction.length > 2 ? Number(formatted).toFixed(2) : formatted;
};

export const getGasFeeToDisplay = (fee: string, networkFee: NetworkFee) => {
  if (fee === '') {
    return fee;
  }
  // strings coming in are already decimal formatted from our getUpToTwoDecimals function
  // If there is no network fee, return undefined
  if (!networkFee) return undefined;
  // If network fees are all the same, return decimals (fee arg)
  if (
    networkFee.high === networkFee.low &&
    networkFee.high === networkFee?.medium
  ) {
    return fee;
  }
  // else if fee is less than or equal to 1, return decimals
  else if (parseFloat(fee) <= 1) {
    return fee;
  }
  // else, return rounded fee
  else {
    return Math.round(parseFloat(fee));
  }
};

const POLLED_BALANCES = [TokenType.NATIVE];

export function CustomFees({
  maxFeePerGas,
  limit,
  estimatedFee,
  onChange,
  onModifierChangeCallback,
  gasPriceEditDisabled = false,
  maxGasPrice,
  selectedGasFeeModifier,
  network,
  networkFee,
  isLimitReadonly,
  isCollapsible,
  size = 'normal',
  hasEnoughForFee = true,
  isBatchApprovalScreen,
}: CustomGasFeesProps) {
  const { t } = useTranslation();
  const tokenPrice = useNativeTokenPrice(network);
  const { currencyFormatter } = useSettingsContext();
  const [customGasLimit, setCustomGasLimit] = useState<number | undefined>();
  const gasLimit = customGasLimit || limit;
  const [customFee, setCustomFee] = useState<FeeRate | undefined>(
    networkFee?.medium,
  );
  const [newFees, setNewFees] = useState<
    ReturnType<typeof calculateGasAndFees>
  >(
    calculateGasAndFees({
      maxFeePerGas,
      tokenPrice,
      tokenDecimals: network?.networkToken.decimals,
      gasLimit,
    }),
  );
  const [isCollapsed, setIsCollapsed] = useState(isCollapsible);
  const customInputRef = useRef<HTMLInputElement>(null);
  const [showEditGasLimit, setShowEditGasLimit] = useState(false);
  const [selectedFee, setSelectedFee] = useState<GasFeeModifier>(
    networkFee?.isFixedFee
      ? GasFeeModifier.SLOW
      : selectedGasFeeModifier || GasFeeModifier.SLOW,
  );

  const {
    fetchGaslessChallange,
    isGaslessEligible,
    challengeHex,
    solutionHex,
    isGaslessOn,
    setIsGaslessOn,
  } = useNetworkFeeContext();

  useLiveBalance(POLLED_BALANCES); // Make sure we always use the latest native balance.

  useEffect(() => {
    fetchGaslessChallange();
  }, [fetchGaslessChallange]);

  useEffect(() => {
    if (!customFee && networkFee) {
      setCustomFee(networkFee?.low);
    }
  }, [customFee, networkFee]);

  const handleGasChange = useCallback(
    (rate: FeeRate, modifier: GasFeeModifier): void => {
      if (modifier === GasFeeModifier.CUSTOM) {
        setCustomFee(rate);
      }

      const isTooHigh = maxGasPrice ? rate.maxFeePerGas > maxGasPrice : false;

      // update
      const updatedFees = calculateGasAndFees({
        maxFeePerGas: rate.maxFeePerGas,
        tokenPrice,
        tokenDecimals: network?.networkToken.decimals,
        gasLimit,
      });

      onChange({
        customGasLimit: customGasLimit,
        maxFeePerGas: rate.maxFeePerGas,
        maxPriorityFeePerGas: rate.maxPriorityFeePerGas,
        feeType: modifier,
      });

      if (!isTooHigh) {
        setNewFees(updatedFees);
      }
    },
    [
      tokenPrice,
      network?.networkToken.decimals,
      gasLimit,
      customGasLimit,
      maxGasPrice,
      onChange,
    ],
  );

  const getFeeRateForCustomGasPrice = useCallback(
    (customFeePerGas: string, fee: NetworkFee): FeeRate => {
      const maxFee = parseUnits(customFeePerGas, fee.displayDecimals);
      const { baseFee: baseMaxFee } = fee;
      // When the user manually sets a max. fee, we also use it to calculate
      // the max. priority fee (tip) for EVM transactions.
      // If the custom max. fee is greater than the current base fee,
      // the max. tip will be set to the difference between the two.
      const maxTip =
        baseMaxFee && maxFee > baseMaxFee ? maxFee - baseMaxFee : undefined;

      return {
        maxFeePerGas: maxFee,
        maxPriorityFeePerGas: maxTip,
      };
    },
    [],
  );

  const updateGasFee = useCallback(
    (modifier?: GasFeeModifier) => {
      if (!modifier || !networkFee) {
        return;
      }
      setSelectedFee(modifier);
      switch (modifier) {
        case GasFeeModifier.NORMAL: {
          handleGasChange(networkFee.medium, modifier);
          break;
        }
        case GasFeeModifier.FAST: {
          handleGasChange(networkFee.high, modifier);
          break;
        }
        case GasFeeModifier.CUSTOM:
          if (customFee) {
            handleGasChange(customFee, modifier);
          }
          break;
        default:
          handleGasChange(networkFee.low, GasFeeModifier.SLOW);
      }
    },
    [handleGasChange, networkFee, customFee],
  );

  const handleModifierClick = useCallback(
    (modifier?: GasFeeModifier) => {
      updateGasFee(modifier);

      if (onModifierChangeCallback) {
        onModifierChangeCallback(modifier);
      }
    },
    [updateGasFee, onModifierChangeCallback],
  );

  useEffect(() => {
    // 1. Update selected fees when data is loaded loaded.
    // 2. Make sure Normal preset is selected if the network fee is fixed.
    if (typeof networkFee?.isFixedFee !== 'boolean') {
      return;
    }

    if (networkFee.isFixedFee) {
      updateGasFee(GasFeeModifier.SLOW);
    } else {
      updateGasFee(selectedGasFeeModifier);
    }
  }, [networkFee?.isFixedFee, selectedGasFeeModifier, updateGasFee]);

  const feeAmount = useMemo(() => {
    if (!network?.networkToken) {
      return {
        rounded: '-',
        precise: '',
      };
    }

    if (typeof estimatedFee === 'bigint') {
      const unit = new TokenUnit(
        estimatedFee,
        network?.networkToken.decimals,
        network?.networkToken.symbol,
      );

      return {
        rounded: unit.toDisplay(),
        precise: unit.toString(),
      };
    }

    return {
      rounded: newFees.feeUnit.toDisplay(),
      precise: newFees.feeUnit.toString(),
    };
  }, [network?.networkToken, estimatedFee, newFees.feeUnit]);

  const onGaslessSwitch = useCallback(async () => {
    handleModifierClick(GasFeeModifier.NORMAL);
    setIsGaslessOn(!isGaslessOn);
    if (!challengeHex || !solutionHex) {
      fetchGaslessChallange();
    }
  }, [
    challengeHex,
    fetchGaslessChallange,
    handleModifierClick,
    isGaslessOn,
    setIsGaslessOn,
    solutionHex,
  ]);

  if (!networkFee) {
    return null;
  }

  const isMaxFeeUsed =
    network?.vmName === NetworkVMType.EVM && !networkFee.isFixedFee;

  const isCustomGasLimitSupported = network?.vmName === NetworkVMType.EVM;

  return (
    <ApprovalSection>
      <ApprovalSectionHeader
        label={t(isMaxFeeUsed ? 'Maximum Network Fee' : 'Network Fee')}
        tooltip={
          isMaxFeeUsed
            ? t(
                'Core estimates the maximum gas (maxFeePerGas) a transaction could consume based on network conditions. This transaction will likely consume less gas than estimated.',
              )
            : undefined
        }
      >
        {isCollapsible ? (
          <IconButton
            size="small"
            data-testid="customize-fee-button"
            onClick={() => setIsCollapsed((wasCollapsed) => !wasCollapsed)}
          >
            <ChevronDownIcon
              sx={{
                transform: isCollapsed ? 'rotateX(0deg)' : 'rotateX(180deg)',
              }}
            />
          </IconButton>
        ) : (
          isCustomGasLimitSupported && (
            <IconButton
              size="small"
              data-testid="edit-gas-limit-button"
              onClick={() => setShowEditGasLimit(true)}
            >
              <GearIcon />
            </IconButton>
          )
        )}
      </ApprovalSectionHeader>
      <ApprovalSectionBody>
        <Collapse
          in={!isCollapsible || !isCollapsed}
          mountOnEnter
          unmountOnExit
        >
          {!isBatchApprovalScreen && isGaslessEligible && (
            <GaslessFee
              onSwitch={() => {
                onGaslessSwitch();
              }}
              isTurnedOn={isGaslessOn}
              isLoading={!solutionHex}
            />
          )}
          <Collapse in={!isGaslessOn} mountOnEnter unmountOnExit>
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: size === 'small' ? 0.5 : 0,
              }}
            >
              <FeeButton
                data-testid="gas-fee-slow-button"
                disabled={gasPriceEditDisabled}
                color={
                  selectedFee === GasFeeModifier.SLOW ? 'primary' : 'secondary'
                }
                onClick={() => {
                  handleModifierClick(GasFeeModifier.SLOW);
                }}
              >
                <Typography
                  variant={size === 'small' ? 'caption' : 'body2'}
                  sx={{ fontWeight: 'semibold' }}
                >
                  {t('Slow')}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'semibold' }}>
                  {formatGasPrice(
                    networkFee.low.maxFeePerGas,
                    networkFee.displayDecimals,
                  )}
                </Typography>
              </FeeButton>
              {!networkFee.isFixedFee && (
                <>
                  <FeeButton
                    data-testid="gas-fee-normal-button"
                    disabled={gasPriceEditDisabled}
                    color={
                      selectedFee === GasFeeModifier.NORMAL
                        ? 'primary'
                        : 'secondary'
                    }
                    onClick={() => {
                      handleModifierClick(GasFeeModifier.NORMAL);
                    }}
                  >
                    <Typography
                      variant={size === 'small' ? 'caption' : 'body2'}
                      sx={{ fontWeight: 'semibold' }}
                    >
                      {t('Normal')}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 'semibold' }}
                    >
                      {formatGasPrice(
                        networkFee.medium.maxFeePerGas,
                        networkFee.displayDecimals,
                      )}
                    </Typography>
                  </FeeButton>
                  <FeeButton
                    data-testid="gas-fee-fast-button"
                    disabled={gasPriceEditDisabled}
                    color={
                      selectedFee === GasFeeModifier.FAST
                        ? 'primary'
                        : 'secondary'
                    }
                    onClick={() => {
                      handleModifierClick(GasFeeModifier.FAST);
                    }}
                  >
                    <Typography
                      variant={size === 'small' ? 'caption' : 'body2'}
                      sx={{ fontWeight: 'semibold' }}
                    >
                      {t('Fast')}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 'semibold' }}
                    >
                      {formatGasPrice(
                        networkFee.high.maxFeePerGas,
                        networkFee.displayDecimals,
                      )}
                    </Typography>
                  </FeeButton>
                  <FeeButton
                    data-testid="gas-fee-custom-button"
                    disabled={gasPriceEditDisabled}
                    color={
                      selectedFee === GasFeeModifier.CUSTOM
                        ? 'primary'
                        : 'secondary'
                    }
                    onClick={() => {
                      handleModifierClick(GasFeeModifier.CUSTOM);
                      customInputRef?.current?.focus();
                    }}
                    disableRipple
                  >
                    <Typography
                      variant={size === 'small' ? 'caption' : 'body2'}
                      sx={{ fontWeight: 'semibold' }}
                    >
                      {t('Custom')}
                    </Typography>
                    <CustomInput
                      ref={customInputRef}
                      type="number"
                      value={formatGasPrice(
                        customFee?.maxFeePerGas ?? 0n,
                        networkFee.displayDecimals,
                      )}
                      min={1}
                      step={1}
                      onChange={(e) => {
                        handleGasChange(
                          getFeeRateForCustomGasPrice(
                            e.target.value || '0',
                            networkFee,
                          ),
                          GasFeeModifier.CUSTOM,
                        );
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          handleGasChange(
                            networkFee.medium,
                            GasFeeModifier.CUSTOM,
                          );
                        }
                      }}
                    />
                  </FeeButton>
                </>
              )}
            </Stack>
          </Collapse>
        </Collapse>
        <Stack>
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              component="span"
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('Fee Amount')}
            </Typography>

            <Stack direction="row">
              <Typography variant="body2" color="text.secondary">
                ~
              </Typography>
              <Tooltip title={feeAmount.precise}>
                <Typography
                  variant="body2"
                  data-testid="network-fee-token-amount"
                  sx={{
                    fontWeight: 'fontWeightSemibold',
                    color: hasEnoughForFee ? undefined : 'error.main',
                  }}
                >
                  {feeAmount.rounded} {network?.networkToken.symbol}
                </Typography>
              </Tooltip>
            </Stack>
          </Stack>
          <Stack
            sx={{
              alignItems: 'flex-end',
            }}
          >
            <Typography
              data-testid="network-fee-currency-amount"
              variant="caption"
              sx={{ color: 'text.secondary' }}
            >
              {!isNaN(Number(newFees.feeUSD))
                ? `${currencyFormatter(Number(newFees.feeUSD))}`
                : ''}
            </Typography>
          </Stack>
        </Stack>
      </ApprovalSectionBody>
      <CustomGasLimitDialog
        open={Boolean(
          network?.vmName === NetworkVMType.EVM &&
            showEditGasLimit &&
            customFee?.maxFeePerGas,
        )}
      >
        <CustomGasSettings
          isLimitReadonly={isLimitReadonly}
          feeDisplayDecimals={networkFee.displayDecimals}
          gasLimit={gasLimit ?? 0}
          maxFeePerGas={customFee?.maxFeePerGas || 0n}
          maxPriorityFeePerGas={customFee?.maxPriorityFeePerGas || 0n}
          onCancel={() => setShowEditGasLimit(false)}
          onSave={(data) => {
            setCustomGasLimit(data.customGasLimit);
            setCustomFee({
              maxFeePerGas: data.maxFeePerGas,
              maxPriorityFeePerGas: data.maxPriorityFeePerGas,
            });
            setSelectedFee(GasFeeModifier.CUSTOM);
            setShowEditGasLimit(false);
            setNewFees(
              calculateGasAndFees({
                maxFeePerGas: data.maxFeePerGas,
                tokenPrice,
                tokenDecimals: network?.networkToken.decimals,
                gasLimit: data.customGasLimit,
              }),
            );
            onChange({
              customGasLimit: data.customGasLimit,
              maxFeePerGas: data.maxFeePerGas,
              maxPriorityFeePerGas: data.maxPriorityFeePerGas,
              feeType: GasFeeModifier.CUSTOM,
            });
          }}
          network={network}
        />
      </CustomGasLimitDialog>
    </ApprovalSection>
  );
}
