import { TFunction } from 'react-i18next';
import { z } from 'zod';

import {
  MIN_SLIPPAGE,
  MAX_SLIPPAGE,
  HIGH_SLIPPAGE_THRESHOLD,
} from '../swap-config';

export type SlippageValidationResult = {
  success: boolean;
  value?: number;
  error?: string;
  warning?: string;
};

export const getSlippageSchema = (t: TFunction) => {
  return z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), {
      message: t('Invalid slippage value'),
    })
    .refine((val) => val >= MIN_SLIPPAGE, {
      message: t('Slippage must be at least {{min}}%', { min: MIN_SLIPPAGE }),
    })
    .refine((val) => val <= MAX_SLIPPAGE, {
      message: t('Slippage must be less than or equal to {{max}}%', {
        max: MAX_SLIPPAGE,
      }),
    });
};

export const validateSlippage = (
  value: string,
  t: TFunction,
): SlippageValidationResult => {
  const schema = getSlippageSchema(t);
  const result = schema.safeParse(value);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message,
    };
  }

  const numValue = result.data;
  const warning =
    numValue > HIGH_SLIPPAGE_THRESHOLD && numValue < MAX_SLIPPAGE
      ? t('Very high slippage, you may lose money on this swap')
      : undefined;

  return {
    success: true,
    value: numValue,
    warning,
  };
};

export const isSlippageValid = (value: string): boolean => {
  const numValue = parseFloat(value);
  return (
    !isNaN(numValue) && numValue >= MIN_SLIPPAGE && numValue <= MAX_SLIPPAGE
  );
};
