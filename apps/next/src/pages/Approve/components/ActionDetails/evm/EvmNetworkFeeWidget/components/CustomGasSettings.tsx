import { useTranslation } from 'react-i18next';
import { formatUnits, parseUnits } from 'ethers';
import { ComponentProps, FC, useEffect, useState } from 'react';
import { Button, Fade, Stack, Tooltip, Typography } from '@avalabs/k2-alpine';

import { calculateGasAndFees } from '@core/common';
import { FeeRate, NativeTokenBalance } from '@core/types';
import { useKeyboardShortcuts, useSettingsContext } from '@core/ui';

import { Page } from '@/components/Page';

import { DetailsSection } from '../../../generic/DetailsSection';
import { TxDetailsRow } from '../../../generic/DetailsItem/items/DetailRow';
import { EvmGasSettings } from '../types';
import { InvisibileInput } from '@/components/Forms/InvisibleInput';

type CustomGasSettingsProps = {
  onBack: () => void;
  customPreset: FeeRate;
  nativeToken: NativeTokenBalance;
  gasLimit: number;
  onSave: (feeRate: EvmGasSettings) => void;
  feeDecimals: number;
};

export const CustomGasSettings: FC<CustomGasSettingsProps> = ({
  onBack,
  customPreset,
  nativeToken,
  gasLimit,
  onSave,
  feeDecimals,
}) => {
  const { t } = useTranslation();

  const { currencyFormatter } = useSettingsContext();

  const [error, setError] = useState('');
  const [customMaxFeeString, setCustomMaxFeeString] = useState(
    formatUnits(customPreset.maxFeePerGas, feeDecimals),
  );
  const [customMaxTipString, setCustomMaxTipString] = useState(
    formatUnits(customPreset.maxPriorityFeePerGas ?? 1n, feeDecimals),
  );
  const [customGasLimitString, setCustomGasLimitString] = useState(
    gasLimit.toString(),
  );

  const fees = calculateGasAndFees({
    maxFeePerGas: customMaxFeeString
      ? parseUnits(customMaxFeeString, feeDecimals)
      : customPreset.maxFeePerGas,
    tokenPrice: nativeToken.priceInCurrency,
    tokenDecimals: nativeToken.decimals,
    gasLimit: customGasLimitString ? Number(customGasLimitString) : gasLimit,
  });

  const totalFeeInCurrency = fees?.feeUSD ?? null;

  useEffect(() => {
    setError('');

    try {
      const newMaxFee = customMaxFeeString
        ? parseUnits(customMaxFeeString, feeDecimals)
        : customPreset.maxFeePerGas;
      const newMaxTip = customMaxTipString
        ? parseUnits(customMaxTipString, feeDecimals)
        : customPreset.maxPriorityFeePerGas;

      if (!newMaxTip || !newMaxFee) {
        return;
      }

      if (newMaxTip > newMaxFee) {
        setError(t('Max base fee must be greater than max priority fee'));
      }
    } catch {
      setError(t('Please enter a valid decimal value'));
    }
  }, [
    customMaxFeeString,
    customMaxTipString,
    customPreset.maxFeePerGas,
    customPreset.maxPriorityFeePerGas,
    feeDecimals,
    t,
  ]);

  const handleSave = () => {
    onSave({
      maxFeePerGas: parseUnits(customMaxFeeString, feeDecimals),
      maxPriorityFeePerGas: parseUnits(customMaxTipString, feeDecimals),
      gasLimit: customGasLimitString ? Number(customGasLimitString) : undefined, // If user erases it completely, do not save it.
    });
  };

  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: handleSave,
  });

  return (
    <Page
      withBackButton
      withViewSwitcher={false}
      onBack={onBack}
      title={t('Edit network fee')}
      {...keyboardShortcuts}
    >
      <Stack flexGrow={1} gap={1} width="100%">
        <DetailsSection sx={{ width: '100%' }}>
          <TxDetailsRow
            label={t('Max base fee')}
            tooltip={t(
              'The base fee is set by the network and changes frequently. Any difference between the set max base fee and the actual base fee will be refunded.',
            )}
          >
            <Stack textAlign="end">
              <FeeInput
                autoFocus
                defaultValue={customMaxFeeString}
                onChange={(ev) => {
                  setCustomMaxFeeString(ev.currentTarget.value || '0');
                }}
              />
              <Fade in={typeof totalFeeInCurrency === 'number'}>
                <Typography variant="caption" color="text.secondary">
                  {currencyFormatter(totalFeeInCurrency ?? 0)}
                </Typography>
              </Fade>
            </Stack>
          </TxDetailsRow>
          <TxDetailsRow
            label={t('Max priority fee')}
            tooltip={t(
              'The priority fee is an incentive paid to network operators to prioritize processing of this transaction.',
            )}
          >
            <FeeInput
              defaultValue={customMaxTipString}
              onChange={(ev) => {
                setCustomMaxTipString(ev.currentTarget.value || '0');
              }}
            />
          </TxDetailsRow>
          <TxDetailsRow
            label={t('Gas limit')}
            tooltip={t(
              'Total units of gas needed to complete the transaction. Setting it too low may cause the transaction to fail.',
            )}
          >
            <FeeInput
              defaultValue={gasLimit}
              onChange={(ev) => {
                setCustomGasLimitString(ev.currentTarget.value || '0');
              }}
            />
          </TxDetailsRow>
        </DetailsSection>
        <DetailsSection>
          <TxDetailsRow
            label={t('Total network fee')}
            tooltip={t(
              `Total network fee = (current base fee + max priority fee) × gas limit. It will never be higher than max base fee × gas limit.`,
            )}
          >
            <Stack textAlign="end">
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Tooltip title={fees?.feeUnit.toString()}>
                  <Typography variant="body3">
                    ~{fees?.feeUnit.toDisplay()} {nativeToken.symbol}
                  </Typography>
                </Tooltip>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {currencyFormatter(totalFeeInCurrency ?? 0)}
              </Typography>
            </Stack>
          </TxDetailsRow>
        </DetailsSection>
        <Fade in={Boolean(error)}>
          <Stack width="100%" textAlign="center">
            <Typography variant="caption" color="error.main">
              {error}
            </Typography>
          </Stack>
        </Fade>
      </Stack>
      <Stack width="100%" gap={1}>
        <Button
          variant="contained"
          color="primary"
          size="extension"
          fullWidth
          disabled={Boolean(error)}
          onClick={handleSave}
        >
          {t('Save')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="extension"
          fullWidth
          onClick={onBack}
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Page>
  );
};

const FeeInput = (props: ComponentProps<typeof InvisibileInput>) => (
  <InvisibileInput
    type="number"
    step="any"
    sx={{ textAlign: 'end', px: 0 }}
    inputMode="decimal"
    {...props}
  />
);
