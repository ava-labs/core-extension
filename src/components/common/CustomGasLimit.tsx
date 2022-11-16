import {
  HorizontalFlex,
  Input,
  PrimaryButton,
  Typography,
  VerticalFlex,
  SubTextTypography,
  ComponentSize,
} from '@avalabs/react-components';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { BigNumber } from 'ethers';
import { useState } from 'react';
import { PageTitle } from './PageTitle';
import { t } from 'i18next';
import { Network } from '@avalabs/chains-sdk';

interface CustomGasLimitProps {
  limit: number;
  gasPrice: BigNumber;
  onSave(gasLimit: number): void;
  onCancel(): void;
  network?: Network;
}

export function CustomGasLimit({
  limit,
  gasPrice,
  onSave,
  onCancel,
  network,
}: CustomGasLimitProps) {
  const tokenPrice = useNativeTokenPrice(network);
  const [customGasLimit, setCustomGasLimit] = useState<number>(limit);
  const [calculateGasAndFeesError, setCalculateGasAndFeesError] =
    useState<string>('');
  const [newFees, setNewFees] = useState<
    ReturnType<typeof calculateGasAndFees>
  >(
    calculateGasAndFees({
      gasPrice,
      tokenPrice,
      tokenDecimals: network?.networkToken.decimals,
      gasLimit: limit,
    })
  );
  function handleOnSave(): void {
    if (customGasLimit) {
      onSave(customGasLimit);
      onCancel();
    }
  }

  const checkCustomGasLimit = (customGasLimit: number) => {
    try {
      const calculatedGasAndFees = calculateGasAndFees({
        gasPrice,
        tokenPrice,
        tokenDecimals: network?.networkToken.decimals,
        gasLimit: customGasLimit,
      });
      setNewFees(calculatedGasAndFees);
      setCustomGasLimit(customGasLimit);
      calculateGasAndFeesError && setCalculateGasAndFeesError('');
    } catch (error) {
      setCalculateGasAndFeesError('Gas Limit is too much');
    }
  };

  return (
    <VerticalFlex padding="16px 0 24px 0" height="100%">
      <PageTitle onBackClick={onCancel}>{t('Edit Gas Limit')}</PageTitle>
      <VerticalFlex padding="8px 16px 0">
        <Typography
          size={32}
          height="44px"
          padding="0 0 8px 0"
          wordBreak="break-word"
        >
          {newFees.fee}
          <SubTextTypography padding="0 0 0 4px" weight={500} height="24px">
            {network?.networkToken.symbol}
          </SubTextTypography>
        </Typography>
        <Input
          autoFocus
          label={'Gas Limit'}
          type={'number'}
          value={customGasLimit}
          onChange={(evt) =>
            checkCustomGasLimit(parseInt(evt.currentTarget.value || '0'))
          }
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
