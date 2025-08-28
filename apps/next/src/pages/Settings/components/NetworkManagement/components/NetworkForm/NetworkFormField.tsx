import type { FC, ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { FormField } from '@/components/Forms/FormField';

type FlavouredFieldProps = Pick<
  ComponentProps<typeof FormField>,
  'value' | 'onChange' | 'allowCopy'
> & {
  error?: string;
  required?: boolean;
};

export const RpcUrlField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Network RPC URL')}
      placeholder={t('Type in or paste RPC URL')}
      prompt={t('Add RPC URL')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};

export const ChainIdField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Chain ID')}
      placeholder={t('Type in or paste chain ID')}
      prompt={t('Add chain ID')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};

export const TokenSymbolField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Token symbol')}
      placeholder={t('Type in or paste token symbol')}
      prompt={t('Add token symbol')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};

export const TokenNameField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Token name')}
      placeholder={t('Type in or paste token name')}
      prompt={t('Add token name')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};
export const ExplorerUrlField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Explorer URL')}
      placeholder={t('Type in or paste explorer URL')}
      prompt={t('Add explorer URL')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};

export const LogoUrlField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Logo URL')}
      placeholder={t('Type in or paste logo URL')}
      prompt={t('Add logo URL')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};
