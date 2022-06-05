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
import { BigNumber } from 'ethers';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useNetworkContext } from '../../contexts/NetworkProvider';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { NetworkVMType } from '@avalabs/chains-sdk';

interface CustomGasFeesProps {
  gasPrice: BigNumber;
  limit: number;
  onChange(
    gasLimit: number,
    gasPrice: BigNumber,
    feeType: GasFeeModifier
  ): void;
  gasPriceEditDisabled?: boolean;
  maxGasPrice?: string;
  selectedGasFeeModifier?: GasFeeModifier;
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

export function CustomFees({
  gasPrice,
  limit,
  onChange,
  gasPriceEditDisabled = false,
  maxGasPrice,
  selectedGasFeeModifier,
}: CustomGasFeesProps) {
  const { network } = useNetworkContext();
  const tokenPrice = useNativeTokenPrice();
  const { currencyFormatter, currency } = useSettingsContext();
  const { networkFee } = useNetworkFeeContext();
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
      ? parseInt(
          gasPrice.div(10 ** (networkFee?.displayDecimals ?? 9)).toString()
        ).toString()
      : parseInt(
          networkFee?.low
            .div(10 ** (networkFee?.displayDecimals ?? 9))
            .toString() || '0'
        ).toString()
  );

  const [isGasPriceTooHigh, setIsGasPriceTooHigh] = useState(false);
  const customInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const [showEditGasLimit, setShowEditGasLimit] = useState(false);
  const [selectedFee, setSelectedFee] = useState<GasFeeModifier>(
    selectedGasFeeModifier || GasFeeModifier.NORMAL
  );

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

      if (maxGasPrice && newFees.bnFee.gte(maxGasPrice)) {
        setIsGasPriceTooHigh(true);
        return;
      }

      if (modifier === GasFeeModifier.CUSTOM) {
        setCustomGasInput(
          gas.div(10 ** (networkFee?.displayDecimals || 0)).toString() || '0'
        );
      }

      setNewFees(newFees);
      // call cb with limit and gas
      onChange(gasLimit, gas, modifier);
    },
    [
      tokenPrice,
      network?.networkToken.decimals,
      gasLimit,
      maxGasPrice,
      onChange,
      networkFee?.displayDecimals,
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
          handleGasChange(
            BigNumber.from(customGasInput).mul(
              10 ** networkFee.displayDecimals
            ),
            modifier
          );
          break;
        default:
          handleGasChange(networkFee.low, GasFeeModifier.NORMAL);
      }
    },
    [customGasInput, handleGasChange, networkFee]
  );

  // this should update the gas prices when there is a change (e.g. from hook)
  useEffect(() => {
    updateGasFee(selectedGasFeeModifier);
  }, [selectedGasFeeModifier, updateGasFee]);

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
            onChange(
              limit,
              customGasPrice,
              selectedGasFeeModifier || GasFeeModifier.NORMAL
            );
          }}
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
                size={14}
                height="17px"
                weight={600}
                margin="0 8px 0 0"
              >
                {newFees.fee} {network?.networkToken.symbol}
              </Typography>
              <Typography height="15px" size={12}>
                {!isNaN(Number(newFees.feeUSD))
                  ? `${currencyFormatter(Number(newFees.feeUSD))} ${currency}`
                  : ''}
              </Typography>
            </HorizontalFlex>
            {network?.vmName === NetworkVMType.EVM && (
              <TextButton onClick={() => setShowEditGasLimit(true)}>
                <GearIcon height="16px" color={theme.colors.icon1} />
              </TextButton>
            )}
          </HorizontalFlex>
          <HorizontalFlex justify="space-between">
            <FeeButton
              disabled={gasPriceEditDisabled}
              className={selectedFee === GasFeeModifier.NORMAL ? 'focus' : ''}
              onClick={() => {
                updateGasFee(GasFeeModifier.NORMAL);
              }}
              width="65px"
            >
              Normal <br />
              {parseInt(
                networkFee.low.div(10 ** networkFee.displayDecimals).toString()
              )}
            </FeeButton>
            <FeeButton
              disabled={gasPriceEditDisabled}
              className={selectedFee === GasFeeModifier.FAST ? 'focus' : ''}
              onClick={() => {
                updateGasFee(GasFeeModifier.FAST);
              }}
              width="65px"
            >
              Fast <br />
              {parseInt(
                networkFee.medium
                  .div(10 ** networkFee.displayDecimals)
                  .toString()
              )}
            </FeeButton>
            <FeeButton
              disabled={gasPriceEditDisabled}
              className={selectedFee === GasFeeModifier.INSTANT ? 'focus' : ''}
              onClick={() => {
                updateGasFee(GasFeeModifier.INSTANT);
              }}
              width="65px"
            >
              Instant <br />
              {parseInt(
                networkFee.high.div(10 ** networkFee.displayDecimals).toString()
              )}
            </FeeButton>
            <FeeButton
              disabled={gasPriceEditDisabled}
              className={selectedFee === GasFeeModifier.CUSTOM ? 'focus' : ''}
              onClick={() => {
                updateGasFee(GasFeeModifier.CUSTOM);
                customInputRef?.current?.focus();
              }}
              width="65px"
            >
              <VerticalFlex>
                <CustomLabel>Custom</CustomLabel>
                <CustomInput
                  ref={customInputRef}
                  type={'number'}
                  value={customGasInput}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      handleGasChange(BigNumber.from(0), GasFeeModifier.CUSTOM);
                    } else {
                      handleGasChange(
                        BigNumber.from(e.target.value).mul(
                          10 ** networkFee.displayDecimals
                        ),
                        GasFeeModifier.CUSTOM
                      );
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setCustomGasInput(
                        parseInt(
                          networkFee.low
                            .div(10 ** networkFee.displayDecimals)
                            .toString()
                        ).toString()
                      );
                      handleGasChange(networkFee.low, GasFeeModifier.CUSTOM);
                    }
                  }}
                />
              </VerticalFlex>
            </FeeButton>
          </HorizontalFlex>
        </VerticalFlex>
      </Card>
      {isGasPriceTooHigh && (
        <VerticalFlex padding="4px 0">
          <Typography size={12} color={theme.colors.error}>
            Insufficient balance
          </Typography>
        </VerticalFlex>
      )}
    </>
  );
}
