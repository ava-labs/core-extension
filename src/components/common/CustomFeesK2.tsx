import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { BigNumber, utils } from 'ethers';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { formatUnits } from 'ethers/lib/utils';
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
  maxFeePerGas: BigNumber;
  limit: number;
  onChange(values: {
    customGasLimit?: number;
    maxFeePerGas: BigNumber;
    maxPriorityFeePerGas?: BigNumber;
    feeType: GasFeeModifier;
  }): void;
  gasPriceEditDisabled?: boolean;
  maxGasPrice?: string;
  selectedGasFeeModifier?: GasFeeModifier;
  network?: Network;
  networkFee: NetworkFee | null;
  suggestedNetworkFee?: FeeRate | null;
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

function getUpToTwoDecimals(input: BigNumber, decimals: number) {
  const result = input
    .mul(100)
    .div(10 ** decimals)
    .toNumber();

  return formatUnits(result, 2);
}

export function CustomFeesK2({
  maxFeePerGas,
  limit,
  onChange,
  gasPriceEditDisabled = false,
  maxGasPrice,
  selectedGasFeeModifier,
  network,
  networkFee,
  suggestedNetworkFee,
}: CustomGasFeesProps) {
  const { t } = useTranslation();
  const tokenPrice = useNativeTokenPrice(network);
  const { currencyFormatter } = useSettingsContext();
  const [customGasLimit, setCustomGasLimit] = useState<number | undefined>();
  const gasLimit = customGasLimit || limit;
  const [customFee, setCustomFee] = useState<FeeRate | undefined>(
    suggestedNetworkFee ?? networkFee?.low
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
      const newFees = calculateGasAndFees({
        maxFeePerGas: rate.maxFee,
        tokenPrice,
        tokenDecimals: network?.networkToken.decimals,
        gasLimit,
      });

      if (maxGasPrice && newFees.bnFee.gt(maxGasPrice)) {
        setIsGasPriceTooHigh(true);
        // call cb with limit and gas
        onChange({
          customGasLimit,
          maxFeePerGas: rate.maxFee,
          maxPriorityFeePerGas: rate.maxTip,
          feeType: modifier,
        });
        return;
      }
      setNewFees(newFees);
      // call cb with limit and gas
      onChange({
        customGasLimit,
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
    (customFeePerGas: string, networkFee: NetworkFee): FeeRate => {
      const maxFee = utils.parseUnits(
        customFeePerGas,
        networkFee.displayDecimals
      );
      const { baseFee } = networkFee;
      // When the user manually sets a max. fee, we also use it to calculate
      // the max. priority fee (tip) for EVM transactions.
      // If the custom max. fee is greater than the current base fee,
      // the max. tip will be set to the difference between the two.
      const maxTip =
        baseFee && maxFee.gt(baseFee) ? maxFee.sub(baseFee) : undefined;

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

  const getGasFeeToDisplay = (fee: string) => {
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

  useEffect(() => {
    if (networkFee) {
      // 1. Update selected fees when data is loaded loaded.
      // 2. Make sure Normal preset is selected if the network fee is fixed.
      networkFee.isFixedFee
        ? updateGasFee(GasFeeModifier.NORMAL)
        : updateGasFee(selectedGasFeeModifier);
    }
  }, [networkFee, selectedGasFeeModifier, updateGasFee]);

  if (!networkFee) {
    return null;
  }

  return (
    <ApprovalSection>
      <ApprovalSectionHeader label={t('Network Fee')}>
        <IconButton
          size="small"
          data-testid="edit-gas-limit-button"
          onClick={() => setShowEditGasLimit(true)}
        >
          <GearIcon />
        </IconButton>
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
              updateGasFee(GasFeeModifier.NORMAL);
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
                )
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
                  updateGasFee(GasFeeModifier.FAST);
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
                    )
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
                  updateGasFee(GasFeeModifier.INSTANT);
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
                    )
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
                  updateGasFee(GasFeeModifier.CUSTOM);
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
                      customFee?.maxFee ?? BigNumber.from(0),
                      networkFee.displayDecimals
                    )
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
          feeDisplayDecimals={networkFee.displayDecimals}
          gasLimit={gasLimit}
          maxFeePerGas={customFee?.maxFee || BigNumber.from(0)}
          maxPriorityFeePerGas={customFee?.maxTip || BigNumber.from(0)}
          onCancel={() => setShowEditGasLimit(false)}
          onSave={(data) => {
            setCustomGasLimit(data.gasLimit);
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
                gasLimit: data.gasLimit,
              })
            );
            onChange({
              customGasLimit: data.gasLimit,
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
