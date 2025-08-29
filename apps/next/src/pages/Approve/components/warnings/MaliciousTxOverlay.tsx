import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@avalabs/vm-module-types';
import { MdOutlineRemoveModerator } from 'react-icons/md';
import { Stack, Box, Typography, Button } from '@avalabs/k2-alpine';

import { SlideUpDialog } from '@/components/Dialog';

import { Drawer } from '../ActionDrawer';

type MaliciousTxOverlayProps = {
  open: boolean;
  cancelHandler: () => void;
  alert: Alert;
};

export const MaliciousTxOverlay = ({
  open,
  cancelHandler,
  alert,
}: MaliciousTxOverlayProps) => {
  const { t } = useTranslation();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(open);

  return (
    <SlideUpDialog
      open={isAlertDialogOpen}
      onClose={() => setIsAlertDialogOpen(false)}
    >
      <Stack
        width="100%"
        flexGrow={1}
        px={2}
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        color="error.main"
        gap={2}
      >
        <Box width={48} height={48}>
          <MdOutlineRemoveModerator size={48} />
        </Box>
        <Typography variant="h4" fontWeight={700}>
          {alert.details.title}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {alert.details.description}
        </Typography>
      </Stack>

      <Drawer>
        <Button
          variant="contained"
          color="primary"
          size="extension"
          onClick={cancelHandler}
        >
          {alert.details.actionTitles?.reject || t('Cancel transaction')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="extension"
          onClick={() => setIsAlertDialogOpen(false)}
        >
          {alert.details.actionTitles?.proceed || t('Proceed anyway')}
        </Button>
      </Drawer>
    </SlideUpDialog>
  );
};
