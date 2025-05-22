import { useScopedToast } from '@/hooks/useScopedToast';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RenameDialog } from '../components/RenameDialog';

export const useEntityRename = ({
  updateFn,
  currentName,
  dialogTitle,
  onSuccess,
  onFailure,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const { t } = useTranslation();
  const toast = useScopedToast('account-switcher');

  const prompt = useCallback(() => setIsRenaming(true), []);
  const cancel = useCallback(() => setIsRenaming(false), []);
  const confirm = useCallback(
    (newName: string) => {
      if (newName === currentName) {
        setIsRenaming(false);
        return;
      }

      if (newName.trim().length === 0) {
        toast.error(t('New name is required'), { duration: 1000 });
        return;
      }

      setIsSaving(true);
      updateFn(newName.trim())
        .then(() => {
          setIsRenaming(false);
          onSuccess();
        })
        .catch(onFailure)
        .finally(() => {
          setIsSaving(false);
        });
    },
    [updateFn, currentName, onSuccess, onFailure, t, toast],
  );

  const renderDialog = useCallback(
    () => (
      <RenameDialog
        title={dialogTitle}
        currentName={currentName}
        isOpen={isRenaming}
        isSaving={isSaving}
        onClose={cancel}
        onSave={confirm}
      />
    ),
    [currentName, dialogTitle, cancel, confirm, isRenaming, isSaving],
  );

  return {
    prompt,
    renderDialog,
  };
};
