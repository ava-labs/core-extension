import type { FC, ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { FormField } from '@/components/Forms/FormField';

type FlavouredFieldProps = Pick<
  ComponentProps<typeof FormField>,
  'value' | 'onChange' | 'allowCopy'
>;

export const RpcUrlField: FC<FlavouredFieldProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Network RPC URL')}
      placeholder={t('Type in or paste RPC URL')}
      prompt={t('Add RPC URL')}
      error={value ? undefined : t('RPC required')}
      onChange={onChange}
    />
  );
};

export const NameField: FC<FlavouredFieldProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Network name')}
      placeholder={t('Type in or paste network name')}
      prompt={t('Add network name')}
      error={value ? undefined : t('Network Name is required')}
      onChange={onChange}
    />
  );
};

export const ChainIdField: FC<FlavouredFieldProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Chain ID')}
      placeholder={t('Type in or paste chain ID')}
      prompt={t('Add chain ID')}
      error={!value || value === '0' ? t('Chain ID is required') : undefined}
      onChange={onChange}
    />
  );
};

export const TokenSymbolField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Token symbol')}
      placeholder={t('Type in or paste token symbol')}
      prompt={t('Add token symbol')}
      error={value ? undefined : t('Token symbol is required')}
      onChange={onChange}
    />
  );
};

export const TokenNameField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Token name')}
      placeholder={t('Type in or paste token name')}
      prompt={t('Add token name')}
      error={value ? undefined : t('Token name is required')}
      onChange={onChange}
    />
  );
};
export const ExplorerUrlField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Explorer URL')}
      placeholder={t('Type in or paste explorer URL')}
      prompt={t('Add explorer URL')}
      error={undefined}
      onChange={onChange}
    />
  );
};
