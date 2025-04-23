import { AlertDialog } from 'packages/ui/pages/Permissions/components/AlertDialog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MaliciousTxAlertProps {
  cancelHandler: () => void;
  showAlert?: boolean;
  title?: string;
  description?: string;
  actionTitles?: {
    reject: string;
    proceed: string;
  };
}

export function MaliciousTxAlert({
  showAlert,
  title,
  description,
  cancelHandler,
  actionTitles,
}: MaliciousTxAlertProps) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(true);
  const { t } = useTranslation();

  return (
    <>
      {showAlert && (
        <AlertDialog
          open={isAlertDialogOpen}
          cancelHandler={cancelHandler}
          onClose={() => setIsAlertDialogOpen(false)}
          title={title || t('Scam Transaction')}
          text={
            description || t('This transaction is malicious do not proceed.')
          }
          proceedLabel={actionTitles?.proceed || t('Proceed Anyway')}
          rejectLabel={actionTitles?.reject || t('Reject Transaction')}
        />
      )}
    </>
  );
}
