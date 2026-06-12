import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { MdInfoOutline } from 'react-icons/md';

import { SlideUpDialog } from '@/components/Dialog';
import { Page } from '@/components/Page';

type CancelRecurringOrderDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const CancelRecurringOrderDialog = ({
  open,
  onClose,
  onConfirm,
}: CancelRecurringOrderDialogProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <SlideUpDialog open={open} onClose={onClose}>
      <Page
        title={t('Cancel recurring swap?')}
        onBack={onClose}
        contentProps={{
          mt: -1.5,
          px: 0,
          alignItems: 'stretch',
          justifyContent: 'space-between',
          height: '100%',
        }}
        containerProps={{
          pb: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack direction="row" gap={1} alignItems="center" flexShrink={0}>
          <MdInfoOutline color={theme.palette.error.main} size={24} />
          <Typography variant="body3" color="error.main">
            {t(
              'This stops all future swaps on this schedule. Swaps that already executed are not affected.',
            )}
          </Typography>
        </Stack>

        <Stack
          width="100%"
          gap={1}
          position="sticky"
          bottom={0}
          pt={3}
          pb={2}
          flexShrink={0}
        >
          <Button
            variant="contained"
            color="error"
            size="small"
            fullWidth
            onClick={onConfirm}
            data-testid="recurring-order-cancel-confirm"
          >
            {t('Cancel recurring swap')}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            fullWidth
            onClick={onClose}
            data-testid="recurring-order-cancel-dismiss"
          >
            {t('Keep recurring swap')}
          </Button>
        </Stack>
      </Page>
    </SlideUpDialog>
  );
};
