import { ReactNode } from 'react';
import {
  Dialog as K2Dialog,
  Typography,
  useTheme,
} from '@avalabs/k2-components';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  content?: ReactNode;
  isCloseable?: boolean;
};

const Dialog = ({
  open,
  onClose,
  title,
  content,
  isCloseable = true,
}: DialogProps) => {
  const theme = useTheme();

  return (
    <K2Dialog
      open={open}
      showCloseIcon={isCloseable}
      onClose={() => {
        if (isCloseable) {
          onClose();
        }
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'none',
        },
      }}
      PaperProps={{
        style: {
          backgroundColor: theme.palette.background.paper,
          padding: '24px 32px',
          margin: '32px 16px',
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
            marginBottom: '4px',
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
