import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  XCircleFilledIcon,
} from '@avalabs/core-k2-components';
import { useKeyboardShortcuts } from '@src/hooks/useKeyboardShortcuts';

export const RenameDialog = ({
  isOpen,
  isSaving,
  onClose,
  title,
  currentName,
  onSave,
}) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: () => onSave(newName),
    Escape: onClose,
  });
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      showCloseIcon={false}
      PaperProps={{
        sx: { m: 2, width: 1 },
      }}
    >
      <DialogTitle typographyProps={{ fontSize: 20 }}>{title}</DialogTitle>
      <DialogContent sx={{ pt: 1.5 }}>
        <TextField
          size="small"
          placeholder={currentName}
          onChange={(ev) => setNewName(ev.target.value)}
          value={newName}
          autoFocus
          InputProps={{
            endAdornment: (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setNewName('');
                }}
                sx={{
                  color: 'grey.500',
                  visibility: newName.trim() ? 'visible' : 'hidden',
                }}
              >
                <XCircleFilledIcon size={20} />
              </IconButton>
            ),
          }}
          {...keyboardShortcuts}
        />
      </DialogContent>
      <Stack
        sx={{
          px: 3,
          py: 2,
          mt: 5.5,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Button
          color="secondary"
          size="large"
          fullWidth
          disabled={isSaving}
          onClick={(e) => {
            e.stopPropagation();
            setNewName('');
            onClose();
          }}
          data-testid="abort-renaming"
        >
          {t('Cancel')}
        </Button>
        <Button
          color="primary"
          disabled={isSaving || newName.trim().length === 0}
          isLoading={isSaving}
          size="large"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onSave(newName);
          }}
          data-testid="confirm-renaming"
        >
          {t('Save')}
        </Button>
      </Stack>
    </Dialog>
  );
};
