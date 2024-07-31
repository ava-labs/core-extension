import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { formatUnits, parseUnits } from 'ethers';
import { Trans, useTranslation } from 'react-i18next';
import {
  FeeRate,
  NetworkFee,
} from '@src/background/services/networkFee/models';
import {
  Button,
  Dialog,
  DialogProps,
  GearIcon,
  IconButton,
  Stack,
  Typography,
  styled,
} from '@avalabs/k2-components';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { useLiveBalance } from '@src/hooks/useLiveBalance';
import { CustomGasSettings } from './CustomGasSettings';

interface CustomGasFeesProps {
  maxFeePerGas: bigint;
  limit: number;
  onChange(values: {
    customGasLimit?: number;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas?: bigint;
    feeType: GasFeeModifier;
  }): void;
  onModifierChangeCallback?: (feeType?: GasFeeModifier) => void;
  gasPriceEditDisabled?: boolean;
  maxGasPrice?: string;
  selectedGasFeeModifier?: GasFeeModifier;
  network?: Network;
  networkFee: NetworkFee | null;
  isLimitReadonly?: boolean;
}

export enum GasFeeModifier {
  NORMAL = 'NORMAL',
  FAST = 'FAST',
  INSTANT = 'INSTANT',
  CUSTOM = 'CUSTOM',
}

// TODO: This button will be available through K2 soon (CP-4506). We should replace it then.
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

export function getUpToTwoDecimals(input: bigint, decimals: number) {
  const result = (input * 100n) / 10n ** BigInt(decimals);

  return formatUnits(result, 2);
}

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

