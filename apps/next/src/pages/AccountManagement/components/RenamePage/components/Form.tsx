import { StandaloneField } from '@/components/StandaloneField';
import { Typography } from '@avalabs/k2-alpine';
import { useKeyboardShortcuts } from '@core/ui';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButtons } from '../../ActionButtons';
import { ViewHost } from '../../ViewHost';
import { validateName } from '../utils/validateName';

type Props = {
  label: string;
  name: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
};

export const RenameForm: FC<Props> = ({
  name: currentName,
  label,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const touchedRef = useRef(false);
  const validation = validateName(name, currentName, t);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const shortcuts = useKeyboardShortcuts({
    Enter: () => saveButtonRef.current?.click(),
  });

  const isError = touchedRef.current && !validation.success;

  return (
    <ViewHost in>
      <Typography variant="h2">{label}</Typography>
      <StandaloneField
        value={name}
        placeholder={currentName}
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
    </ViewHost>
  );
};
