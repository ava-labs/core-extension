import type { ReactNode } from 'react';
import { Dialog as K2Dialog, Typography } from '@avalabs/core-k2-components';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  content?: ReactNode;
  bgColorDefault?: boolean;
  isCloseable?: boolean;
}

const Dialog = ({
  open,
  onClose,
  title,
  content,
  bgColorDefault = false,
  isCloseable = true,
}: DialogProps) => {
  return (
    <K2Dialog
      open={open}
      showCloseIcon={isCloseable}
      onClose={() => {
        if (isCloseable) {
          onClose();
        }
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: `${bgColorDefault ? 'undefined' : 'none'}`,
            backgroundColor: `${
              bgColorDefault ? 'background.default' : 'undefined'
            }`,
          },
        },
      }}
      PaperProps={{
        sx: {
          width: '100%',
          backgroundColor: 'background.paper',
          mx: 2,
          my: 4,
          py: 3,
          px: 2,
        },
      }}
    >
      {title && (
        <Typography
          variant="h5"
          align="left"
          sx={{
            fontWeight: 700,
            lineHeight: '28px',
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
      )}
      {content}
    </K2Dialog>
  );
};

export default Dialog;
