import { memoize } from 'lodash';
import { TFunction } from 'react-i18next';
import { z } from 'zod';

const getNameSchema = memoize((accountName: string, t: TFunction) => {
  return z
    .string()
    .trim()
    .min(1, { message: t('Account name must be at least 1 character long') })
    .refine((name) => name !== accountName, {
      message: t('Account name must be different from the current name'),
    });
});

export const validateName = (
  newName: string,
  accountName: string,
  t: TFunction,
) => {
  return getNameSchema(accountName, t).safeParse(newName);
};
