import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { BigNumber } from 'ethers';
import { useState } from 'react';
import { PageTitle } from './PageTitle';
import { useTranslation } from 'react-i18next';
import { Network } from '@avalabs/chains-sdk';
import { Button, Stack, TextField } from '@avalabs/k2-components';

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
  const { t } = useTranslation();
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
    setCustomGasLimit(customGasLimit);

    if (customGasLimit <= 0) {
      setCalculateGasAndFeesError(t('Gas Limit too low'));
      return;
    }

    try {
      const calculatedGasAndFees = calculateGasAndFees({
        gasPrice,
        tokenPrice,
        tokenDecimals: network?.networkToken.decimals,
        gasLimit: customGasLimit,
      });
      setNewFees(calculatedGasAndFees);
      calculateGasAndFeesError && setCalculateGasAndFeesError('');
    } catch (error) {
      setCalculateGasAndFeesError(t('Gas Limit is too much'));
    }
  };

  return (
    <Stack sx={{ height: '100%' }}>
      <PageTitle onBackClick={onCancel}>{t('Edit Gas Limit')}</PageTitle>
      <Stack sx={{ padding: 2 }}>
        <TextField
          light
          label={t('Current Gas Cost')}
          value={`${newFees.fee} ${network?.networkToken.symbol}`}
          disabled
          sx={{ marginBottom: 5 }}
        />
        <TextField
          light
          autoFocus
          label={t('Gas Limit')}
          type={'number'}
          value={customGasLimit}
          onChange={(evt) =>
            checkCustomGasLimit(parseInt(evt.currentTarget.value))
          }
          error={!!calculateGasAndFeesError}
          helperText={calculateGasAndFeesError}
        />
      </Stack>

      <Stack
        sx={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingX: 2,
          paddingBottom: 3,
        }}
      >
        <Button
          data-testid="save-gas-limit-button"
          size="large"
          variant="contained"
          onClick={handleOnSave}
          disabled={!!calculateGasAndFeesError}
          fullWidth
        >
          {t('Save')}
        </Button>
      </Stack>
    </Stack>
  );
}
