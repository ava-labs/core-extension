import { StandaloneField } from '@/components/StandaloneField';
import { Typography } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { useKeyboardShortcuts } from '@core/ui';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigateBack } from '../../../NavigateBackContext';
import { ActionButtons } from '../ActionButtons';
import { validateName } from './utils';

type Props = {
  account: Account;
  onSave: (newName: string) => void;
  onCancel: () => void;
};

export const RenameAccount: FC<Props> = ({ account, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const touchedRef = useRef(false);
  const validation = validateName(name, account.name, t);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const { register } = useNavigateBack();
  useEffect(() => register(onCancel), [register, onCancel]);

  const shortcuts = useKeyboardShortcuts({
    Enter: () => saveButtonRef.current?.click(),
  });

  const isError = touchedRef.current && !validation.success;

  return (
    <>
      <Typography variant="h2">{t('Rename Account')}</Typography>
      <StandaloneField
        value={name}
        placeholder={account.name}
        onChange={(e) => {
          touchedRef.current = true;
          setName(e.target.value);
        }}
        error={isError}
        helperText={isError && validation.error.format()._errors.join(', ')}
        autoFocus
        {...shortcuts}
      />
      <ActionButtons
        top={{
          ref: saveButtonRef,
          label: t('Save'),
          disabled: !validation.success,
          onClick: validation.success ? () => onSave(name) : undefined,
          color: 'primary',
        }}
        bottom={{
          label: t('Cancel'),
          color: 'secondary',
          onClick: onCancel,
        }}
      />
    </>
  );
};
