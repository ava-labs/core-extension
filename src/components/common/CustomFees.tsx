import {
  HorizontalFlex,
  TextButton,
  Typography,
  VerticalFlex,
  Card,
  GearIcon,
  SecondaryButton,
  Overlay,
  BNInput,
} from '@avalabs/react-components';
import { GasPrice } from '@src/background/services/gas/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useState } from 'react';
import { Big, bnToLocaleString, bigToBN } from '@avalabs/avalanche-wallet-sdk';
import styled, { useTheme } from 'styled-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { CustomGasLimit } from '@src/components/common/CustomGasLimit';

interface CustomGasFeesProps {
  gasPrice: GasPrice;
  limit: string;
  onChange(gasLimit: string, gasPrice: GasPrice): void;
  gasPriceEditDisabled?: boolean;
}

enum GasFeeModifier {
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

  &.focus {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.bg2};
    background-color: ${({ theme }) => theme.colors.text1};
  }
`;

const CustomGasLimitOverlay = styled(Overlay)`
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg1};
  align-items: flex-start;
  justify-content: flex-start;
`;

const CustomBNInput = styled(BNInput)`
  width: 65px;

  > div > input {
    font-size: 14px;
    font-weight: 600;
    height: 40px;
    padding: 4px 8px;
    textalign: center;
    background-color: ${({ theme }) => theme.colors.text1};
    color: ${({ theme }) => theme.colors.bg2};

    :focus {
      background-color: ${({ theme }) => theme.colors.text1};
      color: ${({ theme }) => theme.colors.bg2};
    }
  }
`;

export function CustomFees({
  gasPrice,
  limit,
  onChange,
  gasPriceEditDisabled = false,
}: CustomGasFeesProps) {
  const { avaxPrice } = useWalletContext();
  const { currencyFormatter, currency } = useSettingsContext();
  const [customGasLimit, setCustomGasLimit] = useState<string>(limit);
  const [customGasPrice, setCustomGasPrice] = useState<GasPrice>(gasPrice);
  const [newFees, setNewFees] = useState<
    ReturnType<typeof calculateGasAndFees>
  >(calculateGasAndFees(gasPrice, limit, avaxPrice));
  const [originalGas] = useState<GasPrice>(gasPrice);
  const theme = useTheme();

  const [gasModifierSelected, setGasModifierSelected] = useState(
    GasFeeModifier.NORMAL
  );

  const [showEditGasLimit, setShowEditGasLimit] = useState(false);

  const gasModifer = (amount: number): GasPrice => {
    // take current GasPrice (BN) and add amount .05 | .15 | custom
    const bigGas = new Big(bnToLocaleString(originalGas.bn, 9));
    const newBigGas = bigGas.times(amount).plus(bigGas);

    const modifiedGasPrice = {
      bn: bigToBN(newBigGas, 9),
      value: newBigGas.toString(),
    };

    return modifiedGasPrice;
  };

  const handleGasChange = (gas: GasPrice): void => {
    // update customGas
    setCustomGasPrice(gas);
    // update newFees
    setNewFees(calculateGasAndFees(gas, customGasLimit, avaxPrice));
    // call cb with limit and gas
    onChange(customGasLimit, gas);
  };

  const updateGasFee = (modifier: GasFeeModifier) => {
    setGasModifierSelected(modifier);
    switch (modifier) {
      case GasFeeModifier.FAST: {
        handleGasChange(gasModifer(0.05));
        break;
      }
      case GasFeeModifier.INSTANT: {
        handleGasChange(gasModifer(0.15));
        break;
      }
      case GasFeeModifier.CUSTOM:
        break;
      default:
        handleGasChange(originalGas);
    }
  };

  if (showEditGasLimit && customGasPrice) {
    return (
      <CustomGasLimitOverlay>
        <CustomGasLimit
          limit={customGasLimit}
          gasPrice={customGasPrice}
          onCancel={() => setShowEditGasLimit(false)}
          onSave={(limit) => {
            // update customGasLimit
            setCustomGasLimit(limit);
            // update newFees
            setNewFees(calculateGasAndFees(customGasPrice, limit, avaxPrice));
            // call cb with limit and gas
            onChange(limit, customGasPrice);
          }}
        />
      </CustomGasLimitOverlay>
    );
  }

  return (
    <Card padding="16px">
      <VerticalFlex width="100%">
        <HorizontalFlex
          align="center"
          justify="space-between"
          margin="0 0 16px 0"
        >
          <HorizontalFlex align="center">
            <Typography size={14} height="17px" weight={600} margin="0 8px 0 0">
              {newFees.fee} AVAX
            </Typography>
            <Typography height="15px" size={12}>
              {!isNaN(Number(newFees.feeUSD))
                ? `${currencyFormatter(Number(newFees.feeUSD))} ${currency}`
                : ''}
            </Typography>
          </HorizontalFlex>
          <TextButton onClick={() => setShowEditGasLimit(true)}>
            <GearIcon height="16px" color={theme.colors.icon1} />
          </TextButton>
        </HorizontalFlex>
        <HorizontalFlex justify="space-between">
          <FeeButton
            disabled={gasPriceEditDisabled}
            className={
              gasModifierSelected === GasFeeModifier.NORMAL ? 'focus' : ''
            }
            onClick={() => updateGasFee(GasFeeModifier.NORMAL)}
            width="65px"
          >
            Normal
          </FeeButton>
          <FeeButton
            disabled={gasPriceEditDisabled}
            className={
              gasModifierSelected === GasFeeModifier.FAST ? 'focus' : ''
            }
            onClick={() => updateGasFee(GasFeeModifier.FAST)}
            width="65px"
          >
            Fast
          </FeeButton>
          <FeeButton
            disabled={gasPriceEditDisabled}
            className={
              gasModifierSelected === GasFeeModifier.INSTANT ? 'focus' : ''
            }
            onClick={() => updateGasFee(GasFeeModifier.INSTANT)}
            width="65px"
          >
            Instant
          </FeeButton>
          {gasModifierSelected !== GasFeeModifier.CUSTOM && (
            <FeeButton
              disabled={gasPriceEditDisabled}
              onClick={() => updateGasFee(GasFeeModifier.CUSTOM)}
              width="65px"
            >
              Custom
            </FeeButton>
          )}
          {gasModifierSelected === GasFeeModifier.CUSTOM && (
            <CustomBNInput
              placeholder={'nAVAX'}
              value={customGasPrice?.bn}
              onChange={(value) =>
                handleGasChange({
                  bn: value.bn as any,
                  value: value.amount,
                })
              }
              disabled={gasPriceEditDisabled}
              denomination={9}
            />
          )}
        </HorizontalFlex>
      </VerticalFlex>
    </Card>
  );
}
