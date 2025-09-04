import type { FC, ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import {
  isValidAddress,
  isValidBtcAddress,
  isValidSvmAddress,
  isValidXPAddress,
} from '@core/common';
import { FormField } from '@/components/Forms/FormField';

type FlavouredAddressFieldProps = Pick<
  ComponentProps<typeof FormField>,
  'value' | 'onChange' | 'allowCopy'
>;

export const EVMAddressField: FC<FlavouredAddressFieldProps> = ({
  value,
  onChange,
  allowCopy,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Avalanche C-Chain')}
      placeholder={t('Type in or paste address')}
      prompt={t('Add Avalanche C-Chain Address')}
      error={
        isValidAddress(value)
          ? undefined
          : t('Invalid Avalanche C-Chain address')
      }
      onChange={onChange}
      allowCopy={allowCopy}
    />
  );
};

export const BTCAddressField: FC<FlavouredAddressFieldProps> = ({
  value,
  onChange,
  allowCopy,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Bitcoin')}
      placeholder={t('Type in or paste address')}
      prompt={t('Add Bitcoin Address')}
      error={
        isValidBtcAddress(value) ? undefined : t('Invalid Bitcoin address')
      }
      onChange={onChange}
      allowCopy={allowCopy}
    />
  );
};

export const XPAddressField: FC<FlavouredAddressFieldProps> = ({
  value,
  onChange,
  allowCopy,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Avalanche X/P-Chain')}
      placeholder={t('Type in or paste address')}
      prompt={t('Add Avalanche X/P-Chain Address')}
      error={
        isValidXPAddress(value)
          ? undefined
          : t('Invalid Avalanche X/P-Chain address')
      }
      onChange={onChange}
      allowCopy={allowCopy}
    />
  );
};

export const SVMAddressField: FC<FlavouredAddressFieldProps> = ({
  value,
  onChange,
  allowCopy,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Solana')}
      placeholder={t('Type in or paste address')}
      prompt={t('Add Solana Address')}
      error={isValidSvmAddress(value) ? undefined : t('Invalid Solana address')}
      onChange={onChange}
      allowCopy={allowCopy}
    />
  );
};
