import {
  HorizontalFlex,
  TextButton,
  Typography,
  VerticalFlex,
  Card,
  GearIcon,
  SecondaryButton,
  Overlay,
} from '@avalabs/react-components';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
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
import { useLiveBalance } from '@src/hooks/useLiveBalance';
import { CustomGasLimit } from './CustomGasLimit';

interface CustomGasFeesProps {
  gasPrice: BigNumber;
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
}

export enum GasFeeModifier {
  NORMAL = 'NORMAL',
  FAST = 'FAST',
  INSTANT = 'INSTANT',
  CUSTOM = 'CUSTOM',
}

const FeeButton = styled(SecondaryButton)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text2};
  background-color: ${({ theme }) => `${theme.colors.bg3}80`};
  border-radius: 8px;
  height: 40px;
  max-height: 40px;
  font-weight: 500;
  padding: 4px 0;
  line-height: 15px;
  position: relative;

  &.focus {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.bg2};
    background-color: ${({ theme }) => theme.colors.text1};
    padding: 4px 0 5px 0;
    line-height: 16px;
  }
`;

const CustomGasLimitOverlay = styled(Overlay)`
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg1};
  align-items: flex-start;
  justify-content: flex-start;
`;

const CustomInput = styled.input`
  width: 100%;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: inherit;
  line-height: 15px;
  text-align: center;
  border: none;
  font-family: ${({ theme }) => theme.fontFamily};
  padding: 0 4px;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
`;

const CustomLabel = styled.span`
  color: ${({ theme }) => theme.colors.text2};

  &.focus {
    color: ${({ theme }) => theme.colors.bg2};
  }
`;

function getUpToTwoDecimals(input: BigNumber, decimals: number) {
  const result = input
    .mul(100)
    .div(10 ** decimals)
    .toNumber();

  return formatUnits(result, 2);
}

export function CustomFees({
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
  const [customFee, setCustomFee] = useState<FeeRate | undefined>(
    networkFee?.low
  );
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

  const [isGasPriceTooHigh, setIsGasPriceTooHigh] = useState(false);
  const customInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

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
    // If there is no network fee, return null
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

  if (network?.vmName === NetworkVMType.EVM && showEditGasLimit) {
    return (
      <CustomGasLimitOverlay>
        <CustomGasLimit
          limit={gasLimit}
          gasPrice={customFee?.maxFee || gasPrice}
          onCancel={() => setShowEditGasLimit(false)}
          onSave={(limit) => {
            // update customGasLimit
            setCustomGasLimit(limit);
            // update newFees
            setNewFees(
              calculateGasAndFees({
                gasPrice: customFee?.maxFee || gasPrice,
                tokenPrice,
                tokenDecimals: network?.networkToken.decimals,
                gasLimit: limit,
              })
            );
            // call cb with limit and gas
            onChange({
              customGasLimit: limit,
              maxFeePerGas: customFee?.maxFee || gasPrice,
              feeType: selectedGasFeeModifier || GasFeeModifier.NORMAL,
            });
          }}
          network={network}
        />
      </CustomGasLimitOverlay>
    );
  }

  if (!networkFee) {
    return null;
  }

  return (
    <>
      <Card padding="8px 16px">
        <VerticalFlex width="100%">
          <HorizontalFlex
            align="center"
            justify="space-between"
            margin="0 0 16px 0"
          >
            <HorizontalFlex align="center">
              <Typography
                data-testid="network-fee-token-amount"
                size={14}
                height="17px"
                weight={600}
                margin="0 8px 0 0"
              >
                {newFees.fee} {network?.networkToken.symbol}
              </Typography>
              <Typography
                data-testid="network-fee-currency-amount"
                height="15px"
                size={12}
              >
                {!isNaN(Number(newFees.feeUSD))
                  ? `${currencyFormatter(Number(newFees.feeUSD))}`
                  : ''}
              </Typography>
            </HorizontalFlex>
            {network?.vmName === NetworkVMType.EVM && (
              <TextButton
                data-testid="edit-gas-limit-button"
                onClick={() => setShowEditGasLimit(true)}
              >
                <GearIcon height="16px" color={theme.colors.icon1} />
              </TextButton>
            )}
          </HorizontalFlex>
          <HorizontalFlex justify="space-between">
            <FeeButton
              data-testid="gas-fee-normal-button"
              disabled={gasPriceEditDisabled}
              className={selectedFee === GasFeeModifier.NORMAL ? 'focus' : ''}
              onClick={() => {
                updateGasFee(GasFeeModifier.NORMAL);
              }}
              width="65px"
            >
              {t('Normal')}
              <br />
              {getGasFeeToDisplay(
                getUpToTwoDecimals(
                  networkFee.low.maxFee,
                  networkFee.displayDecimals
                )
              )}
            </FeeButton>
            {!networkFee.isFixedFee && (
              <>
                <FeeButton
                  data-testid="gas-fee-fast-button"
                  disabled={gasPriceEditDisabled}
                  className={selectedFee === GasFeeModifier.FAST ? 'focus' : ''}
                  onClick={() => {
                    updateGasFee(GasFeeModifier.FAST);
                  }}
                  width="65px"
                >
                  {t('Fast')}
                  <br />
                  {getGasFeeToDisplay(
                    getUpToTwoDecimals(
                      networkFee.medium.maxFee,
                      networkFee.displayDecimals
                    )
                  )}
                </FeeButton>
                <FeeButton
                  data-testid="gas-fee-instant-button"
                  disabled={gasPriceEditDisabled}
                  className={
                    selectedFee === GasFeeModifier.INSTANT ? 'focus' : ''
                  }
                  onClick={() => {
                    updateGasFee(GasFeeModifier.INSTANT);
                  }}
                  width="65px"
                >
                  {t('Instant')}
                  <br />
                  {getGasFeeToDisplay(
                    getUpToTwoDecimals(
                      networkFee.high.maxFee,
                      networkFee.displayDecimals
                    )
                  )}
                </FeeButton>
                <FeeButton
                  data-testid="gas-fee-custom-button"
                  disabled={gasPriceEditDisabled}
                  className={
                    selectedFee === GasFeeModifier.CUSTOM ? 'focus' : ''
                  }
                  onClick={() => {
                    updateGasFee(GasFeeModifier.CUSTOM);
                    customInputRef?.current?.focus();
                  }}
                  width="65px"
                >
                  <VerticalFlex>
                    <CustomLabel>{t('Custom')}</CustomLabel>
                    <CustomInput
                      ref={customInputRef}
                      type={'number'}
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
                          handleGasChange(
                            networkFee.low,
                            GasFeeModifier.CUSTOM
                          );
                        }
                      }}
                    />
                  </VerticalFlex>
                </FeeButton>
              </>
            )}
          </HorizontalFlex>
        </VerticalFlex>
      </Card>
      {isGasPriceTooHigh && (
        <VerticalFlex padding="4px 0">
          <Typography size={12} color={theme.colors.error}>
            <Trans
              i18nKey="Insufficient balance to cover gas costs. <br />Please add {{tokenSymbol}}."
              values={{ tokenSymbol: network?.networkToken.symbol }}
            />
          </Typography>
        </VerticalFlex>
      )}
    </>
  );
}
