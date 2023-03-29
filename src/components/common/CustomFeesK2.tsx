import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { CustomGasLimit } from '@src/components/common/CustomGasLimit';
import { BigNumber, utils } from 'ethers';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { formatUnits } from 'ethers/lib/utils';
import { Trans, useTranslation } from 'react-i18next';
import { NetworkFee } from '@src/background/services/networkFee/models';
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
} from '@src/pages/SignTransaction/components/ApprovalSection';
import { useLiveBalance } from '@src/hooks/useLiveBalance';

interface CustomGasFeesProps {
  gasPrice: BigNumber;
  limit?: number;
  onChange(values: {
    customGasLimit?: number;
    gasPrice: BigNumber;
    feeType: GasFeeModifier;
  }): void;
  gasPriceEditDisabled?: boolean;
  maxGasPrice?: string;
  selectedGasFeeModifier?: GasFeeModifier;
  network?: Network;
  networkFee: NetworkFee | null;
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
  gasPrice,
  limit,
  onChange,
  gasPriceEditDisabled = false,
  maxGasPrice,
  selectedGasFeeModifier,
  network,
  networkFee,
}: CustomGasFeesProps) {
  const { t } = useTranslation();
  const tokenPrice = useNativeTokenPrice(network);
  const { currencyFormatter } = useSettingsContext();
  const [customGasLimit, setCustomGasLimit] = useState<number | undefined>();
  const gasLimit = customGasLimit || limit;
  const [customGasPrice, setCustomGasPrice] = useState<BigNumber>(gasPrice);
  const [newFees, setNewFees] = useState<
    ReturnType<typeof calculateGasAndFees>
  >(
    calculateGasAndFees({
      gasPrice,
      tokenPrice,
      tokenDecimals: network?.networkToken.decimals,
      gasLimit,
    })
  );

  const [customGasInput, setCustomGasInput] = useState(
    selectedGasFeeModifier === GasFeeModifier.CUSTOM
      ? getUpToTwoDecimals(
          gasPrice,
          networkFee?.displayDecimals ?? 9
        ).toString()
      : getUpToTwoDecimals(
          networkFee?.low ?? BigNumber.from(0),
          networkFee?.displayDecimals ?? 9
        ).toString()
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

  const handleGasChange = useCallback(
    (gas: BigNumber, modifier: GasFeeModifier): void => {
      setIsGasPriceTooHigh(false);
      // update customGas
      setCustomGasPrice(gas);
      // update
      const newFees = calculateGasAndFees({
        gasPrice: gas,
        tokenPrice,
        tokenDecimals: network?.networkToken.decimals,
        gasLimit,
      });

      if (maxGasPrice && newFees.bnFee.gt(maxGasPrice)) {
        setIsGasPriceTooHigh(true);
        // call cb with limit and gas
        onChange({ customGasLimit, gasPrice: gas, feeType: modifier });
        return;
      }
      if (modifier === GasFeeModifier.CUSTOM) {
        setCustomGasInput(
          getUpToTwoDecimals(gas, networkFee?.displayDecimals || 0)
        );
      }
      setNewFees(newFees);
      // call cb with limit and gas
      onChange({ customGasLimit, gasPrice: gas, feeType: modifier });
    },
    [
      tokenPrice,
      network?.networkToken.decimals,
      gasLimit,
      customGasLimit,
      maxGasPrice,
      onChange,
      networkFee?.displayDecimals,
    ]
  );

  const updateGasFee = useCallback(
    (modifier?: GasFeeModifier) => {
      if (!modifier || !networkFee || !customGasInput) {
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
          handleGasChange(
            utils.parseUnits(customGasInput, networkFee.displayDecimals),
            modifier
          );
          break;
        default:
          handleGasChange(networkFee.low, GasFeeModifier.NORMAL);
      }
    },
    [customGasInput, handleGasChange, networkFee]
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
    if (networkFee && customGasInput !== '') {
      setCustomGasInput(
        getUpToTwoDecimals(networkFee.low, networkFee.displayDecimals || 0)
      );
      // if the network fee is fixed, that means we only show Normal.
      networkFee.isFixedFee
        ? updateGasFee(GasFeeModifier.NORMAL)
        : updateGasFee(selectedGasFeeModifier);
    }
  }, [customGasInput, networkFee, selectedGasFeeModifier, updateGasFee]);

  if (!networkFee) {
    return null;
  }

  return (
    <ApprovalSection>
      <ApprovalSectionHeader label={t('Network Fee')}>
        {gasLimit !== undefined && (
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
              updateGasFee(GasFeeModifier.NORMAL);
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>
              {t('Normal')}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'semibold' }}>
              {getGasFeeToDisplay(
                getUpToTwoDecimals(networkFee.low, networkFee.displayDecimals)
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
                      networkFee.medium,
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
                      networkFee.high,
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
                  value={getGasFeeToDisplay(customGasInput)}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setCustomGasInput(e.target.value);
                    } else {
                      handleGasChange(
                        utils.parseUnits(
                          e.target.value,
                          networkFee.displayDecimals
                        ),
                        GasFeeModifier.CUSTOM
                      );
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setCustomGasInput(
                        getUpToTwoDecimals(
                          networkFee.low,
                          networkFee.displayDecimals
                        ).toString()
                      );
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
      {gasLimit !== undefined && (
        <CustomGasLimitDialog
          open={Boolean(
            network?.vmName === NetworkVMType.EVM &&
              showEditGasLimit &&
              customGasPrice
          )}
        >
          <CustomGasLimit
            limit={gasLimit}
            gasPrice={customGasPrice}
            onCancel={() => setShowEditGasLimit(false)}
            onSave={(limit) => {
              // update customGasLimit
              setCustomGasLimit(limit);
              // update newFees
              setNewFees(
                calculateGasAndFees({
                  gasPrice: customGasPrice,
                  tokenPrice,
                  tokenDecimals: network?.networkToken.decimals,
                  gasLimit: limit,
                })
              );
              // call cb with limit and gas
              onChange({
                customGasLimit: limit,
                gasPrice: customGasPrice,
                feeType: selectedGasFeeModifier || GasFeeModifier.NORMAL,
              });
            }}
            network={network}
          />
        </CustomGasLimitDialog>
      )}
    </ApprovalSection>
  );
}