export function CustomFees({
  maxFeePerGas,
  limit,
  onChange,
  onModifierChangeCallback,
  gasPriceEditDisabled = false,
  maxGasPrice,
  selectedGasFeeModifier,
  network,
  networkFee,
  isLimitReadonly,
}: CustomGasFeesProps) {
  const { t } = useTranslation();
  const tokenPrice = useNativeTokenPrice(network);
  const { currencyFormatter } = useSettingsContext();
  const [customGasLimit, setCustomGasLimit] = useState<number | undefined>();
  const gasLimit = customGasLimit || limit;
  const [customFee, setCustomFee] = useState<FeeRate | undefined>(
    networkFee?.low
  );
  const [newFees, setNewFees] = useState<
    ReturnType<typeof calculateGasAndFees>
  >(
    calculateGasAndFees({
      maxFeePerGas,
      tokenPrice,
      tokenDecimals: network?.networkToken.decimals,
      gasLimit,
    })
  );
  const [isGasPriceTooHigh, setIsGasPriceTooHigh] = useState(false);
  const customInputRef = useRef<HTMLInputElement>(null);
  const [showEditGasLimit, setShowEditGasLimit] = useState(false);
  const [selectedFee, setSelectedFee] = useState<GasFeeModifier>(
    networkFee?.isFixedFee
      ? GasFeeModifier.NORMAL
      : selectedGasFeeModifier || GasFeeModifier.NORMAL
  );

  useLiveBalance(); // Make sure we always use the latest balances.

  useEffect(() => {
    if (!customFee && networkFee) {
      setCustomFee(networkFee?.low);
    }
  }, [customFee, networkFee]);

  const handleGasChange = useCallback(
    (rate: FeeRate, modifier: GasFeeModifier): void => {
      setIsGasPriceTooHigh(false);

      if (modifier === GasFeeModifier.CUSTOM) {
        setCustomFee(rate);
      }

      // update
      const updatedFees = calculateGasAndFees({
        maxFeePerGas: rate.maxFee,
        tokenPrice,
        tokenDecimals: network?.networkToken.decimals,
        gasLimit,
      });

      if (maxGasPrice && updatedFees.bnFee > BigInt(maxGasPrice)) {
        setIsGasPriceTooHigh(true);
        // call cb with limit and gas
        onChange({
          customGasLimit: customGasLimit,
          maxFeePerGas: rate.maxFee,
          maxPriorityFeePerGas: rate.maxTip,
          feeType: modifier,
        });
        return;
      }
      setNewFees(updatedFees);
      // call cb with limit and gas
      onChange({
        customGasLimit: customGasLimit,
        maxFeePerGas: rate.maxFee,
        maxPriorityFeePerGas: rate.maxTip,
        feeType: modifier,
      });
    },
    [
      tokenPrice,
      network?.networkToken.decimals,
      gasLimit,
      customGasLimit,
      maxGasPrice,
      onChange,
    ]
  );

  const getFeeRateForCustomGasPrice = useCallback(
    (customFeePerGas: string, fee: NetworkFee): FeeRate => {
      const maxFee = parseUnits(customFeePerGas, fee.displayDecimals);
      const { baseMaxFee } = fee;
      // When the user manually sets a max. fee, we also use it to calculate
      // the max. priority fee (tip) for EVM transactions.
      // If the custom max. fee is greater than the current base fee,
      // the max. tip will be set to the difference between the two.
      const maxTip =
        baseMaxFee && maxFee > baseMaxFee ? maxFee - baseMaxFee : undefined;

      return {
        maxFee,
        maxTip,
      };
    },
    []
  );

  const updateGasFee = useCallback(
    (modifier?: GasFeeModifier) => {
      if (!modifier || !networkFee) {
        return;
      }
      setSelectedFee(modifier);
      switch (modifier) {
        case GasFeeModifier.FAST: {
          handleGasChange(networkFee.medium, modifier);
          break;
        }
        case GasFeeModifier.INSTANT: {
          handleGasChange(networkFee.high, modifier);
          break;
        }
        case GasFeeModifier.CUSTOM:
          if (customFee) {
            handleGasChange(customFee, modifier);
          }
          break;
        default:
          handleGasChange(networkFee.low, GasFeeModifier.NORMAL);
      }
    },
    [handleGasChange, networkFee, customFee]
  );

  const handleModifierClick = useCallback(
    (modifier?: GasFeeModifier) => {
      updateGasFee(modifier);

      if (onModifierChangeCallback) {
        onModifierChangeCallback(modifier);
      }
    },
    [updateGasFee, onModifierChangeCallback]
  );

  useEffect(() => {
    // 1. Update selected fees when data is loaded loaded.
    // 2. Make sure Normal preset is selected if the network fee is fixed.
    if (typeof networkFee?.isFixedFee !== 'boolean') {
      return;
    }

    if (networkFee.isFixedFee) {
      updateGasFee(GasFeeModifier.NORMAL);
    } else {
      updateGasFee(selectedGasFeeModifier);
    }
  }, [networkFee?.isFixedFee, selectedGasFeeModifier, updateGasFee]);

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
                'Core estimates the maximum gas (maxFeePerGas) a transaction could consume based on network conditions. This transaction will likely consume less gas than estimated.'
              )
            : undefined
        }
      >
        {isCustomGasLimitSupported && (
          <IconButton
            size="small"
            data-testid="edit-gas-limit-button"
            onClick={() => setShowEditGasLimit(true)}
          >
            <GearIcon />
          </IconButton>
        )}
      </ApprovalSectionHeader>
      <ApprovalSectionBody>
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <FeeButton
            data-testid="gas-fee-normal-button"
            disabled={gasPriceEditDisabled}
            color={
              selectedFee === GasFeeModifier.NORMAL ? 'primary' : 'secondary'
            }
            onClick={() => {
              handleModifierClick(GasFeeModifier.NORMAL);
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>
              {t('Normal')}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'semibold' }}>
              {getGasFeeToDisplay(
                getUpToTwoDecimals(
                  networkFee.low.maxFee,
                  networkFee.displayDecimals
                ),
                networkFee
              )}
            </Typography>
          </FeeButton>
          {!networkFee.isFixedFee && (
            <>
              <FeeButton
                data-testid="gas-fee-fast-button"
                disabled={gasPriceEditDisabled}
                color={
                  selectedFee === GasFeeModifier.FAST ? 'primary' : 'secondary'
                }
                onClick={() => {
                  handleModifierClick(GasFeeModifier.FAST);
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>
                  {t('Fast')}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'semibold' }}>
                  {getGasFeeToDisplay(
                    getUpToTwoDecimals(
                      networkFee.medium.maxFee,
                      networkFee.displayDecimals
                    ),
                    networkFee
                  )}
                </Typography>
              </FeeButton>
              <FeeButton
                data-testid="gas-fee-instant-button"
                disabled={gasPriceEditDisabled}
                color={
                  selectedFee === GasFeeModifier.INSTANT
                    ? 'primary'
                    : 'secondary'
                }
                onClick={() => {
                  handleModifierClick(GasFeeModifier.INSTANT);
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>
                  {t('Instant')}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'semibold' }}>
                  {getGasFeeToDisplay(
                    getUpToTwoDecimals(
                      networkFee.high.maxFee,
                      networkFee.displayDecimals
                    ),
                    networkFee
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
                <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>
                  {t('Custom')}
                </Typography>
                <CustomInput
                  ref={customInputRef}
                  type="number"
                  value={getGasFeeToDisplay(
                    getUpToTwoDecimals(
                      customFee?.maxFee ?? 0n,
                      networkFee.displayDecimals
                    ),
                    networkFee
                  )}
                  onChange={(e) => {
                    handleGasChange(
                      getFeeRateForCustomGasPrice(
                        e.target.value || '0',
                        networkFee
                      ),
                      GasFeeModifier.CUSTOM
                    );
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      handleGasChange(networkFee.low, GasFeeModifier.CUSTOM);
                    }
                  }}
                />
              </FeeButton>
            </>
          )}
        </Stack>
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
            <Typography
              variant="body2"
              data-testid="network-fee-token-amount"
              sx={{ fontWeight: 'fontWeightSemibold' }}
            >
              {newFees.fee} {network?.networkToken.symbol}
            </Typography>
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
      {isGasPriceTooHigh && (
        <Stack sx={{ py: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'error.main' }}>
            <Trans
              i18nKey="Insufficient balance to cover gas costs. <br />Please add {{tokenSymbol}}."
              values={{ tokenSymbol: network?.networkToken.symbol }}
            />
          </Typography>
        </Stack>
      )}
      <CustomGasLimitDialog
        open={Boolean(
          network?.vmName === NetworkVMType.EVM &&
            showEditGasLimit &&
            customFee?.maxFee
        )}
      >
        <CustomGasSettings
          isLimitReadonly={isLimitReadonly}
          feeDisplayDecimals={networkFee.displayDecimals}
          gasLimit={gasLimit}
          maxFeePerGas={customFee?.maxFee || 0n}
          maxPriorityFeePerGas={customFee?.maxTip || 0n}
          onCancel={() => setShowEditGasLimit(false)}
          onSave={(data) => {
            setCustomGasLimit(data.customGasLimit);
            setCustomFee({
              maxFee: data.maxFeePerGas,
              maxTip: data.maxPriorityFeePerGas,
            });
            setSelectedFee(GasFeeModifier.CUSTOM);
            setShowEditGasLimit(false);
            setNewFees(
              calculateGasAndFees({
                maxFeePerGas: data.maxFeePerGas,
                tokenPrice,
                tokenDecimals: network?.networkToken.decimals,
                gasLimit: data.customGasLimit,
              })
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
