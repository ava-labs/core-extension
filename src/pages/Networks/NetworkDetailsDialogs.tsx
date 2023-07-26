import { Button, Stack, Typography } from '@avalabs/k2-components';
import Dialog from '@src/components/common/Dialog';
import { useTranslation } from 'react-i18next';

export enum NetworkDetailsDialogOptions {
  DELETE_DIALOG = 'deleteDialog',
  RESET_RPC_URL_DIALOG = 'resetRpcUrlDialog',
  UPDATE_RPC_URL_DIALOG = 'updateRpcUrlDialog',
}

interface NetworkDetailsDialogsProps {
  isPrimaryButtonLoading: boolean;
  isDelete?: boolean;
  isResetRpcUrl?: boolean;
  isUpdateRpcUrl?: boolean;
  handlePrimaryClick: (dialogType: NetworkDetailsDialogOptions) => void;
  hideDialog: () => void;
}

export const NetworkDetailsDialogs = ({
  isDelete,
  isResetRpcUrl,
  isUpdateRpcUrl,
  isPrimaryButtonLoading,
  handlePrimaryClick,
  hideDialog,
}: NetworkDetailsDialogsProps) => {
  const { t } = useTranslation();

  const renderDialogContent = (
    title: string,
    bodyText: string,
    primaryButtonFn: NetworkDetailsDialogOptions,
    primaryButtonText: string,
    secondaryButtonText: string
  ) => {
    return (
      <Stack sx={{ justifyContent: 'center', width: '100%' }}>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
          {bodyText}
        </Typography>
        <Stack
          sx={{
            mt: 3,
          }}
        >
          <Button
            sx={{ mb: 1 }}
            onClick={() => {
              handlePrimaryClick(primaryButtonFn);
            }}
            disabled={isPrimaryButtonLoading}
            isLoading={isPrimaryButtonLoading}
          >
            {primaryButtonText}
          </Button>
          <Button variant="text" onClick={() => hideDialog()}>
            {secondaryButtonText}
          </Button>
        </Stack>
      </Stack>
    );
  };

  return (
    <>
      {isDelete && (
        <Dialog
          open={isDelete}
          onClose={hideDialog}
          content={renderDialogContent(
            t('Delete Network?'),
            t('Are you sure you want to delete this network?'),
            NetworkDetailsDialogOptions.DELETE_DIALOG,
            t('Delete'),
            t('Cancel')
          )}
          bgColorDefault
        />
      )}
      {isResetRpcUrl && (
        <Dialog
          open={isResetRpcUrl}
          onClose={hideDialog}
          content={renderDialogContent(
            t('Reset RPC?'),
            t("Resetting the RPC URL will put it back to it's default URL."),
            NetworkDetailsDialogOptions.RESET_RPC_URL_DIALOG,
            t('Reset Url'),
            t('Back')
          )}
          bgColorDefault
        />
      )}
      {isUpdateRpcUrl && (
        <Dialog
          open={isUpdateRpcUrl}
          onClose={hideDialog}
          content={renderDialogContent(
            t('Warning'),
            t('Core functionality may be unstable with custom RPC URLs.'),
            NetworkDetailsDialogOptions.UPDATE_RPC_URL_DIALOG,
            t('Confirm Save'),
            t('Back')
          )}
          bgColorDefault
        />
      )}
    </>
  );
};
