import React, { WheelEvent, useEffect, useState } from 'react';
import BN from 'bn.js';
import Big from 'big.js';
import {
  Stack,
  TextField,
  InputAdornment,
  Button,
  styled,
  CircularProgress,
} from '@avalabs/core-k2-components';
import { bnToLocaleString, numberToBN } from '@avalabs/core-utils-sdk';

Big.PE = 99;
Big.NE = -18;

export interface BNInputProps {
  value?: BN;
  denomination: number;
  onChange?(val: { bn: BN; amount: string }): void;
  placeholder?: string;
  min?: BN;
  max?: BN;
  isValueLoading?: boolean;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  withMaxButton?: boolean;
}

const InputNumber = styled(TextField)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  padding: 0;
`;

function splitBN(val: string) {
  return val.includes('.') ? val.split('.') : [val, null];
}

export function BNInput({
  value,
  denomination,
  onChange,
  min = new BN(0),
  max,
  isValueLoading,
  error,
  disabled,
  fullWidth,
  withMaxButton = true,
  ...props
}: BNInputProps) {
  const [valStr, setValStr] = useState('');
  useEffect(() => {
    if (value === undefined) {
      if (Number(valStr) !== 0) {
        setValStr('');
      }

      return;
    }

    if (value.eq(new BN(0)) && Number(valStr) === 0) {
      return;
    }

    if (value) {
      const valueAsBig = new Big(value.toString()).div(
        Math.pow(10, denomination)
      );
      /**
       * When deleting zeros after decimal, all zeros delete without this check.
       * This also preserves zeros in the input ui.
       */

      if (!valStr || !valueAsBig.eq(valStr)) {
        setValStr(valueAsBig.toString());
      }
    }
  }, [denomination, valStr, value]);

  const onValueChanged = (newValue: string) => {
    /**
     * Split the input and make sure the right side never exceeds
     * the denomination length
     */
    const [, endValue] = splitBN(newValue);

    if (!endValue || endValue.length <= denomination) {
      const valueToBn = numberToBN(newValue || 0, denomination);

      if (valueToBn.lt(min)) {
        return;
      }
      const oldValueToBn = numberToBN(valStr || 0, denomination);
      if (!valueToBn.eq(oldValueToBn)) {
        onChange?.({
          // used to removing leading & trailing zeros
          amount: newValue ? bnToLocaleString(valueToBn, denomination) : '0',
          bn: valueToBn,
        });
      }
      setValStr(newValue);
    }
  };

  const setMax = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!max) {
      return;
    }

    const big = new Big(max.toString()).div(Math.pow(10, denomination));
    onValueChanged(big.toString());
  };

  return (
    <Stack sx={{ position: 'relative' }}>
      <InputNumber
        fullWidth={fullWidth}
        value={valStr}
        onChange={(e) => onValueChanged(e.target.value)}
        type="number"
        onKeyDown={(e) => {
          if (
            e.code === 'KeyE' ||
            e.key === '-' ||
            e.key === '+' ||
            e.key === 'ArrowUp' ||
            e.key === 'ArrowDown'
          ) {
            e.preventDefault();
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onWheel={(e: WheelEvent<HTMLInputElement>) => {
          // Prevent changing value by mouse wheel
          if (e.target === document.activeElement) {
            (document.activeElement as HTMLInputElement).blur();
          }
        }}
        error={error}
        placeholder="0.0"
        sx={{
          width: fullWidth ? 'auto' : '180px',
        }}
        InputProps={{
          disabled,
          endAdornment: withMaxButton ? (
            isValueLoading ? (
              <CircularProgress size={16} sx={{ height: 'auto !important' }} />
            ) : max ? (
              <InputAdornment position="end">
                <Button
                  variant="text"
                  size="small"
                  onClick={setMax}
                  sx={{ p: 0, justifyContent: 'flex-end' }}
                >
                  Max
                </Button>
              </InputAdornment>
            ) : null
          ) : null,
          inputMode: 'text',
          sx: {
            py: 1,
            px: 2,
          },
        }}
        {...props}
      />
    </Stack>
  );
}
