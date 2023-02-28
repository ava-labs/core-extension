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
import { CustomGasLimit } from '@src/components/common/CustomGasLimit';
import { BigNumber, utils } from 'ethers';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { formatUnits } from 'ethers/lib/utils';
import { Trans, useTranslation } from 'react-i18next';
import { NetworkFee } from '@src/background/services/networkFee/models';
import { useLiveBalance } from '@src/hooks/useLiveBalance';

interface CustomGasFeesProps {
  gasPrice: BigNumber;
  limit: number;
  onChange(values: {
    customGasLimit?: number;
    gasPrice: BigNumber;
    feeType: GasFeeModifier;
    error?: boolean;
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
  const theme = useTheme();

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
        onChange({
          customGasLimit,
          gasPrice: gas,
          feeType: modifier,
          error: true,
        });
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

  if (
    network?.vmName === NetworkVMType.EVM &&
    showEditGasLimit &&
    customGasPrice
  ) {
    return (
      <CustomGasLimitOverlay>
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
                getUpToTwoDecimals(networkFee.low, networkFee.displayDecimals)
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
                      networkFee.medium,
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
                      networkFee.high,
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
