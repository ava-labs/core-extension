import { Dialog, IconButton, Typography, XIcon } from '@avalabs/k2-components';
import { PropsWithChildren } from 'react';

interface RemoteApprovalDialogProps {
  onReject: () => void;
  pageTitle: string;
}

export function RemoteApprovalDialog({
  onReject,
  pageTitle,
  children,
}: PropsWithChildren<RemoteApprovalDialogProps>) {
  return (
    <Dialog
      open
      showCloseIcon={false}
      PaperProps={{
        sx: {
          m: 2,
          width: 1,
          height: 1,
          maxWidth: 'none',
          position: 'relative',
        },
      }}
    >
      <IconButton
        onClick={onReject}
        sx={{ position: 'absolute', top: 8, right: 8, p: 1 }}
        disableRipple
      >
        <XIcon size={24} />
      </IconButton>
      <Typography variant="h4" sx={{ py: 3, pl: 3, pr: 6 }}>
        {pageTitle}
      </Typography>

      {children}
    </Dialog>
  );
}
