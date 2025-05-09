import {
  Button,
  Dialog,
  Stack,
  Typography,
  useTheme,
  RemoveModeratorIcon,
} from '@avalabs/core-k2-components';

interface AlertDialogProps {
  cancelHandler: () => void;
  open: boolean;
  onClose: () => void;
  title: string;
  text: string;
  rejectLabel: string;
  proceedLabel: string;
}

export function AlertDialog({
  cancelHandler,
  open,
  onClose,
  title,
  text,
  rejectLabel,
  proceedLabel,
}: AlertDialogProps) {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      showCloseIcon
      onClose={onClose}
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
      <Stack
        sx={{
          py: 3,
          px: 5,
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '225px',
            gap: 1.5,
            py: 14,
          }}
        >
          <RemoveModeratorIcon
            size={48}
            color={theme.customPalette.avalancheRed}
          />
          <Typography
            sx={{ color: theme.customPalette.avalancheRed, px: 2 }}
            variant="h4"
          >
            {title}
          </Typography>
          <Typography variant="body2">{text}</Typography>
        </Stack>
        <Stack
          sx={{
            alignItems: 'center',
            width: '100%',
            gap: 1,
          }}
        >
          <Button
            color="primary"
            data-testid="connect-reject-btn"
            onClick={() => {
              cancelHandler();
            }}
            fullWidth
            size="large"
          >
            {rejectLabel}
          </Button>
          <Button
            data-testid="connect-approve-btn"
            onClick={onClose}
            fullWidth
            size="large"
            color="secondary"
          >
            {proceedLabel}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
