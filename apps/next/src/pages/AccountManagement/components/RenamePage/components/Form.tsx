import { ActionButtons } from '@/components/ActionButtons';
import { StandaloneField } from '@/components/StandaloneField';
import { useSubmitButton } from '@/hooks/useSubmitButton';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateName } from '../utils/validateName';
import { Stack } from '@avalabs/k2-alpine';

type Props = {
  name: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
};

export const RenameForm: FC<Props> = ({
  name: currentName,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const touchedRef = useRef(false);
  const validation = validateName(name, currentName, t);
  const [saveButtonRef, shortcuts] = useSubmitButton();

  const isError = touchedRef.current && !validation.success;

  return (
    <Stack flexGrow={1}>
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
    </Stack>
  );
};
