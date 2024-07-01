import { AlertDialog } from '@src/pages/Permissions/components/AlertDialog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MaliciousTxAlertProps {
  cancelHandler: () => void;
  showAlert?: boolean;
}

export function MaliciousTxAlert({
  showAlert,
  cancelHandler,
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
          title={t('Scam Transaction')}
          text={t('This transaction is malicious do not proceed.')}
          rejectLabel={t('Reject Transaction')}
        />
      )}
    </>
  );
}
