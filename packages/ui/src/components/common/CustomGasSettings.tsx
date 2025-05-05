import { formatUnits, parseUnits } from 'ethers';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { useNativeTokenPrice } from '@/hooks/useTokenPrice';
import { calculateGasAndFees } from '@core/common';
import { useEffect, useState } from 'react';
import { PageTitle } from './PageTitle';
import { useTranslation } from 'react-i18next';
import { Network } from '@avalabs/core-chains-sdk';
import {
  Box,
  Button,
  Divider,
  InfoCircleIcon,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { useSettingsContext } from '@/contexts/SettingsProvider';
import { TextFieldLabel } from './TextFieldLabel';
import { TruncateFeeAmount } from './TruncateFeeAmount';

type GasSettings = {
  customGasLimit: number;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
};

type OnSave = (data: GasSettings) => void;

interface CustomGasSettingsProps {
  feeDisplayDecimals: number;
  gasLimit: number;
  isLimitReadonly?: boolean;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  onSave: OnSave;
  onCancel(): void;
  network?: Network;
}

const ErrorMessage = ({ message }) => (
  <Typography variant="caption" sx={{ color: 'error.light' }}>
    {message}
  </Typography>
);

const FiatValue = ({ value }) => (
  <Box sx={{ width: '100%', pt: 0.5, minHeight: '16px' }}>
    <Typography variant="caption" component="p" sx={{ textAlign: 'end' }}>
      {value}
    </Typography>
  </Box>
);

const FeeAmount = ({ decimals, value, fiatValue, tokenSymbol }) => {
  const unit = new TokenUnit(value, decimals, tokenSymbol);

  return (
    <Stack sx={{ textAlign: 'end', gap: 0.5 }}>
      <Stack sx={{ textAlign: 'end' }}>
        <Stack
          sx={{
            flexDirection: 'row',
            gap: 0.5,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Tooltip title={unit.toString()}>
            <TruncateFeeAmount amount={unit.toDisplay()} />
          </Tooltip>
          <Typography variant="subtitle2" component="span" color="text.primary">
            {tokenSymbol}
          </Typography>
        </Stack>
        {fiatValue && (
          <Typography variant="body2" color="text.secondary">
            {fiatValue}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export function CustomGasSettings({
  feeDisplayDecimals,
  gasLimit,
  isLimitReadonly,
  maxFeePerGas,
  maxPriorityFeePerGas,
  onSave,
  onCancel,
  network,
}: CustomGasSettingsProps) {
  const { t } = useTranslation();
  const tokenPrice = useNativeTokenPrice(network);
  const { currencyFormatter } = useSettingsContext();
  const tokenDecimals = network?.networkToken.decimals ?? 18;
  const [customGasLimit, setCustomGasLimit] = useState<number>(gasLimit);
  const [customMaxFeePerGas, setCustomMaxFeePerGas] =
    useState<bigint>(maxFeePerGas);
  const [customMaxPriorityFeePerGas, setCustomMaxPriorityFeePerGas] =
    useState<bigint>(maxPriorityFeePerGas);
  const [errors, setErrors] = useState<{
    gasLimit?: string;
    maxFee?: string;
    maxPriorityFee?: string;
  }>({});
  const [newFees, setNewFees] = useState<
    ReturnType<typeof calculateGasAndFees>
  >(
    calculateGasAndFees({
      maxFeePerGas,
      tokenPrice,
      tokenDecimals,
      gasLimit,
    }),
  );
  function handleOnSave(): void {
    if (customGasLimit) {
      onSave({
        customGasLimit: customGasLimit,
        maxFeePerGas: customMaxFeePerGas,
        maxPriorityFeePerGas: customMaxPriorityFeePerGas,
      });
    }
  }

  useEffect(() => {
    let hasErrors = false;

    if (customGasLimit <= 0) {
      setErrors((existingErrors) => ({
        ...existingErrors,
        gasLimit: t('Gas Limit too low'),
      }));
      hasErrors = true;
    } else {
      setErrors((existingErrors) => ({
        ...existingErrors,
        gasLimit: undefined,
      }));
    }

    if (customMaxPriorityFeePerGas > customMaxFeePerGas) {
      setErrors((existingErrors) => ({
        ...existingErrors,
        maxPriorityFee: t(
          'Maximum priority fee cannot be greater than maximum fee',
        ),
      }));
      hasErrors = true;
    } else {
      setErrors((existingErrors) => ({
        ...existingErrors,
        maxPriorityFee: undefined,
      }));
    }

    if (hasErrors) {
      return;
    }

    try {
      const calculatedGasAndFees = calculateGasAndFees({
        maxFeePerGas: customMaxFeePerGas,
        maxPriorityFeePerGas: customMaxPriorityFeePerGas,
        tokenPrice,
        tokenDecimals,
        gasLimit: customGasLimit,
      });
      setErrors({});
      setNewFees(calculatedGasAndFees);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('overflow')) {
          // https://links.ethers.org/v5-errors-NUMERIC_FAULT-overflow
          setErrors((existingErrors) => ({
            ...existingErrors,
            gasLimit: t('Gas Limit is too much'),
          }));
        } else if (
          error.message === 'Please provide gasPrice or maxFeePerGas parameters'
        ) {
          setErrors((existingErrors) => ({
            ...existingErrors,
            maxFee: t('Provide valid numerical value for maximum fee'),
          }));
        }
      }
    }
  }, [
    customGasLimit,
    customMaxFeePerGas,
    customMaxPriorityFeePerGas,
    maxFeePerGas,
    t,
    tokenPrice,
    tokenDecimals,
  ]);

  return (
    <Stack sx={{ height: '100%' }}>
      <PageTitle margin="16px 0 0" onBackClick={onCancel}>
        {t('Edit Network Fee')}
      </PageTitle>
      <Stack sx={{ padding: 2, gap: 2.5 }}>
        <Stack sx={{ width: '100%', gap: 0.5 }}>
          <TextFieldLabel
            label={t('Max Base Fee')}
            tooltip={t(
              'The Base Fee is set by the network and changes frequently. Any difference between the set Max Base Fee and the actual Base Fee will be refunded.',
            )}
          />
          <TextField
            fullWidth
            type={'number'}
            value={formatUnits(customMaxFeePerGas, feeDisplayDecimals)}
            onChange={(evt) => {
              setCustomMaxFeePerGas(
                parseUnits(evt.currentTarget.value || '0', feeDisplayDecimals),
              );
            }}
            error={!!errors.maxFee}
            data-testid="max-base-fee"
          />
          {errors.maxFee ? (
            <ErrorMessage message={errors.maxFee} />
          ) : (
            <FiatValue
              value={newFees.feeUSD ? currencyFormatter(newFees.feeUSD) : ''}
            />
          )}
        </Stack>
        <Stack sx={{ width: '100%', gap: 0.5 }}>
          <TextFieldLabel
            label={t('Max Priority Fee')}
            tooltip={t(
              'The Priority Fee is an incentive paid to network operators to prioritize processing of this transaction.',
            )}
          />
          <TextField
            autoFocus
            fullWidth
            type={'number'}
            value={formatUnits(customMaxPriorityFeePerGas, feeDisplayDecimals)}
            onChange={(evt) => {
              setCustomMaxPriorityFeePerGas(
                parseUnits(evt.currentTarget.value || '0', feeDisplayDecimals),
              );
            }}
            error={!!errors.maxPriorityFee}
            data-testid="max-priority-fee"
          />
          {errors.maxPriorityFee ? (
            <ErrorMessage message={errors.maxPriorityFee} />
          ) : (
            <FiatValue
              value={newFees.tipUSD ? currencyFormatter(newFees.tipUSD) : ''}
            />
          )}
        </Stack>
        <Stack sx={{ width: '100%', gap: 0.5 }}>
          <TextFieldLabel
            label={t('Gas Limit')}
            tooltip={
              isLimitReadonly
                ? t(
                    'Estimated gas units needed to complete the transaction. Includes a small buffer. Not editable for this transaction.',
                  )
                : t(
                    'Total units of gas needed to complete the transaction. Do not edit unless necessary.',
                  )
            }
          />
          <TextField
            fullWidth
            InputProps={{
              readOnly: isLimitReadonly,
            }}
            disabled={isLimitReadonly}
            type={'number'}
            value={customGasLimit?.toString()}
            onChange={
              isLimitReadonly
                ? undefined
                : (evt) => setCustomGasLimit(parseInt(evt.currentTarget.value))
            }
            error={!!errors.gasLimit}
            data-testid="gas-limit"
          />
          {errors.gasLimit && <ErrorMessage message={errors.gasLimit} />}
        </Stack>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'start',
          }}
        >
          <Stack
            sx={{
              flexDirection: 'row',
              gap: 1,
              alignItems: 'center',
              pt: 0.75,
            }}
          >
            <Typography variant="caption">{t('Total Network Fee')}</Typography>
            <Tooltip
              title={
                <>
                  <div>
                    {t(
                      'Total Network Fee = (Current Base Fee + Max Priority Fee) * Gas Limit.',
                    )}
                  </div>
                  <br />
                  <div>
                    {t(
                      'It will never be higher than Max Base Fee * Gas Limit.',
                    )}
                  </div>
                </>
              }
            >
              <InfoCircleIcon />
            </Tooltip>
          </Stack>
          <FeeAmount
            value={newFees.bnFee}
            decimals={network?.networkToken.decimals}
            fiatValue={
              newFees.feeUSD ? currencyFormatter(newFees.feeUSD) : null
            }
            tokenSymbol={network?.networkToken.symbol}
          />
        </Stack>
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
          disabled={Object.keys(errors).length > 0}
          fullWidth
        >
          {t('Save')}
        </Button>
      </Stack>
    </Stack>
  );
}
