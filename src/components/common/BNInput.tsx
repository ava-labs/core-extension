import React, { WheelEvent, useEffect, useState } from 'react';
import Big from 'big.js';
import {
  Stack,
  TextField,
  InputAdornment,
  Button,
  styled,
  CircularProgress,
} from '@avalabs/core-k2-components';
import { bigToLocaleString } from '@avalabs/core-utils-sdk';
import { stringToBigint } from '@src/utils/stringToBigint';
import { bigintToBig } from '@src/utils/bigintToBig';

Big.PE = 99;
Big.NE = -18;

export interface BNInputProps {
  value?: bigint;
  denomination: number;
  onChange?(val: { bigint: bigint; amount: string }): void;
  placeholder?: string;
  min?: bigint;
  max?: bigint;
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
  min = 0n,
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

    if (value === 0n && Number(valStr) === 0) {
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
      const valueToBigint = stringToBigint(newValue || '0', denomination);

      if (valueToBigint < min) {
        return;
      }
      const oldValueToBigint = stringToBigint(valStr || '0', denomination);
      if (valueToBigint !== oldValueToBigint) {
        onChange?.({
          // used to removing leading & trailing zeros
          amount: newValue
            ? bigToLocaleString(bigintToBig(valueToBigint, denomination))
            : '0',
          bigint: valueToBigint,
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

  const isMaxBtnVisible = max && max > 0n;

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
            ) : isMaxBtnVisible ? (
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
