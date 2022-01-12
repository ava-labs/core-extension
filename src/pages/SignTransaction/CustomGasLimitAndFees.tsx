import {
  HorizontalFlex,
  Input,
  PrimaryButton,
  TextButton,
  Typography,
  VerticalFlex,
  CaretIcon,
  IconDirection,
  SubTextTypography,
  BNInput,
} from '@avalabs/react-components';
import { GasPrice } from '@src/background/services/gas/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useEffect, useState } from 'react';
import { Utils } from '@avalabs/avalanche-wallet-sdk';
import { useTheme } from 'styled-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

interface CustomGasLimitAndFeesProps {
  limit: string;
  gasPrice: GasPrice;
  onSave(gasPrice: GasPrice, gasLimit: string): void;
  onCancel(): void;
  gasPriceEditDisabled?: boolean;
}

export function CustomGasLimitAndFees({
  limit,
  gasPrice,
  onSave,
  onCancel,
  gasPriceEditDisabled,
}: CustomGasLimitAndFeesProps) {
  const { avaxPrice } = useWalletContext();
  const { currencyFormatter } = useSettingsContext();
  const [customGasLimit, setCustomGasLimit] = useState<string>('');
  const [customGasPrice, setCustomGasPrice] = useState<GasPrice>();
  const [calculateGasAndFeesError, setCalculateGasAndFeesError] =
    useState<string>('');
  const [newFees, setNewFees] =
    useState<ReturnType<typeof calculateGasAndFees>>();
  const theme = useTheme();

  useEffect(() => {
    if (customGasPrice && Object.keys(customGasPrice).length) {
      setNewFees(
        calculateGasAndFees(customGasPrice, customGasLimit, avaxPrice)
      );
    }
  }, [customGasPrice, avaxPrice, customGasLimit]);

  useEffect(() => {
    if (!customGasLimit) {
      setCustomGasLimit(limit);
    }
  }, [limit, customGasLimit]);

  useEffect(() => {
    if (!customGasPrice || !Object.keys(customGasPrice).length) {
      setCustomGasPrice({
        bn: Utils.stringToBN(gasPrice.value, 9),
        value: gasPrice.value,
      });
    }
  }, [gasPrice, customGasPrice]);

  function handleOnSave(): void {
    if (customGasPrice && customGasLimit) {
      onSave && onSave(customGasPrice, customGasLimit);
    }
  }

  const checkCustomGasLimit = (customGasLimit: string) => {
    if (!customGasPrice) {
      return;
    }
    try {
      const calculatedGasAndFees = calculateGasAndFees(
        customGasPrice,
        customGasLimit,
        avaxPrice
      );
      setNewFees(calculatedGasAndFees);
      setCustomGasLimit(customGasLimit);
      calculateGasAndFeesError && setCalculateGasAndFeesError('');
    } catch (error) {
      setCalculateGasAndFeesError('Gas Limit is too much');
    }
  };

  return (
    <VerticalFlex margin="24px 0 0 0">
      <HorizontalFlex align="center">
        <TextButton onClick={() => onCancel && onCancel()} margin="0 108px 0 0">
          <CaretIcon
            height="20px"
            direction={IconDirection.LEFT}
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography as="h1" size={24} weight={700} align="center">
          Edit Fees
        </Typography>
      </HorizontalFlex>
      <VerticalFlex padding="32px 0 0 0">
        <Typography
          size={36}
          weight={700}
          padding="0 0 8px 0"
          wordBreak="break-word"
        >
          {newFees?.fee}
          <Typography
            padding="0 0 0 4px"
            weight={600}
            color={theme.colors.text2}
          >
            AVAX
          </Typography>
        </Typography>
        <SubTextTypography size={12}>
          Max fee: ({currencyFormatter(Number(newFees?.feeUSD))} AVAX)
        </SubTextTypography>
      </VerticalFlex>
      <Input
        label={'Gas Limit'}
        type={'number'}
        value={customGasLimit}
        onChange={(evt) => checkCustomGasLimit(evt.currentTarget.value)}
        margin="24px 0 0 0"
        error={!!calculateGasAndFeesError}
        errorMessage={calculateGasAndFeesError}
      />
      <BNInput
        label={'Gas Price'}
        value={customGasPrice?.bn}
        onChange={(value) =>
          setCustomGasPrice({
            bn: value.bn,
            value: value.amount,
          })
        }
        disabled={gasPriceEditDisabled}
        margin="24px 0 0 0"
        denomination={9}
      />

      <HorizontalFlex flex={1} align="flex-end" width="100%">
        <PrimaryButton width="100%" onClick={handleOnSave}>
          Save
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
