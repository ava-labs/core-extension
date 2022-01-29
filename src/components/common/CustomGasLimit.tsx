import {
  HorizontalFlex,
  Input,
  PrimaryButton,
  TextButton,
  Typography,
  VerticalFlex,
  CaretIcon,
  IconDirection,
} from '@avalabs/react-components';
import { GasPrice } from '@src/background/services/gas/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useState } from 'react';
import { useTheme } from 'styled-components';

interface CustomGasLimitProps {
  limit: string;
  gasPrice: GasPrice;
  onSave(gasLimit: string): void;
  onCancel(): void;
}

export function CustomGasLimit({
  limit,
  gasPrice,
  onSave,
  onCancel,
}: CustomGasLimitProps) {
  const { avaxPrice } = useWalletContext();
  const [customGasLimit, setCustomGasLimit] = useState<string>(limit);
  const [calculateGasAndFeesError, setCalculateGasAndFeesError] =
    useState<string>('');
  const [newFees, setNewFees] = useState<
    ReturnType<typeof calculateGasAndFees>
  >(calculateGasAndFees(gasPrice, limit, avaxPrice));
  const theme = useTheme();

  function handleOnSave(): void {
    if (customGasLimit) {
      onSave(customGasLimit);
      onCancel();
    }
  }

  const checkCustomGasLimit = (customGasLimit: string) => {
    try {
      const calculatedGasAndFees = calculateGasAndFees(
        gasPrice,
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
    <VerticalFlex margin="24px 0 0 0" height="100%">
      <HorizontalFlex align="center">
        <TextButton onClick={() => onCancel()} margin="0 84px 0 0">
          <CaretIcon
            height="20px"
            direction={IconDirection.LEFT}
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography as="h1" size={24} weight={700} align="center">
          Edit Gas Limit
        </Typography>
      </HorizontalFlex>
      <VerticalFlex padding="32px 0 0 0">
        <Typography
          size={36}
          weight={700}
          padding="0 0 8px 0"
          wordBreak="break-word"
        >
          {newFees.fee}
          <Typography
            padding="0 0 0 4px"
            weight={600}
            color={theme.colors.text2}
          >
            AVAX
          </Typography>
        </Typography>
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

      <HorizontalFlex flex={1} align="flex-end" width="100%">
        <PrimaryButton width="100%" onClick={handleOnSave}>
          Save
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
