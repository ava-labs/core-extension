import {
  HorizontalFlex,
  Input,
  PrimaryButton,
  Typography,
  VerticalFlex,
  SubTextTypography,
  ComponentSize,
} from '@avalabs/react-components';
import { GasPrice } from '@src/background/services/gas/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { useState } from 'react';
import { PageTitle } from './PageTitle';

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
    <VerticalFlex padding="16px 0 24px 0" height="100%">
      <PageTitle onBackClick={onCancel}>Edit Gas Limit</PageTitle>
      <VerticalFlex padding="8px 16px 0">
        <Typography
          size={32}
          height="44px"
          padding="0 0 8px 0"
          wordBreak="break-word"
        >
          {newFees.fee}
          <SubTextTypography padding="0 0 0 4px" weight={500} height="24px">
            AVAX
          </SubTextTypography>
        </Typography>
        <Input
          label={'Gas Limit'}
          type={'number'}
          value={customGasLimit}
          onChange={(evt) => checkCustomGasLimit(evt.currentTarget.value)}
          margin="16px 0 0 0"
          error={!!calculateGasAndFeesError}
          errorMessage={calculateGasAndFeesError}
        />
      </VerticalFlex>

      <HorizontalFlex flex={1} align="flex-end" padding="0 16px" width="100%">
        <PrimaryButton
          size={ComponentSize.LARGE}
          width="100%"
          onClick={handleOnSave}
        >
          Save
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
