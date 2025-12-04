import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineRemoveModerator } from 'react-icons/md';
import { Stack, Box, Typography, Button } from '@avalabs/k2-alpine';

import { SlideUpDialog } from '@/components/Dialog';

import { Drawer } from '../ActionDrawer';

type MaliciousDappOverlayProps = {
  open: boolean;
  cancelHandler: () => void;
};

export const MaliciousDappOverlay = ({
  open,
  cancelHandler,
}: MaliciousDappOverlayProps) => {
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
          {t('Scam Application')}
        </Typography>
        <Stack>
          <Typography variant="body1" color="text.primary">
            {t('This application is malicious.')}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {t('Do not proceed')}.
          </Typography>
        </Stack>
      </Stack>

      <Drawer>
        <Button
          variant="contained"
          color="primary"
          size="extension"
          onClick={cancelHandler}
        >
          {t('Cancel')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="extension"
          onClick={() => setIsAlertDialogOpen(false)}
        >
          {t('Proceed anyway')}
        </Button>
      </Drawer>
    </SlideUpDialog>
  );
};
